# Skill: Data-Driven Portfolio Content

Use this for any section content implementation or refactor.

## Rules
1. Do not hardcode long-form portfolio content in component files.
2. Keep each domain in its own typed module under `src/data/`.
3. Export both types and values from each data file.
4. Design data structures for future editing by non-engineers (clear keys, stable schema).
5. Components should map data to UI; they should not own business/content text.

## Required content modules
- `about.ts`
- `skills.ts`
- `sports.ts`
- `publications.ts`
- `projects.ts`
- `work.ts`
- `research.ts`
- `contact.ts`

## Output expectation
- Updating future content requires data file edits only.
- UI components are reusable renderers of typed data.
