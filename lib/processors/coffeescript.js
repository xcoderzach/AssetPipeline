var coffee = require("coffee-script")

module.exports = function(file, name, url, next) {
  try {
    javascript = coffee.compile(coffeescript.toString())
    next(null, javascript)
  } catch(e) {
    next(new Error("syntax error " + url + " " + e.toString()))
  } 
}
