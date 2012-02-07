var fs = require("fs")
  , path = require("path")
  , Route = require("../lib/route")
  , _ = require("underscore")
  , zipObject
  , asyncEach

zipObject = function(keys, values) {
  var zipped = {}
  keys.forEach(function(key, index) {
    zipped[key] = values[index]
  })
  return zipped
};   

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


module.exports = function() {
  var allFiles = []
  AssetPipe = {}

  AssetPipe.addFiles = function(file) {
    var stats = fs.statSync(file)
      , files
    if(stats.isFile()) {
      allFiles.push(path.resolve(file))
    } else if(stats.isDirectory()) {

      var files = fs.readdirSync(file)

      files.forEach(function(newFile) {
        AssetPipe.addFiles(file + newFile)
      })
    }
  }

  AssetPipe.script = function() {
    return new ScriptPipe
  }

  function ScriptPipe() {

  }       

  ScriptPipe.prototype.getScriptFiles = function() {
    var scripts = []
      , that = this
    allFiles.forEach(function(file) {
      if(that.fileRoute.match(file)) {
        scripts.push(file)
      }
    })
    return scripts
  }

  ScriptPipe.prototype.routeToRoute = function(match, fromRoute, toRoute) {
    var from = fromRoute.path
      , to = toRoute.path
      , match = fromRoute.match(match)
      , routeKeys = _(fromRoute.keys).pluck("name")
      , result

    if(match) {
      result = zipObject(routeKeys, match.slice(1))
      _(result).each(function(val, key) {
        var keyReplaceRegex = new RegExp(":" + key, "g")
        to = to.replace(keyReplaceRegex, val)
      })
      return to
    } else {
      throw new Error("No asset found that matches " + match)
    }
  }

  ScriptPipe.prototype.fileToUrl = function(file) {
    return this.routeToRoute(file, this.fileRoute, this.urlRoute)
  }

  ScriptPipe.prototype.urlToFile = function(url) {
    return this.routeToRoute(url, this.urlRoute, this.fileRoute)
  }

  ScriptPipe.prototype.get = function(url, callback) {
    var file     = this.urlToFile(url) 
      , contents = fs.readFileSync(file, 'utf8')

    asyncEach(this.pipeline, function(process, next) {
      process(contents, function(newContents) { 
        contents = newContents
        next() 
      })
    })

    callback(contents)
  }

  ScriptPipe.prototype.getScriptTag = function(url) {
    return '<script src = "' + url + '"></script>'
  }

  ScriptPipe.prototype.getScriptTags = function() {
    var scriptUrls = _(this.getScriptFiles()).map(this.fileToUrl, this)
      , scriptTags = _(scriptUrls).map(this.getScriptTag, this)
    return scriptTags.join("\n") + "\n"
  }

  ScriptPipe.prototype.url = function(from) {
    this.urlRoute = new Route("GET", path.resolve(from))
    return this
  }

  ScriptPipe.prototype.file = function(to) {
    this.fileRoute = new Route("GET", to)
    return this
  }

  ScriptPipe.prototype.process = function(callback) {
    this.pipeline = this.pipeline || []
    this.pipeline.push(callback)
    return this
  }
 
  return AssetPipe
}
