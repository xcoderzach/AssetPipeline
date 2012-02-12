var path = require("path")
  , _ = require("underscore")
  , util = require("util")
  , Pipeline = require("./pipeline")

function ScriptPipeline() {
  Pipeline.call(this)
  this.config.fileType = 'text/javascript'
  this.config.urlPrefix = "/modules"
  this.config.fileExtension = "js"
  this.config.urlExtension = "js"
}       

util.inherits(ScriptPipeline, Pipeline)

ScriptPipeline.prototype.getScriptFiles = function() {
  var scripts = []
    , that = this
  this.files.forEach(function(file) {
    scripts.push(file)
  })
  return scripts
}

ScriptPipeline.prototype.resolve = function(file) {
  //try to resolve the file as a module
  try {
   file = require.resolve(file)
  } catch(e) {
   file = path.resolve(file)
  }
  return file
}

ScriptPipeline.prototype.getScriptTag = function(url) {
  return '<script src = "' + url + '"></script>'
}

ScriptPipeline.prototype.getScriptTags = function() {
  var scriptUrls = _(this.getScriptFiles()).map(this.fileToUrl, this)
    , scriptTags = _(scriptUrls).map(this.getScriptTag, this)
  return scriptTags.join("\n") + "\n"
}

module.exports = ScriptPipeline
