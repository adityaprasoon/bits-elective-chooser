# BITS Elective Chooser

A static, client-side elective planner for M.Tech AIML Semester 2. It runs without a build step, backend, or external dependencies.

## Run locally

Open `index.html` in a browser, or serve this directory with any static file server. Curriculum and program details are configured in `js/config.js`.

## Deploy to GitHub Pages

In the repository settings, enable GitHub Pages and deploy from the `main` branch root. The app consists only of static HTML, CSS, and JavaScript.

## Features

- Select electives while enforcing the one-course-per-bucket rule.
- Quick-select a specialization and lock its required elective.
- Review calculated units and matching specializations.
- Browse, filter, search, and apply every valid combination.
- Automatically save selections locally and encode them in a shareable URL.