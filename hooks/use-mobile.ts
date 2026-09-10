import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  return React.useSyncExternalStore(
    (callback) => {
      const media = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
      media.addEventListener("change", callback)
      return () => media.removeEventListener("change", callback)
    },
    () => window.innerWidth < MOBILE_BREAKPOINT,
    () => false,
  )
}
