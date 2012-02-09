function AssetServer(pipe) {
  this.pipe = pipe
}

AssetServer.prototype.middleware = function() {
  var that = this
  return function (req, res, next) {
    that.pipe.fileFromUrl(req.url, function(err, contents) {
      if(err) {
        // we should send some size/filetype etc headers
        // and maybe this should be a stream too
        res.writeHead(500, { 'Content-Length': err.message.length})
        res.write(err.message, 'utf8')
      } else {
        res.writeHead(200, { 'Content-Length': contents.length, 'Content-Type': 'text/javascript'})
        res.write(contents, 'utf8')
        res.end()
      }
    })
  }
}

module.exports = AssetServer
