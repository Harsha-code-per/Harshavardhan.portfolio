/**
 * ViewportScaler — DISABLED.
 *
 * We previously attempted to apply `html { zoom: scale }` anchored to a
 * 1920 px design baseline to compensate for OS display scaling and browser
 * zoom.  The approach was abandoned because CSS `zoom` on the root element
 * changes the coordinate space that GSAP uses for getBoundingClientRect()
 * and window.innerHeight.  This caused ScrollTrigger pin scroll-distances to
 * be calculated incorrectly, producing the large empty gaps visible in
 * WorkShowcase, MaskedAbout and HorizontalProjects at anything other than
 * 100 % browser zoom.
 *
 * What actually handles zoom/scale correctly:
 *  • `vw` / `vh` / `dvh` CSS units — already relative to whatever viewport
 *    the browser reports, at any zoom level.
 *  • `invalidateOnRefresh: true` on every ScrollTrigger — tells GSAP to
 *    recalculate all measurements when ScrollTrigger.refresh() is called.
 *  • The debounced resize → ScrollTrigger.refresh() in SmoothScroller —
 *    fires on every browser-zoom or OS-scaling change, recalculating all
 *    pin durations and scroll positions automatically.
 *
 * No further action needed here.
 */
export function ViewportScaler() {
  return null;
}
