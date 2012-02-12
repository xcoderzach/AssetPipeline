var path = require("path")
  , _ = require("underscore")
  , util = require("util")
  , Pipeline = require("./pipeline")

function ImagePipeline() {
  Pipeline.call(this)
  this.config.urlPrefix = "/modules"
  this.config.urlExtension = /\.(jpg|png|gif)/i
}
