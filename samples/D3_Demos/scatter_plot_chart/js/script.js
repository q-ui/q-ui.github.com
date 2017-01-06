(function () {
    "use strict"; // Start of use strict

    var config = {
        url: 'data/data.json',
        selector: '.d3-graph.d3-chart-scatter-plot',
        margin: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
        },
        data: {
            xValueField: 'xValue',
            yValueField: 'yValue',
            categoryField: 'category'
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

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        data.forEach(function (d) {
            d[config.data.yValueField] = +d[config.data.yValueField];
            d[config.data.xValueField] = +d[config.data.xValueField];
        });

        var xAxisWidth = margin.left * 2;
        var yAxisHeight = margin.bottom;

        // 绘制X轴
        var x = d3.scaleLinear()
            .range([xAxisWidth, width])
            .domain(d3.extent(data, function (d) {
                return d[config.data.xValueField];
            })).nice();
        var xAxis = d3.axisBottom()
            .scale(x);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height - yAxisHeight) + ")")
            .call(xAxis);

        // 绘制Y轴
        var y = d3.scaleLinear()
            .range([height - yAxisHeight, 0])
            .domain(d3.extent(data, function (d) {
                return d[config.data.yValueField];
            })).nice();
        var yAxis = d3.axisLeft().scale(y);

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + xAxisWidth + ", 0)")
            .call(yAxis);

        // 绘制小圆点
        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", function (d) { return x(d[config.data.xValueField]); })
            .attr("cy", function (d) { return y(d[config.data.yValueField]); })
            .style("fill", function (d) { return color(d[config.data.categoryField]); });

        // 绘制右上角的小图例
        var legend = svg.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) { return "translate(0," + (i * 20) + ")"; });

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) { return d; });

        window.onresize = function () {
            drawGraph();
        }
    }

    function drawGraph() {
        d3.json(config.url, function (error, data) {
            if (error) throw error;
            drawDetailGraph(data);
        })
    }

    drawGraph();
})();