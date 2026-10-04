import { useState } from "react"
import type { ReactElement } from "react"
import { QueryClient, QueryClientProvider, keepPreviousData, useQuery } from "@tanstack/react-query"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { DataUpdatingIndicator } from "@/components/portal/data-updating-indicator"

type Row = { id: string; label: string }

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason: Error) => void
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })
  return { promise, resolve, reject }
}

function ContinuityHarness({
  filter,
  page = 1,
  load,
}: {
  filter: string
  page?: number
  load: (filter: string, page: number) => Promise<Row[]>
}) {
  const query = useQuery({
    queryKey: ["continuity-test", filter, page],
    queryFn: () => load(filter, page),
    placeholderData: keepPreviousData,
    retry: false,
  })
  const [actionCount, setActionCount] = useState(0)

  if (query.isPending) return <div data-testid="initial-skeleton">Loading rows</div>

  return (
    <section aria-label="Query results" aria-busy={query.isPlaceholderData}>
      <DataUpdatingIndicator active={query.isPlaceholderData} />
      {query.isError && query.data ? <p>Update failed. Showing previous results.</p> : null}
      {query.isError && !query.data ? <p>Unable to update results</p> : null}
      {!query.isError && !query.data?.length ? <p>No results</p> : null}
      {query.data?.map((row) => <p key={row.id}>{row.label}</p>)}
      <button disabled={query.isPlaceholderData} onClick={() => setActionCount((count) => count + 1)}>
        Dangerous action {actionCount}
      </button>
      <button disabled={query.isPlaceholderData}>Next page</button>
    </section>
  )
}

function renderHarness(ui: ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  })
  const view = render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>)
  return { ...view, client }
}

describe("query result continuity", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("keeps previous rows busy and read-only until a filter replacement resolves", async () => {
    const requests = new Map<string, ReturnType<typeof deferred<Row[]>>>()
    const load = vi.fn((filter: string) => {
      const request = deferred<Row[]>()
      requests.set(filter, request)
      return request.promise
    })

    const view = renderHarness(<ContinuityHarness filter="A" load={load} />)
    expect(screen.getByTestId("initial-skeleton")).toBeInTheDocument()

    await waitFor(() => expect(requests.has("A")).toBe(true))
    requests.get("A")?.resolve([{ id: "a", label: "Row A" }])
    expect(await screen.findByText("Row A")).toBeInTheDocument()

    view.rerender(
      <QueryClientProvider client={view.client}>
        <ContinuityHarness filter="B" load={load} />
      </QueryClientProvider>,
    )

    await waitFor(() => expect(requests.has("B")).toBe(true))
    expect(screen.getByText("Row A")).toBeInTheDocument()
    expect(screen.getByRole("status")).toHaveTextContent("Updating results")
    expect(screen.getByRole("region")).toHaveAttribute("aria-busy", "true")
    expect(screen.queryByText("No results")).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Dangerous action/ })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled()
    expect(load).toHaveBeenCalledTimes(2)

    requests.get("B")?.resolve([{ id: "b", label: "Row B" }])
    expect(await screen.findByText("Row B")).toBeInTheDocument()
    expect(screen.queryByText("Row A")).not.toBeInTheDocument()
    expect(screen.getByRole("region")).toHaveAttribute("aria-busy", "false")
    expect(screen.queryByRole("status")).not.toBeInTheDocument()
  })

  it("shows the empty state only after the replacement query resolves", async () => {
    const requests = new Map<string, ReturnType<typeof deferred<Row[]>>>()
    const load = vi.fn((filter: string) => {
      const request = deferred<Row[]>()
      requests.set(filter, request)
      return request.promise
    })
    const view = renderHarness(<ContinuityHarness filter="with-rows" load={load} />)

    await waitFor(() => expect(requests.has("with-rows")).toBe(true))
    requests.get("with-rows")?.resolve([{ id: "a", label: "Existing row" }])
    expect(await screen.findByText("Existing row")).toBeInTheDocument()
    view.rerender(
      <QueryClientProvider client={view.client}>
        <ContinuityHarness filter="empty" load={load} />
      </QueryClientProvider>,
    )

    await waitFor(() => expect(requests.has("empty")).toBe(true))
    expect(screen.getByText("Existing row")).toBeInTheDocument()
    expect(screen.queryByText("No results")).not.toBeInTheDocument()

    requests.get("empty")?.resolve([])
    expect(await screen.findByText("No results")).toBeInTheDocument()
    expect(screen.queryByText("Existing row")).not.toBeInTheDocument()
  })

  it("retains the prior page and disables paging during replacement", async () => {
    const requests = new Map<number, ReturnType<typeof deferred<Row[]>>>()
    const load = vi.fn((_filter: string, page: number) => {
      const request = deferred<Row[]>()
      requests.set(page, request)
      return request.promise
    })
    const view = renderHarness(<ContinuityHarness filter="all" page={1} load={load} />)

    await waitFor(() => expect(requests.has(1)).toBe(true))
    requests.get(1)?.resolve([{ id: "one", label: "Page one row" }])
    expect(await screen.findByText("Page one row")).toBeInTheDocument()
    view.rerender(
      <QueryClientProvider client={view.client}>
        <ContinuityHarness filter="all" page={2} load={load} />
      </QueryClientProvider>,
    )

    await waitFor(() => expect(requests.has(2)).toBe(true))
    expect(screen.getByText("Page one row")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled()

    requests.get(2)?.resolve([{ id: "two", label: "Page two row" }])
    expect(await screen.findByText("Page two row")).toBeInTheDocument()
    expect(load).toHaveBeenCalledTimes(2)
  })

  it("communicates a replacement failure without returning to a loading skeleton", async () => {
    const requests = new Map<string, ReturnType<typeof deferred<Row[]>>>()
    const load = vi.fn((filter: string) => {
      const request = deferred<Row[]>()
      requests.set(filter, request)
      return request.promise
    })
    const view = renderHarness(<ContinuityHarness filter="working" load={load} />)

    await waitFor(() => expect(requests.has("working")).toBe(true))
    requests.get("working")?.resolve([{ id: "a", label: "Last successful row" }])
    expect(await screen.findByText("Last successful row")).toBeInTheDocument()
    view.rerender(
      <QueryClientProvider client={view.client}>
        <ContinuityHarness filter="failing" load={load} />
      </QueryClientProvider>,
    )
    await waitFor(() => expect(requests.has("failing")).toBe(true))

    requests.get("failing")?.reject(new Error("replacement failed"))

    expect(await screen.findByText("Unable to update results")).toBeInTheDocument()
    expect(screen.queryByText("Last successful row")).not.toBeInTheDocument()
    expect(screen.queryByTestId("initial-skeleton")).not.toBeInTheDocument()
    expect(screen.queryByText("No results")).not.toBeInTheDocument()
  })
})
