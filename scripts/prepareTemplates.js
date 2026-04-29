#!/usr/bin/env node
const fs = require('fs');
const pages = ['index.html', 'about.html', 'articles.html', 'article.html'];
pages.forEach(f => {
  const templatePath = `templates/${f}`;
  if (fs.existsSync(templatePath)) {
    fs.copyFileSync(templatePath, f);
  }
});
