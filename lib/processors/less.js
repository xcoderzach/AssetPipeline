var stylus = require("stylus")
  , path   = require("path")
  , less   = require("less")

module.exports = function(file, name, url, next) {
  var dirname = path.dirname(name)
    , parser = new less.Parser({ paths: [ dirname, __dirname + "/../../assets/less" ]
                               , filename: name
                               })

  parser.parse(file, function(err, tree) {
    if(err) {
      next(err.toString())
    }
    if(process.env.NODE_ENV.toLowerCase() === "production") {
      next(tree.toCSS(null, { compress: true }))
    } else {
      next(tree.toCSS(null, { compress: false }))
    }
  })
} 
