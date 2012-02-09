var AssetServer = module.exports = function(pipe) {
  return function(req, res, next) {
    pipe.get(req.url, function(err, contents) {
      if(err) {
        res.write(err.message, 'utf8')
      } else {
        res.write(contents, 'utf8')
        res.end()
      }
    })
  }
}
