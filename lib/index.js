var fs = require("fs")
  , path = require("path")
  , AssetServer = require("./server_middleware")
  , _ = require("underscore")
  , zipObject
  , asyncEach
  , ScriptPipeline = require("./script_pipeline")

var AssetPipe = module.exports = function() {
  this.allFiles = []
  this.pipes = []
  this.server = new AssetServer(this)
}

AssetPipe.prototype.addFiles = function(file) {
  var stats = fs.statSync(file)
    , that = this
    , files
  if(stats.isFile()) {
    this.allFiles.push(path.resolve(file))
  } else if(stats.isDirectory()) {

    var files = fs.readdirSync(file)

    files.forEach(function(newFile) {
      that.addFiles(file + "/" + newFile)
    })
  }
}

AssetPipe.prototype.script = function() {
  var scriptPipe = new ScriptPipeline(this)
  this.pipes.push(scriptPipe)
  return scriptPipe 
}

AssetPipe.prototype.fileFromUrl = function(url, callback) {
  _(this.pipes).each(function(pipe) {
    if(pipe.urlToFile(url)) {
      pipe.get(url, callback)
    }
  })
}

return AssetPipe
