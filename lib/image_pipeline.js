var path = require("path")
  , _ = require("underscore")
  , util = require("util")
  , Pipeline = require("./pipeline")

function ImagePipeline() {
  Pipeline.call(this)
  this.config.urlPrefix = "/images"
  this.config.urlExtension = /\.(jpg|png|gif)/i
}

ImagePipeline.prototype.serveDefault = function() {
  this.root(__dirname + "/../")
  this.addFiles(__dirname + "/../assets/img")
}
 

util.inherits(ImagePipeline, Pipeline)
module.exports = ImagePipeline
