function AssetServer(pipe) {
  this.pipe = pipe
}

AssetServer.prototype.middleware = function() {
  var that = this
  return function (req, res, next) {
    that.pipe.fileFromUrl(req.url, next, function(err, contents, fileType) {
      if(err) {
        res.writeHead(500, { 'Content-Length': err.toString().length, 'Content-Type': 'text/plain' })
        res.end(err.toString())
      } else {
        res.writeHead(200, { 'Content-Length': contents.length, 'Content-Type': fileType })
        res.write(contents)
        res.end()
      }
    })
  }
}

module.exports = AssetServer
