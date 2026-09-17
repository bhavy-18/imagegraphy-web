/**
 * Determines whether a target element is interactive (sidebar, button, link, control),
 * so that clicks or hovers on it do NOT trigger background image navigation.
 */
export function isInteractiveElement(target) {
  if (
    !target ||
    (typeof document !== 'undefined' &&
      (target === document.body || target === document.documentElement))
  ) {
    return false;
  }
  return Boolean(
    target.closest(
      'aside, .sidebar, button, a, input, select, textarea, [role="button"], [role="link"], .overview-thumb-item, .project-detail-thumb, .back-to-projects-btn, .menu-toggle, .mobile-header-controls'
    )
  );
}

/**
 * Determines whether a pointer position (clientX, clientY) corresponds to
 * 'prev' (previous image), 'next' (next image), or 'center' (toggle thumbnails / open grid).
 *
 * Rules:
 * - Outside image to the left (clientX < rect.left): 'prev'
 * - Outside image to the right (clientX > rect.right): 'next'
 * - Directly on the image vertically (clientY >= rect.top && clientY <= rect.bottom):
 *   - Left 1/3: 'prev'
 *   - Center 1/3: 'center'
 *   - Right 1/3: 'next'
 * - Outside image vertically (above or below, but rect.left <= clientX <= rect.right):
 *   - Left half (clientX < rect.left + rect.width / 2): 'prev'
 *   - Right half: 'next'
 * - Fallback if image rect is unavailable:
 *   - Left half of window: 'prev'
 *   - Right half of window: 'next'
 */
export function getImageNavZone(clientX, clientY, imgEl) {
  const screenCenter = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;

  if (!imgEl) {
    return clientX < screenCenter ? 'prev' : 'next';
  }

  const rect = imgEl.getBoundingClientRect();
  if (!rect || rect.width <= 0 || rect.height <= 0) {
    return clientX < screenCenter ? 'prev' : 'next';
  }

  // 1. Outside to the left of the image
  if (clientX < rect.left) {
    return 'prev';
  }

  // 2. Outside to the right of the image
  if (clientX > rect.right) {
    return 'next';
  }

  // 3. Within horizontal span of the image:
  // If vertically within image bounds:
  if (clientY >= rect.top && clientY <= rect.bottom) {
    const x = clientX - rect.left;
    const third = rect.width / 3;
    if (x < third) return 'prev';
    if (x > rect.width - third) return 'next';
    return 'center';
  }

  // 4. In the background area above or below the image:
  const center = rect.left + rect.width / 2;
  return clientX < center ? 'prev' : 'next';
}
