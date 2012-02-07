var AssetPipe = require("../lib/index")()
  , path = require("path")
  , fs = require("fs")
  , scriptPipe
AssetPipe.addFiles(__dirname + "/scripts/")

describe("AssetPipeline", function() {
  describe(".script()", function() {
    describe("with no middleware", function() {

      before(function() {
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
        it("should output the files", function(done) {
          var script = scriptPipe.get("/javascripts/scripts/derp.js", function(script) {
            script.should.equal("derp()\n")
            done()
          })
        })
      })
      describe(".getScriptTags()", function() {
        it("should output the files", function() {
          var tags = scriptPipe.getScriptTags()
          tags.should.eql(fs.readFileSync(__dirname + "/output/script_tags.html", "utf8"))
        })
      })
    })
    describe("with middleware", function() {
      before(function() {
        AssetPipe.addFiles(__dirname + "/scripts/")

        scriptPipe = AssetPipe.script()
          .file(__dirname + "/:type/:modelName.js")
          .url("/javascripts/:type/:modelName.js")
          .process(function(file, next) {
             next("(function() {\n" + file + "}())\n") 
          })
      }) 
      describe(".get()", function() {
        it("the file should be wrapped", function(done) {
          var script = scriptPipe.get("/javascripts/scripts/derp.js", function(script) {
            console.log()
            script.should.equal(fs.readFileSync(__dirname + "/output/wrapped.js", "utf8"))
            done()
          })
        })
      })
    })
  })
})
