var util            = require("util")
  , Pipeline        = require("./pipeline")
  , _               = require("underscore")
  , moduleProcessor = require("./processors/module")

function HtmlPipeline() {
  Pipeline.call(this)
  this.config.urlPrefix = "/templates"
  this.config.fileExtension = ".html"
  this.config.urlExtension = ".html"
}       
util.inherits(HtmlPipeline, Pipeline)

HtmlPipeline.prototype.getScriptTags = function() {
  return "<script src = \"/templates/cache.js\"></script>"
}

HtmlPipeline.prototype.urlToFile = function(url) {
  if(url === "/templates/cache.js") {
    return "/templates/cache.js"
  } 
  Pipeline.prototype.urlToFile.call(this)
}

HtmlPipeline.prototype.get = function(url, callback) {
  if(url === "/templates/cache.js") {
    this.getFilesJSON(function(files) {
      var processor = moduleProcessor()
      processor("module.exports = " + JSON.stringify(files), "/templates/cache.js", "", function(err, wrapped) { 
        callback(null, wrapped, "application/javascript")
      })
    })
  } else {
    Pipeline.prototype.get.call(this, callback)
  }
}

module.exports = HtmlPipeline 
