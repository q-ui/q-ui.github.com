function lineChart() {
    var _chart = {};
    var _width, _height;
    var _margin = {
        left: 50,
        top: 10,
        right: 10,
        bottom: 30
    };
    var _svg;
    var _data;
    var _line;
    var _x;
    var _y;
    var _xtick = 6;
    var _ytick = [0, 10, 20];
    var xField = '';
    var yFields = [];
    var _colors = d3.scaleOrdinal(d3.schemeCategory20);
    var _xformat;
    var _yformat;
    var _yLabelText;
    var selectedCircle;
    var _container;
    var tooltipDiv;

    var header;
    var button;
    var _dragging = false;
    var _zoomArea = {};
    var _zoomed = false;
    var _flag = false;
    var selectedData;
    var typeArr;
    var legend;
    var breakpoint;
    var counts;
    var id;
    var tooltipfunction = function (d) {
        return 'Use tipFunction to customize your tooltip';
    }
    _chart.container = function (c) {
        if (arguments.length > 0) {
            _container = d3.select(c);
            return this;
        }
        return _container;
    };

    _chart.typeArr = function (t) {
        if (arguments.length > 0) {
            typeArr = t;
            return this;
        }
        return _typeArr;
    };

    _chart.width = function (w) {
        if (arguments.length > 0) {
            _width = w;
            return this;
        }
        return _width;
    };

    _chart.height = function (h) {
        if (arguments.length > 0) {
            _height = h;
            return this;
        }
        return _height;
    };

    _chart.data = function (data) {
        if (arguments.length > 0) {
            _data = data;
            return this;
        }
        return _data;
    };

    _chart.xField = function (x) {
        if (arguments.length > 0) {
            xField = x;
            return this;
        }
        return xField;
    };

    _chart.yFields = function (y) {
        if (arguments.length > 0) {
            yFields = y;
            return this;
        }
        return yFields;
    };

    _chart.colors = function (c) {
        if (arguments.length > 0) {
            _colors = c;
            return this;
        }
        return _colors;
    };

    _chart.xtick = function (x) {
        if (arguments.length > 0) {
            _xtick = x;
            return this;
        }
        return _xtick;
    };

    _chart.ytick = function (y) {
        if (arguments.length > 0) {
            _ytick = y;
            return this;
        }
        return _ytick;
    };

    _chart.xformat = function (xf) {
        if (arguments.length > 0) {
            _xformat = xf;
            return this;
        }
        return _xformat;
    };

    _chart.yformat = function (yf) {
        if (arguments.length > 0) {
            _yformat = yf;
            return this;
        }
        return _yformat;
    };

    _chart.yLabelText = function (t) {
        if (arguments.length > 0) {
            _yLabelText = t;
            return this;
        }
        return _yLabelText;
    };

    _chart.render = function () {
        if (!_svg) {
            _svg = _container.append('svg');
            id = _svg.nodes()[0].parentNode.parentNode.getAttribute('id');
            header = _container.append('div')
                .attr('class', 'lineChart-chart-header');
            button = header.append('div')
                .attr('class', 'lineChart-header-button')
                .on('click', onHeaderButtonClickHandler);
            tooltipDiv = _container.append('div').attr('class', 'lineChart-tooltip').attr('style', 'left:0px;top:0px;')
                .style('display', 'none');
            legend = _container.append('div')
                .attr('class', 'lineChart-legend');
            var clippath = _svg.append('clipPath').attr('id', id + 'clippath');
            clippath.append('rect').attr('x', '0').attr('y', '0').attr('stroke', '#000000')
                .attr('stroke-miterlimit', '10').attr('width', _width).attr('height', _height - _margin.bottom);
        }
        _svg.attr('width', _width).attr('height', _height);
        if (_data != null) {
            redrawGraph(_data);
        }
    };

    function redrawGraph(data) {
        selectedData = _svg.append('g').attr('class', 'selected-rect').append('rect');
        for (var index = 0; index < typeArr.length; index++) {
            typeArr[index].show = true;
        }
        clearGraph();
        drawHeader();
        renderAxes(data);
        renderLine(data);
        renderContent(data);
        drawLegend(data);
    }
    function renderContent(data) {
        _svg.on('mousemove.a', function (d) {
            d3.event.stopPropagation();
            window.addEventListener('mousemove', hideTooltip);
            if (_dragging) return;
            var mouseX = d3.event.clientX - this.getBoundingClientRect().left;
            if ((mouseX >= _margin.left) && (mouseX <= _width)) {
                var min = 0, minValue = _width;
                for (var i = 0; i < data.length; i++) {
                    if (minValue > (Math.abs(mouseX - _x(data[i][xField])))) {
                        min = i;
                        minValue = Math.abs(mouseX - _x(data[i][xField]));
                    }
                }

                d3.select('.lineChart-tooltip').style('display', 'block');
                var tooltipDom = tooltipDiv.nodes()[0];
                tooltipDom.innerHTML = tooltipfunction(data[min]);
                var svgDom = _svg.nodes()[0];
                tooltipDiv.attr('style', function () {
                    var tooltipWidth = tooltipDom.getBoundingClientRect().width;
                    var tooltipHeight = tooltipDom.getBoundingClientRect().height;
                    var svgRect = svgDom.getBoundingClientRect();

                    var left = d3.event.clientX + 10;
                    if (left + tooltipWidth > svgRect.right) {
                        left = svgRect.right - tooltipWidth - _container.node().getBoundingClientRect().left;
                    } else {
                        left = left - _container.node().getBoundingClientRect().left;
                    }
                    var top = d3.event.clientY + 10;
                    if (top + tooltipHeight > svgRect.bottom) {
                        top = svgRect.bottom - tooltipHeight - _container.node().getBoundingClientRect().top;
                    } else {
                        top = top - _container.node().getBoundingClientRect().top;
                    }

                    return 'left: ' + left + 'px' + ';' + 'top: ' + top + 'px';
                });
                for (i = 0; i < yFields.length; i++) {
                    if (typeArr[i].show) {
                        _svg.select('g.circle_' + i).selectAll('circle').each(function (d, index) {
                            d3.select(this).classed('hidden', index != min);
                        });
                    }
                }
            }
        });
        if (!_flag) {
            _svg.on('mousedown', function (d) {
                _dragging = true;
                _zoomArea.x1 = d3.event.clientX - this.getBoundingClientRect().left;

                _svg.on('mousemove.b', function () {
                    _zoomArea.x2 = d3.event.clientX - this.getBoundingClientRect().left;
                    var minX = _zoomArea.x1;
                    var maxX = _zoomArea.x2;
                    if (minX > maxX) {
                        minX = _zoomArea.x2;
                        maxX = _zoomArea.x1;
                    }
                    selectedData.attr('x', minX)
                        .attr('y', 0)
                        .attr('width', maxX - minX)
                        .attr('height', _height - _margin.bottom);
                });

                _svg.on('mouseup', function () {
                    _dragging = false;
                    _zoomArea.x2 = d3.event.clientX - this.getBoundingClientRect().left;
                    _svg.on('mousemove.b', null);
                    _svg.on('mouseup', null);
                    zoom(data);
                });
            });
        } else {
            _svg.on('mousedown', null);
        }
    }

    function drawLegend(data) {
        legend.selectAll(".legend-label").data(typeArr).remove();
        var legendDiv = legend.selectAll(".legend-label").data(typeArr)
            .enter().append("div").attr("class", "legend-label");
        legendDiv.append('div').attr('class', 'legend-button')
            .attr("style", function (d) {
                return "background-color:" + d.color + ";";
            });
        legendDiv.append('span').attr('class', 'legend-text')
            .text(function (d) { return d.typeText; });
        legend.selectAll('.legend-label').on('click', function (d) {
            var selectedLegend = d3.select(this).select('.legend-button');
            if (selectedLegend.node().classList.contains('legend-hide')) {
                selectedLegend.classed('legend-hide', false)
                    .attr('style', "background-color:" + d.color);
                d.show = true;
                clearGraph();
                renderAxes(data);
                renderLine(data);
                renderContent(data);
            } else {
                selectedLegend.classed('legend-hide', true)
                    .attr('style', "background-color:#999");
                d.show = false;
                clearGraph();
                renderAxes(data);
                renderLine(data);
                renderContent(data);
            }
        })
    }

    function onHeaderButtonClickHandler() {
        _flag = false;
        _zoomed = false;
        redrawGraph(_data);
    }
    function zoom(data) {
        selectedData.attr('width', 0);

        var minX = _zoomArea.x1;
        var maxX = _zoomArea.x2;
        if (minX > maxX) {
            minX = _zoomArea.x2;
            maxX = _zoomArea.x1;
        }

        var d;
        var dx;
        var zoomData = [];

        for (var i = 0; i < data.length; i++) {
            d = data[i];
            dx = _x(d[xField])
            if (dx <= maxX && dx >= minX) {
                zoomData.push(d);
            }
        }
        if (zoomData.length < 2) {
            return;
        }
        _zoomed = true;

        clearGraph();
        if (zoomData.length <= 2) {
            _flag = true;
        } else {
            _flag = false;
        }

        redrawGraph(zoomData);

    }

    function drawHeader() {
        button.text((_zoomed ? '重置' : ''));
        button.style('display', (_zoomed ? 'block' : 'none'));
    }

    function hideTooltip() {
        d3.select('.lineChart-tooltip').style('display', 'none');
        window.removeEventListener('mousemove', hideTooltip);
    }
    function clearGraph() {
        if (_svg) {
            _svg.selectAll('g').remove();
            _svg.selectAll('path').remove();
            _svg.selectAll('circle').remove();
        }
        tooltipDiv.style('display', 'none');
        selectedData = _svg.append('g').attr('class', 'selected-rect').append('rect');
    }
    function renderAxes(data) {
        renderYaxis();
        renderXaxis(data);
    }

    function renderXaxis(data) {
        _x = d3.scaleLinear().domain([data[0][xField], data[data.length - 1][xField]]);
        _x.range([_margin.left, _width - _margin.right]);

        var xAxis = d3.axisBottom().scale(_x).ticks(_xtick);
        if (_xformat != null) xAxis.tickFormat(_xformat);
        _svg.append('g')
            .attr('class', 'axis x')
            .attr('transform', 'translate(0, ' + (_height - _margin.bottom) + ')')
            .call(xAxis)
    }

    function renderYaxis() {
        var maxTemp;
        var max = 0;
        for (var i = 0; i < yFields.length; i++) {
            maxTemp = d3.max(_data, function (d) {
                return d[yFields[i]];
            })
            if (maxTemp > max) {
                max = maxTemp;
            }
        }
        _y = d3.scaleLinear().domain([0, max]);
        _y.range([_height - _margin.bottom, _margin.top]);

        var yAxis = d3.axisLeft().scale(_y).tickValues(_ytick);
        if (_yformat != null) yAxis.tickFormat(_yformat);
        var yAxisG = _svg.append('g')
            .attr('class', 'axis y')
            .call(yAxis);

        if (_yLabelText) {
            _svg.append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', 0)
                .attr('x', -(_height / 2))
                .attr('dy', '1em')
                .style('text-anchor', 'middle')
                .style('font-size', '12px')
                .text(_yLabelText);
        }

        var marginLeft;
        var maxTickTextWidth = 0;

        _svg.selectAll('g.axis.y g.tick text').each(function (value, index, arr) {
            maxTickTextWidth = Math.max(arr[index].getBoundingClientRect().width, maxTickTextWidth)
        });
        marginLeft = maxTickTextWidth;
        if (_yLabelText) {
            marginLeft += 28;
        }
        _margin.left = marginLeft;
        yAxisG.attr('transform', 'translate(' + _margin.left + ',0)');
        d3.selectAll('g.axis.y g.tick line')
            .classed('grid-line', true)
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', _width - _margin.left - _margin.right)
            .attr('y2', 0)
    }

    function renderLine(data) {
        //取到breakpoint
        breakpoint = new Array();
        counts = new Array();
        for (var i = 0; i < data.length; i++) {
            if (!data[i][xField]) {
                breakpoint.push(data[i]);
                counts.push(i);
            }
        }
        for (var i = 0; i < yFields.length; i++) {
            if (typeArr[i].show) {
                _line = d3.line()
                    .defined(function (d) {
                        return d[xField] != null;
                    })
                    .x(function (d) { return _x(d[xField]); })
                    .y(function (d) { return _y(d[yFields[i]]); })
                    .curve(d3.curveMonotoneX);
                //给breakpoint显示圆圈
                for (var j = 0; j < counts.length; j++) {
                    var dot1 = _svg.append('g').attr('class', 'dot_' + j)
                        .selectAll('circle').data(breakpoint).enter().append('circle')
                        .style('fill', 'none').style('stroke', '#4F8FCE').style('stroke-width', '2px')
                        .attr('r', 2)
                    if (counts[j] - 1 >= 0 && data[counts[j] - 1][yFields[i]] != null) {
                        dot1.attr('cx', _x(data[counts[j] - 1][xField]))
                            .attr('cy', _y(data[counts[j] - 1][yFields[i]]));
                    }

                    var dot2 = _svg.append('g').attr('class', 'dot_' + j)
                        .selectAll('circle').data(breakpoint).enter().append('circle')
                        .style('fill', 'none').style('stroke', '#4F8FCE').style('stroke-width', '2px')
                        .attr('r', 2)
                    if (counts[j] + 1 <= data.length - 1 && data[counts[j] + 1][yFields[i]] != null) {
                        dot2.attr('cx', _x(data[counts[j] + 1][xField]))
                            .attr('cy', _y(data[counts[j] + 1][yFields[i]]));
                    }
                }

                _svg.append('path').attr('class', 'line').style('stroke', _colors(i))
                    .attr('d', _line(data))
                    .style('clip-path', 'url(#' + id + 'clippath)');
                var circle = _svg.append('g').attr('class', 'circle_' + i)
                    .selectAll('circle').data(data).enter().append('circle')

                if (data.length == 1) {
                    circle.attr('class', 'circle')
                } else {
                    circle.attr('class', 'circle').classed('hidden', true);
                }
                circle.style('fill', _colors(i))
                    .attr('r', 5)
                    .attr('cx', function (d) {
                        return _x(d[xField]);
                    })
                    .attr('cy', function (d) {
                        return _y(d[yFields[i]]);
                    });
            }
        }
    }
    return _chart;
}
