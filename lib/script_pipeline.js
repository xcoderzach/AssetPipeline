var path = require("path")
  , fs = require("fs")
  , _ = require("underscore")
  , util = require("util")
  , Pipeline = require("./pipeline")

function ScriptPipeline() {
  Pipeline.call(this)
  this.config.urlPrefix = "/modules"
  this.config.fileExtension = ".js"
  this.config.urlExtension = ".js"
}       

util.inherits(ScriptPipeline, Pipeline)

ScriptPipeline.prototype.getScriptFiles = function() {
  return this.files
}

function fileExists(file) {
  var file = file
    , suffix = ["", ".js", "/index.js"]
    , i
  for(i = 0 ; i < suffix.length ; i++) {
    try {
      fs.statSync(file + suffix[i])
      return file + suffix[i]

    } catch(e) {} 
  }
  return false
}

function resolveNodeModuleRequireWithDirs(base, dir) {
  var file = path.resolve(path.join(base, "node_modules", dir))
  file = fileExists(file)
  if(file) {
    return file
  }
  if(base === "/") {
    return resolveNodeModuleRequireWithDirs(path.resolve(path.join(base, "..")), dir)
  } else {
    return false
  }
}

ScriptPipeline.prototype.resolve = function(file) {
  //try to resolve the file as a module
  if(file[0] !== "." && file[0] !== "/") {
    file = resolveNodeModuleRequireWithDirs(this.root, file)
  } else {
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
