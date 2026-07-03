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
  /* area selector goes here: */
  'area_select': null,
  /* filtered lake_ids get stored here: */
  'lake_ids': [],
  'map_lake_ids': [],
  /* lakes data table object: */
  'lakes_table': null,
  'lakes_table_updating': false,
  /* filter elements, values, etc.: */
  'filters': {
    'area': {
      'el': document.getElementById('slider_area'),
      'value_el': document.getElementById('slider_area_value'),
      'step': 0.1,
      'margin': 0.3,
      'min': 0,
      'max': 10,
      'lo': 0,
      'hi': 10
    },
    'volume': {
      'el': document.getElementById('slider_volume'),
      'value_el': document.getElementById('slider_volume_value'),
      'step': 100000,
      'margin': 5000000,
      'min': 0,
      'max': 10,
      'lo': 0,
      'hi': 10
    },
    'expansion': {
      'el': document.getElementById('slider_expansion'),
      'value_el': document.getElementById('slider_expansion_value'),
      'step': 0.001,
      'margin': 0.005,
      'min': 0,
      'max': 10,
      'lo': 0,
      'hi': 10
    }
  }
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
  /* create area select: */
  let area_select = new L.LocationFilter2({});
  page_data['area_select'] = area_select;
  /* add area selection to map: */
  area_select.addTo(map);
  /* add area select control: */
  let map_area_select = L.control({position: 'topleft'});
  map_area_select.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'map_area_select_container');
    this.update();
    return this._div;
  };
  map_area_select.update = function(props) {
    this._div.innerHTML = '<img class="map_area_select_img" ' +
                          'src="' + images_url + '/map/area_select.png" title="Select an area">';
  };
  map_area_select.addTo(map);
  /* add listener for map text open button ... get the element: */
  let map_area_select_el = document.getElementsByClassName('map_area_select_container')[0];
  /* add the listener: */
  map_area_select_el.addEventListener('click', area_select_toggle);
  /* make sure selection is initially disabled: */
  area_select.disable();
  /* store map: */
  page_data['map'] = map;
  /* update the page data: */
  update_data();
};

/* function to open tooltip for lake id: */
function open_lake_tt(lake_id) {
  /* get active lake markers: */
  let lake_markers = page_data['lake_markers'];
  /* loop through markers: */
  for (let i = 0; i < lake_markers.length; i++) {
    /* get marker: */
    let lake_marker = lake_markers[i];
    /* get lake id from marker: */
    let marker_id = lake_marker.lake_id;
    /* if this is the required lake ... : */
    if (marker_id == lake_id) {
        lake_marker.openTooltip();
        break;
    };
  };
};

/* function to close tooltip for lake id: */
function close_lake_tt(lake_id) {
  /* get active lake markers: */
  let lake_markers = page_data['lake_markers'];
  /* loop through markers: */
  for (let i = 0; i < lake_markers.length; i++) {
    /* get marker: */
    let lake_marker = lake_markers[i];
    /* get lake id from marker: */
    let marker_id = lake_marker.lake_id;
    /* if this is the required lake ... : */
    if (marker_id == lake_id) {
        lake_marker.closeTooltip();
        break;
    };
  };
};

/* function to toggle ara selection: */
function area_select_toggle() {
  /* get area select: */
  var area_select = page_data['area_select'];
  /* select button element: */
  let map_area_select_el = document.getElementsByClassName('map_area_select_container')[0];
  /* if select already enabled: */
  if ((area_select != null) && (area_select.isEnabled())) {
    /* disable it: */
    area_select.disable();
    /* update data: */
    update_data();
    /* update area select control html: */
    map_area_select_el.innerHTML = '<img class="map_area_select_img" ' +
                                   'src="' + images_url + '/map/area_select.png"' +
                                   'title="Select an area">';
    return;
  };
  /* store all current active lake ids: */
  page_data['map_lake_ids'] = page_data['lake_ids'];
  /* enable the area select: */
  area_select.enable();
  /* update things based on selected area: */
  update_data();
  /* add on change functionality: */
  area_select.on('change', update_data);
  /* update area select control html: */
  map_area_select_el.innerHTML = '<img class="map_area_select_img" ' +
                                 'src="' + images_url + '/map/close.png"' +
                                 'title="Clear area selection">';
};

