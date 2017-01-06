(function () {
    "use strict"; // Start of use strict

    var config = {
        selector: '.d3-graph.d3-graph-zoom',
        margin: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
        },
        data: {
            
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
            .attr('height', height)
            .on("touchstart", nozoom)
            .on("touchmove", nozoom);

        data = data.map(function () {
            return [Math.random() * width, Math.random() * height];
        })

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var zoom = d3.zoom()
            .on("zoom", zoomed);

        var g = svg.append("g")
            .call(zoom);

        g.append("rect")
            .attr("width", width)
            .attr("height", height)
            .on("click", clicked);

        var view = g.append("g")
            .attr("class", "view");

        view.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("transform", function (d) {
                return "translate(" + d + ")";
            })
            .attr("r", 32)
            .style("fill", function (d, i) {
                return color(i);
            });

        function zoomed() {
            view.attr("transform", d3.event.transform.toString());
        }

        function clicked(d, i) {
            if (d3.event.defaultPrevented) return; // zoomed

            d3.select(this).transition()
                .style("fill", "black")
                .transition()
                .style("fill", "white");
        }

        function nozoom() {
            d3.event.preventDefault();
        }

        window.onresize = function () {
            drawGraph();
        }
    }

    function drawGraph() {
        var data = d3.range(20);

        drawDetailGraph(data);
    }

    drawGraph();
})();