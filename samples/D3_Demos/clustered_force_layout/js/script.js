(function () {
    "use strict";

    var config = {
        url: 'data/data.json',
        selector: '.d3-graph.d3-clustered-force-layout',
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
        var padding = 1.5; // separation between same-color circles
        var clusterPadding = 6; // separation between different-color circles
        var maxRadius = 12;

        var n = 200; // total number of circles
        var m = 10;

        var color = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(d3.range(m));

        // The largest node for each cluster.
        var clusters = new Array(m);

        var nodes = d3.range(n).map(function () {
            var i = Math.floor(Math.random() * m),
                r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
                d = { cluster: i, radius: r };
            if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
            return d;
        });

        var forceSimulation = d3.forceSimulation(nodes)
            .velocityDecay(0.2)
            .force('link', d3.forceLink().id(function (d) { return d.id; }))
            // .force('charge', d3.forceManyBody())
            // .force('center', d3.forceCenter(width / 2, height / 2))
            .force('x', d3.forceX())
            .force('y', d3.forceY())
            // .size([width, height])
            // .alpha(.02)
            // .charge(0)
            .on("tick", tick);

        var circle = svg.selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("r", function (d) { return d.radius; })
            .style("fill", function (d) { return color(d.cluster); })
            // .call(forceSimulation.drag);

        function tick(e) {
            // circle
            //     .each(cluster(10 * e.alpha * e.alpha))
            //     .each(collide(.5))
            //     .attr("cx", function (d) { return d.x; })
            //     .attr("cy", function (d) { return d.y; });
        }

        // Move d to be adjacent to the cluster node.
        function cluster(alpha) {
            return function (d) {
                var cluster = clusters[d.cluster];
                if (cluster === d) return;
                var x = d.x - cluster.x,
                    y = d.y - cluster.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + cluster.radius;
                if (l != r) {
                    l = (l - r) / l * alpha;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    cluster.x += x;
                    cluster.y += y;
                }
            };
        }

        // Resolves collisions between d and all other circles.
        function collide(alpha) {
            var quadtree = d3.geom.quadtree(nodes);
            return function (d) {
                var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
                    nx1 = d.x - r,
                    nx2 = d.x + r,
                    ny1 = d.y - r,
                    ny2 = d.y + r;
                quadtree.visit(function (quad, x1, y1, x2, y2) {
                    if (quad.point && (quad.point !== d)) {
                        var x = d.x - quad.point.x,
                            y = d.y - quad.point.y,
                            l = Math.sqrt(x * x + y * y),
                            r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                        if (l < r) {
                            l = (l - r) / l * alpha;
                            d.x -= x *= l;
                            d.y -= y *= l;
                            quad.point.x += x;
                            quad.point.y += y;
                        }
                    }
                    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                });
            };
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

        // Todo End

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