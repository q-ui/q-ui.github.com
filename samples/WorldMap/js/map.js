// 需要强调展示的国家信息
var dataValue = {
  "countries": [
    { "name": "US", "threat": 120, "cnName": "美国" },
    { "name": "CN", "threat": 200, "cnName": "中国" },
    { "name": "FR", "threat": 100, "cnName": "法国" },
    { "name": "DE", "threat": 50, "cnName": "德国" },
    { "name": "CA", "threat": 80, "cnName": "加拿大" }
  ]
};

// 地图绘制相关配置信息
var options = {
  geoUrl: 'data/webui.geo.json',
  drag: {
    enabled: true
  },
  zoom: {
    enabled: true,
    rate: 0.2
  },
  fill: {
    color: '#ABDDA4',
    linearColor: true,
    linearStart: '#F8F8F8',
    linearEnd: '#344962'
  },
  border: {
    width: 1,
    opacity: 1,
    color: '#CECECE'
  },
  tooltips: {
    enabled: true,
    template: function (geoData, valueData) {
      var tmp = '<div class="hs-worldmap-hoverinfo">'
              + '威胁个数' 
              + '<br>' 
              + valueData.cnName + ':' + valueData.threat
              + '</div>';
      return tmp; 
    }
  },
  highlight: {
    enabled: true,
    fill: {
      color: '#F3C377',
      opacity: 1
    },
    border: {
      width: 2,
      opacity: 1,
      color: '#F3C377'
    }
  }
}

