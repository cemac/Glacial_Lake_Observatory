/*** database.js ***/

'use strict';

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
    'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2023_3857/default/g/{z}/{y}/{x}.jpg', {
      'attribution': '<a href="https://s2maps.eu/" target="_blank">Sentinel-2 cloudless</a>'
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
      'attribution': 'ITS_LIVE'
    }
  );
  /* all tile layers: */
  var tile_layers = {
    'Sentinel-2': s2_layer,
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
      28.5,
      84.5
    ],
    /* define bounds: */
    maxBounds: [
      [min_lat, min_lon],
      [max_lat, max_lon],
    ],
    maxBoundsViscosity: 1.0,
    /*  zoom levels: */
    zoom:    5,
    minZoom: 2,
    maxZoom: 12
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

  /* draw lake markers: */
  for (var i = 0; i < lakes_data.length; i++) {
    var lake = lakes_data[i];
    var lake_lat = lake['LATITUDE'];
    var lake_lon = lake['LONGITUDE'];
    var lake_name = lake['GLO_ID'];
    var lake_alt_name = lake['COMMON_NAME'];
    var lake_url = window.location.href + '/lake/' + lake_name;
    var lake_text = '<b>' + lake_name + '</b>';
    if (lake_alt_name != null) {
      lake_text += '<br>' + lake_alt_name;
    };
    var lake_marker = new L.circleMarker([lake_lat, lake_lon],{
      radius: 8,
      stroke: true,
      weight: 1,
      opacity: 0.9,
      color: '#cc0033',
      fill: true,
      fillOpacity: 0.8,
      fillColor: '#ff3333'
    });
    lake_marker.url = lake_url;
    lake_marker.bindTooltip(lake_text, {interactive: true});
    lake_marker.on('click', function(e) { window.location.href = e.sourceTarget.url; });
    lake_marker.addTo(map);
  };
};

/* function to load temperature data: */
async function load_temperature_data() {
  /* get data: */
  await fetch(
    data_temperature,
    {'cache': 'no-cache'}
  ).then(async function(data_req) {
    page_data['temperature'] = await data_req.json();
  });
  /* get data: */
  var data = page_data['temperature'];
  /* draw the temperature plot: */
  temperature_plot(data);
};

/* function to draw temperature plot: */
function temperature_plot(data) {
  /* init scatter plot data: */
  var scatter_data = [];
  /* loop through data ids: */
  var data_ids = data['data_ids'];
  for (var i = 0; i < data_ids.length; i++) {
    /* get data for this id: */
    var data_id = data_ids[i];
    var id_data = data['data'][data_id];
    /* get x values: */
    var x = id_data['times'];
    if (x[0] == '') {
      var x = id_data['start_dates'];
    };
    var y = id_data['temperatures'];
    /* temperature plot: */
    var scatter_temperature = {
      'name': data_id,
      'type': 'scatter',
      'mode': 'markers',
      'x': x,
      'y': y
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
    'pageLength': 50,
    'stateSave': true
  });
});
