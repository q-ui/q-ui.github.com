function ScatterChart() {
    var _chart = {};

    var _chart = {};

    var _legendbottom = 25,   //area for legend in Method 2  
        _legendleft = 40,
        _padding = {
            top: 0,
            right: 20,
            bottom: 20,
            left: 60
        };  //area for legend in Method 1  ;

    var _width, _height;

    var _initialized = false;

    var _svg;

    var _legend;

    var _x, _y;

    var _xAxisG, _yAxisG;

    var _bodyG;

    var _selectedRect;

    var _tooltipDiv;

    var _data;

    var _xStartValue, _xEndValue;

    var _dragging = false;

    var _zoomArea = {};

    var _zoomed = false;

    var _originData;
    var _minCount;
    var _maxCount;

    var _totalCount = {};

    _chart.width = function (w) {
        if (!arguments.length) return _width;
        _width = w;
        return _chart;
    };

    _chart.height = function (h) {
        if (!arguments.length) return _height;
        _height = h - _legendbottom;;
        return _chart;
    };

    _chart.padding = function (p) {
        if (!arguments.length) return _padding;
        _padding = p;
        return _chart;
    };

    _chart.data = function (d, isZoom, startX, endX) {
        if (!arguments.length) return _data;
        if (!isZoom) {
            _originData = d.concat();
            _zoomed = false;
            _xStartValue = d[0].x;
            _xEndValue = d[0].x;
            _minCount = d[0].count;
            _maxCount = d[0].count;
            for (var i = 0; i < typeTextArr.length; i++)
                _totalCount[typeTextArr[i].typeId] = 0;
            for (var i = 0; i < d.length; i++) {
                if (_xStartValue > d[i].x)
                    _xStartValue = d[i].x;
                if (d[i].x > _xEndValue)
                    _xEndValue = d[i].x;
                if (_minCount > d[i].count)
                    _minCount = d[i].count;
                if (_maxCount < d[i].count)
                    _maxCount = d[i].count;
                _totalCount[d[i].type] += d[i].count;
            }
        } else {
            _zoomed = true;
            _xStartValue = startX;
            _xEndValue = endX;
        }
        _data = d;
        return _chart;
    };

    _chart.render = function () {
        if (!_initialized) {
            init();
        }

        _svg.attr('width', _width).attr('height', _height);

        renderAxes();
        renderDots();
        renderLegend();
    };

    function contentWidth() {
        return _width - _padding.left - _padding.right;
    }

    function contentHeight() {
        return _height - _padding.top - _padding.bottom;
    }

    function startX() {
        return _padding.left;
    }

    function endX() {
        return _width - _padding.right;
    }

    function startY() {
        return _height - _padding.bottom;
    }

    function endY() {
        return _padding.top;
    }

    function isZoomed() {
        return _zoomed;
    }

    function init() {
        _initialized = true;
        _svg = d3.select('body').append('svg');
        _legend = d3.select('body').append('div').attr('style', 'text-align:center;width:' + _width + 'px;');
        _svg.on('mousedown', function (d) {
            _dragging = true;
            _zoomArea.x1 = d3.event.clientX - this.getBoundingClientRect().left;

            d3.select('body').on('mousemove', function () {
                _zoomArea.x2 = d3.event.clientX - this.getBoundingClientRect().left;
                drawSelectedRect();
            });

            d3.select('body').on('mouseup', function () {
                _dragging = false;
                _zoomArea.x2 = d3.event.clientX - this.getBoundingClientRect().left;
                d3.select('body').on('mousemove', null);
                d3.select('body').on('mouseup', null);
                zoom();
            });
        });

        _xAxisG = _svg.append('g').attr('class', 'axis x');
        _yAxisG = _svg.append('g').attr('class', 'axis y');

        _bodyG = _svg.append('g').attr('class', 'body');

        _selectedRect = _svg.append('g').attr('class', 'selected-rect').append('rect');

        _tooltipDiv = d3.select('body').append('div').attr('class', 'tooltip hidden');

        addEventListener('dotmouseover', function (e) {
            if (_dragging) return;
            var tooltipDom = _tooltipDiv.nodes()[0];
            tooltipDom.innerHTML = makeTooltipHtml(e.parameters[0]);

            var svgDom = _svg.nodes()[0];

            _tooltipDiv.attr('style', function () {
                var tooltipWidth = tooltipDom.getBoundingClientRect().width;
                var svgRect = svgDom.getBoundingClientRect();

                var left = e.parameters[1] + 20;
                if (e.parameters[1] + 20 + tooltipWidth > svgRect.right) {
                    left = svgRect.right - tooltipWidth;
                }

                return 'left: ' + left + 'px; '
                    + 'top: ' + (e.parameters[2] + 20) + 'px';
            }).classed('hidden', false);
        });

        addEventListener('dotmouseout', function (e) {
            _tooltipDiv.classed('hidden', true);
        });

        addEventListener('dotclick', function (e) {
            console.log('You click ' + JSON.stringify(e.parameters[0]));
        });
    }

    function drawSelectedRect() {
        var minX = _zoomArea.x1;
        var maxX = _zoomArea.x2;
        if (minX > maxX) {
            minX = _zoomArea.x2;
            maxX = _zoomArea.x1;
        }
        _selectedRect.attr('x', minX).attr('y', endY()).attr('width', maxX - minX).attr('height', contentHeight());
    }

    function zoom() {
        _selectedRect.attr('width', 0);

        var minX = _zoomArea.x1;
        var maxX = _zoomArea.x2;
        if (minX > maxX) {
            minX = _zoomArea.x2;
            maxX = _zoomArea.x1;
        }

        var d;
        var dx;
        var zoomData = [];

        var reverseX = d3.scaleLinear().domain(_x.range()).range(_x.domain());

        for (var i = 0; i < _data.length; i++) {
            d = _data[i];
            dx = _x(d.x)
            if (dx <= maxX && dx >= minX) {
                zoomData.push(d);
            }
        }

        var newStartX = parseInt(reverseX(minX));
        var newEndX = parseInt(reverseX(maxX));
        if (newEndX - newStartX >= 3600 * 1000) {
            _chart.data(zoomData, true, newStartX, newEndX).render();
        }
    }

    _chart.zoomReset = function () {
        _chart.data(_originData).render();
    };

    function renderAxes() {
        renderXAxis();
        renderYAxis();

        renderGrid();
    }

    function renderXAxis() {
        var xAxisRealDotCount = (newWidth && newWidth < 600) ? Math.floor(xAxisDotCount * newWidth / width) : xAxisDotCount;
        var delta = (_xEndValue - _xStartValue) / (xAxisRealDotCount - 1);
        var tickValus = [];
        for (var i = 0; i < (xAxisRealDotCount + 2); i++) {
            tickValus.push(_xStartValue - xAxisMarginRatio * delta + i * delta + ((i > 0) ? (xAxisMarginRatio - 1) * delta : 0) + ((i == xAxisRealDotCount + 1) ? (xAxisMarginRatio - 1) * delta : 0));
        }

        _x = d3.scaleLinear().domain([_xStartValue - xAxisMarginRatio * delta, _xEndValue + xAxisMarginRatio * delta]).range([startX(), startX() + contentWidth()]);
        var _xAxis = d3.axisBottom().tickSize(0).tickPadding(10).tickValues(tickValus).tickFormat(xAxisTickTextFormat).scale(_x);
        _xAxisG.call(_xAxis).attr('transform', 'translate(0, ' + startY() + ')');
        _xAxisG.selectAll('text.axislabel').data([xAxisLabel]).enter()
            .append('text')
            .attr('class', 'axislabel')
            .attr('text-anchor', 'end')
            .attr('x', (_width - _padding.left - _padding.right) / 2 + _padding.left)
            .attr('y', 30)
            .text(function (d) { return d; });
        _xAxisG.selectAll('text.axislabel').data([xAxisLabel]).text(function (d) { return d; });
        //make tick
        d3.selectAll("g.x.axis g.tick line").attr("y2", function (d, index, arr) {
            if (index == 0 || index == (arr.length - 1))
                return 0;
            else
                return 4;
        });
    }

    function renderYAxis() {
        var domain = [];
        var range = [];

        for (var i = 0; i < (yAxisDotCount + 2); i++) {
            domain.push(i);
            range.push(startY() - contentHeight() / (yAxisDotCount - 1 + 2 * yAxisMarginRatio) * (i + ((i > 0) ? (yAxisMarginRatio - 1) : 0) + ((i == yAxisDotCount + 1) ? (yAxisMarginRatio - 1) : 0)));
        }

        _y = d3.scaleOrdinal().domain(domain).range(range);
        var _yAxis = d3.axisLeft().tickSize(0).tickPadding(5).tickFormat(yAxisFormatFunction).scale(_y);
        _yAxisG.call(_yAxis).attr('transform', 'translate(' + startX() + ', 0)');
        _yAxisG.selectAll('text.axislabel').data([yAxisLabel]).enter()
            .append('text')
            .text(function (d) { return d; })
            .attr('class', 'axislabel')
            .attr('text-anchor', 'end')
            .attr('x', -(_height - _padding.bottom) / 2)
            .attr('y', -(_padding.left) / 2)
            .attr('transform', 'rotate(-90)');
        _yAxisG.selectAll('text.axislabel').data([yAxisLabel])
            .text(function (d) { return d; });
        //make tick
        d3.selectAll("g.y.axis g.tick line").attr("x2", function (d, index, arr) {
            if (index == 0 || index == (arr.length - 1))
                return 0;
            else
                return -4;
        });
    }

    function renderGrid() {
        _yAxisG.selectAll('g.tick .grid-line').remove();
        _yAxisG.selectAll('g.tick').filter(function (data, index, list) {
            return index != 0 && (index != list.length - 1);
        }).append('line')
            .attr('x1', 0).attr('y1', 0.5).attr('x2', contentWidth()).attr('y2', 0.5)
            .attr('class', 'grid-line');
    }

    function renderDots() {
        _bodyG.selectAll('path').data(_data).enter().append('path')
            .on('mouseover', function (d) {
                if (_dragging) return;
                var evt = new Event('dotmouseover');
                evt.parameters = [d, d3.event.clientX, d3.event.clientY];
                window.dispatchEvent(evt);
            }).on('mouseout', function (d) {
                var evt = new Event('dotmouseout');
                evt.parameters = [d, d3.event.clientX, d3.event.clientY];
                window.dispatchEvent(evt);
            }).on('click', function (d) {
                var evt = new Event('dotclick');
                evt.parameters = [d, d3.event.clientX, d3.event.clientY];
                window.dispatchEvent(evt);
            });

        _bodyG.selectAll('path').data(_data).exit().remove();

        var countRatio = d3.scaleLinear().domain([_minCount, _maxCount]).range([50, 500]);
        _bodyG.selectAll('path').data(_data).attr('transform', function (d) {
            return 'translate(' + _x(d.x) + ', ' + _y(d.y) + ')';
        }).attr('d', function (data) {
            return (d3.symbol().type(d3['symbolCircle']).size(countRatio(data.count)))();
        }).attr('class', 'dots').attr('fill', function (d) { return d.color; })
            .attr('stroke', function (d) { return d.color });
        //filter dots ,hide all except for the first kind
        _bodyG.selectAll('path')
            .filter(function (data) {
                return data.type == typeTextArr[0].typeId;
            })
            .classed("hidden", false);
        _bodyG.selectAll('path')
            .filter(function (data) {
                return data.type != typeTextArr[0].typeId;
            })
            .classed("hidden", true);
    }

    //suliu: render legend at the bottom of the chart  
    function renderLegend() {
        _legend.selectAll(".legend-label").data(typeTextArr).remove();
        var legendLengthRatio = typeTextArr.length + 0.5;
        var legendDiv = _legend.selectAll(".legend-label").data(typeTextArr)
            .enter().append("div").attr("class", "legend-label")
            .attr("style", function (d) {
                var style = "display: inline-block;color: #666;text-align:center;height:24px;";
                return style + "margin-right:" + ((_width / legendLengthRatio < 100) ? (15 * _width / 600) : 15) + "px;";
            });

        legendDiv.append('div').attr("style", function (d) {
            var style = "display: inline-block;border-radius: 2px;width:16px;height: 16px;margin-right:4px;vertical-align:middle;";
            return style + "background-color:" + d.color + ";";

        })
            .append('img').attr('src', "selection_2.svg");
        legendDiv.append('span').attr('style', 'vertical-align:middle;')
            .text(function (d, i) {
                var labelObj = typeTextArr.find(function (item) { return item.typeId == d.typeId });
                return labelObj.typeText + " " + _totalCount[labelObj.typeId];
            })

        _legend.selectAll('.legend-label').selectAll('img').classed('showtypes', function (item) {
            return item.typeId == typeTextArr[0].typeId;
        });
        _legend.selectAll('.legend-label').selectAll('img').classed('hidetypes', function (item) {
            return item.typeId != typeTextArr[0].typeId;
        });
        _legend.selectAll('.legend-label').on('click', function (d) {
            var typeIdSelect = d.typeId;
            _legend.selectAll('.legend-label').selectAll('img').classed('showtypes', function (item) {
                return item.typeId == typeIdSelect;
            });
            _legend.selectAll('.legend-label').selectAll('img').classed('hidetypes', function (item) {
                return item.typeId != typeIdSelect;
            });

            _bodyG.selectAll('path')
                .filter(function (data) {
                    return data.type == typeIdSelect;
                })
                .classed("hidden", false);
            _bodyG.selectAll('path')
                .filter(function (data) {
                    return data.type != typeIdSelect;
                })
                .classed("hidden", true);
        })
    }

    function makeTooltipHtml(d) {
        var tpl = '<table>'
            + '<tr><td>时间：</td><td>$1</td></tr>'
            + '<tr><td>攻击次数：</td><td>$2</td></tr>'
            + '<tr><td>攻击类型：</td><td>$3</td></tr>';
        return tpl.replace('$1', d.x).replace('$2', d.count).replace('$3', d.type);
    }

    return _chart;
}