// 国家名称及缩写对应
var countryName = {
	"dz" : "Algeria",
	"ao" : "Angola",
	"eg" : "Egypt",
	"bd" : "Bangladesh",
	"ne" : "Niger",
	"qa" : "Qatar",
	"na" : "Namibia",
	"bg" : "Bulgaria",
	"bo" : "Bolivia",
	"gh" : "Ghana",
	"pk" : "Pakistan",
	"pa" : "Panama",
	"jo" : "Jordan",
	"eh" : "Western Sahara",
	"ly" : "Libya",
	"my" : "Malaysia",
	"pr" : "Puerto Rico",
	"kp" : "North Korea",
	"tz" : "United Republic of Tanzania",
	"pt" : "Portugal",
	"kh" : "Cambodia",
	"py" : "Paraguay",
	"sa" : "Saudi Arabia",
	"me" : "Montenegro",
	"si" : "Slovenia",
	"bf" : "Burkina Faso",
	"ch" : "Switzerland",
	"mr" : "Mauritania",
	"hr" : "Croatia",
	"cl" : "Chile",
	"cn" : "China",
	"kn" : "Saint Kitts and Nevis",
	"jm" : "Jamaica",
	"dj" : "Djibouti",
	"gn" : "Guinea",
	"fi" : "Finland",
	"uy" : "Uruguay",
	"va" : "Vatican",
	"np" : "Nepal",
	"ma" : "Morocco",
	"ye" : "Yemen",
	"ph" : "Philippines",
	"za" : "South Africa",
	"ni" : "Nicaragua",
	"cyn" : "Northern Cyprus",
	"vi" : "United States Virgin Islands",
	"sy" : "Syria",
	"li" : "Liechtenstein",
	"mt" : "Malta",
	"kz" : "Kazakhstan",
	"mn" : "Mongolia",
	"sr" : "Suriname",
	"ie" : "Ireland",
	"dm" : "Dominica",
	"bj" : "Benin",
	"ng" : "Nigeria",
	"be" : "Belgium",
	"tg" : "Togo",
	"de" : "Germany",
	"lk" : "Sri Lanka",
	"gb" : "United Kingdom",
	"gy" : "Guyana",
	"cr" : "Costa Rica",
	"cm" : "Cameroon",
	"kas" : "Siachen Glacier",
	"km" : "Comoros",
	"ug" : "Uganda",
	"tm" : "Turkmenistan",
	"tt" : "Trinidad and Tobago",
	"nl" : "Netherlands",
	"td" : "Chad",
	"ge" : "Georgia",
	"ro" : "Romania",
	"scr" : "Scarborough Reef",
	"lv" : "Latvia",
	"bz" : "Belize",
	"mm" : "Myanmar",
	"af" : "Afghanistan",
	"bi" : "Burundi",
	"by" : "Belarus",
	"gd" : "Grenada",
	"lr" : "Liberia",
	"gr" : "Greece",
	"ls" : "Lesotho",
	"gl" : "Greenland",
	"ad" : "Andorra",
	"mz" : "Mozambique",
	"tj" : "Tajikistan",
	"th" : "Thailand",
	"ht" : "Haiti",
	"mx" : "Mexico",
	"zw" : "Zimbabwe",
	"lc" : "Saint Lucia",
	"in" : "India",
	"vc" : "Saint Vincent and the Grenadines",
	"bt" : "Bhutan",
	"vn" : "Vietnam",
	"no" : "Norway",
	"cz" : "Czech Republic",
	"ag" : "Antigua and Barbuda",
	"fj" : "Fiji",
	"hn" : "Honduras",
	"mu" : "Mauritius",
	"do" : "Dominican Republic",
	"lu" : "Luxembourg",
	"il" : "Israel",
	"sm" : "San Marino",
	"pe" : "Peru",
	"id" : "Indonesia",
	"vu" : "Vanuatu",
	"mk" : "Macedonia",
	"cd" : "Democratic Republic of the Congo",
	"cg" : "Republic of Congo",
	"is" : "Iceland",
	"et" : "Ethiopia",
	"um" : "United States Minor Outlying Islands",
	"co" : "Colombia",
	"ser" : "Serranilla Bank",
	"bw" : "Botswana",
	"md" : "Moldova",
	"mg" : "Madagascar",
	"ec" : "Ecuador",
	"sn" : "Senegal",
	"tl" : "East Timor",
	"fr" : "France",
	"lt" : "Lithuania",
	"rw" : "Rwanda",
	"zm" : "Zambia",
	"gm" : "Gambia",
	"fo" : "Faroe Islands",
	"gt" : "Guatemala",
	"dk" : "Denmark",
	"ua" : "Ukraine",
	"au" : "Australia",
	"at" : "Austria",
	"ve" : "Venezuela",
	"pw" : "Palau",
	"ke" : "Kenya",
	"la" : "Laos",
	"bjn" : "Bajo Nuevo Bank (Petrel Is.)",
	"tr" : "Turkey",
	"jp" : "Japan",
	"al" : "Albania",
	"om" : "Oman",
	"it" : "Italy",
	"bn" : "Brunei",
	"tn" : "Tunisia",
	"hu" : "Hungary",
	"ru" : "Russia",
	"lb" : "Lebanon",
	"bb" : "Barbados",
	"br" : "Brazil",
	"ci" : "Ivory Coast",
	"rs" : "Republic of Serbia",
	"gq" : "Equatorial Guinea",
	"us" : "United States of America",
	"se" : "Sweden",
	"az" : "Azerbaijan",
	"gw" : "Guinea Bissau",
	"sz" : "Swaziland",
	"ca" : "Canada",
	"kv" : "Kosovo",
	"kr" : "South Korea",
	"mw" : "Malawi",
	"sk" : "Slovakia",
	"cy" : "Cyprus",
	"ba" : "Bosnia and Herzegovina",
	"pga" : "Spratly Islands",
	"sg" : "Singapore",
	"tw" : "Taiwan",
	"so" : "Somalia",
	"sol" : "Somaliland",
	"uz" : "Uzbekistan",
	"cf" : "Central African Republic",
	"pl" : "Poland",
	"kw" : "Kuwait",
	"er" : "Eritrea",
	"ga" : "Gabon",
	"ee" : "Estonia",
	"es" : "Spain",
	"iq" : "Iraq",
	"sv" : "El Salvador",
	"ml" : "Mali",
	"st" : "Sao Tome and Principe",
	"ir" : "Iran",
	"sl" : "Sierra Leone",
	"cnm" : "Cyprus No Mans Area",
	"bs" : "The Bahamas",
	"sb" : "Solomon Islands",
	"nz" : "New Zealand",
	"mc" : "Monaco",
	"ss" : "South Sudan",
	"kg" : "Kyrgyzstan",
	"ae" : "United Arab Emirates",
	"ar" : "Argentina",
	"sd" : "Sudan",
	"bh" : "Bahrain",
	"am" : "Armenia",
	"pg" : "Papua New Guinea",
	"cu" : "Cuba"
};

// 变量信息
var scale = 1;
var isDrag = false;
var center = { left: 0, top: 0 };
var delta = { left: 0, top: 0 };
var linear, computeColor;

// 主绘图元素svg
var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

// 是否采用渐进变色的模式进行强调展示
if (options.fill.linearColor) {
  var maxValue = d3.max(dataValue.countries, function (d) { return d.threat; });
  var minValue = 0;

  linear = d3.scaleLinear()
            .domain([minValue, maxValue])
            .range([0, 1]);
  computeColor = d3.interpolate(options.fill.linearStart, options.fill.linearEnd);
}

// 地图中心定位
center.left = width / 2;
center.top = height / 2;

