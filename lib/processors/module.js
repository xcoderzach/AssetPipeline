var path = require("path")
  , _ = require("underscore")

module.exports = function(baseUrl, aliases) {
  baseUrl = path.resolve(baseUrl)
  return function (file, name, url, next) {
    name = name.replace(baseUrl, "")
    _(aliases).each(function(alias, replaceWith) {
      var regex = new RegExp("^" + alias)
      if(name.match(regex)) {
        name = name.replace(regex, replaceWith)
      }
    })
    next(null, 'require.register("' + name + '", ' 
        + 'function(module, exports, require, global) {\n' 
        + file.toString() + '})\n')
  }
}
