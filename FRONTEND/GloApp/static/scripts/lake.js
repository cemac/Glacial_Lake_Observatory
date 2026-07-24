/*** lake.js ***/

'use strict';

/** global variables: **/

var page_data = {
  /* lake data: */
  'lake': null,
  /* geometry data: */
  'geometry': null,
  /* temperature data: */
  'temperature': null,
  /* area data: */
  'area': null,
  /* volume data: */
  'volume': null,
  /* depth data: */
  'depth': null,
  /* geometry color map (R viridis mako): */
  'geometry_colors': [
    "#def5e5ff", "#d9f2e0ff", "#d4f1dcff", "#cfeed7ff", "#c9edd3ff", "#c4eacfff",
    "#bfe9cbff", "#b9e6c7ff", "#b3e4c3ff", "#ade3c0ff", "#a7e1bcff", "#a0dfb9ff",
    "#99ddb6ff", "#93dbb5ff", "#8bdab2ff", "#83d8b0ff", "#7bd6afff", "#74d4adff",
    "#6cd3adff", "#65d0adff", "#5fcdadff", "#59ccadff", "#54c9adff", "#50c6adff",
    "#4cc3adff", "#48c1adff", "#46beadff", "#43bbadff", "#41b8adff", "#3fb5adff",
    "#3db3adff", "#3bafadff", "#3aadacff", "#38aaacff", "#37a7acff", "#36a4abff",
    "#35a1abff", "#359fabff", "#359baaff", "#3499aaff", "#3496a9ff", "#3492a8ff",
    "#3490a8ff", "#348da7ff", "#348aa6ff", "#3487a6ff", "#3485a5ff", "#3482a4ff",
    "#357ea4ff", "#357ca3ff", "#3579a2ff", "#3576a2ff", "#3573a1ff", "#3670a0ff",
    "#366da0ff", "#366a9fff", "#37689fff", "#37649eff", "#38629dff", "#395e9cff",
    "#3a5c9bff", "#3b589aff", "#3c5598ff", "#3d5296ff", "#3e4f94ff", "#3f4c91ff",
    "#40498eff", "#40478aff", "#414387ff", "#414083ff", "#413e7eff", "#403c79ff",
    "#403a75ff", "#3f3770ff", "#3e356cff", "#3e3367ff", "#3c3162ff", "#3b2f5eff",
    "#3a2c59ff", "#382a55ff", "#372851ff", "#35264cff", "#342548ff", "#322243ff",
    "#31213fff", "#2e1e3bff", "#2c1c37ff", "#2a1b33ff", "#28192fff", "#26172aff",
    "#231526ff", "#211423ff", "#1e111fff", "#1b0f1bff", "#190e18ff", "#160b14ff",
    "#140910ff", "#11070cff", "#0f0609ff", "#0b0405ff"
  ],
  /* geometry map elements: */
  'geometry_map': null,
  'geometry_polys': {},
  /* geometry plot elements: */
  'geometry_plot_els': [
    document.getElementById('geometry_header_row'),
    document.getElementById('geometry_plot_row')
  ],
  'geometry_download_el': document.getElementById('download_geometry_button'),
  'geometry_slider': {
    'el': document.getElementById('geometry_slider'),
    'value_el': document.getElementById('geomtry_slider_value'),
    'lo': null,
    'hi': null,
    'active': false
  },
  /* area color map: */
  'area_colors': [
    "#4cc3adff", "#48c1adff", "#46beadff", "#43bbadff", "#41b8adff", "#3fb5adff",
    "#3db3adff", "#3bafadff", "#3aadacff", "#38aaacff", "#37a7acff", "#36a4abff",
    "#35a1abff", "#359fabff", "#359baaff", "#3499aaff", "#3496a9ff", "#3492a8ff",
    "#3490a8ff", "#348da7ff", "#348aa6ff", "#3487a6ff", "#3485a5ff", "#3482a4ff",
    "#357ea4ff", "#357ca3ff", "#3579a2ff", "#3576a2ff", "#3573a1ff", "#3670a0ff",
    "#366da0ff", "#366a9fff", "#37689fff", "#37649eff", "#38629dff", "#395e9cff",
    "#3a5c9bff", "#3b589aff", "#3c5598ff", "#3d5296ff", "#3e4f94ff", "#3f4c91ff",
    "#40498eff", "#40478aff", "#414387ff", "#414083ff", "#413e7eff", "#403c79ff",
    "#403a75ff", "#3f3770ff", "#3e356cff", "#3e3367ff", "#3c3162ff", "#3b2f5eff",
    "#3a2c59ff", "#382a55ff", "#372851ff", "#35264cff", "#342548ff", "#322243ff",
    "#31213fff", "#2e1e3bff", "#2c1c37ff", "#2a1b33ff", "#28192fff", "#26172aff",
    "#231526ff", "#211423ff", "#1e111fff", "#1b0f1bff", "#190e18ff", "#160b14ff",
    "#140910ff", "#11070cff", "#0f0609ff", "#0b0405ff"
  ],
  /* area plot elements: */
  'area_plot_els': [
    document.getElementById('area_header_row'),
    document.getElementById('area_plot_row')
  ],
  'area_text_div': document.getElementById('area_text_div'),
  'area_download_el': document.getElementById('download_area_button'),
  /* temperature color map: */
  'temperature_colors': [
    "#4cc3adff", "#48c1adff", "#46beadff", "#43bbadff", "#41b8adff", "#3fb5adff",
    "#3db3adff", "#3bafadff", "#3aadacff", "#38aaacff", "#37a7acff", "#36a4abff",
    "#35a1abff", "#359fabff", "#359baaff", "#3499aaff", "#3496a9ff", "#3492a8ff",
    "#3490a8ff", "#348da7ff", "#348aa6ff", "#3487a6ff", "#3485a5ff", "#3482a4ff",
    "#357ea4ff", "#357ca3ff", "#3579a2ff", "#3576a2ff", "#3573a1ff", "#3670a0ff",
    "#366da0ff", "#366a9fff", "#37689fff", "#37649eff", "#38629dff", "#395e9cff",
    "#3a5c9bff", "#3b589aff", "#3c5598ff", "#3d5296ff", "#3e4f94ff", "#3f4c91ff",
    "#40498eff", "#40478aff", "#414387ff", "#414083ff", "#413e7eff", "#403c79ff",
    "#403a75ff", "#3f3770ff", "#3e356cff", "#3e3367ff", "#3c3162ff", "#3b2f5eff",
    "#3a2c59ff", "#382a55ff", "#372851ff", "#35264cff", "#342548ff", "#322243ff",
    "#31213fff", "#2e1e3bff", "#2c1c37ff", "#2a1b33ff", "#28192fff", "#26172aff",
    "#231526ff", "#211423ff", "#1e111fff", "#1b0f1bff", "#190e18ff", "#160b14ff",
    "#140910ff", "#11070cff", "#0f0609ff", "#0b0405ff"
  ],
  'temperature_plot_colors': [
    [0.0, 'rgb(222, 245, 229)'],
    [0.01, 'rgb(217, 242, 224)'],
    [0.02, 'rgb(212, 241, 220)'],
    [0.03, 'rgb(207, 238, 215)'],
    [0.04, 'rgb(201, 237, 211)'],
    [0.05, 'rgb(196, 234, 207)'],
    [0.06, 'rgb(191, 233, 203)'],
    [0.07, 'rgb(185, 230, 199)'],
    [0.08, 'rgb(179, 228, 195)'],
    [0.09, 'rgb(173, 227, 192)'],
    [0.1, 'rgb(167, 225, 188)'],
    [0.11, 'rgb(160, 223, 185)'],
    [0.12, 'rgb(153, 221, 182)'],
    [0.13, 'rgb(147, 219, 181)'],
    [0.14, 'rgb(139, 218, 178)'],
    [0.15, 'rgb(131, 216, 176)'],
    [0.16, 'rgb(123, 214, 175)'],
    [0.17, 'rgb(116, 212, 173)'],
    [0.18, 'rgb(108, 211, 173)'],
    [0.19, 'rgb(101, 208, 173)'],
    [0.2, 'rgb(95, 205, 173)'],
    [0.21, 'rgb(89, 204, 173)'],
    [0.22, 'rgb(84, 201, 173)'],
    [0.23, 'rgb(80, 198, 173)'],
    [0.24, 'rgb(76, 195, 173)'],
    [0.25, 'rgb(72, 193, 173)'],
    [0.26, 'rgb(70, 190, 173)'],
    [0.27, 'rgb(67, 187, 173)'],
    [0.28, 'rgb(65, 184, 173)'],
    [0.29, 'rgb(63, 181, 173)'],
    [0.3, 'rgb(61, 179, 173)'],
    [0.31, 'rgb(59, 175, 173)'],
    [0.32, 'rgb(58, 173, 172)'],
    [0.33, 'rgb(56, 170, 172)'],
    [0.34, 'rgb(55, 167, 172)'],
    [0.35, 'rgb(54, 164, 171)'],
    [0.36, 'rgb(53, 161, 171)'],
    [0.37, 'rgb(53, 159, 171)'],
    [0.38, 'rgb(53, 155, 170)'],
    [0.39, 'rgb(52, 153, 170)'],
    [0.4, 'rgb(52, 150, 169)'],
    [0.41, 'rgb(52, 146, 168)'],
    [0.42, 'rgb(52, 144, 168)'],
    [0.43, 'rgb(52, 141, 167)'],
    [0.44, 'rgb(52, 138, 166)'],
    [0.45, 'rgb(52, 135, 166)'],
    [0.46, 'rgb(52, 133, 165)'],
    [0.47, 'rgb(52, 130, 164)'],
    [0.48, 'rgb(53, 126, 164)'],
    [0.49, 'rgb(53, 124, 163)'],
    [0.51, 'rgb(53, 121, 162)'],
    [0.52, 'rgb(53, 118, 162)'],
    [0.53, 'rgb(53, 115, 161)'],
    [0.54, 'rgb(54, 112, 160)'],
    [0.55, 'rgb(54, 109, 160)'],
    [0.56, 'rgb(54, 106, 159)'],
    [0.57, 'rgb(55, 104, 159)'],
    [0.58, 'rgb(55, 100, 158)'],
    [0.59, 'rgb(56, 98, 157)'],
    [0.6, 'rgb(57, 94, 156)'],
    [0.61, 'rgb(58, 92, 155)'],
    [0.62, 'rgb(59, 88, 154)'],
    [0.63, 'rgb(60, 85, 152)'],
    [0.64, 'rgb(61, 82, 150)'],
    [0.65, 'rgb(62, 79, 148)'],
    [0.66, 'rgb(63, 76, 145)'],
    [0.67, 'rgb(64, 73, 142)'],
    [0.68, 'rgb(64, 71, 138)'],
    [0.69, 'rgb(65, 67, 135)'],
    [0.7, 'rgb(65, 64, 131)'],
    [0.71, 'rgb(65, 62, 126)'],
    [0.72, 'rgb(64, 60, 121)'],
    [0.73, 'rgb(64, 58, 117)'],
    [0.74, 'rgb(63, 55, 112)'],
    [0.75, 'rgb(62, 53, 108)'],
    [0.76, 'rgb(62, 51, 103)'],
    [0.77, 'rgb(60, 49, 98)'],
    [0.78, 'rgb(59, 47, 94)'],
    [0.79, 'rgb(58, 44, 89)'],
    [0.8, 'rgb(56, 42, 85)'],
    [0.81, 'rgb(55, 40, 81)'],
    [0.82, 'rgb(53, 38, 76)'],
    [0.83, 'rgb(52, 37, 72)'],
    [0.84, 'rgb(50, 34, 67)'],
    [0.85, 'rgb(49, 33, 63)'],
    [0.86, 'rgb(46, 30, 59)'],
    [0.87, 'rgb(44, 28, 55)'],
    [0.88, 'rgb(42, 27, 51)'],
    [0.89, 'rgb(40, 25, 47)'],
    [0.9, 'rgb(38, 23, 42)'],
    [0.91, 'rgb(35, 21, 38)'],
    [0.92, 'rgb(33, 20, 35)'],
    [0.93, 'rgb(30, 17, 31)'],
    [0.94, 'rgb(27, 15, 27)'],
    [0.95, 'rgb(25, 14, 24)'],
    [0.96, 'rgb(22, 11, 20)'],
    [0.97, 'rgb(20, 9, 16)'],
    [0.98, 'rgb(17, 7, 12)'],
    [0.99, 'rgb(15, 6, 9)'],
    [1.0, 'rgb(11, 4, 5)']
  ],
  'temperature_plot_markers': [
    'circle', 'square', 'diamond', 'triangle-up'
  ],
  /* temperature plot elements: */
  'temperature_plot_els': [
    document.getElementById('temperature_header_row'),
    document.getElementById('temperature_plot_row')
  ],
  'temperature_text_div': document.getElementById('temperature_text_div'),
  'temperature_download_el': document.getElementById('download_temperature_button'),
  /* volume plot elements: */
  'volume_plot_els': [
    document.getElementById('volume_header_row'),
    document.getElementById('volume_plot_row')
  ],
  'volume_table_el': document.getElementById('volume_table_row'),
  /* depth plot elements: */
  'depth_plot_els': [
    document.getElementById('depth_header_row'),
    document.getElementById('depth_plot_row')
  ]
};

