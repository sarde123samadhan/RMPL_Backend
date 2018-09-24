'use strict';

var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var CustomerSchema=new Schema({
    firstname:{type:String},
    lastname:{type:String},
    email:{type:String},
    password:{type:String},
    dob:{type:Date},
    gender:{type:String},
    address:{type:String},
    city:{type:String},
   state:{type:String},
   country:{type:String},
   zip:{type:Number},
   contact:{type:Number},
   role:{type:String}
});

var productSchema=new Schema({
    name:{type:String},
    price:{type:String},
    description:{type:String},
    categoryId:{type:String}
});
var categorySchema=new Schema({
    id:{type:String},
    name:{type:String}
})

mongoose.model('User',CustomerSchema);
mongoose.model('Product',productSchema,'product');
mongoose.model('Category',categorySchema,'category');
module.exports=mongoose.model('User');
module.exports=mongoose.model('Product');
module.exports=mongoose.model('Category');
