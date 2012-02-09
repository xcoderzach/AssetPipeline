var AssetServer = module.exports = function(pipe) {
  return function(req, res, next) {
    pipe.get(req.url, function(contents) {
      res.write(contents, 'utf8')
      res.end()
    })
  }
}
