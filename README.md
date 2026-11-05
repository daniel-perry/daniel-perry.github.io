# Website design preview

Astro static-output preview for Daniel Perry's professional website. This is the
approved design, not a published migration.

The revised preview targets hiring managers with factual descriptions of applied
science and technical leadership. Experience includes Amazon and later roles
only. New pages contain no phone number, email address, or mailto link; LinkedIn
is the professional contact route. The homepage uses the original profile photo
at its native 120-by-200 dimensions without cropping, in the single-column layout.
Historical archive image assets remain unchanged.

Use Node 22:

```sh
npm ci
npm run check
npm run build
npm test
npm run preview
```

Edit experience in `src/data/profile.ts`, research entries in
`src/content/research/`, and presentation in `src/pages/` and `src/styles/`.
Research metadata is validated by an Astro content collection.
Each research entry requires a document `type` and a general `topic`. The research
page combines one type and one topic filter; "All" clears the corresponding
filter. All entries remain available without JavaScript. Experience precedes
selected publications on the homepage, followed by education and a Ph.D. summary.

The existing root `index.html` remains a historical source reference. Astro
generates `dist/index.html`, serving both `/` and `/index.html`. The build copies
explicit legacy archive roots into ignored output and rejects collisions. Tests
check byte-for-byte preservation of included archives and local links in the new
pages. Old coursework retains its historical behavior and dependencies.

**Privacy exception:** `undergrad/resume/` contains historical resume documents.
Those originals remain untouched in the repository but are not copied into
candidate output. This does not remove documents from the existing live website
or git history. Their public availability needs a separate decision before any
release. Hidden/editor-backup files are also excluded.

The manual GitHub Actions workflow builds an artifact only. It has no push
trigger and no deployment permissions or deployment job. Do not change Pages
settings or publish this preview before approval.

The design and displayed content have been reviewed. The research page combines
the LinkedIn publication list with the original website's papers, abstracts, and
theses, deduplicated into 17 entries.

Before publication: decide the historical-resume URL policy, remove the noindex
metadata, and wire Pages deployment only with explicit publication approval.
A downloadable resume and social preview image are not included in this version.
Any future resume must omit phone and email information.

Games and AI easter eggs are deliberately not implemented yet. Candidate
directions are a clustering puzzle, a curated evaluation game, and the existing
arithmetic cipher. Any hidden interaction should support keyboard/touch input
and stay out of the primary professional navigation.
