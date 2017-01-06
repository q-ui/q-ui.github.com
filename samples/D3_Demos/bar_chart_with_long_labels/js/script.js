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

        // Todo Start: Add Codes Here
        var xAxisMargin = margin.left * 2;
        var yAxisMargin = margin.bottom * 2;

        var x = d3.scaleBand()
            .rangeRound([xAxisMargin, width])
            .padding(.1);

        var y = d3.scaleLinear()
            .range([(height - yAxisMargin), 0]);

        var xAxis = d3.axisBottom()
            .scale(x);

        var yAxis = d3.axisLeft()
            .scale(y)
            .ticks(8, "%");

        x.domain(data.map(function (d) { return d.name; }));
        y.domain([0, d3.max(data, function (d) { return d.value; })]);

        svg.append("text")
            .attr("class", "title")
            .attr("x", x(data[0].name))
            .attr("y", -26)
            .text("Why Are We Leaving Facebook?");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height - yAxisMargin) + ")")
            .call(xAxis)
            .selectAll(".tick text")
            .call(wrap, x.bandwidth());

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + xAxisMargin + ",0)")
            .call(yAxis);

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) { return x(d.name); })
            .attr("width", x.bandwidth())
            .attr("y", function (d) { return y(d.value); })
            .attr("height", function (d) { return height - yAxisMargin - y(d.value); });

        function wrap(text, width) {
            text.each(function () {
                var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1, // ems
                    y = text.attr("y"),
                    dy = parseFloat(text.attr("dy")),
                    tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                    }
                }
            });
        }

        // Todo End

        window.onresize = function () {
            drawGraph();
        }
    }

    // Todo Start: Add Codes Here

    // Todo End

    function dataProcessed(data) {
        // Todo Start: Add Codes Here
        data.forEach(function (d) {
            d.value = +d.value;
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