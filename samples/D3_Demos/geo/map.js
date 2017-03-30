function Map() {
    var _map = {};
    var _container;
    var _svg, _controlBar;
    var _w, _h;
    var _nameField = '';
    var _subunits;
    var _zoom;
    var _scaleExtent;
    var _initialTranslate;

    _map.nameField = function (field) {
        if (arguments.length == 0) {
            return _nameField;
        }
        _nameField = field;
        return _map;
    };

    _map.container = function (container) {
        if (arguments.length == 0) {
            return _container;
        }
        _container = d3.select(container);
        return _map;
    };

    _map.width = function (w) {
        if (arguments.length == 0) {
            return _container;
        }
        _w = w;
        return _map;
    };

    _map.height = function (h) {
        if (arguments.length == 0) {
            return _container;
        }
        _h = h;
        return _map;
    };

    _map.draw = function (data) {
        if (!_svg) {
            _svg = _container.append('svg');
            initControlBar();
        }
        _svg.html('');
        _svg.attr('width', _w).attr('height', _h);

        drawMap(data);
    };

    function initControlBar() {
        _controlBar = _container.append('div').attr('class', 'control-bar');
        _controlBar.append('img').attr('class', 'zoom-in').attr('src', 'images/map-zoomin.png');
        _controlBar.append('img').attr('class', 'zoom-out').attr('src', 'images/map-zoomout.png');
        _controlBar.append('img').attr('class', 'center').attr('src', 'images/map-center.png');
        _controlBar.selectAll('img').on('click', function () {
            var img = d3.select(this);
            if (img.attr('class') == 'zoom-in') {
                _zoom.scaleBy(_subunits, 1.1);
            } else if (img.attr('class') == 'zoom-out') {
                _zoom.scaleBy(_subunits, .9);
            } else {
                _zoom.transform(_subunits, d3.zoomIdentity);
                _zoom.translateBy(_subunits, _initialTranslate.x, _initialTranslate.y);
                _zoom.scaleTo(_subunits, _scaleExtent[0]);
            }
        });
    }

    function drawMap(data) {
        var projection = d3.geoEquirectangular();
        var path = d3.geoPath().projection(projection);
        _subunits = _svg.append('g').attr('class', 'subunits');
        var geoData = data.features;
        _subunits.selectAll('path.subunit')
            .data(geoData)
            .enter()
            .append('path')
            .attr('vector-effect', 'non-scaling-stroke')
            .attr('class', function (d) {
                return 'subunit ' + d.properties[_nameField];
            })
            .attr('d', path)
            .style('fill', '#FFF')
            .style('stroke', '#000');
        transformMap();
    }

    function transformMap() {
        var centerRect = _subunits.node().getBoundingClientRect();
        var containerRect = _container.node().getBoundingClientRect();

        _initialTranslate = {};
        _initialTranslate.x = - ((centerRect.left + centerRect.width / 2) - (containerRect.left + containerRect.width / 2));
        _initialTranslate.y = - ((centerRect.top + centerRect.height / 2) - (containerRect.top + containerRect.height / 2));

        var scale = _w / centerRect.width;
        if (scale > 1) {
            scale = Math.floor(_w / centerRect.width);
        }
        _subunits.insert('rect', 'path').attr('width', _w).attr('height', _h).attr('fill', '#fff');

        _zoom = d3.zoom().on("zoom", zoomed);
        _zoom.translateBy(_subunits, _initialTranslate.x, _initialTranslate.y);
        _zoom.scaleTo(_subunits, scale);
        _scaleExtent = [scale, scale * 2];
        _zoom.scaleExtent(_scaleExtent);
        _subunits.call(_zoom);
    }

    function zoomed() {
        _subunits.selectAll('path.subunit').attr("transform", d3.event.transform.toString());
    }

    return _map;
}