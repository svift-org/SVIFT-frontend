var UglifyJS = require('uglify-js2'),
  fs = require('fs'),
  package = require('./package.json')

var base = [
  'index.js',
  './node_modules/svift-helper/index.js',
  './node_modules/svift-vis/index.js'
]

var visualisations = ['all'], names = [null]

for(var key in package.dependencies){
  if(key.substring(0,10) == 'svift-vis-'){
    visualisations.push('./node_modules/'+key+'/index.js')
    names.push(key.substring(10))
  }
}

function buildFile(vi){
  var files = [],
    name = ''
  base.forEach(function(b){files.push(b)})

  if(visualisations[vi] == 'all'){
    visualisations.forEach(function(v){
      if(v!='all'){
        files.push(v)    
      }
    })
  }else{
    files.push(visualisations[vi])
    name = '-' + names[vi]
  }

  var min = UglifyJS.minify(files, {
    outSourceMap: './build/svift' + name + '.min.js.map',
    sourceRoot: "http://svift.xyz/src"
  })

  fs.writeFile("./build/svift" + name + ".min.js", min.code, function(err) {
    if(err) {
      console.log(err);
    } else {
      vi++
      if(vi<visualisations.length){
        buildFile(vi)
      }else{
        console.log('build done')
        process.exit()
      }
    }
  })
}

buildFile(0)