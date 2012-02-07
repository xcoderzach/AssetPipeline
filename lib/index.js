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

  ScriptPipe.prototype.routeToRoute = function(match, fromRoute, toRoute) {
    var from = fromRoute.path
      , to = toRoute.path
      , match = fromRoute.match(match)
      , routeKeys = _(fromRoute.keys).pluck("name")
      , result

    if(match) {
      result = zipObject(routeKeys, match.slice(1))
      _(result).each(function(val, key) {
        var keyReplaceRegex = new RegExp(":" + key, "g")
        to = to.replace(keyReplaceRegex, val)
      })
      return to
    } else {
      throw new Error("No asset found that matches " + match)
    }
  }

  ScriptPipe.prototype.fileToUrl = function(file) {
    return this.routeToRoute(file, this.fileRoute, this.urlRoute)
  }

  ScriptPipe.prototype.urlToFile = function(url) {
    return this.routeToRoute(url, this.urlRoute, this.fileRoute)
  }

  ScriptPipe.prototype.get = function(url) {
    var file     = this.urlToFile(url) 
      , contents = fs.readFileSync(file, 'utf8')

    return contents
  }

  ScriptPipe.prototype.getScriptTag = function(url) {
    return '<script src = "' + url + '"></script>'
  }

  ScriptPipe.prototype.getScriptTags = function() {
    var scriptUrls = _(this.getScriptFiles()).map(this.fileToUrl, this)
      , scriptTags = _(scriptUrls).map(this.getScriptTag, this)
    return scriptTags.join("\n") + "\n"
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
