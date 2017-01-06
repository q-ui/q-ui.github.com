(function () {
    "use strict"; // Start of use strict

    var config = {
        url: 'data/data.json',
        selector: '.d3-graph.d3-chart-pie',
        duration: 1500,
        delay: 500,
        margin: {
            top: 15,
            right: 15,
            bottom: 15,
            left: 15
        },
        data: {
            valueField: 'value',
            colorField: 'color',
            msgField: 'description'
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
            .attr('height', height)
            .html(''.concat(
                '<defs>',
                '<filter id="pieChartInsetShadow">',
                '<feOffset dx="0" dy="0" />',
                '<feGaussianBlur stdDeviation="3" result="offset-blur" />',
                '<feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />',
                '<feFlood flood-color="black" flood-opacity="1" result="color" />',
                '<feComposite operator="in" in="color" in2="inverse" result="shadow" />',
                '<feComposite operator="over" in="shadow" in2="SourceGraphic" />',
                '</filter><defs>',
                '<filter id="pieChartDropShadow">',
                '<feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />',
                '<feOffset in="blur" dx="0" dy="3" result="offsetBlur" />',
                '<feMerge>',
                '<feMergeNode />',
                '<feMergeNode in="SourceGraphic" />',
                '</feMerge>',
                '</filter>',
                '</defs>'
            ));

        var pie = svg.append('g')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        var detailedInfo = svg.append('g')
            .attr('class', 'pieChart--detailedInformation');

        var twoPi = 2 * Math.PI;
        var pieData = d3.pie()
            .value(function (d) {
                return d[config.data.valueField];
            });

        var radius = height / 2;
        var arc = d3.arc()
            .outerRadius(radius - 20)
            .innerRadius(0);

        var pieChartPieces = pie.datum(data)
            .selectAll('path')
            .data(pieData)
            .enter()
            .append('path')
            .attr('class', function (d) {
                return 'pieChart__' + d.data[config.data.colorField];
            })
            .attr('filter', 'url(#pieChartInsetShadow)')
            .attr('d', arc)
            .each(function () {
                this._current = { startAngle: 0, endAngle: 0 };
            })
            .transition()
            .duration(config.duration)
            .attrTween('d', function (d) {
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);

                return function (t) {
                    return arc(interpolate(t));
                };
            })
            .on('end', function (d) {
                drawDetailedInformation(d.data, this);
            });

        drawChartCenter();

        function drawChartCenter() {
            var centerContainer = pie.append('g')
                .attr('class', 'pieChart--center');

            centerContainer.append('circle')
                .attr('class', 'pieChart--center--outerCircle')
                .attr('r', 0)
                .attr('filter', 'url(#pieChartDropShadow)')
                .transition()
                .duration(config.duration)
                .delay(config.delay)
                .attr('r', radius * 0.3);

            centerContainer.append('circle')
                .attr('id', 'pieChart-clippy')
                .attr('class', 'pieChart--center--innerCircle')
                .attr('r', 0)
                .transition()
                .delay(config.delay)
                .duration(config.duration)
                .attr('r', radius * 0.3 - 5)
                .attr('fill', '#fff');
        }

        function drawDetailedInformation(data, element) {
            var bBox = element.getBBox(),
                infoWidth = width * 0.3,
                anchor,
                infoContainer,
                position;

            if ((bBox.x + bBox.width / 2) > 0) {
                infoContainer = detailedInfo.append('g')
                    .attr('width', infoWidth)
                    .attr('transform', 'translate(' + (width - infoWidth) + ',' + (bBox.height + bBox.y) + ')');
                anchor = 'end';
                position = 'right';
            } else {
                infoContainer = detailedInfo.append('g')
                    .attr('width', infoWidth)
                    .attr('transform', 'translate(' + 0 + ',' + (bBox.height + bBox.y + 50) + ')');
                anchor = 'start';
                position = 'left';
            }

            infoContainer.data([data[config.data.valueField] * 100])
                .append('text')
                .text('0 %')
                .attr('class', 'pieChart--detail--percentage')
                .attr('x', (position === 'left' ? 0 : infoWidth))
                .attr('y', -10)
                .attr('text-anchor', anchor)
                .transition()
                .duration(config.duration)
                .tween('text', function (d) {
                    var self = d3.select(this);
                    var i = d3.interpolateRound(+self.text().replace(/\s%/ig, ''), d);
                    return function (t) {
                        self.text(i(t) + ' %');
                    };
                });

            infoContainer.append('line')
                .attr('class', 'pieChart--detail--divider')
                .attr('x1', 0)
                .attr('x2', 0)
                .attr('y1', 0)
                .attr('y2', 0)
                .transition()
                .duration(config.duration)
                .attr('x2', infoWidth);

            infoContainer.data([data[config.data.msgField]])
                .append('foreignObject')
                .attr('width', infoWidth)
                .attr('height', 100)
                .append('xhtml:body')
                .attr('class', 'pieChart--detail--textContainer ' + 'pieChart--detail__' + position)
                .html(data[config.data.msgField]);
        };

        window.onresize = function () {
            drawGraph();
        }
    }

    function drawGraph() {
        d3.json(config.url, function (error, data) {
            if (error) throw error;
            drawDetailGraph(data.pieChart);
        })
    }

    drawGraph();
})();