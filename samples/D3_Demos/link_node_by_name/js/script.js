(function () {
    "use strict"; // Start of use strict

    var config = {
        selector: '.d3-graph.d3-link-node',
        margin: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
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

        var simulation = d3.forceSimulation()
            .force("charge", d3.forceManyBody().strength(-200))
            .force("link", d3.forceLink().id(function (d) { return d.id; }).distance(40))
            .force("x", d3.forceX(width / 2))
            .force("y", d3.forceY(height / 2))
            .on("tick", ticked);

        var link = svg.selectAll(".link"),
            node = svg.selectAll(".node");

        simulation.nodes(data.nodes);
        simulation.force("link").links(data.links);

        link = link
            .data(data.links)
            .enter().append("line")
            .attr("class", "link");

        node = node
            .data(data.nodes)
            .enter().append("circle")
            .attr("class", "node")
            .attr("r", 6)
            .style("fill", function (d) { return d.id; });

        function ticked() {
            link.attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            node.attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; });
        }

        window.onresize = function () {
            drawGraph();
        }
    }

    function drawGraph() {
        d3.json("data/data.json", function (error, data) {
            if (error) throw error;
            drawDetailGraph(data);
        })
    }

    drawGraph();
})();