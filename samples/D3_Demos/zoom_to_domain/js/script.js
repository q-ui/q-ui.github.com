(function () {
    "use strict"; // Start of use strict

    var config = {
        url: 'data/data.csv',
        selector: '.d3-graph.d3-zoom-to-domain',
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
            .attr('height', height);

        var xAxisWidth = margin.left * 2;
        var yAxisHeight = margin.bottom;

        var x = d3.scaleTime().range([xAxisWidth, width]);
        var y = d3.scaleLinear().range([height - yAxisHeight, 0]);

        var xAxis = d3.axisBottom(x);
        var yAxis = d3.axisLeft(y);

        var zoom = d3.zoom()
            .scaleExtent([1, 32])
            .translateExtent([[xAxisWidth, 0], [width, height - yAxisHeight]])
            .extent([[xAxisWidth, 0], [width, height - yAxisHeight]])
            .on("zoom", zoomed);

        var area = d3.area()
            .curve(d3.curveMonotoneX)
            .x(function (d) { return x(d.date); })
            .y0(height - yAxisHeight)
            .y1(function (d) { return y(d.price); });

        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("x", xAxisWidth)
            .attr("y", 0)
            .attr("width", (width - xAxisWidth))
            .attr("height", (height - yAxisHeight));

        x.domain(d3.extent(data, function (d) { return d.date; }));
        y.domain([0, d3.max(data, function (d) { return d.price; })]);

        var g = svg.append("g");

        g.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("clip-path", "url(#clip)")
            .attr("d", area);

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + (height - yAxisHeight) + ")")
            .call(xAxis);

        g.append("g")
            .attr("class", "axis axis--y")
            .attr("transform", "translate(" + xAxisWidth + ", 0)")
            .call(yAxis);

        var d0 = new Date(2003, 0, 1),
            d1 = new Date(2004, 0, 1);

        // Gratuitous intro zoom!
        svg.call(zoom).transition()
            .duration(1500)
            .call(zoom.transform, d3.zoomIdentity
                .scale(width / (x(d1) - x(d0)))
                .translate(-x(d0), 0));

        function zoomed() {
            var t = d3.event.transform;
            var xt = t.rescaleX(x);
            g.select(".area").attr("d", area.x(function (d) { return xt(d.date); }));
            g.select(".axis--x").call(xAxis.scale(xt));
        }

        window.onresize = function () {
            drawGraph();
        }
    }

    function type(d) {
        d.date = d3.timeParse("%b %Y")(d.date);
        d.price = +d.price;
        return d;
    }

    function drawGraph() {
        d3.csv(config.url, type, function (error, data) {
            if (error) throw error;
            drawDetailGraph(data);
        })
    }

    drawGraph();
})();