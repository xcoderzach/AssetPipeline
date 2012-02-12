var fs = require("fs")
  , path = require("path")
  , _ = require("underscore")
  , asyncEach = require("./util").asyncEach

function Pipeline() {
  this.files = []
  this.config = {}

  this.config.fileType = 'text/plain'
  this.config.urlPrefix = "/assets"
  this.config.urlExtension = ""
  this.config.fileExtension = ""
  this.config.root = ""
}       

Pipeline.prototype.fileToUrl = function(file) {
  file = this.resolve(file)
  file.replace(this.config.fileExtension, this.config.urlExtension)
  return file.replace(this.config.root, this.config.urlPrefix)
}

Pipeline.prototype.urlToFile = function(url) {
  url = url.replace("." + this.config.urlExtension, "." + this.config.fileExtension)
  return url.replace(this.config.urlPrefix, this.config.root)
}

Pipeline.prototype.resolve = function(file) {
  return path.resolve(file)
}

Pipeline.prototype.get = function(url, callback) {
  console.log(url)
  var file     = this.urlToFile(url) 
    , that     = this
  fs.readFile(file, 'utf8', function(err, contents) {
    if(err) {
      callback(err, null)
    } else {
      asyncEach(that.pipeline, function(process, next) {
        process(contents, file, url, function(err, newContents) { 
          if(err) {
            callback(err)
          }
          contents = newContents
          next() 
        })
      }, function() {
        callback(null, contents, that.config.fileType)
      })
    }
  })
}

Pipeline.prototype.root = function(root) {
  this.config.root = this.resolve(root)
  return this
}

Pipeline.prototype.process = function(callback) {
  this.pipeline = this.pipeline || []
  this.pipeline.push(callback)
  return this
}
 
Pipeline.prototype.urlPrefix = function(prefix) {
  this.config.urlPrefix = prefix
  return this
}

Pipeline.prototype.fileExtension = function(ext) {
  this.config.fileExtension = ext
  return this
}

Pipeline.prototype.urlExtension = function(ext) {
  this.config.urlExtension = ext
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
