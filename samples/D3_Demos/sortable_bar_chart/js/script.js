(function () {
    "use strict";

    var config = {
        url: 'data/data.tsv',
        selector: '.d3-graph.d3-sortable-bar-chart',
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
        var formatPercent = d3.format(".0%");

        var xAxisWidth = margin.left * 2;
        var yAxisHeight = margin.bottom;

        var x = d3.scaleBand()
            .rangeRound([xAxisWidth, width])
            .padding(0.1);

        var y = d3.scaleLinear()
            .rangeRound([height - yAxisHeight, 0]);

        var xAxis = d3.axisBottom()
            .scale(x);

        var yAxis = d3.axisLeft()
            .scale(y)
            .tickFormat(formatPercent);

        x.domain(data.map(function (d) { return d[config.data.nameField]; }));
        y.domain([0, d3.max(data, function (d) { return d[config.data.valueField]; })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height - yAxisHeight) + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + xAxisWidth + ", 0)")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Frequency");

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) { return x(d[config.data.nameField]); })
            .attr("width", x.bandwidth())
            .attr("y", function (d) { return y(d[config.data.valueField]); })
            .attr("height", function (d) { return (height - yAxisHeight) - y(d[config.data.valueField]); });

        d3.select("input").on("change", change);

        var sortTimeout = setTimeout(function () {
            d3.select("input").property("checked", true).each(change);
        }, 2000);

        function change() {
            clearTimeout(sortTimeout);

            // Copy-on-write since tweens are evaluated after a delay.
            var x0 = x.domain(data.sort(this.checked
                ? function (a, b) { return b[config.data.valueField] - a[config.data.valueField]; }
                : function (a, b) { return d3.ascending(a[config.data.nameField], b[config.data.nameField]); })
                .map(function (d) { return d[config.data.nameField]; }))
                .copy();

            svg.selectAll(".bar")
                .sort(function (a, b) { return x0(a[config.data.nameField]) - x0(b[config.data.nameField]); });

            var transition = svg.transition().duration(750),
                delay = function (d, i) { return i * 50; };

            transition.selectAll(".bar")
                .delay(delay)
                .attr("x", function (d) { return x0(d[config.data.nameField]); });

            transition.select(".x.axis")
                .call(xAxis)
                .selectAll("g")
                .delay(delay);
        }
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