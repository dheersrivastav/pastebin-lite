export function getCurrentTime(testMode: boolean, testNowMs?: string): number {
  if (testMode && testNowMs) {
    const parsed = parseInt(testNowMs, 10)
    if (!isNaN(parsed)) {
      return parsed
    }
  }
  return Date.now()
}

export function isPasteExpired(
  expiresAt: Date | null,
  testMode: boolean,
  testNowMs?: string
): boolean {
  if (!expiresAt) return false
  const now = getCurrentTime(testMode, testNowMs)
  return now >= expiresAt.getTime()
}

export function getRemainingViews(maxViews: number | null, viewCount: number): number | null {
  if (maxViews === null) return null
  return Math.max(0, maxViews - viewCount)
}

export function isPasteUnavailable(
  expiresAt: Date | null,
  maxViews: number | null,
  viewCount: number,
  testMode: boolean,
  testNowMs?: string
): boolean {
  if (isPasteExpired(expiresAt, testMode, testNowMs)) return true
  if (maxViews !== null && viewCount >= maxViews) return true
  return false
}