/** leaflet mouse position control: **/

L.Control.MousePosition = L.Control.extend({
  options: {
    position: 'bottomleft',
    separator: ', ',
    emptyString: 'lat: --, lon: --',
    lngFirst: false,
    numDigits: 3,
    lngFormatter: function(lon) {
      return 'lon:' + lon.toFixed(3)
    },
    latFormatter: function(lat) {
      return 'lat:' + lat.toFixed(3)
    },
    prefix: ''
  },

  onAdd: function (map) {
    this._container = L.DomUtil.create('div', 'leaflet-control-mouseposition');
    L.DomEvent.disableClickPropagation(this._container);
    map.on('mousemove', this._onMouseMove, this);
    this._container.innerHTML=this.options.emptyString;
    return this._container;
  },

  onRemove: function (map) {
    map.off('mousemove', this._onMouseMove)
  },

  _onMouseMove: function (e) {
    var lng = this.options.lngFormatter ? this.options.lngFormatter(e.latlng.lng) : L.Util.formatNum(e.latlng.lng, this.options.numDigits);
    var lat = this.options.latFormatter ? this.options.latFormatter(e.latlng.lat) : L.Util.formatNum(e.latlng.lat, this.options.numDigits);
    var value = this.options.lngFirst ? lng + this.options.separator + lat : lat + this.options.separator + lng;
    var prefixAndValue = this.options.prefix + ' ' + value;
    this._container.innerHTML = prefixAndValue;
  }

});

