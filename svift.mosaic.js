SVIFT.vis.mosaic = (function (data, container) {
   // Module object
  var module = SVIFT.vis.base(data, container);
 
  module.d3config = {
    ease:d3.easeCubicInOut, 
    interpolate: d3.interpolate(0,data.data.data[0]),
  };

  //Grid Function taken from https://bl.ocks.org/cagrimmett/07f8c8daea00946b9e704e3efcbd5739/bd1f4c0c33d8af6f64535b7963b0da2e6499fc31
  module.gridSetupData = function(size) {

    var squareBorder = size * 0.1;
    size = size - squareBorder;

    var data = new Array();
    var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
    var ypos = 1;

    // iterate for rows 
    for (var row = 0; row < 10; row++) {
        data.push( new Array() );

        // iterate for cells/columns inside rows
        for (var column = 0; column < 10; column++) {
            data[row].push({
                x: xpos,
                y: ypos,
                width: size,
                height: size
            })
            // increment the x position. I.e. move it over by 50 (width variable)
            xpos += size + squareBorder;
        }
        // reset the x position after a row is complete
        xpos = 1;
        // increment the y position for the next row. Move it down 50 (height variable)
        ypos += size + squareBorder; 
    }
    return data;
  }

  module.setup = function () {

  	//CODE FOR MULTI ANIMATIONS
    // var returnAnimation = function(index){  
    //   return function(t) { 
    //     var rects = d3.selectAll("rect")
    //         .filter(function(d, i) { return i <= (index); })
    //         .style("fill", "#71609B")
    //         // .style("fill", module.d3config.colorscale(t).hex())
    //         // .attr("opacity",opacityInterpolation)

    //     module.d3config.valueTextBottom
    //       .text(index + "%")
    //   };
    // };

    // for (var i = 0; i < data.data.data[0]; i++) {
    //   module["animate"+i] = returnAnimation(i)
    // }

    // //Add animations
    // var timeSteps = 3000/data.data.data[0];
    // var time = 0;
    // for (var i = 0; i < data.data.data[0]; i++) {
    //   module.timeline['animation'+i] = {start:time, end:(time+timeSteps), func:module["animate"+i]};
    //   time = time+timeSteps;
    // }


    module.g
      .attr("font-family", "sans-serif")

    //Tile(s)
    module.d3config.titleWrapper = module.g.append("g")
      .attr("text-anchor", "middle")
      .attr("font-family", "sans-serif")

    module.d3config.titleMain = module.d3config.titleWrapper.append("text")
      .text(data.data.title)
      .attr("fill", "#71609B")
      .attr("dominant-baseline","hanging")

    module.d3config.titleSub = module.d3config.titleWrapper.append("text")
      .text(data.data.subTitle)
      .attr("fill", "#D8D8D8")
      .attr("dominant-baseline","hanging")


    //Grid
    var dummyData = module.gridSetupData(10);

    module.d3config.rowContainer =  module.g.append('g').attr("id","rowContainer");

    module.d3config.row = module.d3config.rowContainer
      .selectAll(".row")
      .data(dummyData) //Add some dummy data to create all the rect
      .enter().append("g")
      .attr("class", "row");

    module.d3config.column = module.d3config.row.selectAll(".square")
      .data(function(d) { return d; })
      .enter().append("rect")
      .attr("class","square")
      .style("fill", "#D8D8D8")
      .style("stroke", "#fff")


    //Number Text
    module.d3config.valueTextBottom = module.g.append("text")
      .text(data.data.data[0] + "%")
      .attr("font-family", "sans-serif")
      .attr("fill", "#71609B")
      .attr("text-anchor", "middle")

  };


  module.resize = function () {

    var windowWidth = module.container.node().offsetWidth - module.config.margin.left - module.config.margin.right;
    var windowHeight = module.container.node().offsetHeight - module.config.margin.top - module.config.margin.bottom;

    //Set up all the text sizes
    module.d3config.titleMain
      .attr("x", windowWidth / 2)
      .attr("font-size", "2em")

    module.d3config.titleSub
      .attr("x", windowWidth / 2)
      .attr("y", module.d3config.titleMain.node().getBBox().height)
      .attr("font-size", "1em");

    module.d3config.valueTextBottom
      .attr("x", windowWidth / 2)
      .attr("font-size", "2em")


    //set up  grid
    var titleWrapperHeight = module.d3config.titleWrapper.node().getBBox().height + module.d3config.valueTextBottom.node().getBBox().height;
    var maxSize = Math.min(windowWidth,(windowHeight-titleWrapperHeight));
    var cellSize = maxSize / 10;
    var cellData = module.gridSetupData(cellSize);

    module.d3config.row
      .data(cellData)
      .enter();

    module.d3config.column
      .data(function(d) { return d; })
      .enter()

    module.d3config.column
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })
      .attr("width", function(d) { return d.width; })
      .attr("height", function(d) { return d.height; })

    module.d3config.rowContainer
      .attr("transform","translate(" +((windowWidth - maxSize)/2)+ ","+module.d3config.titleWrapper.node().getBBox().height+")")

    // y Position for "value text" at the end 
    var gridSize = module.d3config.rowContainer.node().getBBox().height;
    module.d3config.valueTextBottom
      .attr("y", (titleWrapperHeight + gridSize));

  };

  module.drawBars = function(t){

    var interpolation = Math.round(module.d3config.interpolate(module.d3config.ease(t)));

    var rects = d3.selectAll("rect")
        .filter(function(d, i) { return i == (interpolation - 1); })
        .style("fill", "#71609B")

    module.d3config.valueTextBottom
      .text(interpolation + "%")

  };

  module.timeline = {
    bars: {start:0, end:3000, func:module.drawBars}
  };

  return module;
 });

