# Website

Astro static site for Daniel Perry's professional website.

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

The `Build and deploy website` GitHub Actions workflow checks, builds, and tests
the site, then deploys only `dist/` to GitHub Pages on pushes to `master` or manual
runs. In Settings > Pages, the build source must be **GitHub Actions**, not
**Deploy from a branch**. Branch-based publishing serves the historical root
`index.html` and does not run Astro. There is no need to rename that source file:
the deployed homepage is Astro's generated `dist/index.html`.

The design and displayed content have been reviewed. The research page combines
the LinkedIn publication list with the original website's papers, abstracts, and
theses, deduplicated into 17 entries.
