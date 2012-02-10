var fs = require("fs")
  , path = require("path")
  , Route = require("./route")
  , _ = require("underscore")
  , zipObject
  , asyncEach

zipObject = function(keys, values) {
  var zipped = {}
  keys.forEach(function(key, index) {
    zipped[key] = values[index]
  })
  return zipped
}   
 
asyncEach = function(coll, fn, end) {
  var type
    , obj
    , end = end || function() {}

  if(typeof coll === "object" && !_.isArray(coll)) {
    obj = coll
    coll = _.keys(coll)
    type = "object"
  }
  var callNext = function(i) {
    if(i < coll.length) {
      if(type == "object") {
        fn(obj[coll[i]], coll[i], function() {
          callNext(i+1)
        })
      } else {
        fn(coll[i], function() {
          callNext(i+1)
        })
      }
    } else {
      end()
    }
  }
  if(coll && coll.length) {
    callNext(0) 
  } else {
    end()
  }
}

function ScriptPipeline() {
  this.files = []
  this.fileType = 'text/javascript'
  this.urlPrefix = "/modules"
}       

ScriptPipeline.prototype.getScriptFiles = function() {
  var scripts = []
    , that = this
  this.files.forEach(function(file) {
    scripts.push(file)
  })
  return scripts
}

ScriptPipeline.prototype.fileToUrl = function(file) {
  return this.resolve(file).replace(this.root, this.urlPrefix)
}

ScriptPipeline.prototype.urlToFile = function(url) {
  return this.resolve(url.replace(this.urlPrefix, this.root))
}

ScriptPipeline.prototype.resolve = function(file) {
  //try to resolve the file as a module
  try {
   file = require.resolve(file)
  } catch(e) {
   file = path.resolve(file)
  }
  return file
}

ScriptPipeline.prototype.get = function(url, callback) {
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

ScriptPipeline.prototype.getScriptTag = function(url) {
  return '<script src = "' + url + '"></script>'
}

ScriptPipeline.prototype.getScriptTags = function() {
  var scriptUrls = _(this.getScriptFiles()).map(this.fileToUrl, this)
    , scriptTags = _(scriptUrls).map(this.getScriptTag, this)
  return scriptTags.join("\n") + "\n"
}

ScriptPipeline.prototype.root = function(root) {
  this.root = this.resolve(root)
  return this
}

ScriptPipeline.prototype.process = function(callback) {
  this.pipeline = this.pipeline || []
  this.pipeline.push(callback)
  return this
}
 
ScriptPipeline.prototype.addFiles = function(file) {
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

module.exports = ScriptPipeline
