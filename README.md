# Nam Vu — Security Research & AI

Personal portfolio and security blog: [vuvannam-sec.github.io](https://vuvannam-sec.github.io).

The homepage introduces my interests, public research, and selected projects. Existing security write-ups remain in `_posts/` and use their original URLs. The blog is built with Jekyll and the [Chirpy theme](https://github.com/cotes2020/jekyll-theme-chirpy), then published by GitHub Actions.

## Editing

- `index.html` — portfolio content and links.
- `assets/css/portfolio.css` — homepage styles.
- `assets/js/portfolio.js` — optional employment-tenure display and footer year.
- `_tabs/about.md` — About page in the blog.
- `_posts/` — published research write-ups.
- `_config.yml` — blog title, contact details, and Jekyll settings.

The NTQ tenure in `index.html` uses `data-start-date="2026-07-01"`. The display counts completed months in the visitor's browser and stays hidden when no valid date is provided. Update the date and employment description if the role changes.

To preview locally, install Ruby and Bundler, then run `bundle install` and `bundle exec jekyll serve`. GitHub Actions builds and deploys changes pushed to `main`.
