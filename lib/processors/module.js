var path = require("path")

module.exports = function(baseUrl) {
  baseUrl = path.resolve(baseUrl)
  return function (file, name, url, next) {
    name = name.replace(baseUrl, "")
    next(null, 'require.register("' + name + '", ' 
        + 'function(module, exports, require, global) {\n' 
        + file + '})\n')
  }
}
