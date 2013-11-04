var routes = [],
    routeConfig = ['interface_list','interface_cases','interface_add','interface_edit','case_add','case_run','case_edit','ajax','pages','iwant'];

/*
 * each items of routes is an object , contains:
 * {
 *     template:{String} jade template file name
 *     path:{String} route path
 *     handler:{Function} ,handler function which will called with two params:request , response and returns the data for the template
 *     async:{Boolean} default is false , defined how to call the handler
 * }
 *
 * */

var app,
    get = function () {
        return routes;
    },
    add = function (routeObj) {
        if ("path" in routeObj && "handler" in routeObj) {
            routes.push(routeObj);
            app[routeObj.method || "get"](routeObj.path, function (req, res, next) {
                if (routeObj.async) {
                    routeObj.handler(req, res, function (data) {
                        res.render(routeObj.template, data);
                    },next);
                } else {
                    res.render(routeObj.template, routeObj.handler(req, res, next));
                }
            });
        }
        else {
            throw "the router must contain path and handler";
        }
    },
    init = function (site) {
        app = site;
        routeConfig.forEach(function (file) {
            require("./" + file);
        });
        app.get("*", function (req,res) {
            res.send(404);
        });
    }

exports.add = add;
exports.get = get;
exports.init = init;
exports.getApp = function () {
    return app;
};