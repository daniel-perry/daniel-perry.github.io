# Website design preview

Astro static-output preview for Daniel Perry's professional website.

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

The manual GitHub Actions workflow builds an artifact only. It has no push
trigger and no deployment permissions or deployment job. Do not change Pages
settings or publish this preview before approval.

The design and displayed content have been reviewed. The research page combines
the LinkedIn publication list with the original website's papers, abstracts, and
theses, deduplicated into 17 entries.