L.Map.mergeOptions({
    positionControl: true
});

L.Map.addInitHook(function () {
    if (this.options.positionControl) {
        this.positionControl = new L.Control.MousePosition();
    }
});

L.control.mousePosition = function (options) {
    return new L.Control.MousePosition(options);
};

/** leaflet measure fixings: **/

L.Control.Measure.include({
  /* set icon on the capture marker: */
  _setCaptureMarkerIcon: function () {
    /* disable autopan: */
    this._captureMarker.options.autoPanOnFocus = false;
    /* default function: */
    this._captureMarker.setIcon(
      L.divIcon({
        iconSize: this._map.getSize().multiplyBy(2)
      })
    );
  },
});

/** functions: **/

/* function to load lake data: */
async function load_lake_data() {
  /* get data: */
  await fetch(
    data_lakes,
    {'cache': 'no-cache'}
  ).then(async function(data_req) {
    var lakes_data = await data_req.json();
    page_data['lake'] = lakes_data[lake_id];
  });
  /* load page text: */
  load_text();
};

/* function to load bits of text on page: */
function load_text() {
  /* set title and header text: */
  var title_el = document.getElementById('title_page');
  title_el.innerHTML += ' - ' + lake_id;
  var header_el = document.getElementById('header_lake_id');
  header_el.innerHTML = lake_id;
  /* add lake info text: */
  var info_el = document.getElementById('header_text');
  var info_text = '';
  var info_keys = [
    'GLO_ID', 'COMMON_NAME', 'COUNTRY', 'CONNECTIVITY', 'AREA',
    'EXPANSION_RATE', 'DEPTH_MAX', 'VOLUME'
  ];
  var info_labels = [
    'GLO ID', 'Common name', 'Country', 'Connectivity', 'Area',
    'Expansion rate', 'Maximum depth', 'Volume'
  ];
  for (var i = 0; i < info_keys.length; i++) {
    var info_key = info_keys[i];
    var info_data = page_data['lake'][info_key];
    if (info_data == null) {
      continue;
    };
    if (info_key == 'AREA') {
      var info_extra = page_data['lake']['AREA_YEAR'];
      info_text += '<span><label>' + info_labels[i] + ':</label> ' +
                   info_data.toFixed(3) + ' km² (' + info_extra + ')</span>';
    } else if (info_key == 'EXPANSION_RATE') {
      var info_extra = page_data['lake']['EXPANSION_RATE_UNCERTAINTY'];
      info_text += '<span><label>' + info_labels[i] + ':</label> ' +
                   info_data + ' km²/year (+/-' + info_extra + ')</span>';
    } else if (info_key == 'DEPTH_MAX') {
      info_text += '<span><label>' + info_labels[i] + ':</label> ' +
                   info_data + ' m</span>';
    } else if (info_key == 'VOLUME') {
      var info_extra = page_data['lake']['VOLUME_YEAR'];
      info_text += '<span><label>' + info_labels[i] + ':</label> ' +
                   info_data.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                   ' m³ (' + info_extra + ')</span>';
    } else {
      info_text += '<span><label>' + info_labels[i] + ':</label> ' +
                   info_data + '</span>';
    };
  };
  info_el.innerHTML = info_text;
};

/* function to load geometry data: */
async function load_geometry_data() {
  try {
    /* get data: */
    await fetch(
      data_geometry,
      {'cache': 'no-cache'}
    ).then(async function(data_req) {
      page_data['geometry'] = await data_req.json();
    });
    /* get data: */
    var data = page_data['geometry'];
  } catch(e) {
    /* no data, hide geometry plot elements: */
    var geometry_plot_els = page_data['geometry_plot_els'];
    for (var i = 0 ; i < geometry_plot_els.length; i++) {
      var geometry_plot_el = geometry_plot_els[i];
      geometry_plot_el.style.display = 'none';
    };
    var geometry_download_el = page_data['geometry_download_el'];
    geometry_download_el.style.display = 'none';
    return;
  };
  /* draw the geometry plot: */
  geometry_plot(data);
};

/* function to update geometry polygons on map from slider: */
function update_geometry_map() {
  /* get geometry map and polygons: */
  let geometry_map = page_data['geometry_map'];
  let geometry_polys = page_data['geometry_polys'];
  /* get high and lo values: */
  let geometry_hi = page_data['geometry_slider']['hi'];
  let geometry_lo = page_data['geometry_slider']['lo'];
  /* remove polygons from map: */
  page_data['geometry_slider']['active'] = true;
  for (let i in geometry_polys) {
    geometry_polys[i].removeFrom(geometry_map);
  };
  /* loop through values, and add to map: */
  for (let i = geometry_hi; i > (geometry_lo - 1); i--) {
    let geometry_poly = geometry_polys[i];
    if (geometry_poly != undefined) {
      geometry_poly.addTo(geometry_map);
    };
  };
  page_data['geometry_slider']['active'] = false;
};

