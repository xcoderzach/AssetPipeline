AssetPipeline
=============

  Smashes, Caches, Slices, & Dices your static assets.

  The asset pipeline is a simple middleware provider that serves static assets.
It has modules for file version caching, compiling things like coffeescript and
stylus or sass, minifying, obfuscating, and appending scripts and stylesheets,
slicing up the AST of javascript files, to remove sensitive code before it's
sent to the client, etc.  And also can send notifications to the client when a
file changes. Perhaps in order to dynamically reload stylesheets, scripts, or
html templates.

  The second part is a clientside component which creates a list of script/stylesheet
tags and watches for changes from the server.

  The asset pipeline is setup like a restful router, which takes in a route, which 
matches a url from a request, and a transformation to turn it into a file on the
server.  Then it takes in a list of functions as middleware.

Example
=======

```javascript
  //adds all the files in app
  AssetPipe.addFiles(__dirname + "/app/")

  AssetPipe.script({module: true, baseDir: __dirname})
    .url("/javascripts/:type/:modelName.js")
    .file(__dirname + ":type/:modelName.coffee")
    .process(CompileCoffee)
    .process(SliceSensitiveMethods)
    .process(Modularize)
    .process(Minify)

```
