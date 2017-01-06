(function () {
    "use strict";

    var config = {
        url: 'data/data.json',
        selector: '.d3-graph.d3-line-width-missing-data',
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

        // Todo Start: Add Codes Here
        var xAxisMargin = margin.left * 2;
        var yAxisMargin = margin.bottom;

        var x = d3.scaleLinear()
            .range([xAxisMargin, width]);

        var y = d3.scaleLinear()
            .range([(height - yAxisMargin), 0]);

        // x.domain(d3.extent(data, function (d) { if (d) return d.x; else return null; }));
        // y.domain(d3.extent(data, function (d) { if (d) return d.y; else return null; }));

        var line = d3.line()
            .defined(function (d) { return d; })
            .x(function (d) { return x(d.x); })
            .y(function (d) { return y(d.y); });

        svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0, " + (height - yAxisMargin) + ")")
            .call(d3.axisBottom().scale(x));

        svg.append("g")
            .attr("class", "axis axis--y")
            .attr("transform", "translate(" + xAxisMargin + ", 0)")
            .call(d3.axisLeft().scale(y));

        svg.datum(data)
            .append("path")
            .attr("class", "line")
            .attr("d", line);

        svg.selectAll(".dot")
            .data(data.filter(function (d) { return d; }))
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", line.x())
            .attr("cy", line.y())
            .attr("r", 3.5);

        // Todo End

        window.onresize = function () {
            drawGraph();
        }
    }

    // Todo Start: Add Codes Here

    // Todo End

    function dataProcessed(data) {
        // Todo Start: Add Codes Here
        data = d3.range(40).map(function (i) {
            return i % 5 ? { x: i / 39, y: (Math.sin(i / 3) + 2) / 4 } : null;
        });
        // Todo End

        return data;
    }

    function drawGraph() {
        d3.json(config.url, function (error, data) {
            if (error) throw error;

            data = dataProcessed(data);

            drawDetailGraph(data);
        })
    }

    drawGraph();
})();