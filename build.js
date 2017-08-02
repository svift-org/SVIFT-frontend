var UglifyJS = require('uglify-js2'),
  sass = require('node-sass'),
  fs = require('fs'),
  package = require('./package.json')

var base = [
  'index.js',
  './node_modules/svift-helper/index.js',
  './node_modules/svift-vis/index.js'
]

var template = fs.readFileSync('tests/template.html', 'utf8')

var visualisations = ['all']

for(var key in package.dependencies){
  if(key.substring(0,10) == 'svift-vis-'){
    visualisations.push(key)
  }
}

'./node_modules/'+key+'/index.js'

function buildFile(vi){
  var files = [], style = '',
    name = ''
  base.forEach(function(b){
    if(b.indexOf('svift-vis')>=0){
      style += fs.readFileSync(__dirname + '/node_modules/svift-vis/style.scss', 'utf8')
    }
    files.push(b)
  })

  if(visualisations[vi] == 'all'){
    visualisations.forEach(function(v){
      if(v!='all'){
        files.push(__dirname + '/node_modules/'+v+'/index.js')
        style += fs.readFileSync(__dirname + '/node_modules/'+v+'/style.scss', 'utf8')
      }
    })
  }else{
    files.push(__dirname + '/node_modules/'+visualisations[vi]+'/index.js')
    style += fs.readFileSync('./node_modules/'+visualisations[vi] +'/style.scss', 'utf8')
    name = '-' + visualisations[vi].substring(10)
  }

  var min = UglifyJS.minify(files, {
    outSourceMap: './build/svift' + name + '.min.js.map',
    sourceRoot: "http://svift.xyz/src"
  })

  fs.writeFileSync(__dirname + "/build/svift" + name + ".min.js", min.code, 'utf8');

  fs.writeFileSync(__dirname + "/build/svift" + name + ".css", sass.renderSync({
      data:style,
      outputStyle: 'compressed' 
    }).css,
    'utf8'
  )

  if(visualisations[vi]!='all'){
    fs.writeFileSync(__dirname + '/tests/'+name.substring(1)+'.html', template.split('{{visname}}').join(name), 'utf8')
  }

  vi++
  if(vi<visualisations.length){
    buildFile(vi)
  }else{
    console.log('build done')
    process.exit()
  }
}

buildFile(0)