var projection = d3.geoEquirectangular()
  .scale(height / Math.PI)
  .translate([width / 2, height / 2]);

var path = d3.geoPath()
  .projection(projection);

var graticule = d3.geoGraticule();
svg.append("path")
  .datum(graticule)
  .attr("class", "hs-worldmap-graticule")
  .attr("d", path);

d3.json(options.geoUrl, function (error, data) {
  if (error) throw error;
  var me = this;
  // 绘制国家图形svg元素
  me.drawCountries(data);
  // 绘制国家图形flag
  me.drawFlags();
  // 添加事件响应
  me.addMapHandlers();
});

function drawCountries(data) {
  var me = this;
  var subunits = me.svg.select('g.hs-worldmap-subunits');
  if (subunits.empty()) {
    subunits = me.addLayer('hs-worldmap-subunits', null, true);
  }

  var geoData = data.features;
  var geo = subunits.selectAll('path.hs-worldmap-subunit')
              .data(geoData);
              
  geo.enter()
    .append('path')
    .attr('d', path)
    .attr('class', function (d) { return 'hs-worldmap-subunit ' + d.properties.wb_a2; })
    .style('stroke-width', options.border.width)
    .style('stroke-opacity', options.border.opacity)
    .style('stroke', options.border.color)
    .attr('data-info', function (d) {
      var dataInfo = dataValue.countries.filter(function (item) {
        if (item.name == d.properties.wb_a2) return item;
      });
      return JSON.stringify(dataInfo[0]);
    })
    .style('fill', function (d) {
      var t = 0;
      var dataInfo = dataValue.countries.filter(function (item) { 
        if (item.name == d.properties.wb_a2) return item; 
      });
      if (dataInfo.length > 0) {
        t = linear(dataInfo[0].threat);
      }
      var color = computeColor(t);
      return color || options.fill.color;
    });
}

// 在svg中添加g图层组
function addLayer(className, id, first) {
  var me = this;
  var layer;
  if (first) {
    layer = me.svg.insert('g', ':first-child')
  }
  else {
    layer = me.svg.append('g')
  }
  return layer.attr('id', id || '')
              .attr('class', className || '');
}

function drawFlags() {
  var me = this;
  var flags = d3.select('.hs-worldmap-flag')
    .selectAll('span')
    .data(dataValue.countries)
    .enter()
    .append('span')
    .attr('class', 'f16')
    .html(function (d) {
      var strHtml = '<span class="hs-worldmap-flag-item flag ' + d.name.toLowerCase() + '" title="' + d.cnName + '"></span>' + d.threat;
      return strHtml;
    });
}

function addMapHandlers() {
  var me = this;
  var svg = me.svg;

  if (options.highlight.enabled || options.tooltips.enabled) {
    svg.selectAll('.hs-worldmap-subunit')
      .on('mouseover', function (d) {
        var self = this;
        var selection = d3.select(self);
        if (options.highlight.enabled) {
          var previousAttributes = {
            'fill': selection.style('fill'),
            'stroke': selection.style('stroke'),
            'stroke-width': selection.style('stroke-width'),
            'fill-opacity': selection.style('fill-opacity')
          };
          selection
            .style('fill', options.highlight.fill.color)
            .style('fill-opacity', options.highlight.fill.opacity)
            .style('stroke', options.highlight.border.color)
            .style('stroke-width', options.highlight.border.width)
            .style('stroke-opacity', options.highlight.border.opacity)
            .attr('data-previousAttributes', JSON.stringify(previousAttributes));

          if (! /((MSIE)|(Trident))/.test(navigator.userAgent)) {
            self.parentNode.appendChild(self);
          }
        }

        if (options.tooltips.enabled) {
          me.showTooltips(selection, d, options);
        }
      })
      .on('mouseout', function () {
        var self = this;
        var selection = d3.select(self);

        if (options.highlight.enabled) {
          var previousAttributes = JSON.parse(selection.attr('data-previousAttributes'));
          for (var attr in previousAttributes) {
            selection.style(attr, previousAttributes[attr]);
          }
        }
        selection.on('mousemove', null);
        d3.selectAll('.hs-worldmap-hoverover').style('display', 'none');
      });
  }
  // 添加鼠标tooltips所对应的div
  if (me.options.tooltips.enabled) {
    d3.select(svg.node().parentNode)
      .append('div')
      .attr('class', 'hs-worldmap-hoverover')
      .style('z-index', 9999)
      .style('display', 'none')
      .style('position', 'absolute');
  }

  if (me.options.drag.enabled) {
    svg.on('mousedown', function () {
      isDrag = true;

      d3.select('body').on('mousemove', function () {
        if (isMouseOut(d3.event.toElement)) {
          isDrag = false;
        }
        if (!checkDragValid()) {
          isDrag = false;
        }
        if (isDrag) {
          delta.left += d3.event.movementX;
          delta.top += d3.event.movementY;

          transform();
        }
      });

      d3.select('body').on('mouseup', function () {
        removeDragEvent();
      });

      svg.on('mouseout', function () {
        if (isMouseOut(d3.event.toElement)) {
          removeDragEvent();
        }
      });
    })
    .on('mousewheel', function () {
      onMouseWheelHandler(d3.event);
    })
  }
}

