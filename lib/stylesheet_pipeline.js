var Pipeline = require("./pipeline")
  , util = require("util")

function StylesheetPipeline() {
  Pipeline.call(this)
  this.config.urlPrefix = "/stylesheets"
  this.config.fileExtension = "css"
  this.config.urlExtension = "css"
}       

util.inherits(StylesheetPipeline, Pipeline)
module.exports = StylesheetPipeline
