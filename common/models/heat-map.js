'use strict';

module.exports = function(heatMap) {
  heatMap.getReportDay = function(day, month, year, cameras, cb) {
    let data = {
      x: [],
      y: [],
      value: [],
    };
    for (let i = 0; i < 24; i++)    {
      data.x[i] = [];
      data.y[i] = [];
      data.value[i] = [];
    }
    heatMap.find({where: {
      day: day,
      month: month,
      year: year,
      cameraName: {inq: cameras},
    }}, function(err, listReport) {
      for (let i = 0; i < listReport.length; i++)      {
        data.x[listReport[i].hour] =
          [...data.x[listReport[i].hour], ...listReport[i].x];
        data.y[listReport[i].hour] =
          [...data.y[listReport[i].hour], ...listReport[i].y];
        data.value[listReport[i].hour] =
          [...data.value[listReport[i].hour], ...listReport[i].value];
      }
      cb(null, data);
    });
  };
  heatMap.getReportRangeDay = function(day, month, year, dayTo, monthTo, yearTo, cameras, cb) {
    let data = {
      x: [],
      y: [],
      value: [],
    };
    for (let i = 0; i < dayTo - day + 1; i++)    {
      data.x[i] = [];
      data.y[i] = [];
      data.value[i] = [];
    }
    heatMap.find({where: {
      day: {between: [day, dayTo]},
      month: {between: [month, monthTo]},
      year: {between: [year, yearTo]},
      cameraName: {inq: cameras},
    }}, function(err, listReport) {
      for (let i = 0; i < listReport.length; i++)      {
        if (data.x[listReport[i].day - day].length === 0)        {
          data.x[listReport[i].day - day] =
            [...data.x[listReport[i].day - day], ...listReport[i].x];
          data.y[listReport[i].day - day] =
            [...data.y[listReport[i].day - day], ...listReport[i].y];
          data.value[listReport[i].day - day] =
            [...data.value[listReport[i].day - day], ...listReport[i].value];
        } else        {
          for (let j = 0; j < data.x[listReport[i].day - day].length; j++)          {
            data.value[listReport[i].day - day][j] += listReport[i].value[j];
          }
        }
      }
      // console.log('dataAPI', data);
      cb(null, data);
    });
  };
  heatMap.getReportMonth = function(month, year, cameras, cb) {
    let data = {
      x: [],
      y: [],
      value: [],
    };
    for (let i = 0; i < 31; i++)    {
      data.x[i] = [];
      data.y[i] = [];
      data.value[i] = [];
    }
    heatMap.find({where: {
      month: month,
      year: year,
      cameraName: {inq: cameras},
    }}, function(err, listReport) {
      for (let i = 0; i < listReport.length; i++)      {
        if (data.x[listReport[i].day - 1].length === 0) {
          data.x[listReport[i].day - 1] =
            [...data.x[listReport[i].day - 1], ...listReport[i].x];
          data.y[listReport[i].day - 1] =
            [...data.y[listReport[i].day - 1], ...listReport[i].y];
          data.value[listReport[i].day - 1] =
            [...data.value[listReport[i].day - 1], ...listReport[i].value];
        } else {
          for (let j = 0; j < data.x[listReport[i].day - 1].length; j++)          {
            data.value[listReport[i].day - 1][j] += listReport[i].value[j];
          }
        }
      }
      cb(null, data);
    });
  };
  heatMap.getReportYear = function(year, cameras, cb) {
    let data = {
      x: [],
      y: [],
      value: [],
    };
    for (let i = 0; i < 12; i++)    {
      data.x[i] = [];
      data.y[i] = [];
      data.value[i] = [];
    }
    heatMap.find({where: {
      year: year,
      cameraName: {inq: cameras},
    }}, function(err, listReport) {
      for (let i = 0; i < listReport.length; i++)      {
        if (data.x[listReport[i].month - 1].length === 0) {
          data.x[listReport[i].month - 1] =
            [...data.x[listReport[i].month - 1], ...listReport[i].x];
          data.y[listReport[i].month - 1] =
            [...data.y[listReport[i].month - 1], ...listReport[i].y];
          data.value[listReport[i].month - 1] =
            [...data.value[listReport[i].month - 1], ...listReport[i].value];
        } else {
          for (let j = 0; j < data.x[listReport[i].month - 1].length; j++)          {
            data.value[listReport[i].month - 1][j] += listReport[i].value[j];
          }
        }
      }
      cb(null, data);
    });
  };
  heatMap.remoteMethod(
    'getReportDay',
    {
      http: {path: '/get-reports-day', verb: 'get'},
      accepts: [{arg: 'day', type: 'number', http: {source: 'query'}},
        {arg: 'month', type: 'number', http: {source: 'query'}},
        {arg: 'year', type: 'number', http: {source: 'query'}},
        {arg: 'cameras', type: 'array', http: {source: 'query'}}],

      returns: {arg: 'listReport', type: 'Object'},
    }
  );
  heatMap.remoteMethod(
    'getReportMonth',
    {
      http: {path: '/get-reports-month', verb: 'get'},
      accepts: [
        {arg: 'month', type: 'number', http: {source: 'query'}},
        {arg: 'year', type: 'number', http: {source: 'query'}},
        {arg: 'cameras', type: 'array', http: {source: 'query'}}],

      returns: {arg: 'listReport', type: 'Object'},
    }
  );
  heatMap.remoteMethod(
    'getReportYear',
    {
      http: {path: '/get-reports-year', verb: 'get'},
      accepts: [
        {arg: 'year', type: 'number', http: {source: 'query'}},
        {arg: 'cameras', type: 'array', http: {source: 'query'}}],

      returns: {arg: 'listReport', type: 'Object'},
    }
  );
  heatMap.remoteMethod(
    'getReportRangeDay',
    {
      http: {path: '/get-reports-range-of-day', verb: 'get'},
      accepts: [{arg: 'day', type: 'number', http: {source: 'query'}},
        {arg: 'month', type: 'number', http: {source: 'query'}},
        {arg: 'year', type: 'number', http: {source: 'query'}},
        {arg: 'dayTo', type: 'number', http: {source: 'query'}},
        {arg: 'monthTo', type: 'number', http: {source: 'query'}},
        {arg: 'yearTo', type: 'number', http: {source: 'query'}},
        {arg: 'cameras', type: 'array', http: {source: 'query'}}],

      returns: {arg: 'listReport', type: 'Object'},
    }
  );
};
