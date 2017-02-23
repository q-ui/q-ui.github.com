(function () {
    "use strict";

    var config = {
        url: 'data/data.json',
        selector: '.d3-graph.d3-liusu',
        margin: { top: 20, right: 20, bottom: 20, left: 20 },
        formatTime: '%Y-%m-%d',
        data: {
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
            .attr('height', height);

        var xAxisMargin = margin.left * 2;
        var yAxisMargin = margin.bottom;

        var new_data = new Array(3);
        var length = data.length;
        for (var index = 0; index < 3; index++) {
            new_data[index] = new Array(length);
            for (var n = 0; n < length; n++)
                new_data[index][n] = {};
        }
        // debugger;
        for (index = 0; index < length; index++) {
            new_data[0][index].date = data[index].date;
            new_data[0][index].value = data[index].value1;
            new_data[1][index].date = data[index].date;
            new_data[1][index].value = data[index].value2;
            new_data[2][index].date = data[index].date;
            new_data[2][index].value = data[index].value3;
        }

        data = new_data;

        var max = [];
        for (index = 0; index < data.length; index++) {
            max.push(d3.max(data[index], function (d) { return d.value }))
        }

        var x = d3.scaleTime().range([xAxisMargin, width]).domain([new Date(data[0][0].date), new Date(data[0][length - 1].date)]);
        var y = d3.scaleLinear().range([height - yAxisMargin, 0]).domain([0, d3.max(max)]);
        // var reverseX = d3.scaleTime().domain([xAxisMargin, width]).range([new Date(data[0].date), new Date(data[data.length - 1].date)]);

        var xAxis = d3.axisBottom().scale(x).ticks(8).tickSize(5);
        var yAxis = d3.axisLeft().scale(y).ticks(12).tickSize(5);

        svg.append('g')
            .attr('class', 'lineChart--xAxisTicks')
            .attr('transform', 'translate(0,' + (height - yAxisMargin) + ')')
            .call(xAxis);
        svg.append('g')
            .attr('class', 'lineChart--yAxisTicks')
            .attr('transform', 'translate(' + xAxisMargin + ',0)')
            .call(yAxis);

        var area = d3.area()
            .x(function (d) { return x(new Date(d.date)); })
            .y0(height - yAxisMargin)
            .y1(function (d) { return y(d.value); });

        var line = d3.line()
            .x(function (d) { return x(new Date(d.date)); })
            .y(function (d) { return y(d.value); });

        var selectedCircle = new Array(data.length);
        var tooltipDiv = new Array(data.length);

        var className = [
            { 'area': 'lineChart--area1', 'line': 'lineChart--areaLine1', 'circle': 'lineChart--circle1', 'tooltip': 'tooltip1' },
            { 'area': 'lineChart--area2', 'line': 'lineChart--areaLine2', 'circle': 'lineChart--circle2', 'tooltip': 'tooltip2' },
            { 'area': 'lineChart--area3', 'line': 'lineChart--areaLine3', 'circle': 'lineChart--circle3', 'tooltip': 'tooltip3' }
        ]

        for (index = 0; index < data.length; index++) {
            svg.append('path')
                .datum(data[index])
                .attr('class', className[index].area)
                .attr('d', area);

            svg.append('path')
                .datum(data[index])
                .attr('class', className[index].line)
                .attr('d', line);

            selectedCircle[index] = svg.append('circle').attr('class', className[index].circle + ' hidden').attr('r', 6).attr('cx', 0).attr('cy', 0);
            tooltipDiv[index] = d3.select('body').append('div').attr('class', className[index].tooltip + ' hidden');
        }

        var mouseline = svg.append('line')
            .attr('class', 'mouseline hidden')
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', 0)
            .attr('y2', height - yAxisMargin);

        svg.on('mousemove', function (d) {
            var mouseX = d3.event.clientX - this.getBoundingClientRect().left;
            if ((mouseX >= xAxisMargin) && (mouseX <= width)) {
                var min = 0, minValue = width;
                for (var i = 0; i < data[0].length; i++) {
                    if (minValue > (Math.abs(mouseX - x(new Date(data[0][i].date))))) {
                        min = i;
                        minValue = Math.abs(mouseX - x(new Date(data[0][i].date)));
                    }
                }
                mouseline.attr('x1', x(new Date(data[0][min].date)))
                    .attr('x2', x(new Date(data[0][min].date)))
                    .classed('hidden', false);

                var svgDom = svg.nodes()[0];

                for (i = 0; i < data.length; i++) {
                    selectedCircle[i].attr('cx', x(new Date(data[i][min].date)))
                        .attr('cy', y(data[i][min].value))
                        .classed('hidden', false);

                    var tooltipDom = tooltipDiv[i].nodes()[0];
                    tooltipDiv[i].nodes()[0].innerHTML = makeTooltipHtml(data[i][min]);
                    tooltipDiv[i].classed('hidden', false)
                        .attr('style', function () {
                            var tooltipWidth = tooltipDiv[i].nodes()[0].getBoundingClientRect().width;
                            var tooltipTop = tooltipDiv[i].nodes()[0].getBoundingClientRect().top;
                            var svgRect = svgDom.getBoundingClientRect();

                            var left = x(new Date(data[i][min].date)) + svgRect.left + 20;
                            if (left + tooltipWidth > svgRect.right) {
                                left = svgRect.right - tooltipWidth;
                            }
                            var top = y(data[i][min].value) + svgRect.top + 20;
                            return 'left: ' + left + 'px; '
                                + 'top: ' + top + 'px';
                        });
                }
            }
        });

        function makeTooltipHtml(d) {
            var tpl = '<table>'
                + '<tr><td>时间：</td><td>$1</td></tr>'
                + '<tr><td>数值：</td><td>$2</td></tr>';
            return tpl.replace('$1', d.date).replace('$2', d.value);
        }

        window.onresize = function () {
            drawGraph();
        }
    }

    function dataProcessed(data) {
        var parse = d3.timeFormat(config.formatTime);
        var new_data = data.map(function (datum) {
            datum.date = parse(new Date(datum.date));
            return datum;
        });
        return new_data;
    }

    function drawGraph() {
        d3.json(config.url, function (error, data) {
            if (error) throw error;

            data = dataProcessed(data.lineChart);

            drawDetailGraph(data);
        })
    }

    drawGraph();
})();