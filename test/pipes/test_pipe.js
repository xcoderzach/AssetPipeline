var AssetPipe = require("../../lib/index")
  , ModuleProcessor = require("../../lib/processors/module")

module.exports = assetPipe = new AssetPipe()

var scriptPipe = assetPipe.script()

scriptPipe
  .file(__dirname + "/../scripts/:type/:modelName.js")
  .url("/javascripts/:type/:modelName.js")
  .process(ModuleProcessor(__dirname + "/../.."))
