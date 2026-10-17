import type { ComponentType } from "react"

export default function dynamic(loader: () => Promise<unknown>, options?: { loading?: ComponentType }) {
  void loader
  return options?.loading ?? (() => null)
}
