# Skill: GSAP Motion Director

Use this when building scroll-linked sections, pinned narratives, hero text choreography, or section transitions.

## Rules
1. Use `useGSAP` from `@gsap/react` with a `scope` ref for every component timeline.
2. Animate only `transform` and `opacity` for frequently-updated elements.
3. Keep timeline ownership local to the section; avoid global selector collisions.
4. Use `ScrollTrigger` for spatial storytelling (pin, scrub, horizontal tracks, reveal masks).
5. Keep infinite loops minimal and low-cost; do not run many independent infinite tweens at once.
6. Prefer one coherent timeline per section over many disconnected tweens.

## Output expectation
- Scroll behavior feels smooth and intentional.
- Section start/end states are deterministic on refresh/resize.
- Motion enhances readability rather than obscuring content.
