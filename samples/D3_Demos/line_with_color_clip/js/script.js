(function () {
    "use strict";

    var config = {
        url: 'data/data.tsv',
        selector: '.d3-graph.d3-line-with-color-clip',
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

        var x = d3.scaleTime()
            .range([xAxisMargin, width]);

        var y = d3.scaleLinear()
            .range([(height - yAxisMargin), 0]);

        var xAxis = d3.axisBottom()
            .scale(x);

        var yAxis = d3.axisLeft()
            .scale(y);

        var line = d3.line()
            .curve(d3.curveBasis)
            .x(function (d) { return x(d.date); })
            .y(function (d) { return y(d.temperature); });

        x.domain([data[0].date, data[data.length - 1].date]);
        y.domain(d3.extent(data, function (d) { return d.temperature; }));

        svg.append("clipPath")
            .attr("id", "clip-above")
            .append("rect")
            .attr('x', xAxisMargin)
            .attr('y', 0)
            .attr("width", (width - xAxisMargin))
            .attr("height", y(55));

        svg.append("clipPath")
            .attr("id", "clip-below")
            .append("rect")
            .attr('x', xAxisMargin)
            .attr("y", y(55))
            .attr("width", (width - xAxisMargin))
            .attr("height", (height - yAxisMargin) - y(55));

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height - yAxisMargin) + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + xAxisMargin + ",0)")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Temperature (ºF)");

        svg.selectAll(".line")
            .data(["above", "below"])
            .enter().append("path")
            .attr("class", function (d) { return "line " + d; })
            .attr("clip-path", function (d) { return "url(#clip-" + d + ")"; })
            .datum(data)
            .attr("d", line);
        // Todo End

        window.onresize = function () {
            drawGraph();
        }
    }

    // Todo Start: Add Codes Here

    // Todo End

    function dataProcessed(data) {
        // Todo Start: Add Codes Here
        var parseDate = d3.timeParse("%Y%m%d");
        data.forEach(function (d) {
            d.date = parseDate(d.date);
            d.temperature = +d.temperature;
        })
        // Todo End

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