/*** database.js ***/

'use strict';

/** global variables: **/

var page_data = {
  /* leaflet map: */
  'map': null,
  /* store map lake markers here: */
  'lake_markers': [],
  /* map color map (R viridis mako): */
  'map_colormap': {
    'min': -0.0006,
    'max': 0.0006,
    'decimals': 4,
    'colors': [
      "#def5e5ff", "#a0dfb9ff", "#54c9adff", "#38aaacff", "#348aa6ff", "#366a9fff",
      "#40498eff", "#3b2f5eff", "#28192fff", "#0b0405ff"
    ]
  },
  /* filtered lake_ids get stored here: */
  'lake_ids': [],
  /* lakes data table object: */
  'lakes_table': null,
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

/* function to convert value to color: */
function value_to_color(value) {
  /* get colormap: */
  var colormap = page_data['map_colormap'];
  /* get the colours and bounds for variable: */
  var data_min = colormap['min'];
  var data_max = colormap['max'];
  var data_colors = colormap['colors'];
  /* number of colours: */
  var color_count = data_colors.length;
  /* max index value: */
  var max_index = color_count - 1;
  /* work out increment for color values: */
  var color_inc = (data_max - data_min) / color_count;
  /* work out colour index for value: */
  var color_index = Math.floor((value - data_min) / color_inc);
  if (color_index < 0) {
    color_index = 0;
  };
  if (color_index > max_index) {
    color_index = max_index;
  };
  /* return the colour: */
  return data_colors[color_index];
};

/* function to draw color map data: */
function draw_colormap() {
  /* get colormap: */
  var colormap = page_data['map_colormap'];
  /* get the colours and bounds for variable: */
  var data_min = colormap['min'];
  var data_max = colormap['max'];
  var data_colors = colormap['colors'];
  var data_decimals = colormap['decimals'];
  /* number of colours: */
  var color_count = data_colors.length;
  /* work out increment for color values: */
  var color_inc = (data_max - data_min) / color_count;
  /* create html: */
  var colormap_html = '';
  for (var i = (color_count - 1); i > -1; i--) {
    var my_html = '<p>';
    my_html += '<span class="map_colormap_color" style="background: ' + data_colors[i] + ';"></span>';
    my_html += '<span class="map_colormap_value">';
    if (i == (color_count - 1)) {
      my_html += '&gt;= ' + (data_min + (i * color_inc)).toFixed(data_decimals);
    } else {
      if (i == 0) {
        my_html += '&lt; ';
      } else {
        my_html += (data_min + (i * color_inc)).toFixed(data_decimals) + ' &lt; ';
      };
      my_html += (data_min + ((i + 1) * color_inc)).toFixed(data_decimals);
    };
    my_html += '</span>';
    my_html += '</p>';
    colormap_html += my_html;
  };
  /* return the html: */
  return colormap_html;
};

/* function to update map: */
function update_map() {
  /* get active lake ids, map and lake markers: */
  let lake_ids = page_data['lake_ids'];
  let map = page_data['map'];
  let lake_markers = page_data['lake_markers'];
  /* store new active lake markers and ids here: */
  let active_ids = [];
  let active_markers = [];
  /* remove inactive markers first: */
  for (let i = 0; i < lake_markers.length; i++) {
    /* get marker: */
    let lake_marker = lake_markers[i];
    /* get lake id from marker: */
    let lake_id = lake_marker.lake_id;
    /* if this lake is not in the active set, remove from map: */
    if (lake_ids.indexOf(lake_id) < 0) {
      lake_marker.remove();
    /* else, store id: */
    } else {
      active_ids.push(lake_id);
      active_markers.push(lake_marker);
    };
  };
  /* draw any new lake markers: */
  for (let i = 0; i < lakes_data.length; i++) {
    /* get lake id: */
    var lake = lakes_data[i];
    var lake_id = lake['GLO_ID'];
    /* if this is not in the current active set, move on: */
    if (lake_ids.indexOf(lake_id) < 0) {
      continue;
    };
    /* if this is already on the map, move on: */
    if (active_ids.indexOf(lake_id) > -1) {
      continue;
    };
    /* get lake information: */
    var lake_lat = lake['LATITUDE'];
    var lake_lon = lake['LONGITUDE'];
    var lake_name = lake['GLO_ID'];
    var lake_alt_name = lake['COMMON_NAME'];
    var lake_country = lake['COUNTRY'];
    var lake_connectivity = lake['CONNECTIVITY'];
    var lake_area = lake['AREA'];
    var lake_expansion_rate = lake['EXPANSION_RATE'];
    var lake_expansion_uncertainty = lake['EXPANSION_RATE_UNCERTAINTY'];
    var lake_depth_max = lake['DEPTH_MAX'];
    var lake_volume = lake['VOLUME'];
    var lake_volume_year = lake['VOLUME_YEAR'];
    var lake_url = window.location.href + '/lake/' + lake_name;
    var lake_text = '<b>' + lake_name + '</b>';
    if (lake_alt_name != null) { lake_text += '<br>• Common name: ' + lake_alt_name; };
    if (lake_country != null) { lake_text += '<br>• Country: ' + lake_country; };
    if (lake_connectivity != null) { lake_text += '<br>• Connectivity: ' + lake_connectivity; };
    if (lake_area != null) { lake_text += '<br>• Area: ' + lake_area.toFixed(3) + ' km²'; };
    if ((lake_expansion_rate != null) && (lake_expansion_uncertainty != null)) {
      lake_text += '<br>• Expansion rate: ' + lake_expansion_rate + ' km²/year (+/-' +
                   lake_expansion_uncertainty + ')';
    };
    if (lake_depth_max != null) { lake_text += '<br>• Maximum depth: ' + lake_depth_max.toFixed(0) + ' m'; };
    if ((lake_volume != null) && (lake_volume_year != null)) {
      lake_text += '<br>• Volume: ' + lake_volume.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                   ' m³ (' + lake_volume_year + ')';
    };
    /* get color for this polygon: */
    var poly_color = value_to_color(lake_expansion_rate);
    /* draw polygon: */
    var lake_marker = new L.circleMarker([lake_lat, lake_lon],{
      radius: 5,
      stroke: true,
      weight: 1,
      opacity: 0.6,
      color: '#39ffff',
      fill: true,
      fillOpacity: 0.8,
      fillColor: poly_color
    });
    lake_marker.url = lake_url;
    lake_marker.bindTooltip(lake_text, {interactive: true});
    lake_marker.on('click', function(e) { window.open(e.sourceTarget.url); });
    lake_marker.addTo(map);
    /* store marker and id: */
    active_ids.push(lake_id);
    active_markers.push(lake_marker);
  };
  /* store lake markers: */
  page_data['lake_markers'] = active_markers;
};

/* function to load map: */
function load_map() {
  /* gep map element: */
  var map_div = document.getElementById('lakes_map');
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
  /* init min / max lat / lon: */
  var min_lat = -90;
  var max_lat = 90;
  var min_lon = -180;
  var max_lon = 180;
  /* define map: */
  var map = L.map(map_div, {
    /* map layers: */
    layers: [
      s2_layer
    ],
    /* map center: */
    center: [
      29.05,
      84.62
    ],
    /* define bounds: */
    maxBounds: [
      [min_lat, min_lon],
      [max_lat, max_lon],
    ],
    maxBoundsViscosity: 1.0,
    /*  zoom levels: */
    zoom:    7,
    minZoom: 2,
    maxZoom: 16
  });
  /* remove prefix from attribution control: */
  var map_atrr_control = map.attributionControl;
  map_atrr_control.setPrefix(false);
  /* add mouse pointer position: */
  L.control.mousePosition().addTo(map);
  /* add scale: */
  L.control.scale().addTo(map);
  /* add layer control: */
  L.control.layers(
    tile_layers, {}, {collapsed: true, sortLayers: false}
  ).addTo(map);
  /* add map title: */
  var map_title = L.control();
  map_title.onAdd = function(map) {
     this._div = L.DomUtil.create('div', 'map_ctl map_title');
     this.update();
     return this._div;
  };
  map_title.update = function(title) {
    if (title != undefined) {
      this._div.innerHTML = title;
    };
  };
  map_title.addTo(map);
  /* update map title: */
  var my_title = 'Expansion rate (km²/year)';
  map_title.update(my_title);
  /* add colormap: */
  var colormap_src = draw_colormap();
  var map_colormap = L.control({position: 'bottomright'});
  map_colormap.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'map_ctl map_colormap');
      this.update(colormap_src);
      return this._div;
  };
  map_colormap.update = function(colormap_html) {
    this._div.innerHTML = colormap_html;
  };
  map_colormap.addTo(map);
  /* store map: */
  page_data['map'] = map;
  /* add markers: */
  update_map();
};

