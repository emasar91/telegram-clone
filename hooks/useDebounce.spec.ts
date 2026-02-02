import { renderHook, act } from "@testing-library/react"
import { useDebounce } from "./useDebounce"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500))
    expect(result.current).toBe("initial")
  })

  it("should update value only after the delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } },
    )

    // Update value
    rerender({ value: "updated", delay: 500 })

    // Still initial before timer
    expect(result.current).toBe("initial")

    // Advance part of the time
    act(() => {
      vi.advanceTimersByTime(250)
    })
    expect(result.current).toBe("initial")

    // Advance full time
    act(() => {
      vi.advanceTimersByTime(250)
    })
    expect(result.current).toBe("updated")
  })

  it("should reset timer if value changes before delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } },
    )

    // First update
    rerender({ value: "update-1", delay: 500 })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Still initial
    expect(result.current).toBe("initial")

    // Second update before first delay finishes
    rerender({ value: "update-2", delay: 500 })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Still initial because timer was reset
    expect(result.current).toBe("initial")

    act(() => {
      vi.advanceTimersByTime(200)
    })

    // Finally updated
    expect(result.current).toBe("update-2")
  })
})
