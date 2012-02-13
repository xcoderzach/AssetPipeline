var fs = require("fs")
  , path = require("path")
  , _ = require("underscore")
  , mime = require("mime")
  , asyncEach = require("./util").asyncEach

function Pipeline() {
  this.files = []
  this.config = {}

  this.config.urlPrefix = "/assets"
  this.config.root = ""
}       

Pipeline.prototype.fileToUrl = function(file) {
  file = this.resolve(file)
  if(this.config.fileExtension) {
    file = file.replace(this.config.fileExtension, this.config.urlExtension) 
  }
  file = file.replace(this.config.root, this.config.urlPrefix)
    return file
}

Pipeline.prototype.urlToFile = function(url) {
  var file = url
  if(this.config.fileExtension) {
    file = file.replace(this.config.urlExtension, this.config.fileExtension)
  }
  file = file.replace(this.config.urlPrefix, this.config.root)
  if(this.files.indexOf(file) !== -1) {
    return file
  }
}

Pipeline.prototype.resolve = function(file) {
  return path.resolve(file)
}

Pipeline.prototype.get = function(url, callback) {
  var file     = this.urlToFile(url) 
    , that     = this
  fs.readFile(file, function(err, contents) {
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
        var fileType = mime.lookup(url)
        callback(null, contents, fileType)
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
  if(stats.isFile() && path.extname(file).match(this.config.fileExtension)) {
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