/* function to add geometry slider: */
async function add_geometry_slider() {
  /* get slider elements: */
  let slider_el = page_data['geometry_slider']['el'];
  let value_el = page_data['geometry_slider']['value_el'];
  /* create slider, if it does not exist: */
  if (slider_el.noUiSlider == undefined){
    /* get years for which we have geometry: */
    let data_years = page_data['geometry']['years'];
    let slider_years = [];
    for (let i = 0; i < data_years.length; i++) {
      slider_years.push(parseInt(data_years[i]));
    };
    slider_years.sort();
    let slider_lo = slider_years[0];
    let slider_hi = slider_years.slice(-1);
    /* crate slider: */
    noUiSlider.create(slider_el, {
      'start': [slider_lo, slider_hi],
      'range': {
        'min': slider_lo,
        'max': slider_hi
      },
      'connect': true,
      'step': 1,
      'margin': 0,
      'tooltips': false
    });
    /* set value: */
    value_el.innerHTML = slider_lo + ' to ' + slider_hi;
    /* add change listener: */
    slider_el.noUiSlider.on('change', function() {
      /* update slider styles: */
      page_data['geometry_slider']['el'].children[0].children[0].children[0].style.background = '#94d3e8';
      page_data['geometry_slider']['value_el'].style.color = '#484848';
      /* get values: */
      let value_lo = parseFloat(slider_el.noUiSlider.get()[0]);
      let value_hi = parseFloat(slider_el.noUiSlider.get()[1]);
      /* store the values: */
      page_data['geometry_slider']['lo'] = value_lo;
      page_data['geometry_slider']['hi'] = value_hi;
      /* update geometry map: */
      update_geometry_map();
      /* display the value: */
      value_el.innerHTML = value_lo + ' to ' + value_hi;
    });
    /* add slide listener: */
    slider_el.noUiSlider.on('slide', function() {
      /* update slider styles: */
      page_data['geometry_slider']['el'].children[0].children[0].children[0].style.background = '#94d3e8';
      page_data['geometry_slider']['value_el'].style.color = '#484848';
      /* get values: */
      let value_lo = parseFloat(slider_el.noUiSlider.get()[0]);
      let value_hi = parseFloat(slider_el.noUiSlider.get()[1]);
      /* display the value: */
      value_el.innerHTML = value_lo + ' to ' + value_hi;
    });
  };
};

/* function to update geometry slider when adding layers: */
function update_geometry_slider() {
  /* do nothing if slider does not exist: */
  let slider_el = page_data['geometry_slider']['el'];
  /* create slider, if it does not exist: */
  if (slider_el.noUiSlider == undefined){
    return;
  };
  /* do nothing if adding / removing via slider: */
  if (page_data['geometry_slider']['active'] == true) {
    return;
  };
  /* update slider styles: */
  page_data['geometry_slider']['el'].children[0].children[0].children[0].style.background = '#eeeeee';
  page_data['geometry_slider']['value_el'].style.color = '#cccccc';
  /* adjust slider bounds: */

};

/* function to download geometry data: */
async function download_geometry_data() {
  /* get data: */
  let data_in = page_data['geometry'];
  /* create zip writer object: */
  let zip_writer = new zip.ZipWriter(
    new zip.Data64URIWriter('application/zip')
  );
  /* loop through geometry polygons: */
  for (let i in data_in['data']) {
    /* get required lake information: */
    let lake_properties = data_in['data'][i]['properties'];
    let lake_geometry = data_in['data'][i]['geometry'];
    let lake_id = lake_properties['GLO_ID'];
    let lake_year = lake_properties['AREA_YEAR'];
    lake_properties['name'] = lake_id + ' ' + lake_year;
    /* init feature: */
    let my_feature = {
      'type': 'Feature',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'urn:ogc:def:crs:OGC:1.3:CRS84'
        }
      }
    };
    /* add properties and geometry: */
    my_feature['properties'] = lake_properties;
    my_feature['geometry'] = lake_geometry;
    /* jsonify: */
    let json_out = JSON.stringify(my_feature);
    /* file name for output: */
    let json_name = lake_id + '__geometry_' +
                    my_feature['properties']['AREA_YEAR'] + '.geojson';
    /* add data to zip file: */
    await zip_writer.add(
      json_name, new zip.TextReader(json_out)
    );
  };
  /* close zip file and get encoded data uri: */
  let data_uri = await zip_writer.close();
  /* set zip file name: */
  let zip_name = page_data['lake']['GLO_ID'] + '__geometry.zip';
  /* create a temporary link element: */
  let json_link = document.createElement('a');
  json_link.setAttribute('href', data_uri);
  json_link.setAttribute('download', zip_name);
  json_link.style.visibility = 'hidden';
  document.body.appendChild(json_link);
  json_link.click();
  document.body.removeChild(json_link);
};

