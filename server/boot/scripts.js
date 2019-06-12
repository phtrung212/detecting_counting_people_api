'use strict';
const {Storage} = require('@google-cloud/storage');
const storage = new Storage({
  projectId: 'datnreport',
  keyFilename: './server/config/certificate.json',
});
const bucket = storage.bucket('datnreport.appspot.com');
module.exports = function(app) {
  app.get('/get-file', function(req, res) {
    const file = bucket.file(req.query.filename);
    file.get(function(err, file, apiResponse) {
      if (!err) {
        return file.getSignedUrl({
          action: 'read',
          expires: '03-09-2491',
        }).then(signedUrls => {
          res.json({url: signedUrls[0]});
        });
      }      else      {
        res.json({url: null});
      }
    });
  });
};
