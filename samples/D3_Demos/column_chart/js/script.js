(function () {
    "use strict";

    var config = {
        url: 'data/data.tsv',
        selector: '.d3-graph.d3-bar-chart-with-long-labels',
        margin: { top: 20, right: 20, bottom: 20, left: 20 },
        data: {}
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

        var tooltip = container.append('div')
            .attr('class', 'column-tooltip');

        var xAxisMargin = margin.left * 2;
        var yAxisMargin = margin.bottom * 2;

        var x = d3.scaleBand()
            .rangeRound([xAxisMargin, width])
            .paddingInner(.4).paddingOuter(.2);

        var y = d3.scaleLinear()
            .range([(height - yAxisMargin), 0]);

        var xAxis = d3.axisBottom()
            .scale(x);
        var yDataMax = d3.max(data, function (d) { return d.value; });
        var yAxisMax = yDataMax * 1.1;
        var yAxis = d3.axisLeft()
            .scale(y)
            .tickValues([0, yDataMax / 4, yDataMax / 2, yDataMax * 3 / 4, yDataMax])
            .tickSize(0);

        x.domain(data.map(function (d) { return d.name; }));
        y.domain([0, yAxisMax]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height - yAxisMargin) + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + xAxisMargin + ",0)")
            .call(yAxis).selectAll('g.tick').filter(function (data, index, list) {
                return index != 0;
            }).append('line')
            .attr('x1', 0).attr('y1', 0).attr('x2', width).attr('y2', 0)
            .attr('class', 'grid-line');

        var hideTipTimeout;

        svg.selectAll(".column")
            .data(data)
            .enter().append("rect")
            .attr("class", "column")
            .attr("x", function (d) { return x(d.name); })
            .attr("width", x.bandwidth())
            .on('mouseover', function (data, index, arr) {
                clearTimeout(hideTipTimeout);
                tooltip.html("名称&nbsp;&nbsp;" + data.name + '<br>数量&nbsp;&nbsp;' + data.value);
                var x = parseInt(arr[index].getAttribute('x')) + parseInt(arr[index].getAttribute('width')) / 2 + margin.left - tooltip.node(0).clientWidth / 2;
                var y = height - arr[index].getAttribute('height') - margin.top - 14 - tooltip.node(0).clientHeight;
                if (tooltip.style('visibility') != 'visible') {
                    tooltip.style('left', x + 'px').style('top', y + 'px').style('visibility', 'visible');
                } else {
                    tooltip.transition('column-tip').style('left', x + 'px').style('top', y + 'px');
                }
            }).on('mouseout', function () {
                hideTipTimeout = setTimeout(function () {
                    tooltip.style('visibility', 'hidden');
                }, 1000);
            })
            .attr("y", function (d) { return y(0); })
            .transition()
            .attr("y", function (d) { return y(d.value); })
            .attr("height", function (d) { return height - yAxisMargin - y(d.value); });

        window.onresize = function () {
            drawGraph();
        };
    }

    function dataProcessed(data) {
        data.forEach(function (d) {
            d.value = +d.value;
        });
        return data;
    }

    function drawGraph() {
        d3.tsv(config.url, function (error, data) {
            if (error) throw error;

            data = dataProcessed(data);

            drawDetailGraph(data);
        })
    }

    drawGraph();
})();
