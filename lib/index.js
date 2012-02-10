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

AssetPipe.prototype.script = function() {
  var scriptPipe = new ScriptPipeline(this)
  this.pipes.push(scriptPipe)
  return scriptPipe 
}

AssetPipe.prototype.stylesheet = function() {
  var stylePipe = new StylesheetPipeline(this)
  this.pipes.push(stylePipe)
  return stylePipe 
}
 
AssetPipe.prototype.fileFromUrl = function(url, callback) {
  _(this.pipes).each(function(pipe) {
    if(pipe.urlToFile(url)) {
      pipe.get(url, callback)
    }
  })
}

return AssetPipe
