(function() {
    "use strict";

    var config = {
        url_parent: 'data/data_parent.json',
        url_child: 'data/data_child.json',
        selector: '.d3-graph.d3-multi-pie-chart',
        margin: { top: 20, right: 20, bottom: 20, left: 20 },
        data: {
            valueField: 'value',
            messageField: 'message',
            percentage: 'percentage'
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
            .on('click', onHeaderButtonClickHandler)
        var message = header.append('div')
            .attr('class', 'pie-header-message');
        var svg = container.append('svg')
            .attr('width', width)
            .attr('height', height)
            .html(''.concat(
                '<defs>',
                '<filter id="filter-1">',
                '<feColorMatrix in="SourceGraphic type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 .6 0" />',
                '</filter>',
                '<filter id="filter-2">',
                '<feColorMatrix in="SourceGraphic type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 .8 0" />',
                '</filter>',
                '<filter id="filter-3">',
                '<feColorMatrix in="SourceGraphic type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" />',
                '</filter>',
                '<filter id="filter-hover">',
                '<feMorphology operator="dilate" radius="5" in="SourceGraphic" />',
                '<feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 .5 0" />',
                '<feGaussianBlur stdDeviation="5" result="coloredBlur" />',
                // '<feMerge>',
                // '<feMergeNode in="coloredBlur" />',
                // '<feMergeNode in="SourceGraphic" />',
                // '</femerge>',
                '</filter>',
                '</defs>'
            ));

        // Todo Start: Add Codes Here
        var circleCenter = { x: width * 0.4, y: height * 0.5 };
        var outerRadius = height / 3;
        var middleRadius = height / 6;
        var innerRadius = 1;

        var selectedData = null;
        var lastTextPoint = { x: 0, y: 0, position: '' };

        var color = d3.scaleOrdinal(d3.schemeCategory10);
        var innerPie = d3.pie()
            .value(function(d) {
                return d[config.data.valueField];
            })
            .sortValues(function(a, b) {
                return b - a;
            });
        var innerArc = d3.arc()
            .outerRadius(middleRadius)
            .innerRadius(innerRadius);

        var outerArc = d3.arc()
            .outerRadius(outerRadius)
            .innerRadius(middleRadius + 1);
        var outerPie = d3.pie()
            .value(function(d) {
                return d[config.data.valueField];
            })
            .sortValues(function(a, b) {
                return b - a;
            });

        var gGraph = svg.append('g')
            .attr('class', 'graph')
            .attr('transform', 'translate(' + circleCenter.x + ',' + circleCenter.y + ')');

        var tooltipPanel = container.append('div')
            .attr('class', 'hs-tooltip')
            .style('position', 'absolute')
            .style('display', 'none')
            .style('z-Index', 9999)
            .on('mouseout', function() {
                if (!isMouseInTooltip(d3.event.toElement))
                    hideToolTips();
            });

        redrawGraph(data);

        function redrawGraph(data) {
            // 刷新图形顶部文字
            drawHeader();
            // 绘制饼图
            drawPie(data.items);
            // 绘制右下角图例
            drawLegend(data.items);
        }

        function clearGraph() {
            if (svg) {
                // clear Outer Text
                svg.selectAll('g.outer-text').remove();
                // clear Inner Text
                svg.selectAll('g.inner-text').remove();
                // clear Legend
                svg.selectAll('g.legend').remove();
                // clear Pie
                svg.selectAll('g.graph').html('');
            }
        }

        function drawHeader() {
            title.text(selectedData ? '最近一个月威胁子类型分布' : '最近一个月威胁类型分布');
            button.text('威胁类型：' + (selectedData ? selectedData.data[config.data.messageField] : ''));
            button.style('display', (selectedData ? 'block' : 'none'));
            message.text('攻击次数：' + (selectedData ? selectedData.data[config.data.valueField] : data[config.data.valueField]));
        }

        function drawPie(data) {
            innerPie.startAngle(0)
                .endAngle(2 * Math.PI)
                .padAngle(.01);

            gGraph.selectAll('path.inner-pie')
                .data(innerPie(data))
                .enter()
                .append('path')
                .attr('class', function(d, i) {
                    return 'inner-pie index-' + i;
                })
                .attr('d', innerArc)
                .style('fill', function(d, i) {
                    return color(i);
                })
                .on('mouseover', onPieMouseOverHandler)
                .on('mouseout', onPieMouseOutHandler)
                .each(function(d, i) {
                    drawInnerText(d, this);
                    drawOuterPie(d, i);
                });
        }

        function drawOuterPie(data, innerIndex) {
            outerPie.startAngle(data.startAngle)
                .endAngle(data.endAngle)
                .padAngle(.005);
            gGraph.selectAll('path.outer-pie-' + innerIndex)
                .data(outerPie(data.data.children))
                .enter()
                .append('path')
                .attr('class', function(d, i) {
                    return 'outer-pie index-' + innerIndex + ' filter-' + (i + 1);
                })
                .attr('d', outerArc)
                .style('fill', color(innerIndex))
                .on('mouseover', onPieMouseOverHandler)
                .on('mouseout', onPieMouseOutHandler)
                .each(function(d) {
                    drawOuterText(d, this, innerIndex);
                })
        }

        function onPieMouseOverHandler(d, i) {
            var selection = d3.select(this);
            fanEmphasize(selection);
        }

        function fanEmphasize(selection) {
            selection.style('filter', 'url(#filter-hover)');
            showToolTips(selection);
        }

        function onPieMouseOutHandler(d, i) {
            var selection = d3.select(this);
            fanUnemphasize(selection);
        }

        function fanUnemphasize(selection) {
            selection.style('filter', null);
            if (!isMouseInTooltip(d3.event.toElement))
                hideToolTips();
        }

        function isMouseInTooltip(dom) {
            function isChildElement(element) {
                if (element == null || element.nodeName == 'body' || element.classList == null) {
                    return false;
                } else if (element.classList.contains('hs-tooltip')) {
                    return true;
                } else if (element.parentNode) {
                    return isChildElement(element.parentNode);
                } else {
                    return false;
                }
            }
            return isChildElement(dom);
        }

        function showToolTips(selection) {
            var rect = containerEl.getBoundingClientRect();
            var data = selection.data()[0];
            tooltipPanel.style('display', 'block')
                .style('left', (d3.event.clientX - rect.left + 5) + 'px')
                .style('top', (d3.event.clientY - rect.top + 5) + 'px')
                .html(''.concat(
                    '<div class="tooltip-container">',
                    '<div>',
                    data.data[config.data.messageField],
                    '</div>',
                    '<div>',
                    '攻击次数：<b>',
                    data.data[config.data.valueField],
                    ' (' + data.data[config.data.percentage] + ')',
                    '</b></div>',
                    selectedData ? '' : '<div><b><a class="linkSubThreat">查看威胁子类型</a></b></div>',
                    '<div><b><a class="linkDetail">详细信息</a></b></div>',
                    '</div>'
                ));

            tooltipPanel.select('.linkSubThreat')
                .on('click', function() {
                    gotoSubThreat(selection);
                });

            tooltipPanel.select('.linkDetail')
                .on('click', function() {
                    gotoDetail(data);
                })
        }

        function hideToolTips() {
            tooltipPanel.style('display', 'none');
        }

        function onHeaderButtonClickHandler() {
            selectedData = null;
            d3.json(config.url_parent, function(error, data) {
                if (error) throw error;
                clearGraph();
                hideToolTips();
                redrawGraph(dataProcessed(data));
            })
        }

        function findInnerSelection(selection) {
            var dom = selection.node();
            if (dom.classList.contains('outer-pie')) {
                var i = dom.classList.value.match(/index-(.)/)[1];
                selection = svg.select('path.inner-pie.index-' + i);
            }
            return selection;
        }

        function gotoSubThreat(selection) {
            // 设置选中子项
            selectedData = findInnerSelection(selection).data()[0];
            // 请求子威胁数据
            d3.json(config.url_child, function(error, data) {
                if (error) throw error;
                clearGraph();
                hideToolTips();
                redrawGraph(dataProcessed(data));
            })
        }

        function gotoDetail(data) {
            console.log(data.data[config.data.messageField]);
        }

        function drawInnerText(data, element) {
            var fanCenter = findFanCenterPoint(circleCenter, middleRadius, (data.startAngle + data.endAngle) / 2);
            var infoContainer = svg.append('g')
                .attr('class', 'inner-text');

            // 如果角度太小，则不显示该内容
            if ((data.endAngle - data.startAngle) >= 30 / 360 * 2 * Math.PI) {
                infoContainer.append('text')
                    .attr('x', fanCenter.x)
                    .attr('y', fanCenter.y)
                    .attr('dy', '.3em')
                    .attr('text-anchor', 'middle')
                    .text(data.data[config.data.messageField]);
            }
        }

        function drawOuterText(data, element, innerIndex) {
            var position = findPosition(element);
            var startAngle = data.startAngle;
            var endAngle = data.endAngle;

            var anchor;
            if (position.indexOf('east') > -1) {
                anchor = 'start';
            } else if (position.indexOf('west') > -1) {
                anchor = 'end';
            } else {
                anchor = 'middle';
            }

            // 获取当前弧形的中心点坐标
            var fanCenterPoint = findFanCenterPoint(circleCenter, outerRadius, (startAngle + endAngle) / 2);
            // 获取当前弧形中心点延伸点坐标
            var fanConnectPoint = findFanCenterPoint(circleCenter, (outerRadius + 10), (startAngle + endAngle) / 2);
            // 获取当前文字所在的点坐标
            var fanOuterTextPoint = findOuterTextPoint(circleCenter, startAngle, endAngle, position);

            if (fanOuterTextPoint.x != 0 && fanOuterTextPoint.y != 0) {
                // 如果文字在1.5倍半径的圆以内，则绘制该文字及连线，否则放弃该文字
                lastTextPoint = {
                    x: fanOuterTextPoint.x,
                    y: fanOuterTextPoint.y,
                    position: fanOuterTextPoint.position
                };

                // 包含外部所有图形的组
                var infoContainer = svg.append('g')
                    .attr('class', 'outer-text');

                // 绘制弧形中心点到延伸点的连接线
                infoContainer.append('line')
                    .attr('x1', fanCenterPoint.x)
                    .attr('y1', fanCenterPoint.y)
                    .attr('x2', fanConnectPoint.x)
                    .attr('y2', fanConnectPoint.y)
                    .attr('class', function(d, i) {
                        return 'filter-' + (i + 1);
                    })
                    .style('stroke', color(innerIndex))
                    .style('stroke-width', 2);

                // 绘制延伸点到文字坐标点的连接线
                infoContainer.append('line')
                    .attr('x1', fanConnectPoint.x)
                    .attr('y1', fanConnectPoint.y)
                    .attr('x2', fanOuterTextPoint.x)
                    .attr('y2', fanOuterTextPoint.y)
                    .attr('class', function(d, i) {
                        return 'filter-' + (i + 1);
                    })
                    .style('stroke', color(innerIndex))
                    .style('stroke-width', 2);

                // 绘制文字
                infoContainer.append('text')
                    .attr('x', fanOuterTextPoint.x)
                    .attr('y', fanOuterTextPoint.y)
                    .attr('dx', anchor == 'start' ? '.5em' : '-.5em')
                    .attr('dy', '.3em')
                    .attr('text-anchor', anchor)
                    .text(data.data[config.data.messageField])
                    .attr('fill', color(innerIndex));
            }
        }

        function findOuterTextPoint(circleCenter, startAngle, endAngle, position) {
            var textPoint = findFanCenterPoint(circleCenter, (outerRadius * 1.5), (startAngle + endAngle) / 2);
            var textAngle = 0,
                criticalScale = 1.2,
                fontsize = 14,
                fontDelta = 0,
                criticalDelta = 0;

            // 是否超出顶部/底部范围
            var isOutRange = Math.abs(textPoint.y - circleCenter.y) > (outerRadius * criticalScale);
            // 前一个点是否超出顶部/底部范围
            var isLastOutRange = lastTextPoint.position && (Math.abs(lastTextPoint.y - circleCenter.y) > (outerRadius * criticalScale));

            if (position.indexOf('east') > -1) {
                fontDelta = fontsize;
            }
            if (position.indexOf('west') > -1) {
                fontDelta = -fontsize;
            }
            if (position.indexOf('north') > -1) {
                criticalDelta = -(outerRadius * criticalScale);
            }
            if (position.indexOf('south') > -1) {
                criticalDelta = (outerRadius * criticalScale);
            }
            // 判断当前点是否超出顶部/底部范围
            if (isOutRange) {
                if (isLastOutRange) {
                    // 如果前一个点超出了顶部/底部范围，则移动到其上方/下方
                    textAngle = findTextAngle((lastTextPoint.y + fontDelta), circleCenter, position);
                } else {
                    // 如果前一个点未超出顶部/底部范围，则移动到临界点
                    textAngle = findTextAngle((circleCenter.y + criticalDelta), circleCenter, position);
                }
                // 找到对应的点
                textPoint = findFanCenterPoint(circleCenter, (outerRadius * 1.5), textAngle);
            }
            // 判断是否与前一个点文字重叠
            if ((Math.abs(textPoint.y - lastTextPoint.y) < fontsize) && (lastTextPoint.position == position)) {
                // 如果与前一个点发生重叠，则移动到其上方/下方
                textAngle = findTextAngle((lastTextPoint.y + fontDelta), circleCenter, position);
                textPoint = findFanCenterPoint(circleCenter, (outerRadius * 1.5), textAngle);
            }
            textPoint.position = position;
            return textPoint;
        }

        function findTextAngle(yValue, circleCenter, position) {
            var maxScale = 1.4;
            if (Math.abs(circleCenter.y - yValue) >= outerRadius * maxScale) {
                return -1;
            }
            if (position.indexOf('east') > -1) {
                return Math.acos((circleCenter.y - yValue) / (outerRadius * 1.5));
            } else if (position.indexOf('west') > -1) {
                return Math.PI * 2 - Math.acos((circleCenter.y - yValue) / (outerRadius * 1.5));
            }
        }

        function onTextMouseOverHandler(d, i) {

        }

        function onTextMouseOutHandler(d, i) {

        }

        function findPosition(element) {
            var bBox = element.getBBox();

            var xValue = bBox.x + bBox.width / 2;
            var yValue = bBox.y + bBox.height / 2;

            if (xValue > 0) {
                // right
                if (yValue < 0) {
                    // top
                    return 'northeast';
                } else if (yValue == 0) {
                    // middle
                    return 'middleeast';
                } else {
                    // bottom
                    return 'southeast';
                }
            } else if (xValue == 0) {
                // center
                if (yValue < 0) {
                    // top
                    return 'northcenter';
                } else if (yValue == 0) {
                    // middle
                    return null;
                } else {
                    // bottom
                    return 'southcenter';
                }
            } else {
                // left
                if (yValue < 0) {
                    // top
                    return 'northwest';
                } else if (yValue == 0) {
                    // middle
                    return 'middlewest';
                } else {
                    // bottom
                    return 'southwest';
                }
            }
        }

        function drawLegend(data) {
            var legend = svg.selectAll('g.legend')
                .data(data)
                .enter()
                .append('g')
                .attr('class', 'legend')
                .attr('transform', function(d, i) {
                    var length = data.length;
                    return 'translate(' + (width - 150) + ',' + (height - (length - i + 1) * 25) + ')';
                });

            legend.append('rect')
                .attr('width', 20)
                .attr('height', 20)
                .style('fill', function(d, i) {
                    return color(i);
                });

            legend.append('text')
                .attr('transform', function(d, i) {
                    return 'translate(25,15)';
                })
                .text(function(d) {
                    return d[config.data.messageField] + ': ' + d[config.data.valueField];
                })
        }

        function findFanCenterPoint(circleCenter, radius, centerAngle) {
            if (centerAngle == -1) {
                return { x: 0, y: 0 };
            } else {
                var fanCenter = {};
                fanCenter.x = circleCenter.x + Math.sin(centerAngle) * radius;
                fanCenter.y = circleCenter.y - Math.cos(centerAngle) * radius;
                return fanCenter;
            }
        }

        // Todo End

        window.onresize = function() {
            drawGraph();
        }
    }

    // Todo Start: Add Codes Here
    function dataSort(data) {
        if (data instanceof Array) {
            for (var i = 0; i < data.length; i++) {
                for (var j = i + 1; j < data.length; j++) {
                    if (data[j][config.data.valueField] > data[i][config.data.valueField]) {
                        data[i] = data.splice(j, 1, data[i])[0];
                    }
                }
            }
        }
        return data;
    }

    // Todo End

    function dataProcessed(data) {
        // Todo Start: Add Codes Here
        var tmp = 0;
        var subTotal = 0;
        data.items = dataSort(data.items);
        var total = d3.sum(data.items, function(item) {
            item.children = dataSort(item.children);
            subTotal = d3.sum(item.children, function(child) {
                return +child[config.data.valueField];
            });
            item.children.forEach(function(child) {
                tmp = (+child[config.data.valueField]) / subTotal;
                child[config.data.percentage] = ((tmp * 100).toFixed(1) + '%');
            });
            return +item[config.data.valueField];
        });
        data.items.forEach(function(item) {
            tmp = (+item[config.data.valueField]) / total;
            item[config.data.percentage] = ((tmp * 100).toFixed(1) + '%');
        });
        // Todo End

        return data;
    }

    function drawGraph() {
        d3.json(config.url_parent, function(error, data) {
            if (error) throw error;

            data = dataProcessed(data);

            drawDetailGraph(data);
        })
    }

    drawGraph();
})();