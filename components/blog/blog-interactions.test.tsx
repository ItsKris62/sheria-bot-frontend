import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { BlogFeedback } from "./blog-feedback"
import { BlogNewsletterSignup } from "./blog-newsletter-signup"
import { BlogTopicRequest } from "./blog-topic-request"
import { SourceList } from "./source-list"
import { resetBlogAnalyticsDedupForTests } from "@/lib/analytics/blog-events"
import { trackEvent } from "@/lib/analytics"

const mocks = vi.hoisted(() => ({
  newsletterMutate: vi.fn(),
  topicMutate: vi.fn(),
  feedbackMutate: vi.fn(),
}))

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}))

vi.mock("@/lib/trpc", () => ({
  getErrorMessage: (error: unknown) => error instanceof Error ? error.message : "Something went wrong.",
  trpc: {
    publicMarketing: {
      subscribeBlogNewsletter: {
        useMutation: () => ({
          mutateAsync: mocks.newsletterMutate,
          isPending: false,
          isError: false,
        }),
      },
    },
    blog: {
      submitTopicRequest: {
        useMutation: () => ({
          mutateAsync: mocks.topicMutate,
          isPending: false,
          isError: false,
        }),
      },
      submitFeedback: {
        useMutation: () => ({
          mutateAsync: mocks.feedbackMutate,
          isPending: false,
          isError: false,
        }),
      },
    },
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
  window.sessionStorage.clear()
  resetBlogAnalyticsDedupForTests()
  mocks.newsletterMutate.mockResolvedValue({ success: true })
  mocks.topicMutate.mockResolvedValue({ success: true })
  mocks.feedbackMutate.mockResolvedValue({ success: true })
})

describe("Blog newsletter signup", () => {
  it("submits email to backend but excludes it from analytics", async () => {
    render(<BlogNewsletterSignup sourcePage="/blog" category="Regulatory Updates" />)

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "reader@example.com" },
    })
    fireEvent.click(screen.getByRole("button", { name: /subscribe/i }))

    await waitFor(() => expect(mocks.newsletterMutate).toHaveBeenCalledWith(expect.objectContaining({
      email: "reader@example.com",
      sourcePage: "/blog",
    })))

    expect(trackEvent).toHaveBeenCalledWith("blog_newsletter_subscription_completed", expect.not.objectContaining({
      email: "reader@example.com",
    }))
  })

  it("shows a generic error for failed newsletter submissions", async () => {
    mocks.newsletterMutate.mockRejectedValueOnce(new Error("Redis rate limit details"))
    render(<BlogNewsletterSignup sourcePage="/blog" />)

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "reader@example.com" },
    })
    fireEvent.click(screen.getByRole("button", { name: /subscribe/i }))

    expect(await screen.findByRole("status")).toHaveTextContent("We could not complete the subscription right now")
    expect(screen.getByRole("status")).not.toHaveTextContent("Redis")
  })
})

describe("Blog source tracking", () => {
  it("tracks only the safe source domain", () => {
    render(
      <SourceList
        postId="post-1"
        slug="cbk"
        category="Regulatory Updates"
        sources={[
          {
            id: "source-1",
            sourceType: "OFFICIAL",
            title: "CBK Notice",
            publisher: "Central Bank of Kenya",
            url: "https://www.centralbank.go.ke/notice?token=secret",
          },
        ]}
      />,
    )

    fireEvent.click(screen.getByRole("link", { name: /view source/i }))
    expect(screen.getByRole("link", { name: /view source/i })).toHaveAttribute("href", "https://www.centralbank.go.ke/notice")
    expect(trackEvent).toHaveBeenCalledWith("blog_source_opened", expect.objectContaining({
      sourceDomain: "centralbank.go.ke",
    }))
    expect(trackEvent).not.toHaveBeenCalledWith("blog_source_opened", expect.objectContaining({
      sourceUrl: expect.any(String),
    }))
  })

  it("does not render internal source records publicly", () => {
    render(
      <SourceList
        sources={[
          {
            id: "source-1",
            sourceType: "INTERNAL",
            title: "Internal editorial note",
            publisher: "SheriaBot",
            url: "https://internal.example.com/private",
          },
        ]}
      />,
    )

    expect(screen.queryByText("Internal editorial note")).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /view source/i })).not.toBeInTheDocument()
  })
})

describe("Blog topic request", () => {
  it("submits bounded topic text to backend but not analytics", async () => {
    render(<BlogTopicRequest sourcePage="/blog" category="Data Protection" />)

    fireEvent.change(screen.getByLabelText("Topic"), {
      target: { value: "ODPC breach notification duties" },
    })
    fireEvent.click(screen.getByRole("button", { name: /send request/i }))

    await waitFor(() => expect(mocks.topicMutate).toHaveBeenCalledWith(expect.objectContaining({
      topic: "ODPC breach notification duties",
      category: "Data Protection",
    })))
    expect(trackEvent).toHaveBeenCalledWith("blog_topic_request_submitted", expect.not.objectContaining({
      topic: "ODPC breach notification duties",
    }))
  })

  it("uses unique labelled fields and generic failure copy", async () => {
    mocks.topicMutate.mockRejectedValueOnce(new Error("Topic is too short."))
    render(
      <>
        <BlogTopicRequest sourcePage="/blog" />
        <BlogTopicRequest sourcePage="/blog" compact />
      </>,
    )

    const topicFields = screen.getAllByLabelText("Topic")
    expect(new Set(topicFields.map((field) => field.id)).size).toBe(2)

    fireEvent.change(topicFields[0], {
      target: { value: "ODPC breach notification duties" },
    })
    fireEvent.click(screen.getAllByRole("button", { name: /send request/i })[0])

    const statuses = await screen.findAllByRole("status")
    expect(statuses[0]).toHaveTextContent("We could not submit the request right now")
    expect(statuses[0]).not.toHaveTextContent("too short")
  })
})

describe("Blog feedback", () => {
  it("submits helpful feedback and tracks the stable feedback value", async () => {
    render(<BlogFeedback postId="post-1" slug="cbk" category="Regulatory Updates" />)

    fireEvent.click(screen.getByRole("button", { name: "Yes" }))

    await waitFor(() => expect(mocks.feedbackMutate).toHaveBeenCalledWith(expect.objectContaining({
      postId: "post-1",
      value: "HELPFUL",
    })))
    expect(trackEvent).toHaveBeenCalledWith("blog_feedback_submitted", expect.objectContaining({
      feedbackValue: "HELPFUL",
      postId: "post-1",
    }))
  })

  it("supports vote updates and generic failure copy", async () => {
    mocks.feedbackMutate.mockResolvedValueOnce({ success: true }).mockRejectedValueOnce(new Error("A reader session is required."))
    render(<BlogFeedback postId="post-1" slug="cbk" />)

    fireEvent.click(screen.getByRole("button", { name: "Yes" }))
    await waitFor(() => expect(mocks.feedbackMutate).toHaveBeenCalledWith(expect.objectContaining({ value: "HELPFUL" })))

    fireEvent.click(screen.getByRole("button", { name: "Not really" }))
    expect(await screen.findByRole("status")).toHaveTextContent("We could not save your feedback right now")
    expect(screen.getByRole("status")).not.toHaveTextContent("reader session")
  })
})
