(function () {
    "use strict";

    var config = {
        url_parent: 'data/data_parent.json',
        url_child: 'data/data_child.json',
        selector: '.d3-graph.d3-liusu',
        margin: { top: 20, right: 20, bottom: 20, left: 20 },
        formatTime: '%Y-%m-%d',
        data: {
        }
    };

    function drawDetailGraph(data) {
        var containerEl = document.querySelector(config.selector);
        var width = containerEl.clientWidth;
        var height = width * 0.5;
        var margin = config.margin;
        var container = d3.select(containerEl).html('')
            .style('padding-top', margin.top + 'px')
            .style('padding-right', margin.right + 'px')
            .style('padding-bottom', margin.bottom + 'px')
            .style('padding-left', margin.left + 'px');

        width = width - margin.left - margin.right;
        height = height - margin.top - margin.bottom;

        var header = container.append('div')
            .attr('class', 'pie-chart-header');
        var title = header.append('div')
            .attr('class', 'pie-header-title');
        var button = header.append('div')
            .attr('class', 'pie-header-button')
            .on('click', onHeaderButtonClickHandler);

        var svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);

        var xAxisMargin = margin.left * 2;
        var yAxisMargin = margin.bottom;

        var selectedData = null;
        var new_data;

        var className = [
            { 'area': 'lineChart--area1', 'line': 'lineChart--areaLine1', 'circle': 'lineChart--circle1' },
            { 'area': 'lineChart--area2', 'line': 'lineChart--areaLine2', 'circle': 'lineChart--circle2' },
            { 'area': 'lineChart--area3', 'line': 'lineChart--areaLine3', 'circle': 'lineChart--circle3' }
        ]

        var selectedCircle = new Array(3);
        var tooltipDiv = d3.select('body').append('div').attr('class', 'lineChart--tooltip hidden');
        var mouseline = svg.append('line')
            .attr('class', 'mouseline hidden')
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', 0)
            .attr('y2', height - yAxisMargin);

        redrawGraph(data);
        function redrawGraph(param) {
            data = param;
            new_data = breakdown(data);
            // 刷新图形顶部文字
            drawHeader();
            // 绘制图
            drawArea();
            // 绘制图例
            drawLegend();
        }

        function clearGraph() {
            if (svg) {
                svg.selectAll('g').remove();
                svg.selectAll('path').remove();
                svg.selectAll('circle').remove();
                tooltipDiv.classed('hidden', true);
                mouseline.classed('hidden', true);
            }
        }
        function drawHeader() {
            title.text(selectedData ? '最近一个月威胁子类型分布' : '最近一个月威胁类型分布');
            button.text('威胁类型：' + (selectedData ? selectedData : ''));
            button.style('display', (selectedData ? 'block' : 'none'));
        }
        function drawArea() {
            var length = new_data[0].length;
            var x = d3.scaleTime().range([xAxisMargin, width]).domain([new Date(new_data[0][0].date), new Date(new_data[0][length - 1].date)]);

            var max = [];
            for (var index = 0; index < new_data.length; index++) {
                max.push(d3.max(new_data[index], function (d) { return d.value }));
            }
            var y = d3.scaleLinear().range([height - yAxisMargin, 0]).domain([0, d3.max(max)]);

            var xAxis = d3.axisBottom().scale(x).ticks(8).tickSize(5);
            var yAxis = d3.axisLeft().scale(y).ticks(12).tickSize(5);
            svg.append('g')
                .attr('class', 'lineChart--xAxisTicks')
                .attr('transform', 'translate(0,' + (height - yAxisMargin) + ')')
                .call(xAxis);
            svg.append('g')
                .attr('class', 'lineChart--yAxisTicks')
                .attr('transform', 'translate(' + xAxisMargin + ',0)')
                .call(yAxis);

            var area = d3.area()
                .x(function (d) { return x(new Date(d.date)); })
                .y0(height - yAxisMargin)
                .y1(function (d) { return y(d.value); });

            var line = d3.line()
                .x(function (d) { return x(new Date(d.date)); })
                .y(function (d) { return y(d.value); });

            for (index = 0; index < new_data.length; index++) {
                svg.append('path')
                    .datum(new_data[index])
                    .attr('class', className[index].area)
                    .attr('d', area);

                svg.append('path')
                    .datum(new_data[index])
                    .attr('class', className[index].line)
                    .attr('d', line);

                selectedCircle[index] = svg.append('circle')
                    .attr('class', className[index].circle + ' hidden')
                    .attr('r', 6)
                    .attr('cx', 0)
                    .attr('cy', 0);

                if (selectedData) {
                    selectedCircle[index].classed('click', false);
                } else {
                    selectedCircle[index].classed('click', true)
                        .on('click', function () {
                            var selection = d3.select(this);
                            gotoSubThreat(selection);
                        });
                }
            }

            svg.on('mousemove', function (d) {
                var mouseX = d3.event.clientX - this.getBoundingClientRect().left;
                if ((mouseX >= xAxisMargin) && (mouseX <= width)) {
                    var min = 0, minValue = width;
                    for (var i = 0; i < new_data[0].length; i++) {
                        if (minValue > (Math.abs(mouseX - x(new Date(new_data[0][i].date))))) {
                            min = i;
                            minValue = Math.abs(mouseX - x(new Date(new_data[0][i].date)));
                        }
                    }
                    mouseline.attr('x1', x(new Date(new_data[0][min].date)))
                        .attr('x2', x(new Date(new_data[0][min].date)))
                        .classed('hidden', false);

                    var svgDom = svg.nodes()[0];
                    var tooltipDom = tooltipDiv.nodes()[0];
                    tooltipDom.innerHTML = makeTooltipHtml(data[min]);
                    tooltipDiv.classed('hidden', false)
                        .attr('style', function () {
                            var tooltipWidth = tooltipDom.getBoundingClientRect().width;
                            var tooltipTop = tooltipDom.getBoundingClientRect().top;
                            var svgRect = svgDom.getBoundingClientRect();

                            var left = x(new Date(data[min].date)) + svgRect.left + 20;
                            if (left + tooltipWidth > svgRect.right) {
                                left = svgRect.right - tooltipWidth;
                            }
                            var value = [];
                            value.push(data[min].value1);
                            value.push(data[min].value2);
                            value.push(data[min].value3);
                            var top = y(d3.max(value)) + svgRect.top + 20;
                            return 'left: ' + left + 'px; '
                                + 'top: ' + top + 'px';
                        });

                    for (i = 0; i < new_data.length; i++) {
                        selectedCircle[i].attr('cx', x(new Date(new_data[i][min].date)))
                            .attr('cy', y(new_data[i][min].value))
                            .classed('hidden', false);
                    }
                }
            });

        }

        function makeTooltipHtml(d) {
            var tpl = '<table>'
                + '<tr><td>时间：</td><td>$1</td></tr>'
                + '<tr><td>数值1：</td><td>$2</td></tr>'
                + '<tr><td>数值2：</td><td>$3</td></tr>'
                + '<tr><td>数值3：</td><td>$4</td></tr>';
            return tpl.replace('$1', d.date).replace('$2', d.value1).replace('$3', d.value2).replace('$4', d.value3);
        }

        function breakdown(data) {
            var new_data = new Array(3);
            var length = data.length;
            for (var index = 0; index < 3; index++) {
                new_data[index] = new Array(length);
                for (var n = 0; n < length; n++)
                    new_data[index][n] = {};
            }

            for (index = 0; index < length; index++) {
                new_data[0][index].date = data[index].date;
                new_data[0][index].message = 'value1';
                new_data[0][index].value = data[index].value1;
                new_data[1][index].date = data[index].date;
                new_data[1][index].message = 'value2';
                new_data[1][index].value = data[index].value2;
                new_data[2][index].date = data[index].date;
                new_data[2][index].message = 'value3';
                new_data[2][index].value = data[index].value3;
            }
            return new_data;
        }

        function drawLegend(data) {

        }

        function onHeaderButtonClickHandler() {
            selectedData = null;
            d3.json(config.url_parent, function (error, data) {
                if (error) throw error;
                clearGraph();
                tooltipDiv.classed("hidden", true);
                redrawGraph(dataProcessed(data.lineChart));
            })
        }

        function gotoSubThreat(selection) {
            var index;
            for (index = 0; index < className.length; index++) {
                if (selection.node().classList.contains(className[index].circle)) break;
            }
            selectedData = new_data[index][0].message;
            // 请求子威胁数据
            d3.json(config.url_child, function (error, data) {
                if (error) throw error;
                clearGraph();
                tooltipDiv.classed("hidden", true);
                redrawGraph(dataProcessed(data.lineChart));
            })
        }

        window.onresize = function () {
            drawGraph();
        }
    }

    function dataProcessed(data) {
        var parse = d3.timeFormat(config.formatTime);
        var new_data = data.map(function (datum) {
            datum.date = parse(new Date(datum.date));
            return datum;
        });
        return new_data;
    }

    function drawGraph() {
        d3.json(config.url_parent, function (error, data) {
            if (error) throw error;

            data = dataProcessed(data.lineChart);

            drawDetailGraph(data);
        })
    }

    drawGraph();
})();