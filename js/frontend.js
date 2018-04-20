SVIFT.frontend = (function (_container_1, _container_2) {

  var module = {},
      container_1 = _container_1, //d3.select('#gui-1-overlay')
      container_2 = _container_2, //d3.select('#gui-2')
      cb = cb_extend(chatbot(container_2));

  module.heroku = 'https://svift-dev-backend.herokuapp.com';

  module.vis = null;

  module.visTypeData = null;

  module.table = null;

  module.renderProcess = {
    token : "",
    rowOne:null,
    rowTwo:null,
    status : {},
    visible : false,
    rendered : {
      "gif": false,
      "html": false,
      "png": false,
      "social": false,
      "svg": false
    }
  };

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
          "font": "Patua One", //"Open Sans",Patua One,Hind
          "fontLables": "Open Sans",
          "color": {
              "main": "#71609B",
              "second": "#9A9A9A",
              "background": "#fff",
              "dataColors": ["#434343", "#FF5858", "#99C3F3", "#FFF680", "#EF96FF", "#B9FF6C"]
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
          "title": "Look at this title",
          "subTitle": "and what about a subtitle here?",
          "attribution": "made with svift.xyz",
          "source": "Source: Your source"
      }
  };

  module.defaultFormat = [500, 500, 0.7];

  module.init = function(){
    //Make sure heroku is ready to receive data
    d3.request(module.heroku + '/hello').get(function () { console.log('server is awake'); });

    //Resize the height of the vis container according to the predefined proportions
    d3.select(window).on('resize.two', function () {

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
            cb.addBubble({ type: 'text', value: 'Want to visualize some data for your project?', class: 'bot', delay: 500 }, function () {
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
    })
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
  };

  module.selectThumb = function(d){
    cb.addBubble({ type: 'text', value: 'I want to make a ' + d + ' chart ', class: 'human', emoji: 'smile' }, function () {
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

  module.inputDone = function(){
    cb.addBubble({ type: 'text', value: 'Ok, last step: Choose your design! ', class: 'bot', emoji: 'style', delay: 500 }, function () {

      cb.addBubble({ type: 'styles', class: 'human', function(d){
          module.default.style.color.main = d.color;
          module.default.style.font = d.font;
          module.redrawDebounce();
      }});

      setTimeout(function () {
          cb.addBubble({ type: 'select', value: [{ label: 'I am done!' }], class: 'human send' }, module.themeDone);
      }, 500);

    });
  };

  module.themeDone = function(){
    //start rendering process
    module.render();

    cb.addBubble({ type: 'text', value: 'Look! You can even preview your chart in different sizes', class: 'bot', delay: 1500 }, function () {

      cb.addBubble({ type: 'resize', class: 'human', function(type){
          module.defaultFormat = type;
          module.redraw();
      }});

      setTimeout(function () {

        cb.addBubble({ type: 'select', value: [{ label: 'Continue' }], class: 'human' }, function () {

          cb.addBubble({ type: 'text', value: '<span>Please wait while I build your chart</span><div class="loader"></div>', class: 'bot' });
          cb.addBubble({ type: 'status', class: 'human', function(rowOne, rowTwo){
            module.renderProcess.rowOne = rowOne;
            module.renderProcess.rowOne = rowTwo;
          }});

          module.renderProcess.visible = true;
          module.renderStatusUpdate();

        });
      }, 500);
    });
  };

  module.render = function() {
    d3.request(module.heroku + '/render')
      .header("Content-Type", "application/json")
      .mimeType("application/json")
      .post(
        JSON.stringify(module.default),
        function (err, rawData) {
          inter = setInterval(function () {
            d3.request(module.heroku + '/status/' + rawData.response).get(function (err, data) {

              var jResponse = JSON.parse(data.response);
              var statusCounter = 0;
              module.renderProcess = rawData.response;

              var finished = false;

              for (var type in jResponse.full) {
                if (jResponse.full[type] == 1) {
                  statusCounter++;
                  module.renderProcess.rendered[type] = true;
                }
              }

              //All things have been rendered stop request
              if (jResponse.full.aws == 1) { //jResponse.status == 2
                clearInterval(inter);
                finished = true;
              }

              module.renderStatusUpdate(finished);

            });
          }, 1000);
        }
      );
  };

  module.renderStatusUpdate = function(finished){
    if (module.renderProcess.visible) {
      var status = module.renderProcess.rendered;
      for (var type in status) {
        if (status[type]) {
          if (type == 'social') {
            module.renderProcess.rowOne.selectAll('span')
              .transition()
              .delay(function (d, i) { return i * 400 })
              .attr('class', 'complete');
          } else {
            d3.select('#status-' + type).attr('class', 'complete');
          }
        }
      }

      if (finished) {
        setTimeout(function () {
          module.renderComplete();
        }, 1500);
      }

    }
  };

  module.renderComplete = function(){
    cb.addBubble({ type: 'text', value: '<span>Your charts are now ready! Download them here:<br><a class="bubble-link" target="_blank" style="text-decoration: none; color:rgba(113, 96, 155, 1);"href="' + './download.html#' + module.renderProcess.token + '">www.svift.xyz/' + module.renderProcess.token + '</a></span>', class: 'bot' });
    
    setTimeout(function () {
      cb.addBubble({ type: 'text', value: 'Thanks for using svift! What would you like to do next?', class: 'bot', delay: 1000 });

      setTimeout(function () {
        cb.addBubble({ type: 'select', value: [{ label: 'Give feedback', feedback: true }, { label: 'Make another chart', feedback: false }], class: 'human' }, function (d) {

          if (d.feedback) {
            cb.addBubble({ type: 'feedback', class: 'human' });
            cb.addBubble({ type: 'select', value: [{ label: 'send feedback' }], class: 'human' }, function () {
              var feedbackText = d3.select("#feedback").node().value;

              //TODO: Feedback text needs to be send to the server
              console.log(feedbackText)
              cb.addBubble({ type: 'text', value: 'Thanks for your feedback!!', class: 'bot' });
              setTimeout(function () {
                cb.addBubble({ type: 'select', value: [{ label: 'Make another chart!' }], class: 'human' }, function () {
                  location.reload();
                });
              }, 500);
            });
          } else {
            location.reload();
          }
        });
      }, 1100);
    }, 1500);

    d3.select('.loader').style('display', 'none');
  };

  module.redrawDebounce = SVIFT.helper.debouncer(function () { module.redraw(); }, 500);

  module.updateVis = function(data){
    module.default = data;
    console.log('updateVis');
  };

  module.redraw = function () {

      d3.select('.viz-container svg').remove();

      d3.select(".viz-container")
          .style('height', module.defaultFormat[1] + "px")
          .style('width', module.defaultFormat[0] + "px")
          .style('opacity', 0)

      module.vis = SVIFT.vis[module.default.vis.type](module.default, d3.select('.viz-container'));
      module.vis.setScale(true);
      module.vis.init();
      module.vis.start();

      var height = (d3.select('#gui-1-overlay').node().getBoundingClientRect().width * module.defaultFormat[2]) / (module.defaultFormat[0] / module.defaultFormat[1]);

      d3.select(".viz-container")
          .style("width", (module.defaultFormat[2] * 100) + "%")
          .style("height", height + "px")
          .style('opacity', 1);
  };

  return module;
});