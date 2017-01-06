(function () {
    "use strict";

    var config = {
        url: 'data/data.tsv',
        selector: '.d3-graph.d3-percentage-change',
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

        var formatPercent = d3.format("+.0%"),
            formatChange = function (x) { return formatPercent(x - 1); }

        var x = d3.scaleTime()
            .range([xAxisMargin, width]);

        var y = d3.scaleLog()
            .range([(height - yAxisMargin), 0]);

        x.domain(d3.extent(data, function (d) { return d.date; }));
        y.domain(d3.extent(data, function (d) { return d.ratio; }));

        var xAxis = d3.axisBottom()
            .scale(x);

        var yAxis = d3.axisLeft()
            .scale(y)
            .tickSize(-(width - xAxisMargin), 0)
            .tickFormat(formatChange)
            .tickValues(d3.scaleLinear()
                .domain(y.domain())
                .ticks(20));

        var line = d3.line()
            .x(function (d) { return x(d.date); })
            .y(function (d) { return y(d.ratio); });

        var area = d3.area()
            .x(function (d) { return x(d.date); })
            .y1(function (d) { return y(d.ratio); })
            .y0(y(1));

        var gX = svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0, " + (height - yAxisMargin) + ")")
            .call(xAxis);

        var gY = svg.append("g")
            .attr("class", "axis axis--y")
            .attr("transform", "translate(" + xAxisMargin + ", 0)");

        gY.append("text")
            .attr("class", "axis-title")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .text("Change in Price");

        gY.call(yAxis)
            .selectAll(".tick")
            .classed("tick--one", function (d) { return Math.abs(d - 1) < 1e-6; })

        var defs = svg.append("defs");

        defs.append("clipPath")
            .attr("id", "clip-above")
            .append("rect")
            .attr("x", xAxisMargin)
            .attr("y", 0)
            .attr("width", width - xAxisMargin)
            .attr("height", y(1));

        defs.append("clipPath")
            .attr("id", "clip-below")
            .append("rect")
            .attr("x", xAxisMargin)
            .attr("y", y(1))
            .attr("width", width - xAxisMargin)
            .attr("height", height - y(1) - yAxisMargin);

        svg.append("path")
            .datum(data)
            .attr("clip-path", "url(#clip-above)")
            .attr("class", "area area--above")
            .attr("d", area);

        svg.append("path")
            .datum(data)
            .attr("clip-path", "url(#clip-below)")
            .attr("class", "area area--below")
            .attr("d", area);

        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);

        // Todo End

        window.onresize = function () {
            drawGraph();
        }
    }

    // Todo Start: Add Codes Here

    // Todo End

    function dataProcessed(data) {
        var parseDate = d3.timeParse("%d-%b-%y");
        var baseValue = +data[0].close;
        data.forEach(function (d) {
            d.date = parseDate(d.date);
            d.ratio = d.close / baseValue;
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