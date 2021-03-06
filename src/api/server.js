const Promise            = require('bluebird');
const colors             = require('colors');
const figlet             = Promise.promisify(require('figlet'));
const morgan             = require('morgan');
const express            = require("express");
const db                 = require('../../models');//Bootstraps the entire database.
const bodyParser         = require('body-parser');
const app                = express();
const path               = require('path');
const serveStatic        = express.static;
const PORT               = 8080;
const middlwareError     = 'You made it to the no-no middleware. If you\'re confused, see:http://expressjs.com/en/guide/using-middleware.html';
const IS_PRODUCTION      = false;
const introAscii         = '   POWr';
const introAscii2        = 'Comments';
const asciiFont          = 'Isometric2';

figlet(introAscii,{font:asciiFont})
.then(introMessage => {
  console.log(introMessage.green);
  return figlet(introAscii2,{font:asciiFont})
})
.then(introMessage => {
  console.log(introMessage.green);
})
.then(nothing =>{
  db.sequelize
    .sync()
    .then(()=>{

      if (!IS_PRODUCTION) require('./bundler.js')(app); //Webpack

      app.set('models',db.sequelize.models);

      app.use(bodyParser.json({
        extended:true //see:https://www.npmjs.com/package/body-parser
      }));

      app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname,"../../dist/index.html"));
      });

      app.use(serveStatic(path.join(__dirname,"../../dist")));

      app.use(function(req,res,next){// If you get here, then nothing was able to field the request.
        res.send(JSON.stringify({
          success:false,
          data:middlwareError
        }))
      });

      app.listen(PORT, function () {
        console.log('Server running on port ' + PORT);
      });
    }
  );
})



