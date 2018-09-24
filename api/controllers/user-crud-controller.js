var mongoose=require('mongoose');
mongoose.set('debug', true);
var fs=require("fs");
const RSA_PRIVATE_KEY=fs.readFileSync('./demo/private.key');
var user=mongoose.model('User');
var ProductDetails=mongoose.model('Product');
var categoryDetails=mongoose.model('Category');
var bcrypt=require('bcrypt');
var jwt=require('jsonwebtoken');

/*Start of Sign Up Functionality */
exports.add_users=function(req,res){
    console.log("Req Body==>",JSON.stringify(req.body));
    user.findOne({email:req.body.email},async function(err,results){
    console.log("Results==>",JSON.stringify(results));
    if(results==null){
       let hash;
       bcrypt.hash(req.body.password,10, (err,hashResult)=>{
        if(err)
            return res.status(500).json({error:err});
            var userDetails=new user({
                firstname:req.body.firstName,
                lastname:req.body.lastName,
                email:req.body.email,
                password:hashResult,
                dob:req.body.dob,
                gender:req.body.gender,
                address:req.body.address,
                city:req.body.city,
                state:req.body.state,
                country:req.body.country,
                zip:req.body.zip,
                contact:req.body.contact,
                role:req.body.role
            })
            console.log("User Details:",JSON.stringify(userDetails));
            userDetails.save();
            res.json({success:true,message:"User is successfully registerd."});
       });       
    }else{
        res.json({success:false,message:"User is already registered."});
    }
    
});   
}
/*End of Sign Up Functionality */

/*Start of Sign In Functionality */
exports.signIn=function(req,res,next){
    var token=req.headers["token"];
    console.log("Token",token);
    if(token){
        jwt.verify(token,RSA_PRIVATE_KEY,function(err,decoded){
            if(err){
                return res.json({success:false,message:"Failed to authenticate token"});
            }else{
                res.json({success:true,message:"Token is verified successfully..."});
            }
        });
    }else{
        user.findOne({email:req.body.email})
        .exec()
        .then((user,err)=>{
            if(err||user==null){
                return res.status(401).json({
                    success:false,message:"Invalid Credentials. Please enter valid credentials."
                });
            }else{
                bcrypt.compare(req.body.password,user.password,(err,result)=>{
                    console.log("Result=>",result);
                    if(err){
                        return res.status(401).json({
                            success:false,message:"Unauthorized Access:Sorry we are not able to authenticate. Please Login again."
                        });
                    }
                    else{
                        let JWTToken=jwt.sign(
                            {email:user.email,_id:user._id},
                            RSA_PRIVATE_KEY,
                            {expiresIn:'2hr'});
                        return res.status(200).json({
                            success:true,message:"Welcome to the JWT Auth",
                            token:JWTToken,
                            role:user.role
                        });
                    }
                });
            }
            
        }).catch(error=>{
            res.status(500).json({
                error:error
            });
        });
    }
}
/*End of Sign In Functionality */
/*Start of Product Display Functionality */
exports.display_products=function(req,res){
    console.log("Successfully called display product functionality");
    try{
        // ProductDetails.find({},function(err,prods){
        //     if(err)console.log(err)
        //         res.json({result:prods});
        // });
        ProductDetails.aggregate([{$lookup:{
            from:"category",localField:"categoryId",foreignField:"id",
            as:"product_docs"
            }}],function(err,prods) {
                if(err)console.log(err)
                    res.json({result:prods});
            });
    }catch(err){
        console.log(err);
        res.json({result:"Error"});
    }
    
}
/*End of Product Display Functionality */

/*Start of Product Display Functionality */
module.exports.display_category=function(req,res){
    console.log("In display category");
    categoryDetails.find({},function(err,result){
        if(err){
            console.log("Error in category display..",err);
            res.json({cat:"error:"+err})
        }
        res.json({cat:result});
    })
    
}
/*End of Product Display Functionality */

/*Start of Product Update Functionality */
module.exports.update_product=function(req,res){
    ProductDetails.update({_id:req.body.id},{
        name:req.body.name,
        price:req.body.price,
        description:req.body.description  
    },function(err){
        if(err) console.log("Error=>",err);
        res.json({message:"Product ("+req.body.id+") Update Request is successful"});
    });
}
/*End of Product Update Functionality */
/*Start of Product Delete Functionality */
module.exports.delete_product=function(req,res){
    console.log("Param::",req.params);
    let objectId=mongoose.Types.ObjectId.createFromHexString(req.params.id);
    ProductDetails.deleteOne({_id:objectId},function(err,data){
        if(err){
            console.log("Error::",err);
            res.json({message:"Request is not completed",status:false});
        }else{
            res.json({message:"Request is completed successfully",status:true});
        }
    });
}
/*End of Product Delete Functionality */
/*Start of Product Insert Functionality */
module.exports.insert_product=function(req,res){
    console.log("Body:",req.body);
    let info={name:req.body.name,price:req.body.price,description:req.body.description,categoryId:req.body.categoryId};
    let product=new ProductDetails(info);
    product.save(function(err,result){
        if(err)
            console.log("Error::",err);
        res.json({message:"Product is successfully inserted..",status:true});
    });
}


/*End of Product Insert Functionality */