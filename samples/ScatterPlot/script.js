function ScatterChart() {
    var _chart = {};

    var _padding = {
        top: 30,
        right: 60,
        bottom: 110,
        left: 60
    },
        _legendbottom = 30,   //area for legend in Method 2  
        _legendright = 100;  //area for legend in Method 1  ;

    var _width, _height;

    var _initialized = false;

    var _svg;

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

    _chart.width = function (w) {
        if (!arguments.length) return _width;
        _width = w;
        return _chart;
    };

    _chart.height = function (h) {
        if (!arguments.length) return _height;
        _height = h;
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
            for (var i = 0; i < d.length; i++) {
                if (_xStartValue > d[i].x)
                    _xStartValue = d[i].x;
                if (d[i].x > _xEndValue)
                    _xEndValue = d[i].x;
                //做其他数据准备工作
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
        var delta = (_xEndValue - _xStartValue) / (xAxisDotCount - 1);
        var tickValus = [];
        for (var i = 0; i < (xAxisDotCount + 2); i++) {
            tickValus.push(_xStartValue - xAxisMarginRatio * delta + i * delta + ((i > 0) ? (xAxisMarginRatio - 1) * delta : 0) + ((i == xAxisDotCount + 1) ? (xAxisMarginRatio - 1) * delta : 0));
        }

        _x = d3.scaleLinear().domain([_xStartValue - xAxisMarginRatio * delta, _xEndValue + xAxisMarginRatio * delta]).range([startX(), startX() + contentWidth()]);
        var _xAxis = d3.axisBottom().tickSize(0).tickPadding(10).tickValues(tickValus).tickFormat(xAxisTickTextFormat).scale(_x);
        _xAxisG.call(_xAxis).attr('transform', 'translate(0, ' + startY() + ')');
        _xAxisG.append('text')
            .attr('class', 'axislabel')
            .attr('text-anchor', 'end')
            .attr('x', (_width - _padding.left - _padding.right) / 2 + _padding.left)
            .attr('y', 50)
            .text(xAxisLabel);
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
        _yAxisG.append('text')
            .text(yAxisLabel)
            .attr('class', 'axislabel')
            .attr('text-anchor', 'end')
            .attr('x', -(_height - _padding.bottom) / 2)
            .attr('y', -(_padding.left) / 2)
            .attr('transform', 'rotate(-90)');
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

                var tooltipDom = _tooltipDiv.nodes()[0];
                tooltipDom.innerHTML = makeTooltipHtml(d);

                var svgDom = _svg.nodes()[0];

                _tooltipDiv.attr('style', function () {
                    var tooltipWidth = tooltipDom.getBoundingClientRect().width;
                    var svgRect = svgDom.getBoundingClientRect();

                    var left = d3.event.clientX + 20;
                    if (d3.event.clientX + 20 + tooltipWidth > svgRect.right) {
                        left = svgRect.right - tooltipWidth;
                    }

                    return 'left: ' + left + 'px; '
                        + 'top: ' + (d3.event.clientY + 20) + 'px';
                }).classed('hidden', false);
            }).on('mouseout', function (d) {
                _tooltipDiv.classed('hidden', true);
            }).on('click', function (d) {
                console.log('You click ' + JSON.stringify(d));
            });

        _bodyG.selectAll('path').data(_data).exit().remove();

        _bodyG.selectAll('path').data(_data).attr('transform', function (d) {
            return 'translate(' + _x(d.x) + ', ' + _y(d.y) + ')';
        }).attr('d', function (data) {
            var typeObj = typesObjArr.find(function (typeObj) { return typeObj.typeId == data.type });
            return (d3.symbol().type(typeObj.type).size(data.count))();
        }).attr('class', function (data) {
            var classes = 'dots ';
            if (data.y == 1) {
                classes += 'low';
            } else if (data.y == 2) {
                classes += 'mid';
            } else if (data.y == 3) {
                classes += 'high';
            } else if (data.y == 4) {
                classes += 'serious';
            }
            return classes;
        });
    }

    //suliu: render legend at the bottom of the chart  
    function renderLegend() {
        _svg.selectAll(".legend")
            .data(typeTextArr)
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                var legendX = (_width - _padding.right) - (typeTextArr.length - i) * 100;   //set position for each legend element  
                var legendY = _height - _legendbottom;
                return "translate(" + legendX + ", " + legendY + ")";
            })
            .append('path')
            .attr('d', function (d, i) {
                return (d3.symbol().type(typesObjArr.find(function (item) { return item.typeId == d.typeId; }).type).size(100))();
            })
            .attr("class", "showtypes")
            .on('click', function (d) {
                // console.log('You click ' + JSON.stringify(d));
                typeIdSelect = d.typeId;
                if (d3.select(this).classed("hidetypes")) {
                    d3.select(this).classed("hidetypes", false);
                    d3.select(this).classed("showtypes", true);

                    _bodyG.selectAll('path')
                        .filter(function (data) {
                            return data.type == typeIdSelect;
                        })
                        .classed("hidden", false);
                } else {
                    d3.select(this).classed("hidetypes", true);
                    d3.select(this).classed("showtypes", false);

                    _bodyG.selectAll('path')
                        .filter(function (data) {
                            return data.type == typeIdSelect;
                        })
                        .classed("hidden", true);
                }
            });

        d3.selectAll(".legend").data(typeTextArr).append("text")
            .attr("x", 12)
            .attr("y", 5)
            .classed("legendtext", true)
            .text(function (d, i) {
                return typeTextArr.find(function (item) { return item.typeId == d.typeId }).typeText;
            });
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

