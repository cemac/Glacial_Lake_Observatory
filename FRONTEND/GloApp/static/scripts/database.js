/*** database.js ***/

'use strict';

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