function removeDragEvent() {
  isDrag = false;
  d3.select('body')
    .on('mousemove', null)
    .on('mouseup', null);
  svg.on('mouseout', null);
};

function onMouseWheelHandler(e) {
  var svgRect = svg.node().getBoundingClientRect();
  var gRect = svg.select('g').node().getBoundingClientRect();
  var offset = {
    left: e.x - svgRect.left,
    top: e.y - svgRect.top
  }

  if (e.wheelDelta) {
    // IE/Opera/Chrome
    if (e.wheelDelta == 120) {
      onZoomInHandler(offset);
    } else if (e.wheelDelta == -120) {
      onZoomOutHandler(offset);
    }
  } else if (e.detail) {
    // Firefox
    if (e.detail == -3) {
      onZoomInHandler(offset);
    } else if (e.detail == 3) {
      onZoomOutHandler(offset);
    }
  }
};

function checkDragValid() {
  var rect = svg.select('g').node().getBoundingClientRect();
  if (Math.abs(delta.left / scale) > width / 2) {
    if (delta.left > 0) {
      delta.left = width / 2 * scale;
    } else {
      delta.left = -width / 2 * scale;
    }
    return false;
  }
  if (Math.abs(delta.top / scale) > height / 2) {
    if (delta.top > 0) {
      delta.top = height / 2 * scale;
    } else {
      delta.top = -height / 2 * scale;
    }
    return false;
  }
  return true;
};

function isMouseOut(element) {
  if (element) {
    var classList = element.classList;
    if (classList.contains('hs-worldmap-hoverover') || classList.contains('hoverinfo')) {
      return false;
    }
    var nodeName = element.nodeName;
    if (nodeName == 'path' || nodeName == 'g' || nodeName == 'svg' || nodeName == 'STRONG') {
      return false;
    }
  }
  return true;
};

function showTooltips(element, d, options) {
  var me = this;
  var data = JSON.parse(element.attr('data-info'));
  if (data) {
    element.on('mousemove', function () {
      d3.select(me.svg.nodes()[0].parentNode)
        .select('.hs-worldmap-hoverover')
        .style('top', (d3.event.y + 30) + "px")
        .style('left', (d3.event.x - 50) + "px")
        .html(options.tooltips.template(d, data));
    });
    d3.select(me.svg.nodes()[0].parentNode).select('.hs-worldmap-hoverover').style('display', 'block');
  }
};

var zoomInDiv = document.querySelector('.hs-worldmap-zoomin');
zoomInDiv.addEventListener('click', function () {
  onZoomInHandler(center);
});

function onZoomInHandler(offset) {
  if (scale < 5) {
    var oldScale = scale;
    var newScale = scale += options.zoom.rate;

    delta.left = delta.left - (offset.left - delta.left) * (newScale / oldScale - 1);
    delta.top = delta.top - (offset.top - delta.top) * (newScale / oldScale - 1);

    transform();
  }
};

var zoomOutDiv = document.querySelector('.hs-worldmap-zoomout');
zoomOutDiv.addEventListener('click', function () {
  onZoomOutHandler(center);
});

function onZoomOutHandler(offset) {
  if (scale > 1) {
    var oldScale = scale;
    var newScale = scale -= options.zoom.rate;

    delta.left = delta.left - (offset.left - delta.left) * (newScale / oldScale - 1);
    delta.top = delta.top - (offset.top - delta.top) * (newScale / oldScale - 1);

    transform();
  }
};

var centerDiv = document.querySelector('.hs-worldmap-center');
centerDiv.addEventListener('click', function () {
  if (delta.left != 0 || delta.top != 0 || scale != 1) {
    scale = 1;
    delta = { left: 0, top: 0 };

    transform();
  }
});

function transform() {
  var translateCss = ' translate(' + delta.left + 'px, ' + delta.top + 'px)';
  var scaleCss = ' scale(' + scale + ')';

  var transformCss = scaleCss + translateCss;
  svg.select('g.hs-worldmap-subunits')
    .style('transform-origin', '0 0')
    .style('transform', transformCss);
}