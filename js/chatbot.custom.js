var cb_extend = (function (cb) {
    /*Define bubble types*/

    /*Add a feedback textarea*/
    //TODO: The feedback textarea should be completed via the text input area at the bottom
    cb.types['feedback'] = function (bubble, options, callback) {
        var feedbackWrapper = bubble.append('div').classed('feedback', true);
        feedbackWrapper.append('textarea').attr('id', 'feedback')
            .attr('placeholder', 'Feedback')
    }

    /* Show bubbles which resize the viz*/
    cb.types['resize'] = function (bubble, options, callback) {

        var sizes = [
            { 'name': 'square', 'format': [500, 500, 0.7], 'pic': 'smile' },
            { 'name': 'landscape', 'format': [750, 500, 0.7], 'pic': 'smile' },
            { 'name': 'portrait', 'format': [500, 750, 0.4], 'pic': 'smile' },
        ];

        bubble.style('background-color', '#fff');
        bubble.selectAll('.cb-format')
            .data(sizes).enter().append('div')
            .attr('class', 'cb-format')
            .on('click', function (d) {
                callback(d.format);
            })
            .append('img')
                .attr('src', function (d) { 
                    return './assets/img/icons/format-icons/' + d.name + '.svg';
                });
    }

    /* A select bubble which returns a function*/
    cb.types['select'] = function (bubble, options, callback) {
        bubble.style('background-color', '#fff');
        bubble.selectAll('.cb-choice')
            .data(options.value).enter().append('div')
            .attr('class', 'cb-choice')
            .text(function (d) { return d.label; })
            .on('click', function (d) {

                //remove eventhandler from all bubbles when clicked
                bubble.selectAll('.cb-choice').on('click', null);
                d3.select(this).classed('cb-active', true);
                callback(d);

            });
    };

    /* Add input */
    /*

        Customised Options
        table:svift.table.js

    */
    cb.types['input'] = function (bubble, _options, callback) {

        bubble.style('background-color', '#fff'); //in css
        bubble.attr('class', 'cb-bubble-input');

        var options = _options;

        //title input
        var titleWrapper = bubble.append('div').classed('title', true);
        titleWrapper.append('textarea')
            .attr('id', 'title')
            .attr('placeholder', 'Add your title here')
            .attr('rows',2)
            .on('input', function () {
                options.table.textUpdate("#title-main", "#title", "title", "Look at this title");
            });

        var toggleTitle = titleWrapper.append('div')
            .classed('icon-toggle', true)
            .classed('hidden', false)
            .attr('id', 'titleToggle')
            .on('click', function (d) {
                options.table.textToggle(this, "#title-main", "#title", "title", "Look at this title");
            });

        //sub title input
        var subtitleWrapper = bubble.append('div').classed('subtitle', true);
        subtitleWrapper.append('textarea')
            .attr('id', 'subtitle')
            .attr('placeholder', 'Add your subtitle here')
            .attr('rows', 3)
            .on('input', function () {
                options.table.textUpdate("#title-sub", "#subtitle", "subTitle", "and what about a subtitle here?");
            });

        var toggleSubTitle = subtitleWrapper.append('div')
            .classed('icon-toggle', true)
            .attr('id', 'subtitleToggle')
            .on('click', function (d) {
                options.table.textToggle(this, "#title-sub", "#subtitle", "subTitle", "and what about a subtitle here?");
            });

        //source input
        var sourceWrapper = bubble.append('div').classed('source', true);
        sourceWrapper.append('input')
            .attr('id', 'source-input')
            .attr('placeholder', 'Add your source here')
            .on('input', function () {
                options.table.textUpdate("#source", "#source-input", "source", "Source: Your source");
            });

        var toogleSource = sourceWrapper.append('div')
            .classed('icon-toggle', true)
            .attr('id', 'sourceToggle')
            .on('click', function (d) {
                options.table.textToggle(this, "#source", "#source-input", "source", "Source: Your source");
            });

        options.table.init(bubble);
    };


    /* Add text */
    cb.types['text'] = function (bubble, options, callback) {
        function appendText(bubble, options, callback) {
            bubble.attr('class', 'bubble-ctn-' + options.class).append('div')
                .style("display", "flex")
                .style("width", "50px")
                .html(options.value)
                .transition()
                .duration(200)
                .style("width", "auto")
                .style('opacity', 1);

            if (options.emoji) {
                bubble.append('img').attr('class', 'emoji').attr('src', './assets/emojis/' + options.emoji + '.png');
            }

            callback();
        }

        if (('delay' in options) && options.delay) {
            var animatedCircles = '<div class="circle"></div><div class="circle"></div><div class="circle"></div>';
            bubble.append('div')
                .attr('class', 'cb-waiting')
                .html(animatedCircles);

            setTimeout(function () {

                bubble.select(".cb-waiting").remove();
                appendText(bubble, options, callback);

            }, (isNaN(options.delay) ? 1000 : options.delay));
        } else {
            appendText(bubble, options, callback);
        }
    };

    /* Select a theme */
    // cb.types['themes'] = function (bubble, options, callback) {

    //     var themes = [
    //         { 'name': 'mercury', 'color': '#71609B', 'font': 'Patua One' },
    //         { 'name': 'venus', 'color': '#FE9592', 'font': 'Noto Serif' },
    //         { 'name': 'earth', 'color': '#B8E986', 'font': 'Roboto Mono' },
    //         { 'name': 'mars', 'color': '#FF5C5C', 'font': 'Patua One' }, //E20036
    //         { 'name': 'jupiter', 'color': '#75FABF', 'font': 'Noto Serif' },
    //         { 'name': 'saturn', 'color': '#FBC469', 'font': 'Roboto Mono' },
    //         { 'name': 'uranus', 'color': '#83C4FE', 'font': 'Patua One' },
    //         { 'name': 'neptune', 'color': '#4554A5', 'font': 'Noto Serif' },
    //         { 'name': 'pluto', 'color': '#454545', 'font': 'Roboto Mono' }
    //     ]

    //     var themesWrapper = bubble.append('div')
    //         .attr('class', 'cb-themes-wrapper');

    //     themesWrapper.selectAll('div').data(themes).enter()
    //         .append('div')
    //         .attr('class', function (d) { return 'theme-thumb theme-thumb-' + d.name })
    //         .on('click', function (d) {
    //             console.log(d)
    //             callback(d);
    //         })
    //         .append('img')
    //         .attr('src', function (d) { return './assets/img/themes/theme-' + d.name + '.png' });

    // };




    /* Select a style */
    cb.types['styles'] = function (bubble, options, callback) {

        var styles = [
            { 'color': '#71609B', 'label': 'purple'},
            { 'color': '#FE9592', 'label': 'apricot'},
            { 'color': '#B8E986', 'label': 'green'},
            { 'color': '#FF5C5C', 'label': 'red'},
            { 'color': '#75FABF', 'label': 'turquoise'},
            { 'color': '#FBC469', 'label': 'orange'}
        ];

        var fonts = [
            { 'font': 'IBM Plex Serif','label':'Classic'},
            { 'font': 'IBM Plex Sans Condensed','label':'Modern'},
            { 'font': 'IBM Plex Mono','label':'Future'}
        ]

        var stylesWrapper = bubble.append('div')
            .attr('class', 'cb-styles-wrapper');

        var stylesOptsFont = stylesWrapper.append('div')
            .attr('class', 'cb-styles-opts cb-styles-opts-fonts');

        stylesOptsFont.append('div')
            .text("Typeface")
            .attr('class', 'cb-styles-label');

        var stylesOptsColor = stylesWrapper.append('div')
            .attr('class', 'cb-styles-opts cb-styles-opts-colors');

        stylesOptsColor.append('div')
            .text("Colors")
            .attr('class', 'cb-styles-label');

        stylesOptsFont.selectAll('.cb-styles-btn')
            .data(fonts).enter()
            .append('div')
            .text(function(d){return d.label})
            .attr('class', "cb-styles-btn")
            .style('font-family', function (d) { return d.font })
            .on('click', function (d) {
                callback(d);
            })

        stylesOptsColor.selectAll('.cb-styles-btn')
            .data(styles).enter()
            .append('div')
            .attr('class', "cb-styles-btn")
            .style("background-color", function(d){return d.color})
            .on('click', function (d) {
                callback(d);
            })

    };

    /* Add download buttons */
    cb.types['status'] = function (bubble, options, callback) {

        var downloadWrapper = bubble.append('div')
            .attr('class', 'cb-status-wrapper')

        var rowOne = downloadWrapper.append('div')
            .attr('class', 'cb-status-row');

        var social = [
            { "name": "Gif", "icon": "gif", "link": "none" + ".gif", "html": 'GIF' },
            { "name": "Facebook", "icon": "facebook", "link": "social/facebook.png", "html": '&#xf09a' },
            { "name": "Twitter", "icon": "twitter", "link": "social/twitter.png", "html": '&#xf099' },
            { "name": "Instagram", "icon": "instagram", "link": "social/instagram.png", "html": '&#xf32d' },
            { "name": "Google", "icon": "google", "link": "social/google.png", "html": '&#xf0d5' },
            { "name": "Linkedin", "icon": "linkedin", "link": "social/linkedin.png", "html": '&#xf0e1' },
            { "name": "Tumblr", "icon": "tumblr", "link": "social/tumblr.png", "html": '&#xf173' },
            { "name": "Snapchat", "icon": "snapchat", "link": "social/snapchat.png", "html": '&#xf2ac' }
        ];

        rowOne.selectAll('span').data(social).enter()
            .append('span')
            .html(function (d) { return d.html; })
            .attr('class', 'cb-status-btn');

        var rowTwo = downloadWrapper.append('div')
            .attr('class', 'cb-status-row');

        var formats = [
            { 'html': '&#xe801', 'name': 'html' },
            { 'html': '&#xe804', 'name': 'svg' },
            { 'html': '&#xe803', 'name': 'png' },
            { 'html': '&#xe802', 'name': 'gif'}
        ];

        rowTwo.selectAll('span').data(formats).enter()
            .append('span')
            .html(function (d, i) { return d.html; })
            .attr('class', 'cb-status-btn')
            .attr('id', function (d) { return 'status-' + d.name; });

        callback(rowOne, rowTwo);
    };

    return cb;

});