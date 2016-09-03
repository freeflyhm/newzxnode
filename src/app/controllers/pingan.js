/* jshint
   node: true,        devel: true,
   maxstatements: 50, maxparams: 3, maxdepth: 3,
   maxerr: 50,        nomen: true,  regexp: true
 */

var createCtrl = function () {
  'use strict';

  var request = require('request');

  var Step12downloadImg;

  Step12downloadImg = function (callback) {
    var j = request.jar();
    var url12 = 'http://pingan.com/sics/sicsweb/image.jsp';

    request.get(url12, { jar: j }, function (error, response, body) {
      var data;
      if (!error && response.statusCode === 200) {
        data = 'data:' +
            response.headers['content-type'] +
            ';base64,' + body;

        callback(data);
      }
    });
  };

  return {
    Step12downloadImg: Step12downloadImg,
  };
};

module.exports = createCtrl;
