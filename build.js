var UglifyJS = require('uglify-js2'),
  sass = require('node-sass'),
  fs = require('fs'),
  fse = require('fs-extra'),
  package = require('./package.json');

const googleFontImport = require('google-font-import');

const { spawnSync} = require('child_process');

var base = [
  'index.js',
  './node_modules/svift-helper/index.js',
  './node_modules/svift-render/index.js',
  './node_modules/svift-vis/index.js'
]

var template = fs.readFileSync('tests/template.html', 'utf8')

var visualisations = ['all'], types = []

for(var key in package.dependencies){
  if(key.substring(0,10) == 'svift-vis-'){
    visualisations.push(key)
    types.push(key)
  }
}

fs.writeFileSync(__dirname+'/build/vis_types.json', JSON.stringify(types), 'utf8')

var configJson = {}

function buildFile(vi){
  var files = [], 
    style = '',
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
        //TODO: add sorting attribute (e.g. comparison, single number, etc.)
        var pack = JSON.parse(fs.readFileSync(__dirname + '/node_modules/'+v+'/package.json'))
        fse.copySync(__dirname + '/node_modules/'+v+'/data.json', __dirname+'/build/data/'+pack.definition.name+'.json')
        configJson[pack.definition.name] = {title:pack.definition.title}
        fs.writeFileSync(__dirname+'/build/'+pack.definition.name+'.json', JSON.stringify(pack.definition),'utf8')
        files.push(__dirname + '/node_modules/'+v+'/index.js');
        style += fs.readFileSync(__dirname + '/node_modules/'+v+'/style.scss', 'utf8');
        (['thumb.png','thumb@2x.png']).forEach(function(thumb){
          var tp = __dirname + '/node_modules/'+v+'/'+thumb;
          if (fs.existsSync(tp)) {
            fse.copySync(tp, __dirname+'/build/thumbs/'+pack.definition.name+'_'+thumb);
          }else{
            fse.copySync(__dirname+'/assets/'+thumb, __dirname+'/build/thumbs/'+pack.definition.name+'_'+thumb);
          }
        });
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

  fs.writeFileSync(__dirname + "/build/svift" + name + ".min.js", min.code, 'utf8')

  fs.writeFileSync(__dirname + "/build/svift" + name + ".css", sass.renderSync({
      data:style,
      outputStyle: 'compressed' 
    }).css,
    'utf8'
  )

  if(visualisations[vi]!='all'){
    fs.writeFileSync(__dirname + '/tests/'+name.substring(1)+'.html', template.split('{{visname}}').join(name.substring(1)), 'utf8')
  }

  vi++
  if(vi<visualisations.length){
    buildFile(vi)
  }else{
    fs.writeFileSync(__dirname + '/build/config.json', JSON.stringify(configJson), 'utf8')

    console.log('build done')
  }
}

buildFile(0)

fs.writeFileSync('./build/svgtodatauri.js', fs.readFileSync('./node_modules/svgtodatauri/index.js', 'utf8').replace('module.exports = ', ''), 'utf8');

var dependencyFiles = [
  './js/rgbcolor.js',
  './node_modules/stackblur-canvas/dist/stackblur.min.js',
  './node_modules/canvg/dist/browser/canvg.min.js',
  './build/svgtodatauri.js',
  './node_modules/gif.js/dist/gif.js',
];

var minDependencies = UglifyJS.minify(dependencyFiles, {
  outSourceMap: './build/dependencies.min.js.map',
  sourceRoot: "http://svift.xyz/src"
})

fs.writeFileSync(__dirname + "/build/dependencies.min.js", minDependencies.code, 'utf8')

fs.copyFile('./node_modules/gif.js/dist/gif.worker.js', './gif.worker.js', (err) => console.log(err));
fs.copyFile('./node_modules/svgtodatauri/base64.js', './build/base64.js', (err) => console.log(err));

var opts = {
  src: __dirname + '/styles/fonts/fonts.config',
  htmlpath: __dirname + '/styles/fonts/download',
  fontpath: __dirname + '/styles/fonts/download',
  stylepath: __dirname + '/styles/fonts/download'
};

googleFontImport(opts).then(function () {

  var files = fs.readdirSync(__dirname + '/styles/fonts/download');

  for(var i=0;i<files.length;i++){
    if(files[i].indexOf('css_family_')>=0){
      fs.writeFileSync('./styles/fonts/download/fonts.css', fs.readFileSync('./styles/fonts/download/'+files[i], 'utf8').replace('module.exports = ', ''), 'utf8');
    }
  }

  process.exit()
});