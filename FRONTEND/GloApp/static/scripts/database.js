/*** database.js ***/

'use strict';

/** global variables: **/

var page_data = {
  /* map color map (R viridis mako): */
  'map_colors': [
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

/* function to laod map: */
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

  /* get min / max expansion rates: */
  var expansion_rates = [];
  for (var i = 0; i < lakes_data.length; i++) {
    expansion_rates.push(lakes_data[i]['EXPANSION_RATE']);
  };
  expansion_rates = expansion_rates.sort();
  var min_expansion_index = Math.round(0.1 * (expansion_rates.length -1));
  var min_expansion = expansion_rates[min_expansion_index];
  var max_expansion_index = Math.round(0.9 * (expansion_rates.length -1));
  var max_expansion = expansion_rates[max_expansion_index];
  var expansion_range = max_expansion - min_expansion;
  /* get color map: */
  var map_colors = page_data['map_colors'];
  var color_count = map_colors.length;

  /* draw lake markers: */
  for (var i = 0; i < lakes_data.length; i++) {
    var lake = lakes_data[i];
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
    var poly_color_index = Math.round(
      ((lake_expansion_rate - min_expansion) / expansion_range) * (color_count - 1)
    );
    if (poly_color_index < 0) { poly_color_index = 0; };
    poly_color_index = Math.min(poly_color_index, color_count - 1);
    var poly_color = map_colors[poly_color_index];
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
  };
};

/* set up the page: */
function load_page() {
  load_map();
}

/** add listeners: **/

/* on page load: */
window.addEventListener('load', function() {
  /* set up the page ... : */
  load_page();
});

/** lakes table: **/
$(document).ready(function(){
  $('#lakes_table').DataTable({
    columnDefs: [{
      'targets': [-1],
      'orderable': false
    }],
    'order': [[0, "asc"]],
    'pageLength': 10,
    'stateSave': true
  });
});