/* function to draw geometry plot: */
function geometry_plot(data) {
  /* gep map element: */
  var map_div = document.getElementById('geometry_plot_div');
  /* check if map exists: */
  if (map_div._leaflet_id != undefined) {
    /* return if map exists: */
    return;
  };
  /* define sentinel-2 layer: */
  var s2_layer = L.tileLayer(
    'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2024_3857/default/g/{z}/{y}/{x}.jpg', {
      'attribution': '<a href="https://s2maps.eu/" target="_blank">Sentinel-2 cloudless (2024)</a>'
    }
  );
  /* define esri layer: */
  var esri_layer = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      'attribution': '<a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer" target="_blank">ESRI World Imagery</a>'
    }
  );
  /* define cartodb layer: */
  var carto_layer = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
      'attribution': '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
      'subdomains': 'abcd'
    }
  );
  /* define openstreetmap layer: */
  var osm_layer = L.tileLayer(
    'https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      'attribution': '&copy; <a href="https://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors'
    }
  );
  /* define its_live glacial velocity layer: */
  var gv_layer = L.tileLayer(
    'https://its-live-data.s3-us-west-2.amazonaws.com/velocity_mosaic/v2/static/v_tiles_global/{z}/{x}/{y}.png', {
      'attribution': 'ITS_LIVE',
      'maxNativeZoom': 11
    }
  );
  /* all tile layers: */
  var tile_layers = {
    'Sentinel-2': s2_layer,
    'ESRI World Imagery': esri_layer,
    'Carto': carto_layer,
    'Open Street Map': osm_layer,
    'Glacial Velocity': gv_layer
  };
  /* init polygon layers: */
  var poly_layers = {};
  /* init min / max lat / lon: */
  var min_lat = 90;
  var max_lat = -90;
  var min_lon = 180;
  var max_lon = -180;
  /* get geometry color map: */
  var geometry_colors = page_data['geometry_colors'];
  var color_count = geometry_colors.length;
  /* init variable for storing default ploygon: */
  var default_poly = null;
  /* loop through yars and load polygons: */
  for (var i = (data['years'].length - 1); i > -1; i--) {
    /* get color for this polygon: */
    if (data['years'].length == 1) {
      var poly_color_index = Math.round(
        0.5 * (color_count - 1)
      );
    } else {
      var poly_color_index = Math.round(
        (i / (data['years'].length - 1)) * (color_count - 1)
      );
    }
    var poly_color = geometry_colors[poly_color_index];
    /* add polygon: */
    var poly_year = parseInt(data['years'][i]) + '.0';
    var poly_layer = L.geoJSON(
      data['data'][poly_year],
      {style: function () { return {color: poly_color}; }}
    );
    var poly_area = data['data'][poly_year]['properties']['AREA'];
    poly_layer.area = poly_area;
    poly_layer.bindTooltip(
      '<b>' + parseInt(data['years'][i]) + '</b>' +
      '<br>• Area: ' + poly_area.toFixed(3) + ' km²', {
        'sticky': true,
        'offset': [3, -3]
      }
    );
    var poly_key = ' ' + parseInt(data['years'][i]) +
                   '<span class="map_key_color" style="background-color: ' +
                   poly_color + ';"></span>';
    poly_layers[poly_key] = poly_layer;
    page_data['geometry_polys'][parseInt(data['years'][i])] = poly_layer;
    var poly_bounds = poly_layer.getBounds();
    min_lat = Math.min(min_lat, poly_bounds.getSouth())
    max_lat = Math.max(max_lat, poly_bounds.getNorth())
    min_lon = Math.min(min_lon, poly_bounds.getWest())
    max_lon = Math.max(max_lon, poly_bounds.getEast())
    /* add add and remove listeners: */
    poly_layer.on('add', update_geometry_slider);
    poly_layer.on('remove', update_geometry_slider);
    /* store first polygon for adding to map: */
    if (i == (data['years'].length - 1)) {
      default_poly = poly_layer;
    };
  };
  /* center coords: */
  var center_lat = (max_lat + min_lat) / 2;
  var center_lon = (max_lon + min_lon) / 2;
  /* define map: */
  var map = L.map(map_div, {
    /* map layers: */
    layers: [
      s2_layer
    ],
    /* map center: */
    center: [
      center_lat,
      center_lon,
    ],
    /* define bounds: */
    maxBounds: [
      [min_lat - 0.1, min_lon - 0.1],
      [max_lat + 0.1, max_lon + 0.1],
    ],
    maxBoundsViscosity: 1.0,
    /*  zoom levels: */
    zoom:    12,
    minZoom: 12,
    maxZoom: 18
  });
  page_data['geometry_map'] = map;
  /* remove prefix from attribution control: */
  var map_atrr_control = map.attributionControl;
  map_atrr_control.setPrefix(false);
  /* add mouse pointer position: */
  L.control.mousePosition().addTo(map);
  /* add scale: */
  L.control.scale().addTo(map);
  /* add default polygon: */
  if (default_poly != null) {
    default_poly.addTo(map);
  };
  /* add layer control: */
  L.control.layers(
    tile_layers, poly_layers, {collapsed: true, sortLayers: false}
  ).addTo(map);
  /* add measurererer: */
  L.control.measure({
    'position': 'topright',
    'primaryLengthUnit': 'kilometers',
    'secondaryLengthUnit': 'miles',
    'primaryAreaUnit': 'sqmeters',
    'secondaryAreaUnit': 'sqmiles',
    'captureZIndex': 999999
  }).addTo(map);
  /* add glacial velocity color map: */
  var map_gv_colormap = L.control({position: 'bottomleft'});
  map_gv_colormap.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'map_ctl map_gv_colormap');
      this.update('');
      return this._div;
  };
  map_gv_colormap.update = function(colormap_html) {
    this._div.innerHTML = '<img class="map_gv_colormap_img" ' +
                                   'src="' + images_url + '/map/glacial_velocity_colormap.png">';
  };
  gv_layer.addEventListener('add', function() { map_gv_colormap.addTo(map); });
  gv_layer.addEventListener('remove', function() { map_gv_colormap.remove(); });
  /* head to lake area: */
  map.flyToBounds([
      [min_lat, min_lon],
      [max_lat, max_lon]
  ]);
  /* add geometry slider: */
  add_geometry_slider()
  /* add download button listener: */
  var geometry_download_el = page_data['geometry_download_el'];
  geometry_download_el.addEventListener('click', download_geometry_data);
};

/* function to load area data: */
async function load_area_data() {
  try {
    /* get data: */
    await fetch(
      data_area,
      {'cache': 'no-cache'}
    ).then(async function(data_req) {
      page_data['area'] = await data_req.json();
    });
    /* get data: */
    var data = page_data['area'];
  } catch(e) {
    /* no data, hide area plot elements: */
    var area_plot_els = page_data['area_plot_els'];
    for (var i = 0 ; i < area_plot_els.length; i++) {
      var area_plot_el = area_plot_els[i];
      area_plot_el.style.display = 'none';
    };
    var area_download_el = page_data['area_download_el'];
    area_download_el.style.display = 'none';
    return;
  };
  /* draw the area plot: */
  area_plot(data);
};

/* function to download area data: */
async function download_area_data() {
  /* get data: */
  let data_in = page_data['area'];
  let data_ids = data_in['data_ids'];
  /* create zip writer object: */
  let zip_writer = new zip.ZipWriter(
    new zip.Data64URIWriter('application/zip')
  );
  /* loop through data ids: */
  for (let i = 0; i < data_ids.length; i++) {
    /* get data for this id: */
    let data_id = data_ids[i];
    let data_url_type = data_id.split(':::');
    let data_url = data_url_type[0];
    let data_type = data_url_type[1];
    let data_label = data_url.split('/').slice(-1)[0];
    let data = data_in['data'][data_id];
    /* get metadata: */
    let data_doi = data['DOI'];
    let data_method = data['METHOD'];
    let data_source = data['DATA_SOURCE'];
    let data_notes = data['NOTES'];
    let data_citation = data['CITATION'];
    /* get data values: */
    let data_years = data['area_years'];
    let data_starts = data['start_dates'];
    let data_ends = data['end_dates'];
    let data_areas = data['areas'];
    let data_uncertaintys = data['area_uncertaintys'];
    let data_perimeters = data['perimeters'];
    /* init csv data: */
    let data_csv = '';
    /* add metadata: */
    data_csv += 'doi,' + data_doi + '\r\n';
    data_csv += 'method,' + data_method + '\r\n';
    data_csv += 'source,' + data_source + '\r\n';
    data_csv += 'notes,' + data_notes + '\r\n';
    data_csv += 'citation,' + data_citation + '\r\n';
    data_csv += '\r\n';
    data_csv += 'year,start date,end date,area (km²),area uncertainty,perimiter\r\n';
    /* loop through data values: */
    for (let j = 0; j < data_years.length; j++) {
      data_csv += data_years[j] + ',' + data_starts[j] + ',' +
                  data_ends[j] + ',' + data_areas[j] + ',' +
                  data_uncertaintys[j] + ',' + data_perimeters[j] + '\r\n';
    };
    /* file name for output: */
    let csv_name = lake_id + '__area_' + data_label + '.csv';
    /* add data to zip file: */
    await zip_writer.add(
      csv_name, new zip.TextReader(data_csv)
    );
  };
  /* close zip file and get encoded data uri: */
  let data_uri = await zip_writer.close();
  /* set zip file name: */
  let zip_name = page_data['lake']['GLO_ID'] + '__area.zip';
  /* create a temporary link element: */
  let csv_link = document.createElement('a');
  csv_link.setAttribute('href', data_uri);
  csv_link.setAttribute('download', zip_name);
  csv_link.style.visibility = 'hidden';
  document.body.appendChild(csv_link);
  csv_link.click();
  document.body.removeChild(csv_link);
};

