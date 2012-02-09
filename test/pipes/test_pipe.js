var AssetPipe = require("../../lib/index")()
  , ModuleProcessor = require("../../lib/processors/module")

module.exports = scriptPipe = AssetPipe.script()
  .file(__dirname + "/../scripts/:type/:modelName.js")
  .url("/javascripts/:type/:modelName.js")
  .process(ModuleProcessor(__dirname + "/../.."))