var ka = 0.89081309152928522810;
var kr = Math.sin(3.141592653589793 / 10) / Math.sin(7 * 3.141592653589793 / 10);
var kx = Math.sin(6.283185307179586 / 10) * kr;
var ky = -Math.cos(6.283185307179586 / 10) * kr;
var pentagon = {
    draw: function (context, size) {
        var r = Math.sqrt(size * ka),
            x = kx * r,
            y = ky * r;
        context.moveTo(0, -r);
        for (var i = 1; i < 5; ++i) {
            var a = 6.283185307179586 * i / 5,
                c = Math.cos(a),
                s = Math.sin(a);
            context.lineTo(s * r, -c * r);
        }
        context.closePath();
    }
};
var sqrt3 = Math.sqrt(3);
var inversetriangle = {
    draw: function (context, size) {
        var y = -Math.sqrt(size / (sqrt3 * 3));
        context.moveTo(0, -(y * 2));
        context.lineTo(-sqrt3 * y, y);
        context.lineTo(sqrt3 * y, y);
        context.closePath();
    }
};
var typesObjArr = [{ typeId: 0, type: inversetriangle },
{ typeId: 1, type: d3['symbolStar'] },
{ typeId: 2, type: d3['symbolSquare'] },
{ typeId: 3, type: d3['symbolDiamond'] },
{ typeId: 4, type: d3['symbolCircle'] },
{ typeId: 5, type: pentagon }];
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
var yAxisDotCount = 4;
var yAxisFormatFunction = function (data, index, arr) {
    if (index == 0 || index == arr.length) {
        return '';
    } else if (index == 1) {
        return '低';
    } else if (index == 2) {
        return '中';
    } else if (index == 3) {
        return '高';
    } else if (index == 4) {
        return '严重';
    }
};
var yAxisLabel = '级别';
var yAxisMarginRatio = 0.5;
//label related variable
var typeTextArr = [
    { typeId: 0, typeText: '扫描' },
    { typeId: 1, typeText: '网络攻击' },
    { typeId: 2, typeText: '拒绝服务' },
    { typeId: 3, typeText: '网络钓鱼' },
    { typeId: 4, typeText: '垃圾邮件' },
    { typeId: 5, typeText: '恶意软件' }];
//random data source
var typesDataSource = [inversetriangle, d3['symbolStar'], d3['symbolSquare'], d3['symbolDiamond'], d3['symbolCircle'], pentagon];


function updateData() {
    var max = 100;
    var now = new Date();
    var dataArr = [];

    for (var i = 0; i < max; i++) {
        dataArr.push({
            x: now.getTime() - (max - i) * 3600 * 1000,
            count: Math.ceil(Math.random() * 100) + 28,
            type: Math.floor(Math.random() * typesDataSource.length),
            y: Math.floor(Math.random() * 4 + 1)
        });
    }
    chart.data(dataArr).render();
}

var chart = ScatterChart()
    .width(800).height(300);

updateData();
