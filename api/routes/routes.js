'use strict';
var expJWT=require("express-jwt");
var fs=require('fs');

module.exports=function(app){
    var controllers=require('../controllers/user-crud-controller');
    /* Start of User Registration API configuration*/
    app.route('/add-user').post(controllers.add_users);
    /* End of User Registration API configuration*/
    /* Start of User Registration API configuration*/
    app.route('/sign-in').post(controllers.signIn);
    /* End of User Registration API configuration*/
    /* Start of Product display API configuration*/
    app.route('/display-product').get(controllers.display_products);
    /* End of Product display API configuration*/
    /* Start of Display Category API configuration*/
    app.route('/display-category').get(controllers.display_category);
    /* End of Display Category API configuration*/
}