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

To show the time at NTQ automatically, replace the empty `data-start-date` in `index.html` with the verified start date in `YYYY-MM-DD` format, for example `data-start-date="2026-07-15"`. The date above is an example only. The display counts completed months and stays hidden when no valid date is provided. Update the employment description when the role changes.

To preview locally, install Ruby and Bundler, then run `bundle install` and `bundle exec jekyll serve`. GitHub Actions builds and deploys changes pushed to `main`.
