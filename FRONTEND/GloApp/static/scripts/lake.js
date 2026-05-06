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
  /* geometry plot elements: */
  'geometry_plot_els': [
    document.getElementById('geometry_header_row'),
    document.getElementById('geometry_plot_row')
  ],
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
  /* temperature plot elements: */
  'temperature_plot_els': [
    document.getElementById('temperature_header_row'),
    document.getElementById('temperature_plot_row')
  ],
  'temperature_text_div': document.getElementById('temperature_text_div'),
  /* volume plot elements: */
  'volume_plot_els': [
    document.getElementById('volume_header_row'),
    document.getElementById('volume_plot_row')
  ],
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
    /* no data, hide temeprature plot elements: */
    var geometry_plot_els = page_data['geometry_plot_els'];
    for (var i = 0 ; i < geometry_plot_els.length; i++) {
      var geometry_plot_el = geometry_plot_els[i];
      geometry_plot_el.style.display = 'none';
    };
    return;
  };
  /* draw the geometry plot: */
  geometry_plot(data);
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
    poly_layer.bindTooltip('<b>' + parseInt(data['years'][i]) + '</b>' +
                           '<br>• Area: ' + poly_area.toFixed(3) + ' km²');
    var poly_key = ' ' + parseInt(data['years'][i]) +
                   '<span class="map_key_color" style="background-color: ' +
                   poly_color + ';"></span>';
    poly_layers[poly_key] = poly_layer;
    var poly_bounds = poly_layer.getBounds();
    min_lat = Math.min(min_lat, poly_bounds.getSouth())
    max_lat = Math.max(max_lat, poly_bounds.getNorth())
    min_lon = Math.min(min_lon, poly_bounds.getWest())
    max_lon = Math.max(max_lon, poly_bounds.getEast())
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
  /* head to lake area: */
  map.flyToBounds([
      [min_lat, min_lon],
      [max_lat, max_lon]
  ]);
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
    /* no data, hide temeprature plot elements: */
    var area_plot_els = page_data['area_plot_els'];
    for (var i = 0 ; i < area_plot_els.length; i++) {
      var area_plot_el = area_plot_els[i];
      area_plot_el.style.display = 'none';
    };
    return;
  };
  /* draw the area plot: */
  area_plot(data);
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
      }
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
    area_plot_div, scatter_data, scatter_layout, scatter_conf
  );
  /* update text: */
  area_text_div.innerHTML = area_text;
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
    /* no data, hide temeprature plot elements: */
    var temperature_plot_els = page_data['temperature_plot_els'];
    for (var i = 0 ; i < temperature_plot_els.length; i++) {
      var temperature_plot_el = temperature_plot_els[i];
      temperature_plot_el.style.display = 'none';
    };
    return;
  };
  /* draw the temperature plot: */
  temperature_plot(data);
};

/* function to draw temperature plot: */
function temperature_plot(data) {
  /* init scatter plot data: */
  var scatter_data = [];
  /* plot text element: */
  var temperature_text_div = page_data['temperature_text_div'];
  var temperature_text = '<label>Temperature data sources</label>';
  /* get color map: */
  var temperature_colors = page_data['temperature_colors'];
  var color_count = temperature_colors.length;
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
    /* get x values: */
    var x = id_data['times'];
    if (x[0] == '') {
      var x = id_data['start_dates'];
    };
    var y = id_data['temperatures'];
    /* temperature plot: */
    var scatter_temperature = {
      'name': data_label,
      'type': 'scatter',
      'mode': 'markers',
      'x': x,
      'y': y,
      'marker': {
        'color': temperature_color
      }
    };
    /* plot data, in order of plotting: */
    scatter_data.push(scatter_temperature);
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
  /* create the scatter plot: */
  var scatter_plot = Plotly.newPlot(
    temperature_plot_div, scatter_data, scatter_layout, scatter_conf
  );
  /* update text: */
  temperature_text_div.innerHTML = temperature_text;
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
    /* no data, hide temeprature plot elements: */
    var volume_plot_els = page_data['volume_plot_els'];
    for (var i = 0 ; i < volume_plot_els.length; i++) {
      var volume_plot_el = volume_plot_els[i];
      volume_plot_el.style.display = 'none';
    };
    return;
  };
  /* draw the volume plot: */
  volume_plot(data);
};

/* function to draw volume plot: */
function volume_plot(data) {
  /* x values are years: */
  var x = data['years'];
  /* init y values: */
  var y = [];
  /* init hover text values: */
  var hover_text = [];
  /* loop through years: */
  for (var i = 0; i < x.length; i++) {
    /* get data for this year: */
    var data_year = x[i];
    y.push(data['data'][data_year]['VOLUME']);
    /* store hover text: */
    hover_text[i] = '<b>volume:</b> ' + data['data'][data_year]['VOLUME'] + '<br>' +
                    '<b>method:</b> ' + data['data'][data_year]['METHOD'] + '<br>' +
                    '<b>data source:</b> ' + data['data'][data_year]['DATA_SOURCE'] + '<br>' +
                    '<b>doi:</b> ' + data['data'][data_year]['DOI'];
  };
  /* volume plot: */
  var scatter_volume = {
    'type': 'scatter',
    'mode': 'lines+markers',
    'x': x,
    'y': y,
    'hoverinfo': 'text',
    'hovertext': hover_text
  };
  var scatter_data = [scatter_volume];
  /* scatter plot layout: */
  var scatter_layout = {
    'xaxis': {
      'title': 'Date',
      'type': 'date',
      'hoverformat': '%Y'
    },
    'yaxis': {
      'title': 'Volume (m³)'
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
    volume_plot_div, scatter_data, scatter_layout, scatter_conf
  );
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
    /* no data, hide temeprature plot elements: */
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
    depth_plot_div, surf_data, surf_layout, surf_conf
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
  /* set up the page ... : */
  load_page();
});
