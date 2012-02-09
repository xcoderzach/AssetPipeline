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
        res.write(err.message, 'utf8')
      } else {
        res.write(contents, 'utf8')
        res.end()
      }
    })
  }
}

module.exports = AssetServer
