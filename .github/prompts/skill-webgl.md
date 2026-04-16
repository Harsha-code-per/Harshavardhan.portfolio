# Skill: 3D Experience Layer (Spline + Optional R3F)

Use this when building immersive backgrounds, parallax 3D accents, timeline/progress objects, or 3D project card interactions.

## Rules
1. Treat 3D as atmospheric support; all primary content remains DOM.
2. Start with Spline for fast visual delivery. Use R3F only when custom logic/performance control is required.
3. Never implement video or image-sequence scrubbing.
4. Avoid multiple heavyweight 3D canvases active in the same viewport.
5. Load heavy 3D blocks with dynamic imports where possible.
6. Keep interaction smooth on mid-range hardware (avoid excessive post-processing and overdraw).

## Output expectation
- 3D feels premium but does not block page usability.
- Text remains readable and layered correctly above visual effects.
- Motion and color language match the portfolio brand.