/* set up filters: */
function load_filters() {
  /* loop through lake data to get required values. init these: */
  let areas = [];
  let volumes = [];
  let expansions = [];
  /* loop through lakes: */
  for (let i = 0; i < lakes_data.length; i++) {
    /* get lake id: */
    var lake = lakes_data[i];
    /* get lake information: */
    var lake_area = lake['AREA'];
    var lake_volume = lake['VOLUME'];
    var lake_expansion = lake['EXPANSION_RATE'];
    /* store numeric values: */
    if (isFinite(lake_area)) {
      areas.push(lake_area);
    };
    if (isFinite(lake_volume)) {
      volumes.push(lake_volume);
    };
    if (isFinite(lake_expansion)) {
      expansions.push(lake_expansion);
    };
  };
  /* store mins and maxs ... area: */
  let area_step = page_data['filters']['area']['step'];
  page_data['filters']['area']['min'] = Math.floor(
    parseFloat((Math.min.apply(null, areas)).toFixed(2)) / area_step
  ) * area_step;
  page_data['filters']['area']['max'] = Math.ceil(
    parseFloat((Math.max.apply(null, areas)).toFixed(2)) / area_step
  ) * area_step;
  page_data['filters']['area']['lo'] = page_data['filters']['area']['min'];
  page_data['filters']['area']['hi'] = page_data['filters']['area']['max'];
  /* volume: */
  let volume_step = page_data['filters']['volume']['step'];
  page_data['filters']['volume']['min'] = Math.floor(
    parseFloat((Math.min.apply(null, volumes)).toFixed(0)) / volume_step
  ) * volume_step;
  page_data['filters']['volume']['max'] = Math.ceil(
    parseFloat((Math.max.apply(null, volumes)).toFixed(0)) / volume_step
  ) * volume_step;
  page_data['filters']['volume']['lo'] = page_data['filters']['volume']['min'];
  page_data['filters']['volume']['hi'] = page_data['filters']['volume']['max'];
  /* expansion rate: */
  let expansion_step = page_data['filters']['expansion']['step'];
  page_data['filters']['expansion']['min'] = Math.floor(
    parseFloat((Math.min.apply(null, expansions)).toFixed(4)) / expansion_step
  ) * expansion_step;
  page_data['filters']['expansion']['max'] = Math.ceil(
    parseFloat((Math.max.apply(null, expansions)).toFixed(4)) / expansion_step
  ) * expansion_step;
  page_data['filters']['expansion']['lo'] = page_data['filters']['expansion']['min'];
  page_data['filters']['expansion']['hi'] = page_data['filters']['expansion']['max'];
  /* add area filter. get html element: */
  let area_el = page_data['filters']['area']['el'];
  let area_value_el = page_data['filters']['area']['value_el'];
  let area_margin = page_data['filters']['area']['margin'];
  if (area_el.noUiSlider == undefined){
    /* create slider: */
    let slider_lo = page_data['filters']['area']['lo'];
    let slider_hi = page_data['filters']['area']['hi'];
    noUiSlider.create(area_el, {
      'start': [slider_lo, slider_hi],
      'range': {
        'min': slider_lo,
        'max': slider_hi
      },
      'connect': true,
      'step': area_step,
      'margin': area_margin,
      'tooltips': false
    });
    /* set value: */
    area_value_el.innerHTML = slider_lo + ' km² to ' + slider_hi + ' km²';
    /* add change listener: */
    area_el.noUiSlider.on('change', function() {
      /* get values: */
      let value_lo = parseFloat(area_el.noUiSlider.get()[0]);
      let value_hi = parseFloat(area_el.noUiSlider.get()[1]);
      /* store the values: */
      page_data['filters']['area']['lo'] = value_lo;
      page_data['filters']['area']['hi'] = value_hi;
      /* update data: */
      update_data();
      /* display the value: */
      area_value_el.innerHTML = value_lo + ' km² to ' + value_hi + ' km²';
    });
    /* add slide listener: */
    area_el.noUiSlider.on('slide', function() {
      /* get values: */
      let value_lo = parseFloat(area_el.noUiSlider.get()[0]);
      let value_hi = parseFloat(area_el.noUiSlider.get()[1]);
      /* display the value: */
      area_value_el.innerHTML = value_lo + ' km² to ' + value_hi + ' km²';
    });
  };
  /* add volume filter. get html element: */
  let volume_el = page_data['filters']['volume']['el'];
  let volume_value_el = page_data['filters']['volume']['value_el'];
  let volume_margin = page_data['filters']['volume']['margin'];
  if (volume_el.noUiSlider == undefined){
    /* create slider: */
    let slider_lo = page_data['filters']['volume']['lo'];
    let slider_hi = page_data['filters']['volume']['hi'];
    noUiSlider.create(volume_el, {
      'start': [slider_lo, slider_hi],
      'range': {
        'min': slider_lo,
        'max': slider_hi
      },
      'connect': true,
      'step': volume_step,
      'margin': volume_margin,
      'tooltips': false
    });
    /* set value: */
    volume_value_el.innerHTML = slider_lo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' m³ to ' +
                                slider_hi.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' m³';
    /* add change listener: */
    volume_el.noUiSlider.on('change', function() {
      /* get values: */
      let value_lo = parseFloat(volume_el.noUiSlider.get()[0]);
      let value_hi = parseFloat(volume_el.noUiSlider.get()[1]);
      /* store the values: */
      page_data['filters']['volume']['lo'] = value_lo;
      page_data['filters']['volume']['hi'] = value_hi;
      /* update data: */
      update_data();
      /* display the value: */
      volume_value_el.innerHTML = value_lo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' m³ to ' +
                                  value_hi.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' m³';
    });
    /* add slide listener: */
    volume_el.noUiSlider.on('slide', function() {
      /* get values: */
      let value_lo = parseFloat(volume_el.noUiSlider.get()[0]);
      let value_hi = parseFloat(volume_el.noUiSlider.get()[1]);
      /* display the value: */
      volume_value_el.innerHTML = value_lo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' m³ to ' +
                                  value_hi.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' m³';
    });
  };
  /* add expansion filter. get html element: */
  let expansion_el = page_data['filters']['expansion']['el'];
  let expansion_value_el = page_data['filters']['expansion']['value_el'];
  let expansion_margin = page_data['filters']['expansion']['margin'];
  if (expansion_el.noUiSlider == undefined){
    /* create slider: */
    let slider_lo = page_data['filters']['expansion']['lo'];
    let slider_hi = page_data['filters']['expansion']['hi'];
    noUiSlider.create(expansion_el, {
      'start': [slider_lo, slider_hi],
      'range': {
        'min': slider_lo,
        'max': slider_hi
      },
      'format': {
        'to': function(value) { return value.toFixed(3); },
        'from': function(value) { return Number(parseFloat(value).toFixed(3)); }
      },
      'connect': true,
      'step': expansion_step,
      'margin': expansion_margin,
      'tooltips': false
    });
    /* set value: */
    expansion_value_el.innerHTML = slider_lo + ' km²/year to ' + slider_hi + ' km²/year';
    /* add change listener: */
    expansion_el.noUiSlider.on('change', function() {
      /* get values: */
      let value_lo = parseFloat(expansion_el.noUiSlider.get()[0]);
      let value_hi = parseFloat(expansion_el.noUiSlider.get()[1]);
      /* store the values: */
      page_data['filters']['expansion']['lo'] = value_lo;
      page_data['filters']['expansion']['hi'] = value_hi;
      /* update data: */
      update_data();
      /* display the value: */
      expansion_value_el.innerHTML = value_lo + ' km²/year to ' + value_hi + ' km²/year';
    });
    /* add slide listener: */
    expansion_el.noUiSlider.on('slide', function() {
      /* get values: */
      let value_lo = parseFloat(expansion_el.noUiSlider.get()[0]);
      let value_hi = parseFloat(expansion_el.noUiSlider.get()[1]);
      /* display the value: */
      expansion_value_el.innerHTML = value_lo + ' km²/year to ' + value_hi + ' km²/year';
    });
  };



  /* load the map: */
  load_map();
};

