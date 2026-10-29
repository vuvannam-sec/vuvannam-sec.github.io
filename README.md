# Vũ Văn Nam — Security research, in practice

Personal portfolio and security blog: [vuvannam-sec.github.io](https://vuvannam-sec.github.io).

The homepage introduces my research, public projects and current direction. Published write-ups remain in `_posts/` and keep their original URLs. The blog uses Jekyll and [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy), with deployment through GitHub Actions.

## Editing

- `index.html` — homepage content, research index and project descriptions.
- `assets/css/portfolio.css` — homepage layout, typography and responsive styles.
- `assets/css/reading.css` — typography and colors on the blog's reading pages.
- `assets/js/portfolio.js` — the finding walkthrough, rendering demonstration and employment tenure.
- `assets/fonts/` — Be Vietnam Pro fonts and their SIL Open Font License.
- `assets/img/profile-avatar.png` — the illustrated avatar used in the About section.
- `_tabs/about.md` — the blog's About page.
- `_posts/` — published research write-ups.
- `_config.yml` — blog metadata and Jekyll settings.

The NTQ tenure uses `data-start-date="2026-07-01"`. It counts completed months in the visitor's browser. Update the date and role description when employment changes.

## Rendering demonstration

The finding walkthrough includes a fixed, harmless comparison between HTML insertion and text insertion. It is an illustration of a trust boundary, not a replay against Genspark or a claim about the vendor's current implementation.

The demo executes only after a click, inside an iframe with `sandbox="allow-scripts"` and no same-origin privilege. Its Content Security Policy blocks network connections, forms and external resources. The fixed payload changes a text label in that iframe; the page accepts no user-supplied payloads.

## Local preview

Install Ruby and Bundler, then run `bundle install` and `bundle exec jekyll serve`. Changes pushed to `main` are built and deployed by GitHub Actions.
