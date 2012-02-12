var AssetPipe = require("../../lib/index")
  , ModuleProcessor = require("../../lib/processors/module")
  , StylusProcessor = require("../../lib/processors/stylus") 

module.exports = assetPipe = new AssetPipe()

var scriptPipeline = assetPipe.script()
var stylesheetPipeline = assetPipe.stylesheet()

scriptPipeline
  .root(__dirname + "/../scripts/")
  .addFiles(__dirname + "/../scripts/")
  .process(ModuleProcessor(__dirname + "/../.."))

stylesheetPipeline = assetPipe.stylesheet()
  .root(__dirname + "/../stylesheets")
  .addFiles(__dirname + "/../stylesheets/")
  .fileExtension("styl")
  .urlPrefix("/css") 
  .process(StylusProcessor)
