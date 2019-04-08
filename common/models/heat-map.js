'use strict';

module.exports = function(heatMap) {
  heatMap.getReportDay = function(day, month, year, cameras, cb) {
    let data = {
      x: [],
      y: [],
      value: [],
    };
    for (let i = 0; i < 24; i++)    {
      data.x[i] = 0;
      data.y[i] = 0;
      data.value[i] = 0;
    }
    heatMap.find({where: {
      day: day,
      month: month,
      year: year,
      cameraName: {inq: cameras},
    }}, function(err, listReport) {
      for (let i = 0; i < listReport.length; i++)      {
        data.x[listReport[i].hour] += listReport[i].x;
        data.y[listReport[i].hour] += listReport[i].y;
        data.value[listReport[i].hour] += listReport[i].value;
      }
      cb(null, data);
    });
  };
  heatMap.getReportMonth = function(month, year, cameras, cb) {
    let data = {
      x: [],
      y: [],
      value: [],
    };
    heatMap.find({where: {
      month: month,
      year: year,
      cameraName: {inq: cameras},
    }}, function(err, listReport) {
      for (let i = 0; i < listReport.length; i++) {
        for (let j = 0; j < listReport[i].x.length; j++)        {
          data.x.push(listReport[i].x[j]);
          data.y.push(listReport[i].y[j]);
          data.value.push(listReport[i].value[j]);
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
    heatMap.find({where: {
      year: year,
      cameraName: {inq: cameras},
    }}, function(err, listReport) {
      for (let i = 0; i < listReport.length; i++) {
        for (let j = 0; j < listReport[i].x.length; j++)        {
          data.x.push(listReport[i].x[j]);
          data.y.push(listReport[i].y[j]);
          data.value.push(listReport[i].value[j]);
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
};
