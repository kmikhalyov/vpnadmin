(function($,window){
  $.abusersPage = function(options) {
    var abusers = {
      options: $.extend({}, options),
      ext: '.json',
      buildTableRow: function(number, company) {
        var tr = $('<tr/>').append(
          $('<td/>', { text: number })
        ).append(
          $('<td/>', { text: company.name })
        ).append(
          $('<td/>', { text: formatBytes(company.used) })
        ).append(
          $('<td/>', { text: formatBytes(company.quota) })
        );
        return tr;
      },
      showReport: function(year, month) {
        var tbody = $('#abusersTable > tbody');
        var report = abusers.getReport(year, month);
        tbody.empty();
        $.each(report, function(key, value){
          tbody.append(abusers.buildTableRow(key + 1, value));
        });
      },
      getReport: function(year, month) {
        var report;
        $.ajax({
          url: '/api/report/' + year + '/' + month + abusers.ext,
          async: false
        }).done(function(data) {
          report = data;
        });
        return report;
      },
      generateData: function() {
        $('#generateData').prop('disabled', true);
        $.ajax({
          url: 'api/generate' + abusers.ext,
          type: 'POST',
          async: false
        });
        $('#generateData').prop('disabled', false);
      }
    };
    return abusers;
  };
})(jQuery,this);