module.exports = function(file, name, next) {
  next('require.register("' + name + '", ' 
       + ' function(module, exports, require, global){\n' 
       + data '\n})')
}

