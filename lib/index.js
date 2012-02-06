var fs = require("fs")
  , path = require("path")
  , Route = require("../lib/route")

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
      if(that.fromRoute.match(file)) {
        scripts.push(file)
      }
    })
    return scripts
  }

  ScriptPipe.prototype.from = function(from) {
    this.fromRoute = new Route("GET", path.resolve(from))
    return this
  }

  ScriptPipe.prototype.to = function(to) {
    this.toRoute = new Route("GET", to)
    return this
  }

  return AssetPipe
}
