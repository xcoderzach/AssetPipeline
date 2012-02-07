var fs = require("fs")
  , path = require("path")
  , Route = require("../lib/route")
  , _ = require("underscore")
  , zipObject
zipObject = function(keys, values) {
  var zipped = {}
  keys.forEach(function(key, index) {
    zipped[key] = values[index]
  })
  return zipped
};   

module.exports = function() {
  var allFiles = []
  AssetPipe = {}

  AssetPipe.addFiles = function(file) {
    var stats = fs.statSync(file)
      , files
    if(stats.isFile()) {
      allFiles.push(path.resolve(file))
    } else if(stats.isDirectory()) {

      var files = fs.readdirSync(file)

      files.forEach(function(newFile) {
        AssetPipe.addFiles(file + newFile)
      })
    }
  }

  AssetPipe.script = function() {
    return new ScriptPipe
  }

  function ScriptPipe() {

  }       

  ScriptPipe.prototype.getScriptFiles = function() {
    var scripts = []
      , that = this
    allFiles.forEach(function(file) {
      if(that.fileRoute.match(file)) {
        scripts.push(file)
      }
    })
    return scripts
  }

  ScriptPipe.prototype.urlToFile = function(url) {
    var match = this.urlRoute.match(url)
      , fileName = this.fileRoute.path
      , routeKeys = _(this.urlRoute.keys).pluck("name")
      , result


    if(match) {
      result = zipObject(routeKeys, match.slice(1))
      _(result).each(function(val, key) {
        var keyReplaceRegex = new RegExp(":" + key, "g")
        fileName = fileName.replace(keyReplaceRegex, val)
      })
      return fileName
    } else {
      throw new Error("No asset found that matches " + url)
    }
  }

  ScriptPipe.prototype.get = function(url) {
    var file     = this.urlToFile(url) 
      , contents = fs.readFileSync(file, 'utf8')

    return contents
  }

  ScriptPipe.prototype.url = function(from) {
    this.urlRoute = new Route("GET", path.resolve(from))
    return this
  }

  ScriptPipe.prototype.file = function(to) {
    this.fileRoute = new Route("GET", to)
    return this
  }

  return AssetPipe
}