/* function to draw area plot: */
function area_plot(data) {
  /* init scatter plot data: */
  var scatter_data = [];
  /* plot text element: */
  var area_text_div = page_data['area_text_div'];
  var area_text = '<label>Area data sources</label>';
  /* get color map: */
  var area_colors = page_data['area_colors'];
  var color_count = area_colors.length;
  /* loop through data ids: */
  var data_ids = data['data_ids'];
  for (var i = 0; i < data_ids.length; i++) {
    /* get data for this id: */
    var data_id = data_ids[i];
    var data_url_type = data_id.split(':::');
    var data_url = data_url_type[0];
    var data_type = data_url_type[1];
    var data_label = data_url.split('/').slice(-1)[0];
    var id_data = data['data'][data_id];
    /* get color for this data source: */
    if (data_ids.length == 1) {
      var area_color_index = Math.round(
        0.5 * (color_count - 1)
      );
    } else {
      var area_color_index = Math.round(
        (i / (data_ids.length - 1)) * (color_count - 1)
      );
    }
    var area_color = area_colors[area_color_index];
    /* update plot text: */
    area_text += '<span class="plot_text_link">• <a href="' + data_url +
                 '" target="_blank" style="color: ' + area_color +';">' +
                 data_label + '</a><span class="plot_text_type"> (' +
                 data_type + ')</span></span>';
    /* get x values: */
    var x = id_data['area_years'];
    var y = id_data['areas'];
    /* area plot: */
    var scatter_area = {
      'name': data_label,
      'type': 'scatter',
      'mode': 'lines+markers',
      'x': x,
      'y': y,
      'marker': {
        'color': area_color
      },
      'hovertemplate': '%{x}: %{y:.4f} km²'
    };
    /* plot data, in order of plotting: */
    scatter_data.push(scatter_area);
  };
  /* scatter plot layout: */
  var scatter_layout = {
    'xaxis': {
      'title': 'Date',
      'type': 'date',
      'hoverformat': '%Y'
    },
    'yaxis': {
      'title': 'Area (km²)'
    }
  };
  /* scatter plot config: */
  var scatter_conf = {
    'showLink': false,
    'linkText': '',
    'displaylogo': false,
    'modeBarButtonsToRemove': [
      'autoScale2d',
      'lasso2d',
      'hoverClosestCartesian',
      'hoverCompareCartesian',
      'toggleSpikelines'
    ],
    'responsive': true
  };
  /* create the scatter plot: */
  var scatter_plot = Plotly.newPlot(
    'area_plot_div', scatter_data, scatter_layout, scatter_conf
  );
  /* update text: */
  area_text_div.innerHTML = area_text;
  /* add download button listener: */
  var area_download_el = page_data['area_download_el'];
  area_download_el.addEventListener('click', download_area_data);
};

/* function to load temperature data: */
async function load_temperature_data() {
  try {
    /* get data: */
    await fetch(
      data_temperature,
      {'cache': 'no-cache'}
    ).then(async function(data_req) {
      page_data['temperature'] = await data_req.json();
    });
    /* get data: */
    var data = page_data['temperature'];
  } catch(e) {
    /* no data, hide temperature plot elements: */
    var temperature_plot_els = page_data['temperature_plot_els'];
    for (var i = 0 ; i < temperature_plot_els.length; i++) {
      var temperature_plot_el = temperature_plot_els[i];
      temperature_plot_el.style.display = 'none';
    };
    var temperature_download_el = page_data['temperature_download_el'];
    temperature_download_el.style.display = 'none';
    return;
  };
  /* draw the temperature plot: */
  temperature_plot(data);
};

/* function to download temperature data: */
async function download_temperature_data() {
  /* get data: */
  let data_in = page_data['temperature'];
  let data_ids = data_in['data_ids'];
  /* create zip writer object: */
  let zip_writer = new zip.ZipWriter(
    new zip.Data64URIWriter('application/zip')
  );
  /* loop through data ids: */
  for (let i = 0; i < data_ids.length; i++) {
    /* get data for this id: */
    let data_id = data_ids[i];
    let data_url_type = data_id.split(':::');
    let data_url = data_url_type[0];
    let data_type = data_url_type[1];
    let data_label = data_url.split('/').slice(-1)[0];
    let data = data_in['data'][data_id];
    /* get metadata: */
    let data_doi = data['DOI'];
    let data_method = data['METHOD'];
    let data_source = data['DATA_SOURCE'];
    let data_notes = data['NOTES'];
    /* get data values: */
    let data_times = data['times'];
    let data_time_zones = data['time_zones'];
    let data_starts = data['start_dates'];
    let data_ends = data['end_dates'];
    let data_latitudes = data['latitudes'];
    let data_longitudes = data['longitudes'];
    let data_temperatures = data['temperatures'];
    let data_uncertaintys = data['uncertaintys'];
    let data_depths = data['depths'];
    /* init csv data: */
    let data_csv = '';
    /* add metadata: */
    data_csv += 'doi,' + data_doi + '\r\n';
    data_csv += 'method,' + data_method + '\r\n';
    data_csv += 'source,' + data_source + '\r\n';
    data_csv += 'notes,' + data_notes + '\r\n';
    data_csv += '\r\n';
    data_csv += 'time,time zone,start date,end date,latitude,longitude,temperature (°C),temperature uncertainty,depth\r\n';
    /* loop through data values: */
    for (let j = 0; j < data_times.length; j++) {
      data_csv += data_times[j] + ',' + data_time_zones[j] + ',' +
                  data_starts[j] + ',' + data_ends[j] + ',' +
                  data_latitudes[j] + ',' + data_longitudes[j] + ',' +
                  data_temperatures[j] + ',' + data_uncertaintys[j] + ',' +
                  data_depths[j] + '\r\n';
    };
    /* file name for output: */
    let csv_name = lake_id + '__temperature_' + data_label + '_' + data_type + '.csv';
    /* add data to zip file: */
    await zip_writer.add(
      csv_name, new zip.TextReader(data_csv)
    );
  };
  /* close zip file and get encoded data uri: */
  let data_uri = await zip_writer.close();
  /* set zip file name: */
  let zip_name = page_data['lake']['GLO_ID'] + '__temperature.zip';
  /* create a temporary link element: */
  let csv_link = document.createElement('a');
  csv_link.setAttribute('href', data_uri);
  csv_link.setAttribute('download', zip_name);
  csv_link.style.visibility = 'hidden';
  document.body.appendChild(csv_link);
  csv_link.click();
  document.body.removeChild(csv_link);
};

