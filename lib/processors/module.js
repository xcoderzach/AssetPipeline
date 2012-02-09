var path = require("path")

module.exports = function(baseUrl) {
  baseUrl = path.resolve(baseUrl)
  return function (file, name, next) {
    name = name.replace(baseUrl, "")
    next( 'require.register("' + name + '", ' 
        + 'function(module, exports, require, global) {\n' 
        + file + '})\n')
  }
}
