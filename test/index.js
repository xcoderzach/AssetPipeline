var AssetPipe = require("../lib/index")()
  , path = require("path")

describe("AssetPipeline", function() {

  describe(".script()", function() {
    var scriptPipe
    before(function() {
      AssetPipe.addFiles(__dirname + "/scripts/")

      scriptPipe = AssetPipe.script()
        .file(__dirname + "/:type/:modelName.js")
        .url("/javascripts/:type/:modelName.js")
    })
    describe(".getScripts()", function() {
      it("should get a list of matching files", function() {
        var scripts = scriptPipe.getScriptFiles()
        scripts.length.should.equal(2)
        scripts.indexOf(path.resolve("./scripts/derp.js"))
      })
    })
    describe(".get()", function() {
      describe("with no middleware", function() {
        it("should output the files", function() {
          var script = scriptPipe.get("/javascripts/scripts/derp.js")
          script.should.equal("derp()\n")
        })
      })
    })
  })

})
