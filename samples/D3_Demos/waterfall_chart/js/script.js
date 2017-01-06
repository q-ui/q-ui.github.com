(function () {
    "use strict";

    var config = {
        url: 'data/data.tsv',
        selector: '.d3-graph.d3-waterfall-chart',
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
        var formatChange = d3.format("+d"),
            formatValue = d3.format("d");

        var xAxisMargin = margin.left * 3;
        var yAxisMargin = margin.bottom;

        var x = d3.scaleLinear()
            .domain(d3.extent(data, function (d) { return d.value1; })).nice()
            .range([xAxisMargin, width]);

        var y = d3.scaleBand()
            .domain(data.map(function (d) { return d.region; }))
            .rangeRound([0, (height - yAxisMargin)])
            .padding(0.1);

        svg.append("g")
            .attr("transform", "translate(0," + (height - yAxisMargin) + ")")
            .attr("class", "axis axis--x")
            .call(d3.axisBottom(x));

        svg.append("g").selectAll("rect")
            .data(data)
            .enter().append("rect")
            .attr("class", function (d) { return "rect rect--" + (d.value0 < d.value1 ? "positive" : "negative"); })
            .attr("y", function (d) { return y(d.region); })
            .attr("x", function (d) { return x(d.value0 < d.value1 ? d.value0 : d.value1); })
            .attr("width", function (d) { return d.value0 < d.value1 ? x(d.value1) - x(d.value0) : x(d.value0) - x(d.value1); })
            .attr("height", y.bandwidth());

        var label = svg.append("g").selectAll("text")
            .data(data)
            .enter().append("text")
            .attr("class", function (d) { return "label label--" + (d.value0 < d.value1 ? "positive" : "negative"); })
            .attr("y", function (d) { return y(d.region) + y.bandwidth() / 2; });

        label.append("tspan")
            .attr("class", "label-change")
            .attr("dy", "-.5em")
            .text(function (d) { return formatChange(d.value1 - d.value0); });

        label.append("tspan")
            .attr("class", "label-value")
            .attr("dy", "2em")
            .text(function (d) { return formatValue(d.value1); });

        label.selectAll("tspan")
            .attr("x", function (d) { return x(d.value1) + (d.value0 < d.value1 ? -6 : 6); });

        var yAxis = svg.append("g")
            .attr("class", "axis axis--y")
            .attr("transform", "translate(" + x(0) + ", 0)")
            .call(d3.axisLeft(y).tickSize(0).tickPadding(x(0) + 6));

        yAxis.selectAll('g.tick')
            .attr("transform", function (d) {
                var sel = d3.select(this);
                var transform = sel.attr('transform');
                var transformY = transform.substring(transform.indexOf(',') + 1, transform.indexOf(')'));
                return "translate(" + xAxisMargin + ", " + transformY + ")";
            })
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
        data.reduce(function (v, d) {
            d.value0 = v;
            d.value1 = v + d.value;
            return d.value1;
            // return d.value1 = (d.value0 = v) + d.value;
        }, 0);
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