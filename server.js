var express=require('express');
var app=express();
var router=express.Router();
var bodyParser=require('body-parser');
var cors=require('cors');

// Database connection configuration
var mongoose=require('mongoose');
var user=require('./api/models/models');
mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost:27017/RMPL',{useNewUrlParser: true});
//End of DB connection configuration
var port=3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());
app.use(function(req,res,next){
    console.log("Req is received...");
    next();
});
var routes=require('./api/routes/routes');
routes(app);
app.listen(port,function(){
    console.log("Server is running on port",port);
});