/* function to draw temperature plot: */
function temperature_plot(data) {
  /* init scatter plot data: */
  var scatter_data = [];
  var scatter_tm_data = [];
  /* plot text element: */
  var temperature_text_div = page_data['temperature_text_div'];
  var temperature_text = '<label>Temperature data sources</label>';
  /* get color map: */
  var temperature_colors = page_data['temperature_colors'];
  var color_count = temperature_colors.length;
  /* loop through data ids: */
  var data_ids = data['data_ids'];
  let thermistor_count = 0;
  for (var i = 0; i < data_ids.length; i++) {
    /* get data for this id: */
    var data_id = data_ids[i];
    var data_url_type = data_id.split(':::');
    var data_url = data_url_type[0];
    var data_type = data_url_type[1];
    var data_label = data_url.split('/').slice(-1)[0];
    var id_data = data['data'][data_id];
    /* get color for this data source: */
    if (data_ids.length == 1) {
      var temperature_color_index = Math.round(
        0.5 * (color_count - 1)
      );
    } else {
      var temperature_color_index = Math.round(
        (i / (data_ids.length - 1)) * (color_count - 1)
      );
    }
    var temperature_color = temperature_colors[temperature_color_index];
    /* update plot text: */
    temperature_text += '<span class="plot_text_link">• <a href="' + data_url +
                        '" target="_blank" style="color: ' + temperature_color +';">' +
                        data_label + '</a><span class="plot_text_type"> (' +
                        data_type + ')</span></span>';
    /* get x and y values: */
    var x = id_data['times'];
    if (x[0] == '') {
      var x = id_data['start_dates'];
    };
    var y = id_data['temperatures'];
    /* for thermistor data, filter values to where depth is 0: */
    if (data_type.toLowerCase() == 'thermistor') {
      var depths = id_data['depths'];
      var x_filtered = [];
      var y_filtered = [];
      for (var j = 0; j < depths.length; j++) {
        if (depths[j] == 0) {
          x_filtered.push(x[j]);
          y_filtered.push(y[j]);
        };
      };
      x = x_filtered;
      y = y_filtered;
    };
    /* temperature plot: */
    var scatter_temperature = {
      'name': data_label,
      'type': 'scatter',
      'mode': 'markers',
      'x': x,
      'y': y,
      'marker': {
        'color': temperature_color
      },
      'hovertemplate': '%{x}: %{y:.2f}°C'
    };
    /* plot data, in order of plotting: */
    scatter_data.push(scatter_temperature);
    /* if this is thermistor data ... add to thermistor data: */
    if (data_type.toLowerCase() == 'thermistor') {
      /* get x, y and z values: */
      x = id_data['times'];
      if (x[0] == '') {
        x = id_data['start_dates'];
      };
      var y = id_data['temperatures'];
      var z = id_data['depths'];
      /* set color options: */
      let scatter_colorscale = page_data['temperature_plot_colors'];
      let scatter_marker_index = thermistor_count %
                                 page_data['temperature_plot_markers'].length;
      let scatter_marker = page_data['temperature_plot_markers'][scatter_marker_index];
      var scatter_tm_temperature = {
        'name': data_label,
        'type': 'scatter',
        'mode': 'markers',
        'x': x,
        'y': y,
        'marker': {
          'color': z,
          'colorscale': scatter_colorscale,
          'symbol': scatter_marker,
          'colorbar': {
            'title': {
              'text': 'Depth (m)',
              'side': 'right'
            },
            'thickness': 20
          }
        },
        'hovertemplate': '%{x}: %{y:.2f}°C (%{marker.color:.1f}m)'
      };
      scatter_tm_data.push(scatter_tm_temperature);
      thermistor_count += 1;
    };
  };
  /* scatter plot layout: */
  var scatter_layout = {
    'xaxis': {
      'title': 'Date',
      'type': 'date',
      'hoverformat': '%Y-%m-%d'
    },
    'yaxis': {
      'title': 'Temperature (°C)'
    }
  };
  /* scatter plot config: */
  var scatter_conf = {
    'showLink': false,
    'linkText': '',
    'displaylogo': false,
    'modeBarButtonsToRemove': [
      'autoScale2d',
      'lasso2d',
      'hoverClosestCartesian',
      'hoverCompareCartesian',
      'toggleSpikelines'
    ],
    'responsive': true
  };
  /* add thermistor plot, if there is any thermistor data: */
  if (scatter_tm_data.length > 0) {
    scatter_layout['title'] = 'Thermistor Temperature Data';
    let scatter_tm_plot = Plotly.newPlot(
      'temperature_tm_plot_div', scatter_tm_data, scatter_layout, scatter_conf
    );
    scatter_layout['title'] = 'All Temperature Data';
  } else {
    /* remove thermistor plot element: */
    let scatter_tm_el = document.getElementById('temperature_tm_plot_div');
    scatter_tm_el.style.display = 'none';
  };
  /* create the scatter plot: */
  var scatter_plot = Plotly.newPlot(
    'temperature_plot_div', scatter_data, scatter_layout, scatter_conf
  );
  /* update text: */
  temperature_text_div.innerHTML = temperature_text;
  /* add download button listener: */
  var temperature_download_el = page_data['temperature_download_el'];
  temperature_download_el.addEventListener('click', download_temperature_data);
};

/* function to load volume data: */
async function load_volume_data() {
  try {
    /* get data: */
    await fetch(
      data_volume,
      {'cache': 'no-cache'}
    ).then(async function(data_req) {
      page_data['volume'] = await data_req.json();
    });
    /* get data: */
    var data = page_data['volume'];
  } catch(e) {
    /* no data, hide volume plot elements: */
    var volume_plot_els = page_data['volume_plot_els'];
    for (var i = 0 ; i < volume_plot_els.length; i++) {
      var volume_plot_el = volume_plot_els[i];
      volume_plot_el.style.display = 'none';
    };
    return;
  };
  /* draw the volume plot: */
  volume_plot(data);
  /* add volume table: */
  volume_table(data);
};

