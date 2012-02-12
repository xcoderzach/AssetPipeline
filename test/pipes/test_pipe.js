var AssetPipe = require("../../lib/index")
  , ModuleProcessor = require("../../lib/processors/module")
  , StylusProcessor = require("../../lib/processors/stylus") 
  , CoffeeScriptProcessor = require("../../lib/processors/coffeescript") 

module.exports = assetPipe = new AssetPipe()

var scriptPipeline = assetPipe.script()
var coffeeScriptPipeline = assetPipe.script()
var stylesheetPipeline = assetPipe.stylesheet()

scriptPipeline
  .root(__dirname + "/../scripts/")
  .addFiles(__dirname + "/../scripts/")
  .process(ModuleProcessor(__dirname + "/../.."))

coffeeScriptPipeline
  .fileExtension("coffee")
  .root(__dirname + "/../scripts/")
  .addFiles(__dirname + "/../scripts/")
  .process(CoffeeScriptProcessor)
  .process(ModuleProcessor(__dirname + "/../.."))
 
stylesheetPipeline = assetPipe.stylesheet()
  .fileExtension("styl")
  .urlPrefix("/css") 
  .root(__dirname + "/../stylesheets")
  .addFiles(__dirname + "/../stylesheets/")
  .process(StylusProcessor)
