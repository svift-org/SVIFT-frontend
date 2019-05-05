SVIFT.frontend = (function (_container_1, _container_2) {

  //Run a test to check if the GIF-Render requirements are met

  var supports_webWorker = !!window.Worker;
  var supports_fileAPI = (window.File && window.FileReader && window.FileList && window.Blob);
  var supports_typedArray = ( 'Uint8ClampedArray' in window && 'ArrayBuffer' in window );

  if(!supports_webWorker || !supports_fileAPI || !supports_typedArray){
    alert('It looks like you are using an old Browser. Please install a recent version, ideally, Firefox or Chrome.');
  }

  //tell IE users to switch browser
  //https://blog.julitec.com/dev/pr%C3%BCfen-ob-internet-explorer-verwendet-wird-inklusive-ie-11
  function getInternetExplorerVersion(){
      var rV = -1; // Return value assumes failure.

      if (navigator.appName == 'Microsoft Internet Explorer' || navigator.appName == 'Netscape') {
          var uA = navigator.userAgent;
          var rE = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");

          if (rE.exec(uA) != null) {
              rV = parseFloat(RegExp.$1);
          }
          /*check for IE 11*/
          else if (!!navigator.userAgent.match(/Trident.*rv\:11\./)) {
              rV = 11;
          }
      }
      return rV;
  }

  if(getInternetExplorerVersion() != -1){
    alert('Internet Explorer is not fully supported. Please use Firefox or Chrome.');
  }

  //ios browser fix
  d3.select('.app').style('height', window.innerHeight + 'px');
  window.scrollTo(0,1);


  // Firebase quick&dirty setup - START //
  // var firebaseConfig = {
  //   apiKey: "AIzaSyDfZNHj2kNlkoD0qr5VQRs04p4zDTA6-2E",
  //   authDomain: "svift-feedback-dev-654a9.firebaseapp.com",
  //   databaseURL: "https://svift-feedback-dev-654a9.firebaseio.com",
  //   projectId: "svift-feedback-dev-654a9",
  //   storageBucket: "",
  //   messagingSenderId: "39435822198"
  // };
  // firebase.initializeApp(firebaseConfig);
  // var feedbackRoute = firebase.database().ref('feedback/');
  // var date = moment().format();
  // Firebase quick&dirty setup - END //

  var module = {},
      container_1 = _container_1, //d3.select('#gui-1-overlay')
      container_2 = _container_2, //d3.select('#gui-2')
      cb = cb_extend(chatbot(container_2));

  // module.heroku = 'https://svift-dev-backend.herokuapp.com';
  // module.setHeroku = function(url){
  //   module.heroku = url;
  // };

  module.vis = null;

  module.custom = false;

  module.visTypeData = null;

  module.table = null;

  module.disabled = false;

  //Default visualisation configuration
  module.default = {
      "params": {
          "dev": true
      },
      "vis": {
          "type": "",
          "title": ""
      },
      "length": 3000,
      "style": {
          "theme": "Modern",
          "font": "IBM Plex Sans Condensed", //"Open Sans",Patua One,Hind
          "fontLables": "Open Sans",
          "color": {
              "main": "purple",
              "second": "#9A9A9A",
              "background": "#fff",
              "dataColors": ["#434343", "#FF5858", "#99C3F3", "#FFB81E", "#EF96FF", "#B9FF6C"]
          }
      },
      "data": {
          "columns": ["Wert"],
          "types": ["int"],
          "data":
              [
                  { "label": "A", "data": [25] },
                  { "label": "B", "data": [20] }
              ]
          ,
          "lables": [null],
          "showNumberLabels": true,
          "title": "Look at this title",
          "subTitle": "and what about a subtitle here?",
          "attribution": "Made with svift.xyz",
          "source": "Your source"
      },
      "custom":false
  };

  module.defaultFormat = [500, 500, 0.7];

  module.customize = function(c){
    module.custom = c;
    module.default["custom"] = c;
    module.default.style.theme = c.id;
    module.default.style.color.main = c.id+'-color';
    d3.select('head').append('link')
      .attr('rel','stylesheet')
      .attr('href',c.css);
  };

  module.init = function(){
    //Make sure heroku is ready to receive data
    //d3.request(module.heroku + '/hello').get(function () { console.log('server is awake'); });

    //Resize the height of the vis container according to the predefined proportions
    d3.select(window).on('resize.two', function () {

      d3.select('.app').style('height', window.innerHeight+'px');
      window.scrollTo(0,1);

      var height = (container_1.node().getBoundingClientRect().width * module.defaultFormat[2]) / (module.defaultFormat[0] / module.defaultFormat[1]);

      d3.select(".viz-container")
        .style("height", height + "px");

    });

    //Load data for the thumbnail selector
    d3.json('./build/config.json', function (err, data) {
        if (err) { console.log(err); }

        module.visTypeData = data;

        //Activate the chatbot
        cb.showInput();

        /*Start Chatbot*/

        cb.addBubble({ type: 'text', value: 'Hi there, welcome to SVIFT!', class: 'bot', emoji: 'wave', delay: 1000 }, function () {
            cb.addBubble({ type: 'text', value: 'Want to visualize some data?', class: 'bot', delay: 500 }, function () {
                setTimeout(function () {
                    cb.addBubble({ type: 'select', value: [{ label: 'Sounds great! Let’s go!' }], class: 'human' }, function(d){

                      cb.addBubble({ type: 'text', value: 'Ok then, choose your chart type on the left side!', class: 'bot', emoji: 'handleft', delay: 500 });
                        
                      setTimeout(function () {
                          module.createThumbs(module.visTypeData);
                      }, 500);

                      d3.select('.inner').transition().delay(1000).style('display', 'none');
                      d3.select('#gui-1').transition().delay(1000).style('background', '#75FABF');

                    });
                }, 100);
            });
        });

    });
  };

  module.loadVis = function(vistype){
    d3.json('./build/data/' + vistype + '.json', function (err, visData) {
        if (err) { console.log(err); }

        console.log(visData.data.format)

        //Modify the default object
        module.default.vis.type = vistype;
        module.default.data.format = visData.data.format;
        module.default.data.data = visData.data.data;
        module.default.data.lables = visData.data.lables;
        module.default.data.colors = visData.data.colors || null;

        container_1.html('')
            .append('div')
            .attr('class', 'viz-container');

        //TODO: properly initiate the visualization here 
        module.redraw();
    });
  };

  module.createThumbs = function(data){
    container_1.style('left', '0');

    var overlay = container_1
        .style('background-color', '#75FABF')
        .append('div')
        .attr('class', 'thumb-wrapper');

    var thumb = overlay.selectAll('.thumb')
        .data(d3.keys(data)).enter().append('div')
        .attr('class', 'thumb')
        .attr('id', function (d) { return 'thumb-' + d });

    //TODO: This doesn't look cross-browser compatible
    //TODO: Move style elements to css and work with classes

    thumb
        .append('img')
        .attr('src', function (d) {
            var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
        (min--moz-device-pixel-ratio: 1.5),\
        (-o-min-device-pixel-ratio: 3/2),\
        (min-resolution: 1.5dppx)";
            if (window.devicePixelRatio > 1 && window.matchMedia && window.matchMedia(mediaQuery).matches) {
                return './build/thumbs/' + d + '_thumb@2x.png'
            } else {
                return './build/thumbs/' + d + '_thumb.png'
            }
        })
        .on('click', module.selectThumb)
        .style('opacity', 0)
        .transition()
        .delay(function (d, i) { return i * 300 })
        .style('opacity', 1);

    thumb.append('div')
        .attr('class', "thumb-eyebrow")
        .style('opacity', 0)
        .transition()
        .delay(function (d, i) { return i * 300 })
        .style('opacity', 1)
        .text(function (d) { return d });

    overlay.append('div')
      .attr('id', 'soon-more-vis')
      .append('span')
        .html("🛠&nbsp;Soon more visualisations...");
  };

  module.selectThumb = function(d){
    cb.addBubble({ type: 'text', value: 'I want to make a ' + d + ' chart ', class: 'human'}, function () {
      cb.addBubble({ type: 'text', value: "Good choice! Let's enter your data ", class: 'bot', emoji: 'write', delay: 500 }, function () {
        module.loadVis(d);

        setTimeout(function () {

            module.table = SVIFT.table(module.default, module.updateVis);

            cb.addBubble({ type: 'input', class: 'human', table: module.table });
            cb.addBubble({ type: 'select', value: [{ label: 'I am done entering my data!' }], class: 'human' }, module.inputDone);

        }, 500);
      });
    });
  };

  module.highlightStyle = function(){
    d3.selectAll('.cb-styles-btn').classed('active',false);
    d3.select('.cb-styles-color-' + module.default.style.color.main).classed('active', true);
    d3.select('.cb-styles-font-' + module.default.style.theme).classed('active', true);
  };

  module.inputDone = function(){
    cb.addBubble({ type: 'text', value: 'Ok, last step: Choose your design! ', class: 'bot', delay: 500 }, function () {

      var styleBubble = { type: 'styles', class: 'human'};

      if(module.custom){
        styleBubble['custom'] = module.custom;
      }

      cb.addBubble(styleBubble, function(d){

        if(!module.disabled){

          if(typeof d.color != "undefined"){
            module.default.style.color.main = d.label;
            module.vis.setColor(d.label);
          }else{
            module.default.style.theme = d.id;
            module.vis.setTheme(d.id);
          }
          //module.redrawDebounce();

          module.highlightStyle();
        }

      });

      module.highlightStyle();

      setTimeout(function () {
          cb.addBubble({ type: 'select', value: [{ label: 'I am done!' }], class: 'human send' }, module.render);
      }, 500);

    });

  };

  module.render = function(){

    //start rendering process
    cb.addBubble({ type: 'text', value: 'Nice! Just give me a second', class: 'bot', emoji: 'smile' });

    setTimeout(function () {

      //disable any changes to the input system
      //TODO: Allow changes after render-start > remove render bubbles and restart render process
      module.disabled = true;
      d3.selectAll('.icon-toggle, .column-editor-btn').style('opacity', 0.5).style('pointer-events','none');
      d3.selectAll('.cb-bubble-input input, .cb-bubble-input textarea').attr('disabled',"disabled");

      SVIFT.render.init();
      SVIFT.render.setupVis(module.default);
      SVIFT.render.buildSet();
      SVIFT.render.getStatus();

      _paq.push(['trackEvent', 'Render', 'Color', module.default.style.color.main]);
      _paq.push(['trackEvent', 'Render', 'Visualisation', module.default.vis.type]);
      _paq.push(['trackEvent', 'Render', 'Typography', module.default.style.theme]);

      cb.addBubble({ type: 'text', class: 'bot', value: 'I\'m rendering your GIF now. Status:&nbsp;<b style="color:rgba(113, 96, 155, 1)">0%</b>'}, function(bubble){

        var interval = setInterval(function () {

          var renderStatus = SVIFT.render.getStatus();

          //changes progress bar here
          bubble.select('b').html(Math.round(renderStatus.full.gif*100) + '%');

          if (renderStatus.status == 1) { 

            clearInterval(interval);
            cb.addBubble({ type: 'text', value: 'Your GIF is done!', class: 'bot', delay: 500 }, module.download);

          }

        }, 1000);

      });

    }, 1500);

  };

  module.download = function(){

    cb.addBubble({ type: 'download-gif', class: 'human', delay: 1000 }, function(){

      cb.addBubble({ type: 'text', value: 'and some pics for social media', class: 'bot', delay: 3000}, function(){

        cb.addBubble({ type: 'download-social', class: 'human', delay: 1000 }, function(){

          cb.addBubble({ type: 'text', value: 'we also have a raw svg, if you want to further refine your chart', class: 'bot', delay: 3000}, function(){

            cb.addBubble({ type: 'download-svg', class: 'human', delay: 1000 }, function(){

              setTimeout(function () {
                  module.end()
              },2000);

            })

          })
        })

      })

    })

  };


  module.end = function(){

    setTimeout(function () {
      cb.addBubble({ type: 'text', value: 'Thanks for using svift! What would you like to do next?', class: 'bot', delay: 1000 });

      setTimeout(function () {
        cb.addBubble({ type: 'select', value: [{ label: 'Give feedback', feedback: true}, { label: 'Make another chart', feedback: false }], class: 'human' }, function (d) {

          if (d.feedback) {
            window.location.href = "mailto:hello@svift.xyz";
          } else {
            location.reload();
          }
        });
      }, 1100);
    }, 1500);

  };



  module.redrawDebounce = SVIFT.helper.debouncer(function () { module.redraw(); }, 500);

  module.updateVis = function(data, type){


    if(!module.disabled){
      module.default.data = data;

      if(type == 'vis'){
        module.redrawDebounce();
      //   module.vis.update();
      //   module.vis.resize();
      }else{
        console.log(data);
        module.vis.setData(data);
        module.vis.updateHead();
      }
    }

    //console.log('updateVis');
    //TODO IMPLEMENT FUNCTION > only update chart | idea: update date, refresh last frame (see: social media rendering)
    //module.redraw();
  };

  module.redraw = function () {

      d3.select('.viz-container svg').remove();

      d3.select(".viz-container")
          .style('height', module.defaultFormat[1] + "px")
          .style('width', module.defaultFormat[0] + "px")
          .style('opacity', 0);

      module.vis = SVIFT.vis[module.default.vis.type](module.default, d3.select('.viz-container'));
      module.vis.setScale(false);
      module.vis.init();
      module.vis.start();
      module.vis.setScale(true);

      var height = (d3.select('#gui-1-overlay').node().getBoundingClientRect().width * module.defaultFormat[2]) / (module.defaultFormat[0] / module.defaultFormat[1]);

      d3.select(".viz-container")
          .style("width", (module.defaultFormat[2] * 100) + "%")
          .style("height", height + "px")
          .style('opacity', 1);
  };

  return module;
});

