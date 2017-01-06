(function () {
    "use strict";

    var config = {
        url: 'data/data.tsv',
        selector: '.d3-graph.d3-negative-bar-chart',
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
        var xAxisMargin = 0;
        var yAxisMargin = margin.bottom;

        var x = d3.scaleLinear()
            .range([0, width]);

        var y = d3.scaleBand()
            .rangeRound([0, (height - yAxisMargin)])
            .padding(0.1);

        var xAxis = d3.axisBottom()
            .scale(x);

        var yAxis = d3.axisLeft()
            .scale(y)
            .tickSize(6, 0);

        x.domain(d3.extent(data, function (d) { return d.value; })).nice();
        y.domain(data.map(function (d) { return d.name; }));

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", function (d) { return "bar bar--" + (d.value < 0 ? "negative" : "positive"); })
            .attr("x", function (d) { return x(Math.min(0, d.value)); })
            .attr("y", function (d) { return y(d.name); })
            .attr("width", function (d) { return Math.abs(x(d.value) - x(0)); })
            .attr("height", y.bandwidth());

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height - yAxisMargin) + ")")
            .call(xAxis);

        var tickNegative = svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + x(0) + ",0)")
            .call(yAxis)
            .selectAll(".tick")
            .filter(function (d, i) { return data[i].value < 0; });

        tickNegative.select("line")
            .attr("x2", 6);

        tickNegative.select("text")
            .attr("x", 9)
            .style("text-anchor", "start");

        // Todo End

        window.onresize = function () {
            drawGraph();
        }
    }

    // Todo Start: Add Codes Here

    // Todo End

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