const autoprefixer = require('autoprefixer')
const postcss = require('postcss')
//const precss = require('precss')
const fs = require('fs')

fs.readFile('_includes/styles.css', (err, css) => {
  postcss([
      require('autoprefixer'),
      require('cssnano')
    ])
    .process(css, { from: '_includes/styles.css', to: '_site/app.css' })
    .then(result => {
      fs.writeFile('_site/styles.css', result.css, () => true)
      if ( result.map ) {
        fs.writeFile('_site/styles.css.map', result.map, () => true)
      }
    })
})