/* update active lake ids from data table: */
function update_lake_ids_dt() {
  /* get table: */
  let lakes_table = page_data['lakes_table'];
  /* init filtered lake ids from table: */
  let lake_ids = [];
  lakes_table.rows({'search': 'applied'}).data().each(function(lake) {
    lake_ids.push(lake[0]);
  });
  /* store lake ids information: */
  page_data['lake_ids'] = lake_ids;
};

/* set up lakes data table: */
function load_data_table() {
  /* init lakes table: */
  $(document).ready(function(){
    let lakes_table = $('#lakes_table').DataTable({
      columnDefs: [{
        'targets': [-1],
        'orderable': false
      }],
      'order': [[0, "asc"]],
      'pageLength': 10,
      'stateSave': true
    });
    /* store table: */
    page_data['lakes_table'] = lakes_table;
    /* update lake ids: */
    update_lake_ids_dt();
    /* load the map: */
    load_map();
    /* update map when table is updated: */
    lakes_table.on('draw', function() {
      update_lake_ids_dt();
      update_map();
    });
  });
};

/* set up the page: */
function load_page() {
  /* set up data table: */
  load_data_table();
}

/** add listeners: **/

/* on page load: */
window.addEventListener('load', function() {
  /* set up the page ... : */
  load_page();
});
