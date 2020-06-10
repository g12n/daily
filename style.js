const fs = require('fs')
const CleanCSS = require("clean-css");

fs.readFile('_includes/styles.css', (err, css) => {
   let result =  new CleanCSS({}).minify(css).styles;
    fs.writeFile('_site/styles.css', result, () => true)
})

