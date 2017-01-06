(function () {
    "use strict"; // Start of use strict

    // 配置项
    var config = {
        url: 'data/data.json',
        selector: '.d3-graph.d3-map-knowledge',
        margin: {
            top: 15,
            right: 15,
            bottom: 15,
            left: 15
        },
        data: {
            namefield: 'name',
            rankfield: 'rank',
            weightfield: 'weight'
        },
        colorRange: ["#2aa19a", "#6bb7c7", "#98cfd5"]
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
        
        var gPack = svg.append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        var pack = d3.pack()
            .padding(4)
            .size([width, height]);

        var root = handleData(data);
        var nodes = pack(root).descendants();
        var focus = root, view;

        var maxWeight = d3.max(nodes, function (d) {
            return +d.data[config.data.weightfield];
        });

        var minWeight = d3.min(nodes, function (d) {
            return +d.data[config.data.weightfield];
        });

        var color = d3.scaleLinear()
            .domain([minWeight, 0, maxWeight])
            .interpolate(d3.interpolateRgb)
            .range(config.colorRange);

        var circle = gPack.selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("class", function (d) {
                return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
            })
            .style("fill", function (d) {
                return color(d.data[config.data.weightfield]);
            })
            .on("click", function (d) {
                if (focus !== d) {
                    zoom(d);
                    d3.event.stopPropagation();
                }
            });

        var text = gPack.selectAll("text")
            .data(nodes)
            .enter()
            .append("text")
            .attr("class", "label")
            .style("fill-opacity", function (d) {
                return d.parent === root ? 1 : 0;
            })
            .style("display", function (d) {
                return d.parent === root ? "inline" : "none";
            })
            .text(function (d) {
                return d.data[config.data.namefield];
            });

        var node = gPack.selectAll("circle, text");

        svg.on("click", function () {
            zoom(root);
        });

        zoomTo([root.x, root.y, root.r * 2]);

        function zoom(d) {
            var focus0 = focus;
            focus = d;

            var transition = d3.transition()
                .duration(d3.event.altKey ? 7500 : 750)
                .tween("zoom", function (d) {
                    var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
                    return function (t) {
                        zoomTo(i(t));
                    };
                });

            transition.selectAll("text")
                .filter(function (d) {
                    return d.parent === focus || this.style.display === "inline";
                })
                .style("fill-opacity", function (d) {
                    return d.parent === focus ? 1 : 0;
                })
                .on("start", function (d) {
                    if (d.parent === focus)
                        this.style.display = "inline";
                })
                .on("end", function (d) {
                    if (d.parent !== focus)
                        this.style.display = "none";
                });
        }

        function zoomTo(v) {
            var k = height / v[2];
            view = v;
            node.attr("transform", function (d) {
                return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
            });
            circle.attr("r", function (d) {
                return d.r * k;
            });
        }

        function handleData(data) {
            var root = d3.hierarchy(data)
                .sum(function (d) {
                    return d[config.data.rankfield];
                })
                .sort(function (a, b) {
                    return b.data[config.data.rankfield] - a.data[config.data.rankfield];
                });
            return root;
        };

        window.onresize = function () {
            drawGraph();
        }
    }

    function drawGraph() {
        d3.json(config.url, function (error, data) {
            if (error) throw error;
            drawDetailGraph(data);
        });
    }

    drawGraph();
})();