(function () {
    "use strict"; // Start of use strict

    var config = {
        selector: '.d3-graph.d3-arc-padding-angle',
        margin: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
        }
    };

    function drawArcGraph(data) {
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

        var pie = svg.append('g')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var radius = height / 2;
        var arc = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(0)
            .padAngle(0.03);

        var pieData = d3.pie()
            .value(function (d) {
                return d;
            });

        var pieGraph = pie.datum(data)
            .selectAll('path')
            .data(pieData)
            .enter()
            .append('path')
            .attr('d', arc)
            .each(function () {
                this._current = { startAngle: 0, endAngle: 0 }
            })
            .style('fill', function (d, i) {
                return color(i);
            });

        window.onresize = function () {
            drawGraph();
        }
    }

    function drawGraph() {
        var data = [1, 1, 2, 3, 5, 8, 13];

        drawArcGraph(data);
    }

    drawGraph();
})();