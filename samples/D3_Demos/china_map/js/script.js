(function () {
    "use strict"; // Start of use strict

    var config = {
        url: 'data/china.json',
        selector: '.d3-graph.d3-map-china',
        centerClass: 'NX',
        margin: {
            top: 15,
            right: 15,
            bottom: 15,
            left: 15
        },
        data: {
            nameField: 'abbreviation',
            valueField: 'count',
            areaField: 'province'
        },
        fill: {
            color: '#E4E4E4',
            isLinear: true,
            linearStart: '#E4E4E4',
            linearEnd: '#d50606'
        },
        border: {
            width: .5,
            opacity: 1,
            color: '#CECECE'
        },
        highlight: {
            enabled: true,
            fill: {
                color: '#F3C377',
                opacity: 1
            },
            border: {
                color: '#CCC',
                width: .5,
                opacity: .5
            }
        },
        tooltips: {
            enabled: true,
            template: function (geoData, valueData) {
                if (!valueData) {
                    valueData = {};
                    valueData[config.data.nameField] = geoData.properties[config.data.nameField];
                    valueData[config.data.valueField] = 0;
                    valueData[config.data.areaField] = geoData.properties.name;
                }
                var tmp = ''.concat(
                    '<div class="hoverinfo">',
                    '<div>省/市：',
                    valueData[config.data.areaField],
                    '</div>',
                    '<div>数量：',
                    valueData[config.data.valueField],
                    '</div>',
                    '</div>');
                return tmp;
            }
        }
    }

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
                '<filter id="map-filter">',
                '<feMorphology operator="dilate" radius="2" in="SourceGraphic" />',
                '<feColorMatrix type="matrix" values="0 0 0 0 255 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />',
                '<feGaussianBlur stdDeviation="2.5" result="coloredBlur" />',
                '<feMerge>',
                '<feMergeNode in="coloredBlur" />',
                '<feMergeNode in="SourceGraphic" />',
                '</femerge>',
                '</filter>',
                '</defs>'
            ));

        var projection = d3.geoEquirectangular();

        var path = d3.geoPath()
            .projection(projection);

        var subunits = svg.append('g')
            .attr('class', 'subunits');

        drawSubUnits(data);

        handleListeners();

        drawDataInfo();

        function drawSubUnits(data) {
            var geoData = data.features;

            subunits.selectAll('path.subunit')
                .data(geoData)
                .enter()
                .append('path')
                .attr('d', path)
                .attr('class', function (d) {
                    return 'subunit ' + d.properties[config.data.nameField];
                })
                .style('fill', config.fill.color)
                .style('stroke', config.border.color)
                .style('stroke-width', config.border.width)
                .style('stroke-opacity', config.border.opacity);

            transformMap();
        }

        function zoomed() {
            subunits.selectAll('path.subunit').attr("transform", d3.event.transform.toString());
        }

        function transformMap() {
            var centerDom = svg.select('path.' + config.centerClass).node();
            var centerRect = centerDom.getBoundingClientRect();

            var containerRect = containerEl.getBoundingClientRect();

            var translateX = (centerRect.left + centerRect.width / 2) - (containerRect.left + containerRect.width / 2);
            var translateY = (centerRect.top + centerRect.height / 2) - (containerRect.top + containerRect.height / 2);

            var gRect = subunits.node().getBoundingClientRect();

            var scale = Math.floor(height / gRect.height);

            var zoom = d3.zoom()
                .on("zoom", zoomed);

            zoom.translateBy(subunits, (-translateX), (-translateY));
            zoom.scaleTo(subunits, scale);

            subunits.call(zoom);
        }

        function handleListeners() {
            if (config.highlight.enabled) {
                svg.selectAll('.subunit')
                    .on('mouseover', function (d) {
                        onSubunitMouseOverHandler(d3.select(this), d);
                    })
                    .on('mouseout', function (d) {
                        onSubunitMouseOutHandler(d3.select(this));
                    })
            }

            if (config.tooltips.enabled) {
                d3.select(svg.node().parentNode)
                    .append('div')
                    .attr('class', 'hoverover')
                    .style('z-index', 9999)
                    .style('display', 'none')
                    .style('position', 'fixed')
            }
        }

        function onSubunitMouseOverHandler(selection, data) {
            var previousAttributes = {
                'fill': selection.style('fill'),
                'fill-opacity': selection.style('fill-opacity'),
                'stroke': selection.style('stroke'),
                'stroke-width': selection.style('stroke-width'),
                'stroke-opacity': selection.style('stroke-opacity')
            };
            selection.style('fill', config.highlight.fill.color)
                .style('fill-opacity', config.highlight.fill.opacity)
                .style('stroke', config.highlight.border.color)
                .style('stroke-width', config.highlight.border.width)
                .style('stroke-opacity', config.highlight.border.opacity)
                .attr('data-previousAttributes', JSON.stringify(previousAttributes));

            if (config.tooltips.enabled) {
                showTooltips(selection, data);
            }
        }

        function showTooltips(selection, data) {
            var dataInfo = JSON.parse(selection.attr('data-info'));
            selection.on('mousemove', function () {
                d3.select(svg.node().parentNode)
                    .select('.hoverover')
                    .style('top', (d3.event.y + 30) + 'px')
                    .style('left', (d3.event.x - 50) + 'px')
                    .style('display', 'block')
                    .html(config.tooltips.template(data, dataInfo));
            })
        }

        function onSubunitMouseOutHandler(selection) {
            var previousAttributes = JSON.parse(selection.attr('data-previousAttributes'));
            for (var attr in previousAttributes) {
                selection.style(attr, previousAttributes[attr]);
            }
            selection.on('mousemove', null);
            d3.select('.hoverover').style('display', 'none');
        }

        function drawDataInfo() {
            d3.json('data/data.json', function (error, data) {
                if (error) throw error;

                var linear, computeColor;
                if (config.fill.isLinear) {
                    var maxValue = d3.max(data.items, function (d) { return d[config.data.valueField]; });
                    var minValue = 0;

                    linear = d3.scaleLinear()
                        .domain([minValue, maxValue])
                        .range([0, 1]);
                    computeColor = d3.interpolate(config.fill.linearStart, config.fill.linearEnd);
                }

                var geo = svg.selectAll('path.subunit');
                geo.attr('data-info', function (d) {
                    var dataInfo = data.items.filter(function (item) {
                        if (item[config.data.nameField].toLowerCase() == d.properties[config.data.nameField].toLowerCase()) {
                            return item;
                        }
                    });
                    return JSON.stringify(dataInfo[0]);
                })
                    .style('fill', function (d) {
                        var t = 0, color;
                        var dataInfo = data.items.filter(function (item) {
                            if (item[config.data.nameField].toLowerCase() == d.properties[config.data.nameField].toLowerCase()) {
                                return item;
                            }
                        });
                        if (config.fill.isLinear && dataInfo.length > 0) {
                            color = computeColor(linear(dataInfo[0][config.data.valueField]));
                        }
                        color = color || config.fill.color;
                        return color;
                    });
            })
        }

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