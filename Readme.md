
```
//data contains an array of available visualisation types:

//the thumbnails are available under:
for(var key in data){
  var src = './build/thumbs/'+key+'_thumb.png';
  var src2 = './build/thumbs/'+key+'_thumb@2x.png';
}


//in order to load more config info on the selected vis load:

d3.json('./build/'+key+'.json', function(err, data){
  //This json contains title and input method, in the future we can pack more meta data into this json, which will help us automatically generate the chatbot steps, right now only the data.input is relevant (we should come up with a set of rules)
});

//as we are using svift.min.js, which contains all available visualisations, we don't need to load individual vis types
//in order to initiate one visualisation:
for(var key in data){
  var vis = SVIFT.vis[(key.split('-'))[2]](DATA_FOR_VIS, d3.select('#VIS_CONTAINER'));
    vis.init();
    vis.start(); 
}

//After all elements are being entered, the resulting vis can be send to the backend via
//The structure of output is collected from the vis modules

var output = {
  "params":{
    "dev":true
  },
  "vis":{
    "type":"barchart",
    "title":"Barchart"
  },
  "data":{
    "columns":["Jahr","Wert"],
    "types":["date","int"],
    "data":[
      [2017,3.9],
      [2016,4.1],
      [2015,4.6],
      [2014,5.0],
      [2013,5.2],
      [2012,5.5],
      [2011,5.9],
      [2010,7.1],
      [2009,7.8]
    ]
  }
};

//The request will return an ID

d3.xhr(URL OF SERVER)
  .header("Content-Type", "application/json")
  .post(
      JSON.stringify(output),
      function(err, rawData){
          var data = JSON.parse(rawData);
          console.log("got response", data);
      }
  );

//This ID can then be used to poll the backend every 200 - milliseconds, in order to get the status of the rendering (right now this only returns an output when everything is done, this will be my (SEB) TODO for the weekend to send detailed progress information, but it will be something like this:

//for each type the result is 0-1 (1 = done)

var feedback = {
  svg:0.5,
  png:1,
  html:1,
  ...
};

//The ID is also equivalent to the permanent (7 day) url: svift.xyz/?/ID/ (index.html) > the index.html is actually not yet there, but i (SEB) will also take care of this...
´´´