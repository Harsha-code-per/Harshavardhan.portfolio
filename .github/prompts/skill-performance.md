# Skill: Motion Performance Auditor

Use this before or after major animation/3D changes.

## Rules
1. Prioritize smoothness: prevent jank before adding new visual complexity.
2. Flag and reduce sources of layout thrash (animating width/height/top/left/margin).
3. Keep GSAP + smooth-scroll integration synchronized and centralized.
4. Reduce oversized assets in `public/` and avoid duplicate heavy images.
5. Minimize concurrent always-on animations.
6. Prefer progressive enhancement: ship a fast baseline first, then layer advanced effects.

## Output expectation
- Clear list of bottlenecks and exact fixes.
- Performance-minded alternatives for each heavy effect.
