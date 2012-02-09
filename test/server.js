var AssetServer = require("../lib/server_middleware")
  , path = require("path")
  , fs = require("fs")
  , request = require("superagent")
  , testPipe = require("./pipes/test_pipe.js")
  , connect = require("connect")
  , server

server = connect(AssetServer(testPipe))
server.listen(3001)

describe("AssetServer", function() { 
  it("should serve the test file", function(done) {
    request.get('localhost:3001/javascripts/models/user.js', function(res) {
      res.text.should.equal(fs.readFileSync(__dirname + "/output/user_javascript_output.js", "utf8"))
      done()
    })
  })
})
