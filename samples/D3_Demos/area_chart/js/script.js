(function () {
    "use strict"; // Start of use strict

    var config = {
        url: 'data/data.json',
        selector: '.d3-graph.d3-chart-area',
        duration: 1500,
        margin: {
            top: 15,
            right: 15,
            bottom: 15,
            left: 15
        },
        formatTime: '%Y-%m-%d',
        data: {
            dateField: 'date',
            valueField: 'value'
        }
    };

    function drawDetailGraph(data) {
        var containerEl = document.querySelector(config.selector);
        var width = containerEl.clientWidth;
        var height = width * 0.6;
        var margin = config.margin;
        var container = d3.select(containerEl).html('')
            .style('padding-top', margin.top + 'px')
            .style('padding-right', margin.right + 'px')
            .style('padding-bottom', margin.bottom + 'px')
            .style('padding-left', margin.left + 'px');

        width = width - margin.left - margin.right;
        height = height - margin.top - margin.bottom;

        var svg = container.append('svg')
            .attr('width', width)
            .attr('height', height)
            .html(''.concat(
                '<defs>',
                '<linearGradient id="lineChart--gradientBackgroundArea" x1="0" x2="0" y1="0" y2="1">',
                '<stop class="lineChart--gradientBackgroundArea--top" offset="0%" />',
                '<stop class="lineChart--gradientBackgroundArea--bottom" offset="100%" />',
                '</linearGradient>',
                '</defs>')
            );

        var yAxisHeight = margin.bottom;

        var x = d3.scaleTime()
            .range([0, width]);
        var xAxis = d3.axisBottom()
            .scale(x)
            .ticks(8)
            .tickSize(-(height - yAxisHeight));
        var xAxisTicks = d3.axisBottom()
            .scale(x)
            .ticks(16)
            .tickSize(-(height - yAxisHeight))
            .tickFormat('');

        var y = d3.scaleLinear()
            .range([height - yAxisHeight, 0]);
        var yAxisTicks = d3.axisRight()
            .scale(y)
            .ticks(12)
            .tickSize(width)
            .tickFormat('');

        var area = d3.area()
            .x(function (d) {
                return x(new Date(d[config.data.dateField]));
            })
            .y0(height)
            .y1(function (d) {
                return y(d[config.data.valueField]);
            });

        var line = d3.line()
            .x(function (d) {
                return x(new Date(d[config.data.dateField]));
            })
            .y(function (d) {
                return y(d[config.data.valueField]);
            });

        data = handleData(data);
        var startData = data.map(function (datum) {
            return {
                date: datum[config.data.dateField],
                value: 0
            };
        });

        var circleContainer;

        // Compute the minimum and maximum date, and the maximum price.
        x.domain([new Date(data[0][config.data.dateField]), new Date(data[data.length - 1][config.data.dateField])]);
        // hacky hacky hacky :(
        y.domain([0, d3.max(data, function (d) { return d[config.data.valueField]; }) + 500]);

        svg.append('g')
            .attr('class', 'lineChart--xAxis')
            .attr('transform', 'translate(0,' + (height - yAxisHeight) + ')')
            .call(xAxis);

        svg.append('g')
            .attr('class', 'lineChart--xAxisTicks')
            .attr('transform', 'translate(0,' + (height - yAxisHeight) + ')')
            .call(xAxisTicks);

        svg.append('g')
            .attr('class', 'lineChart--yAxisTicks')
            .call(yAxisTicks);

        // Add the line path.
        svg.append('path')
            .datum(startData)
            .attr('class', 'lineChart--areaLine')
            .attr('d', line)
            .attr('transform', 'translate(0, ' + (-yAxisHeight) + ')')
            .transition()
            .duration(config.duration)
            .delay(config.duration / 2)
            .attrTween('d', tween(data, line))
            .on('end', function () {
                drawCircles(data);
            });

        // Add the area path.
        svg.append('path')
            .datum(startData)
            .attr('class', 'lineChart--area')
            .attr('d', area)
            .attr('transform', 'translate(0, ' + (-yAxisHeight) + ')')
            .transition()
            .duration(config.duration)
            .attrTween('d', tween(data, area));

        // Helper functions!!!
        function drawCircle(datum, index) {
            circleContainer.datum(datum)
                .append('circle')
                .attr('class', 'lineChart--circle')
                .attr('r', 0)
                .attr('cx', function (d) {
                    return x(new Date(d[config.data.dateField]));
                })
                .attr('cy', function (d) {
                    return y(d[config.data.valueField]) - yAxisHeight;
                })
                .on('mouseenter', function (d) {
                    d3.select(this)
                        .attr('class', 'lineChart--circle lineChart--circle__highlighted')
                        .attr('r', 7);

                    d.active = true;
                    showCircleDetail(d);
                })
                .on('mouseout', function (d) {
                    d3.select(this)
                        .attr('class', 'lineChart--circle')
                        .attr('r', 6);

                    if (d.active) {
                        hideCircleDetails();
                        d.active = false;
                    }
                })
                .on('click touch', function (d) {
                    if (d.active) {
                        showCircleDetail(d)
                    } else {
                        hideCircleDetails();
                    }
                })
                .transition()
                .delay(config.duration / 10 * index)
                .attr('r', 6);
        }

        function drawCircles(data) {
            circleContainer = svg.append('g');

            data.forEach(function (datum, index) {
                drawCircle(datum, index);
            });
        }

        function hideCircleDetails() {
            circleContainer.selectAll('.lineChart--bubble')
                .remove();
        }

        function showCircleDetail(data) {
            var details = circleContainer.append('g')
                .attr('class', 'lineChart--bubble')
                .attr('transform', function () {
                    var result = 'translate(';

                    result += x(new Date(data[config.data.dateField])) - 50;
                    result += ', ';
                    result += y(data[config.data.valueField]) - 80;
                    result += ')';

                    return result;
                });

            details.append('path')
                .attr('d', 'M2.99990186,0 C1.34310181,0 0,1.34216977 0,2.99898218 L0,47.6680579 C0,49.32435 1.34136094,50.6670401 3.00074875,50.6670401 L44.4095996,50.6670401 C48.9775098,54.3898926 44.4672607,50.6057129 49,54.46875 C53.4190918,50.6962891 49.0050244,54.4362793 53.501875,50.6670401 L94.9943116,50.6670401 C96.6543075,50.6670401 98,49.3248703 98,47.6680579 L98,2.99898218 C98,1.34269006 96.651936,0 95.0000981,0 L2.99990186,0 Z M2.99990186,0');

            var text = details.append('text')
                .attr('class', 'lineChart--bubble--text');

            text.append('tspan')
                .attr('class', 'lineChart--bubble--label')
                .attr('x', 50)
                .attr('y', 20)
                .attr('text-anchor', 'middle')
                .text(data.label);

            text.append('tspan')
                .attr('class', 'lineChart--bubble--value')
                .attr('x', 50)
                .attr('y', 40)
                .attr('text-anchor', 'middle')
                .text(data[config.data.valueField]);
        }

        function tween(b, callback) {
            return function (a) {
                var i = d3.interpolateArray(a, b);

                return function (t) {
                    return callback(i(t));
                };
            };
        }

        function handleData(data) {
            // parse helper functions on top
            var parse = d3.timeFormat(config.formatTime);
            // data manipulation first
            var new_data = data.map(function (datum) {
                datum[config.data.dateField] = parse(new Date(datum[config.data.dateField]));
                return datum;
            });
            return new_data;
        };

        window.onresize = function () {
            drawGraph();
        }
    }

    function drawGraph() {
        d3.json(config.url, function (error, data) {
            if (error) throw error;

            drawDetailGraph(data.lineChart);
        })
    }

    drawGraph();
})();