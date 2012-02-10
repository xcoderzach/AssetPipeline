var fs = require("fs")
  , path = require("path")
  , _ = require("underscore")
  , asyncEach = require("./util").asyncEach

function Pipeline() {
  this.files = []
  this.fileType = 'text/plain'
  this.urlPrefix = "/assets"
}       

Pipeline.prototype.fileToUrl = function(file) {
  return this.resolve(file).replace(this.root, this.urlPrefix)
}

Pipeline.prototype.urlToFile = function(url) {
  return this.resolve(url.replace(this.urlPrefix, this.root))
}

Pipeline.prototype.resolve = function(file) {
  return path.resolve(file)
}

Pipeline.prototype.get = function(url, callback) {
  var file     = this.urlToFile(url) 
    , contents = fs.readFileSync(file, 'utf8')
    , that     = this

  asyncEach(this.pipeline, function(process, next) {
    process(contents, file, url, function(err, newContents) { 
      if(err) {
        callback(err)
      }
      contents = newContents
      next() 
    })
  }, function() {
    callback(null, contents, that.fileType)
  })
}

Pipeline.prototype.root = function(root) {
  this.root = this.resolve(root)
  return this
}

Pipeline.prototype.process = function(callback) {
  this.pipeline = this.pipeline || []
  this.pipeline.push(callback)
  return this
}
 
Pipeline.prototype.urlPrefix = function(prefix) {
  this.urlPrefix = prefix
  return this
}
 
Pipeline.prototype.addFiles = function(file) {
   file = this.resolve(file)
   var stats = fs.statSync(file)
    , that = this
    , files
  if(stats.isFile()) {
    this.files.push(file)
  } else if(stats.isDirectory()) {
    var files = fs.readdirSync(file)

    files.forEach(function(newFile) {
      that.addFiles(file + "/" + newFile)
    })
  }
  return this
} 

module.exports = Pipeline 
