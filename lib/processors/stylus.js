var stylus = require("stylus")
var nib    = require("nib")

module.exports = function(file, name, url, next) {
  var dirname = path.dirname(module.uri)
  stylus(stylusText.toString())
    .set('paths',[paths.assets + "/stylesheets", require('stylus-blueprint')])
    .use(nib())
    .render(function(err, css) {

      if(err) {
        next(err)
      } else {
        next(css)
      }
    })
}