var typeIdSelect = '';

//x Axsis variable
var xAxisDotCount = 6;
var xAxisTickTextFormat = function (data, index, arr) {
    if (index == 0 || index == arr.length - 1) {
        return '';
    } else {
        var _timeFormat = d3.timeFormat('%m/%d %H:%M:%S');
        return _timeFormat(new Date(data));
    }
};
var xAxisLabel = '检测时间';
var xAxisMarginRatio = 0.3;
//y Axsis variable
var yAxisDotCount = 6;
var yAxisFormatFunction = function (data, index, arr) {
    if (index == 0 || index == arr.length) {
        return '';
    } else if (index == 1) {
        return '扫描';
    } else if (index == 2) {
        return '网络攻击';
    } else if (index == 3) {
        return '拒绝服务';
    } else if (index == 4) {
        return '网络钓鱼';
    } else if (index == 5) {
        return '垃圾邮件';
    } else if (index == 6) {
        return '恶意软件';
    }
};
var yAxisLabel = '';
var yAxisMarginRatio = 0.5;
//label related variable
var typeTextArr = [
    { typeId: 1, typeText: '低', color: "#4F8FCE" },
    { typeId: 2, typeText: '中', color: "#F5D800" },
    { typeId: 3, typeText: '高', color: "#FF9B2B" },
    { typeId: 4, typeText: '严重', color: "#FF6E6E" }];
var newWidth = null;

function updateData() {
    var max = 100;
    var now = new Date();
    var dataArr = [];

    for (var i = 0; i < max; i++) {
        var dataTemp = {
            x: now.getTime() - (max - i) * 3600 * 1000,
            count: Math.ceil(Math.random() * 100) + 28,
            y: Math.floor(Math.random() * 6 + 1),
            type: Math.floor(Math.random() * 4 + 1)
        };
        switch (dataTemp.type) {
            case 1:
                dataTemp.color = "#4F8FCE";
                break;
            case 2:
                dataTemp.color = "#F5D800";
                break;
            case 3:
                dataTemp.color = "#FF9B2B";
                break;
            case 4:
                dataTemp.color = "#FF6E6E";
                break;
            default:
                dataTemp.color = "#4F8FCE";
        }
        dataArr.push(dataTemp);
    }
    chart.data(dataArr).render();
}

var chart = ScatterChart()
    .width(800).height(300);

updateData();
