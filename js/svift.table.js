//Data input table
//Handles states for the data input table
//Data obj contains the default init data
SVIFT.table = (function (_config, updateCallback) {

  var module = {};

    module.config = _config;
    module.data = _config.data;
    module.maxCol = 15;
    module.minCol = 2;
    module.column = {};
    module.table = null;
    module.container = null;
    module.rows = null;

    module.init = function (_container) {

        module.container = _container;

        var tableData = module.parse(module.data);

        var tableWrapper = module.container.append('div').attr("class", "table-wrapper");

        module.table = tableWrapper.append('table').append('tbody');

        module.rows = module.table.selectAll('tr')
            .data(tableData).enter()
            .append('tr')
            .attr("data-row-index", function (d, i) { return i; })
            .style('display', function (d, i) {
                if (i == 0 && (module.config.data.format === "one-val")) {
                    return 'none';
                }
            });

        var colorCounter = 0;

        module.rows
            .selectAll('td')
            .data(function (d) { return d }).enter()
            .append('td')
            .style('display', function (d, i) {
                if (i == 0 && (module.data.format === "single-set" || module.data.format === "one-val")) {
                    return 'none'
                }
            })
            .append('input')
            .style('border-left', function (d, i) {
                if (i == 0 && module.data.format === "multi-set") {
                    colorCounter++
                    if (colorCounter !== 1) {
                        return '3px solid ' + module.data.colors[colorCounter - 2];
                    } else { 
                        return null;
                    }
                }
            })
            .classed('number', function (d, i) {
                if (module.data.format === "one-val") { return true }
                else { false }
            })
            .attr("data-td-index", function (d, i) { return i })
            .attr('placeholder', function (d) { return d })
            .on('input', function () { module.valuesUpdate(this) });


        //add remove data buttons
        if (module.data.format !== "one-val") {

            var editColButtons = tableWrapper.append('div')
                .classed('column-editor-wrapper', true);

            var removeButton = editColButtons.append('div')
                .classed('column-editor-btn', true)
                .classed('btn-remove', true)
                .text('–')
                .classed('disabled-btn', true)
                .on('click', function (d) {
                    module.columnRemove()
                });

            var addButton = editColButtons.append('div')
                .classed('column-editor-btn', true)
                .classed('btn-add', true)
                .text('+')
                .on('click', function (d) {
                    module.columnAdd();
                });

        }
    };

    module.columnAdd = function () {

        if (module.data.data.length >= module.minCol) {
            d3.select(".column-editor-btn.btn-remove").classed('disabled-btn', false);
        }

        if (module.data.data.length === module.maxCol) {
            return
        }

        module.data.data.push({
            label : (("ABCDEFGHIJKLMNOPQRSTUVWXYZ").split(""))[module.data.data.length],
            data : JSON.parse(JSON.stringify(module.data.data[module.data.data.length - 1].data))
        });

        module.table.selectAll('tr')
            .data(module.parse(module.data))
            .selectAll('td')
            .data(function (d) { return d }).enter()
            .append('td')
            .append('input')
            .attr("data-td-index", function (d, i) { return i })
            .attr('placeholder', function (d) { return d })
            .on('input', function () { module.valuesUpdate(this) });

        updateCallback(module.data);

        if (module.data.data.length === module.maxCol) {
            d3.select(".column-editor-btn.btn-add").classed('disabled-btn', true);
        }
    }

    module.parse = function(data){
        var tableData = [],
        //Add column headers for first row
            headerRow = [""];

        for (var i = 0; i < data.data.length; i++) {
            headerRow.push(data.data[i].label)
        }
        tableData.push(headerRow);

        //Add row data with label
        for (var i = 0; i < data.data[0].data.length; i++) {

            // var label = data.labels[i] || "none";
            var label;
            if (data.labels == undefined) {
                label = "none"
            }
            else {
                label = data.labels[i] || "none";
            }

            var rowData = [label];

            for (var ii = 0; ii < data.data.length; ii++) {
                rowData.push(data.data[ii].data[i]);
            }

            tableData.push(rowData)

        }

        return tableData;
    };

    module.columnRemove = function () {

        var amountButtons = module.data.data.length;

        if (amountButtons === module.minCol) {
            return
        }

        if (amountButtons === 3) {
            d3.select(".column-editor-btn.btn-remove").classed('disabled-btn', true)
        }

        if (amountButtons <= module.maxCol) {
            d3.select(".column-editor-btn.btn-add").classed('disabled-btn', false)
        }

        module.data.data.pop();

        module.rows.data(module.parse(module.data)).enter()
            .selectAll('td')
            .data(function (d) { return d }).exit().remove();

        updateCallback(module.data);

    };

    module.validate = function (data, obj) {

        if (isNaN(data)) {
            d3.select(obj).classed('bad-input-data', true)
            return false
        } else {
            d3.select(obj).classed('bad-input-data', false)
            return true;
        }

    };

    module.valuesUpdate = function (obj) {

        //remove placeholder
        d3.select(obj).attr('placeholder', null);

        //get index;
        var rowIndex = d3.select(obj.parentNode.parentNode).attr("data-row-index");
        var tdIndex = d3.select(obj).attr("data-td-index");

        //get value
        var inputValue = d3.select(obj).node().value;

        //if header is changed (A,B,C)
        if (rowIndex == 0) {
            console.log("header change")
            module.data.data[tdIndex - 1].label = inputValue || '';
        }
        else {
            //If Label is changed (line 1, 2)
            if (tdIndex == 0) {
                console.log("label change")
                module.data.labels[rowIndex - 1] = inputValue || '';
            }
            //if data is changed
            else {
                //put this in a function
                inputValue = inputValue.replace(",", ".");
                inputValue = Number(inputValue);
                if (inputValue > 100 && module.config.vis.type == "mosaic") {
                    inputValue = Number(inputValue.toString().slice(0, 2));
                    xx = d3.select(obj);
                    d3.select(obj).property("value", inputValue);
                    return
                }

                var validData = module.validate(inputValue, obj);

                if (validData) {
                    module.data.data[tdIndex - 1].data[rowIndex - 1] = inputValue;
                } else {
                    return
                }

                console.log("data change")
            }
        }

        updateCallback(module.data);
    };


    module.textUpdate = function (selectorViz, selectorInput, selectorData, altText) {

        var inputText = d3.select(selectorInput).node().value;
        module.data[selectorData] = inputText || altText;
        if (selectorData == "source" && inputText) { 
            module.data[selectorData] = "Source: " + inputText;
        }
        d3.select(selectorViz).text(module.data[selectorData]);

    };

    module.textToggle = function (obj, selectorViz, selectorInput, selectorData, altText) {

        var hidden = d3.select(obj.parentNode).classed("hidden");

        if (!hidden) {
            d3.select(obj.parentNode).classed("hidden", true);
            d3.select(obj.parentNode).select('input').attr('disabled', true);

            var inputText = "";
            module.data[selectorData] = inputText;
            if (selectorData == "source" && inputText) { 
                module.data[selectorData] = "Source: " + inputText;
            }
            d3.select(selectorViz).text(module.data[selectorData]);
        }
        else {
            d3.select(obj.parentNode).select('input').attr('disabled', null);

            d3.select(obj.parentNode).classed("hidden", false);

            var inputText = d3.select(selectorInput).node().value;
            module.data[selectorData] = inputText || altText;
            if (selectorData == "source" && inputText) {
                 module.data[selectorData] = "Source: " + inputText;
            }
            d3.select(selectorViz).text(module.data[selectorData]);
        }

    };

    return module;
});