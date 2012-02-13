var util = require("util")
  , Pipeline = require("./pipeline")

function HtmlPipeline() {
  Pipeline.call(this)
  this.config.urlPrefix = "/templates"
  this.config.fileExtension = ".html"
  this.config.urlExtension = ".html"
}       

util.inherits(HtmlPipeline, Pipeline)
module.exports = ScriptPipeline 
