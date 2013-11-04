/**
 * Module dependencies.
 */

var express = require('express')
    , http = require('http')
    , url = require('url')
    , path = require('path')
    , ajaxFake = require('./routes/ajaxfake')
    , runner = require('./runner');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 5000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser({uploadDir:'./pages'}));
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(ajaxFake);
    app.use(app.router);
	
});

app.configure('development', function () {
    app.use(express.errorHandler());
    require("./dao/config").setEnv('development');
});


//init routers
require("./routes/route").init(app);

var bRUN = process.argv[2];


(bRUN === "run") && 
runner.runall(function(err){
    if(err){
        console.log(err.stack);
    }
});


http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});


