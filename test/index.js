var AssetPipe = require("../lib/index")()
  , path = require("path")

describe("AssetPipeline", function() {

  describe(".script()", function() {
    var scriptPipe
    before(function() {
      AssetPipe.addFiles(__dirname + "/scripts/")

      scriptPipe = AssetPipe.script()
        .from(__dirname + "/:type/:modelName.js")
        .to("/javascripts/:type/:modelName.js")
    })
    describe(".getScripts()", function() {
      it("should get a list of matching files", function() {
        var scripts = scriptPipe.getScriptFiles()
        scripts.length.should.equal(2)
        scripts.indexOf(path)
      })
    })
  })

})
