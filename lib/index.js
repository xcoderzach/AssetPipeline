var fs = require("fs")
  , path = require("path")
  , AssetServer = require("./server_middleware")
  , _ = require("underscore")
  , zipObject
  , asyncEach
  , ScriptPipeline = require("./script_pipeline")
  , StylesheetPipeline = require("./stylesheet_pipeline")
  , ImagePipeline = require("./image_pipeline")
  , HtmlPipeline = require("./html_pipeline")

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
 
AssetPipe.prototype.image = function() {
  var imagePipe = new ImagePipeline(this)
  this.pipes.push(imagePipe)
  return imagePipe 
}
 
AssetPipe.prototype.stylesheet = function() {
  var stylePipe = new StylesheetPipeline(this)
  this.pipes.push(stylePipe)
  return stylePipe 
}
  
AssetPipe.prototype.html = function() {
  var htmlPipe = new HtmlPipeline(this)
  this.pipes.push(htmlPipe)
  return htmlPipe 
}
 
 
AssetPipe.prototype.fileFromUrl = function(url, next, callback) {
  var found = false
  _(this.pipes).each(function(pipe) {
    if(pipe.urlToFile(url)) {
      found = true
      pipe.get(url, function(err, data, fileType) {
        if(!err || err.code !== 'ENOENT') {
          callback(err, data, fileType)
        }
      })
    }
  })
  if(!found) {
    next()
  }
}

AssetPipe.prototype.scriptTags = function() {
  var scriptTags = ""
  _(this.pipes).each(function(pipe) {
    if(typeof pipe.getScriptTags === "function") {
      scriptTags += pipe.getScriptTags()
    }
  })
  return scriptTags
}

module.exports = AssetPipe