/* function to draw volume plot: */
function volume_plot(data) {
  /* x values are years: */
  var x = data['years'];
  /* init y values: */
  var y = [];
  /* init tick values: */
  var tickvals = [
    x[0],
  ];
  var tick_count = 0;
  /* loop through years: */
  for (var i = 0; i < x.length; i++) {
    /* get data for this year: */
    var data_year = x[i];
    y.push(data['data'][data_year]['VOLUME']);
    /* add to tickvals if appropriate: */
    if (i < 1) {
      continue;
    };
    if (i == x.length - 1) {
      if (x.length == 2) {
        tickvals.push(data_year);
      } else {
        if ((data_year - tickvals[tick_count]) <= 2) {
          tickvals[tick_count] = data_year;
        };
      };
    };
    if ((data_year - tickvals[tick_count]) > 2) {
      tickvals.push(data_year);
      tick_count += 1;
    };
  };
  /* volume plot: */
  var scatter_volume = {
    'name': 'Volume',
    'type': 'scatter',
    'mode': 'markers',
    'x': x,
    'y': y,
    'marker': {
      'color': '#000000',
      'size': 12
    },
    'hovertemplate': '%{x}: %{y:,} m³'
  };
  var scatter_data = [scatter_volume];
  /* scatter plot layout: */
  var scatter_layout = {
    'xaxis': {
      'tickmode': 'array',
      'tickvals': tickvals,
      'zeroline': false
    },
    'yaxis': {
      'zeroline': false
    },
    'margin': {
      'l': 25,
      'r': 15,
      'b': 25,
      't': 25
    }
  };
  /* scatter plot config: */
  var scatter_conf = {
    'showLink': false,
    'linkText': '',
    'displaylogo': false,
    'modeBarButtonsToRemove': [
      'autoScale2d',
      'lasso2d',
      'hoverClosestCartesian',
      'hoverCompareCartesian',
      'toggleSpikelines'
    ],
    'responsive': true
  };
  /* create the scatter plot: */
  var scatter_plot = Plotly.newPlot(
    'volume_plot_div', scatter_data, scatter_layout, scatter_conf
  );
};

/* function to draw volume table: */
function volume_table(data) {
  /* get data years: */
  let years = data['years'];
  /* get html element: */
  let table_el = page_data['volume_table_el'];
  /* init html: */
  let table_html = '';
  /* loop through years: */
  for (let i = 0; i < years.length; i++) {
    /* get data for this year: */
    let year = years[i];
    /* replace 'NA' values: */
    for (let j in data['data'][year]) {
      if (data['data'][year][j] == 'NA') {
        data['data'][year][j] = undefined;
      };
    };
    /* get required values: */
    let volume = data['data'][year]['VOLUME'] ?
                 data['data'][year]['VOLUME'].toString().replace(
                   /\B(?=(\d{3})+(?!\d))/g, ","
                 ) + ' m³' : '-';
    let uncertainty = data['data'][year]['UNCERTAINTY'] ?
                      data['data'][year]['UNCERTAINTY'] : '-';
    let start = data['data'][year]['START_DATE'] ?
                data['data'][year]['START_DATE'] : '-';
    let end = data['data'][year]['END_DATE'] ?
              data['data'][year]['END_DATE'] : '-';
    let method = data['data'][year]['METHOD'] ?
                 data['data'][year]['METHOD'] : '-';
    let source = data['data'][year]['DATA_SOURCE'] ?
                 data['data'][year]['DATA_SOURCE'] : '-';
    let doi = data['data'][year]['DOI'] ?
              '<a href="' + data['data'][year]['DOI'] + '" target="_blank">' +
              data['data'][year]['DOI'] + '</a>' : '-';
    let citation = data['data'][year]['CITATION'] ?
                   data['data'][year]['CITATION'] : '-';
    let notes = data['data'][year]['NOTES'] ?
                data['data'][year]['NOTES'] : '-';
    /* html for this entry: */
    let row_html = '<div class="volume_table_div flex_grow">' +
                   '<span class="volume_table_header">' + year + '</span><br>' +
                   '<label>Volume:</label> ' + volume + '<br>' +
                   '<label>Uncertainty:</label> ' + uncertainty + '<br>' +
                   '<label>Start Date:</label> ' + start + '<br>' +
                   '<label>End Date:</label> ' + end + '<br>' +
                   '<label>Method:</label> ' + method + '<br>' +
                   '<label>Source:</label> ' + source + '<br>' +
                   '<label>DOI:</label> ' + doi + '<br>' +
                   '<label>Citation:</label> <span class="volume_table_citation">' + citation + '</span><br>' +
                   '<label>Notes:</label> ' + notes +
                   '</div>';
    table_html += row_html;
  };
  /* update html: */
  table_el.innerHTML = table_html;
};

/* function to load depth data: */
async function load_depth_data() {
  try {
    /* get data: */
    await fetch(
      data_depth,
      {'cache': 'no-cache'}
    ).then(async function(data_req) {
      page_data['depth'] = await data_req.json();
    });
    /* get data for first data id: */
    var data_id = page_data['depth']['data_ids'][0];
    var data = page_data['depth']['data'][data_id];
    /* get x, y, and z data: */
    var x = data['grid_lon'];
    var y = data['grid_lat'];
    var z = data['grid_depth'];
  } catch(e) {
    /* no data, hide depth plot elements: */
    var depth_plot_els = page_data['depth_plot_els'];
    for (var i = 0 ; i < depth_plot_els.length; i++) {
      var depth_plot_el = depth_plot_els[i];
      depth_plot_el.style.display = 'none';
    };
    return;
  };
  /* draw the depth plot: */
  depth_plot(x, y, z);
};

/* function to draw depth plot: */
function depth_plot(x, y, z) {
  /* 3d depth plot: */
  var surface_depth = {
    'type': 'surface',
    'x': x,
    'y': y,
    'z': z,
    'surfacecolor': 'Blues',
    'colorscale': 'Blues'
  };
  /* plot data, in order of plotting: */
  var surf_data = [surface_depth];
  /* surface plot layout: */
  var surf_layout = {};
  /* surface plot config: */
  var surf_conf = {
    'showLink': false,
    'linkText': '',
    'displaylogo': false,
    'modeBarButtonsToRemove': [
      'autoScale2d',
      'lasso2d',
      'hoverClosestCartesian',
      'hoverCompareCartesian',
      'toggleSpikelines'
    ],
    'responsive': true
  };
  /* create the surf plot: */
  var surf_plot = Plotly.newPlot(
    'depth_plot_div', surf_data, surf_layout, surf_conf
  );
};

/* set up the page: */
function load_page() {
  load_lake_data();
  load_geometry_data();
  load_temperature_data();
  load_area_data();
  load_volume_data();
  load_depth_data();
}

/** add listeners: **/

/* on page load: */
window.addEventListener('load', function() {
  /* configure zip.js: */
  zip.configure({
    useWebWorkers: true,
    maxWorkers: 2,
  });
  /* set up the page ... : */
  load_page();
});
