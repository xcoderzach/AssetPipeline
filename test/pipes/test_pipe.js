var AssetPipe = require("../../lib/index")
  , ModuleProcessor = require("../../lib/processors/module")

module.exports = assetPipe = new AssetPipe()

var scriptPipe = assetPipe.script()

scriptPipe
  .root(__dirname + "/../scripts/")
  .addFiles(__dirname + "/../scripts/")
  .process(ModuleProcessor(__dirname + "/../.."))
