var dateFormatter = (function() {
  var df = {};

  df.getTodayDate = function(date) {
    var today = moment();
    var inputDate = moment(date);
    var outputDate;

    if (today.format('YYYYMMDD') == inputDate.format('YYYYMMDD')) {
      outputDate = 'Today - ';
    }
    else {
      outputDate = inputDate.format('MMM. D - ');
    }
    outputDate = outputDate + inputDate.format('hh:mma');

    return outputDate;
  }

  return df;
})();
