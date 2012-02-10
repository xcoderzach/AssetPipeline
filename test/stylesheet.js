var AssetPipe = require("../lib/index")
  , path = require("path")
  , fs = require("fs")
  , request = require("superagent")
  , connect = require("connect")
  , server
  , testPipe = require("./pipes/test_pipe.js")

server = connect(testPipe.server.middleware())
server.listen(3001)

describe("AssetPipeline", function() {
  describe("loading a stylesheet", function() {
    it("should convert the .styl to .css", function(done) {
      request.get('localhost:3001/modules/models/user.js', function(res) {
        res.headers['content-type'].should.equal("text/javascript")
        res.text.should.equal(fs.readFileSync(__dirname + "/output/user_javascript_output.js", "utf8"))
        done()
      }) 
    })
  })
})
