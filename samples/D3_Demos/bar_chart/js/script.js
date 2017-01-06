(function () {
    "use strict";

    var config = {
        url: 'data/data.tsv',
        selector: '.d3-graph.d3-bar-chart',
        margin: { top: 20, right: 20, bottom: 20, left: 20 },
        data: {
            nameField: 'letter',
            valueField: 'frequency'
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

        // Todo Start: Add Codes Here
        var xAxisMargin = margin.left * 2;
        var yAxisMargin = margin.bottom;

        var x = d3.scaleBand()
            .rangeRound([xAxisMargin, width])
            .padding(0.1);
        var y = d3.scaleLinear()
            .rangeRound([height - yAxisMargin, 0]);

        x.domain(data.map(function (d) { return d[config.data.nameField]; }));
        y.domain([0, d3.max(data, function (d) { return d[config.data.valueField]; })]);

        svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0, " + (height - yAxisMargin) + ")")
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("class", "axis axis--y")
            .attr("transform", "translate(" + xAxisMargin + ", 0)")
            .call(d3.axisLeft(y).ticks(10, "%"))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Frequency");

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) { return x(d[config.data.nameField]); })
            .attr("y", function (d) { return y(d[config.data.valueField]); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return (height - yAxisMargin) - y(d[config.data.valueField]); });
        // Todo End

        window.onresize = function () {
            drawGraph();
        }
    }

    // Todo Start: Add Codes Here

    // Todo End

    function dataProcessed(data) {
        data.forEach(function (d) {
            d[config.data.valueField] = +d[config.data.valueField];
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