/* function to update data on lakes tale update: */
function lakes_table_draw() {
  /* get the table: */
  let lakes_table = page_data['lakes_table'];
  /* don't update if already updating ... : */
  if (page_data['lakes_table_updating'] == false) {
    /* start update: */
    page_data['lakes_table_updating'] = true;
    /* clear lake id search: */
    lakes_table.column(0).search('');
    /* redraw table: */
    lakes_table.draw();
    /* update data: */
    update_data();
    /* end update: */
    page_data['lakes_table_updating'] = false;
  };
};

/* set up lakes data table: */
function load_data_table() {
  /* init lakes table: */
  $(document).ready(function(){
    let lakes_table = $('#lakes_table').DataTable({
      'columnDefs': [{
        'orderable': false,
        'targets': [-1]
      }, {
        'type': 'num',
        'targets': [4, 5, 6, 7]
      }, {
        'render': function (data, type, row, meta) {
          if (type == 'sort') {
            return row[8];
          };
          return data;
        },
        'targets': [7]
      }, {
        'visible': false,
        'targets': [8]
      }],
      'order': [[0, 'asc']],
      'pageLength': 10,
      'stateSave': false
    });
    /* store table: */
    page_data['lakes_table'] = lakes_table;
    /* clear any id based searches ... : */
    lakes_table.column(0).search('').draw();
    /* update data when table is updated: */
    lakes_table.on('draw', lakes_table_draw);
    /* load filters: */
    load_filters();
  });
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
    lake_marker.lake_id = lake_id;
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

/* update data table from active lake ids: */
function update_lakes_table() {
  /* get active lake ids and lake table: */
  let lake_ids = page_data['lake_ids'];
  let lakes_table = page_data['lakes_table'];
  /* if no lake ids ... : */
  if (lake_ids.length < 1) {
    /* filter table based on nonsens: */
    lakes_table.column(0).search('NULL|VOID', true).draw();
  } else {
    /* filter table based on ids and re-draw: */
    lakes_table.column(0).search(lake_ids.join('|'), true).draw();
  };
};

/* try to update and synchronise data sources / filters ... : */
function update_data() {
  /* init aray for storing new lake ids: */
  let lake_ids = [];

  /* get lake ids from table first: */
  let lakes_table = page_data['lakes_table'];
  /* init filtered lake ids from table: */
  lakes_table.rows({'search': 'applied'}).data().each(function(lake) {
    lake_ids.push(lake[0]);
  });

  /* get lake ids from filters ... area: */
  let area_slider = page_data['filters']['area']['el'];
  let area_min = page_data['filters']['area']['min'];
  let area_max = page_data['filters']['area']['max'];
  let [area_lo, area_hi] = area_slider.noUiSlider.get();
  /* only filter by area if slider has been set ... : */
  if ((area_lo != area_min) || (area_hi != area_max)) {
    /* store new lake ids here: */
    let lake_ids_area = [];
    /* loop through lakes: */
    for (let i = 0; i < lakes_data.length; i++) {
      /* get lake info: */
      let lake = lakes_data[i];
      /* check id first: */
      let lake_id = lake['GLO_ID'];
      if (lake_ids.indexOf(lake_id) < 0) {
        continue;
      };
      /* check for lake area: */
      let lake_area = lake['AREA'];
      if (lake_area == null) {
        continue;
      };
      /* check if lake area is wihtin required bounds: */
      if ((area_lo <= lake_area) && (lake_area <= area_hi)) {
        /* store lake id: */
        lake_ids_area.push(lake_id);
      };
    };
    /* update lake ids: */
    lake_ids = lake_ids_area;
  };

  /* volume filter: */
  let volume_slider = page_data['filters']['volume']['el'];
  let volume_min = page_data['filters']['volume']['min'];
  let volume_max = page_data['filters']['volume']['max'];
  let [volume_lo, volume_hi] = volume_slider.noUiSlider.get();
  /* only filter by volume if slider has been set ... : */
  if ((volume_lo != volume_min) || (volume_hi != volume_max)) {
    /* store new lake ids here: */
    let lake_ids_volume = [];
    /* loop through lakes: */
    for (let i = 0; i < lakes_data.length; i++) {
      /* get lake info: */
      let lake = lakes_data[i];
      /* check id first: */
      let lake_id = lake['GLO_ID'];
      if (lake_ids.indexOf(lake_id) < 0) {
        continue;
      };
      /* check for lake volume: */
      let lake_volume = lake['VOLUME'];
      if (lake_volume == null) {
        continue;
      };
      /* check if lake volume is wihtin required bounds: */
      if ((volume_lo <= lake_volume) && (lake_volume <= volume_hi)) {
        /* store lake id: */
        lake_ids_volume.push(lake_id);
      };
    };
    /* update lake ids: */
    lake_ids = lake_ids_volume;
  };

  /* expansion filter: */
  let expansion_slider = page_data['filters']['expansion']['el'];
  let expansion_min = page_data['filters']['expansion']['min'];
  let expansion_max = page_data['filters']['expansion']['max'];
  let [expansion_lo, expansion_hi] = expansion_slider.noUiSlider.get();
  /* only filter by expansion if slider has been set ... : */
  if ((expansion_lo != expansion_min) || (expansion_hi != expansion_max)) {
    /* store new lake ids here: */
    let lake_ids_expansion = [];
    /* loop through lakes: */
    for (let i = 0; i < lakes_data.length; i++) {
      /* get lake info: */
      let lake = lakes_data[i];
      /* check id first: */
      let lake_id = lake['GLO_ID'];
      if (lake_ids.indexOf(lake_id) < 0) {
        continue;
      };
      /* check for lake expansion: */
      let lake_expansion = lake['EXPANSION_RATE'];
      if (lake_expansion == null) {
        continue;
      };
      /* check if lake expansion is wihtin required bounds: */
      if ((expansion_lo <= lake_expansion) && (lake_expansion <= expansion_hi)) {
        /* store lake id: */
        lake_ids_expansion.push(lake_id);
      };
    };
    /* update lake ids: */
    lake_ids = lake_ids_expansion;
  };

  /* get lake id from map, if an area is selected: */
  let area_select = page_data['area_select'];
  if ((area_select != null) && (area_select.isEnabled())) {
    /* get area bounds: */
    let area_bounds = area_select.getBounds();
    let area_bb = L.latLngBounds(area_bounds);
    /* store new lake ids here: */
    let lake_ids_map = [];
    /* loop through lakes: */
    for (let i = 0; i < lakes_data.length; i++) {
      /* get lake info: */
      let lake = lakes_data[i];
      /* check id first: */
      let lake_id = lake['GLO_ID'];
      if (lake_ids.indexOf(lake_id) < 0) {
        continue;
      };
      /* check for lake in area: */
      let lake_ll = {
        'lat': lake['LATITUDE'],
        'lng': lake['LONGITUDE']
      };
      /* check if selected area and table contains this lake: */
      if (area_bb.contains(lake_ll)) {
        /* store lake id: */
        lake_ids_map.push(lake_id);
      };
    };
    /* update lake ids: */
    lake_ids = lake_ids_map;
  };

  /* store lake ids information: */
  page_data['lake_ids'] = lake_ids;
  /* update map and data table from new ids: */
  update_map();
  update_lakes_table();
};

/* set up the page: */
function load_page() {
  /* set up data table: */
  load_data_table();
};

/** add listeners: **/

/* on page load: */
window.addEventListener('load', function() {
  /* set up the page ... : */
  load_page();
});
