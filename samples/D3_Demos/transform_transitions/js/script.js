(function () {
    "use strict";

    var config = {
        url: 'data/data.json',
        selector: '.d3-graph.d3-transform-transitions',
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
        var z = 20,
            x = 960 / z,
            y = 500 / z;

        data = d3.range(x * y);

        svg.data(data)
            .enter()
            .append('rect')
            .style('transform', function (d) {
                return 'translate(' + (d % x) * z + 'px, ' + Math.floor(d / x) * z + 'px)';
            })
            .style('fill', function (d) {
                return d3.hsl(d % x / x * 360, 1, Math.floor(d / x) / y);
            })
            .on("mouseover", mouseover);

        function mouseover(d) {
            d3.select(this)
                .style("pointer-events", "none")
                .raise()
                .transition()
                .duration(750)
                .style("transform", "translate(480px, 240px) scale(20) rotate(180deg)")
                .transition()
                .delay(1500)
                .style("transform", "translate(480px, 240px) scale(0.01)")
                .remove();
        }
        // Todo End

        window.onresize = function () {
            drawGraph();
        }
    }

    // Todo Start: Add Codes Here

    // Todo End

    function dataProcessed(data) {
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