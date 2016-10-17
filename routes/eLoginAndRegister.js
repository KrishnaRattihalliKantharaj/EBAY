var ejs = require("ejs");
var mysql = require("./mysql");
var encryption = require('./encryption');
var fs = require('file-system');
var writeFile = require('write');
var append = require('append-stream');

//var stream = new append('public/logs/userLogs.txt');
var lastLogin;

exports.ebayValidateLogin = function(request,response){
	
	var emailId = request.body.emailId;
	var loginPassword =encryption.saltHashPassword(request.body.loginPassword);
	console.log("emailid is : "+emailId+" password is : "+loginPassword);
	var getUser="select emailId,seller_handle from ebayuser.users where emailId='"+emailId+"' and password='" +loginPassword+"'";
	console.log("Query is:"+getUser);
	var logDate = new Date();
	request.session.logDate = logDate;
	
		mysql.fetchData(function(err,results){
			if(err){
				throw err;
			}
			else{
				if(results.length > 0){
					//Assigning the session
					lastLogin=new Date();
					request.session.seller_handle = results[0].seller_handle;
					request.session.emailId = emailId;
					request.session.firstName="";
					request.session.cart=[];
					request.session.totalPrice=0;
					request.session.datelogin="";
					console.log("valid Login");
					//render new page here
					
					response.send({
						"result":"200"
					});
				}
				else {
					response.send({"result":"404"});
					console.log("Invalid Login");
					//Send invalid message to the front end
				}
			}
		},getUser);
		

		
		
		
		//stream.write('user name : '+emailId+'loged in at :'+logDate+'\n');
		fs.appendFile('public/logs/userLogs.txt', '\nDate of Log :\n '+logDate+'\n\tLogin Module:\n\tUser:'+emailId+' Loged In and the buttonId is: ebayLogin\n',function(err){});
		
		//writeFile.sync('public/logs/userLogs.txt', 'user name : '+emailId+'loged in at :'+logDate);
		
	};
exports.ebayMainPage=function(request,response){

	if(request.session.emailId)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		response.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		var getUser="select firstName from ebayuser.users where emailId='"+request.session.emailId+"'";
		mysql.fetchData(function(err,results){
			if(err){
				throw err;
			}
			else{
				if(results.length > 0){
					//Assigning the session
					console.log("valid Login");
					console.log("userName :"+results[0].firstName);
					request.session.firstName=results[0].firstName;
					//render new page here
					response.render("ebayMainPage",{firstName:results[0].firstName});
				}
				else {
					console.log("Invalid Login");
					//Send invalid message to the front end
				}
			}
		},getUser);
		
	}
	else
	{
		response.redirect('/');
	}
	

};

exports.ebayRegister = function(request,response){
	var regEmail = request.body.regEmail;
	var password = encryption.saltHashPassword(request.body.password);
	var firstName = request.body.firstName;
	var lastName = request.body.lastName;
	var Dob = request.body.Dob;
	var contactNo = request.body.contactNo;
	var location = request.body.location;
	console.log("location is:"+location);
	console.log("emailid is : "+regEmail+" password is : "+password);
	var  getUser = "select * from ebayuser.users where emailId='"+regEmail+"'";
	var date=new Date();
	console.log("query is:"+getUser);
	mysql.fetchData(function(err,result){
		if(err){
			throw err;
		}
		else{
			if(result.length>0){
				console.log("User already exsists");
				response.send({
					"result":"401"
				});//receive the message at the front end 
			}
			else{
				var getUser1 = "insert into ebayuser.users (emailId,password,firstName,lastName,Dob,location,contactNo) values "+"('"+regEmail+"','"+password+"','"+firstName+"','"+lastName+"','"+Dob+"','"+location+"','"+contactNo+"')";
				 mysql.fetchData(function(err,result){
					 if(err){
						 throw err;
					 }
					 else{
						 fs.appendFile('public/logs/userLogs.txt', '\nNew user:\n '+regEmail+'Registered at: '+date+' and the button Id is regEmail\n',function(err){});
						 if(result.length>0){
							 console.log("Invalid Login");
							 //manage the if part as there is new data been entered try to render a new page
						 }
					 }
					 
				 },getUser1);
			}
		}
	},getUser);

};


exports.logout = function(req,res)
{
	req.session.destroy();
	res.redirect('/');
};


//Start of the main page functionalities like profile
exports.profile = function(request,response){
	if(request.session.emailId){
		var date = new Date();
		var getUser="select firstName,emailId,lastName,Dob,location,seller_handle from ebayuser.users where emailId='"+request.session.emailId+"'";
		mysql.fetchData(function(err,results){
			if(err){
				throw err;
			}
			else{
				if(results.length > 0){
					//Assigning the session
					console.log("valid Login");
					console.log("userName :"+results[0].firstName);
					console.log("emailId :"+results[0].emailId);
					var Dob=results[0].Dob;
					Dob.toString();
					var date="";
					for(var i=0;i<10;i++){
						date += Dob[i];
					}
					//results[0].seller_handle;
					console.log("date of birth:"+typeof(date));
					console.log("date of birth:"+date);
					//render new page here
					response.render("profile",
							{
								firstName:results[0].firstName,
								emailId:results[0].emailId,
								lastName:results[0].lastName,
								Dob:date,
								location:results[0].location
							});
				}
				else {
					console.log("Invalid Login");
					//Send invalid message to the front end
				}
			}
		},getUser);
		fs.appendFile('public/logs/userLogs.txt', '\n\tProfile of:'+request.session.emailId+' was loaded at: '+date+' and the button Id is: loadProfile\n',function(err){});
	}
	
};
exports.ebayCart = function(request,response){
	
	if(request.session.emailId)
	{
		var getUser="select firstName from ebayuser.users where emailId='"+request.session.emailId+"'";
		mysql.fetchData(function(err,results){
			if(err){
				throw err;
			}
			else{
				if(results.length > 0){
					
					//render new page here
					response.render("ebayCart",{firstName:results[0].firstName});
				}
				else {
					console.log("Invalid Login");
					//Send invalid message to the front end
				}
			}
		},getUser);

	}
	else
	{
		console.log("inside second else");
		response.redirect('/');
	}
	
};


//post Advertisements
exports.postAdvertisement=function(request,response){
	
	var itemName = request.body.itemName;
	var itemDescription=request.body.itemDescription;
    var itemPrice=request.body.itemPrice;
    var quantity=request.body.Quantity;
    var sellDate = Date();
    var type = "normal";
    var prd_image;
    var date = new Date();
    if (itemName=="iphone 6S"){
		prd_image="./images/iPhone7.jpg";
	}
    else if (itemName=="Beats Headphone"){
    	prd_image="./images/Headphone.jpg";
    }
    else if (itemName=="Prom Dress"){
    	prd_image="./images/Dress.jpg";
    }
    else{
    	prd_image="./images/laptop.jpg";
    }
    
    var insertAdd ="insert into ebayuser.product (seller_handle,s_username,prd_name,prd_desc,prd_quantity,prd_price,prd_image,type) values "+"('"+request.session.seller_handle+"','"+request.session.emailId+"','"+itemName+"','"+itemDescription+"','"+quantity+"','"+itemPrice+"','"+prd_image+"','"+type+"')";
    mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else{
			 request.session.sellDate = sellDate;
			 var prd_image;
			fs.appendFile('public/logs/userLogs.txt', '\n\tUser: '+request.session.emailId+' Posted: '+itemName+' item of quantity: '+quantity+' for sale at : '+date+' an the button Id is: postBid\n',function(err){});
			   
			if(results.length > 0){
				console.log("success");				
				
			}
			else {
				console.log("there was no items");
				//Send invalid message to the front end
				
				response.send({
					"result":"510"
				});
			}
		}
	},insertAdd);
    
};
exports.fetchAdvertisement=function(request,response){
	var date = new Date();
	var fetchquery = "select * from ebayuser.product where s_username='"+request.session.emailId+"'";
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else{
			if(results.length > 0){
				
				//render new page here
				response.send({"result":results});
				
			}
			else {
				console.log("Invalid Login");
				//Send invalid message to the front end
			}
		}
	},fetchquery);
	fs.appendFile('public/logs/userLogs.txt', '\n\tLoaded all the Advertisements to: '+request.session.emailId+' Main Page at: '+date+'\n',function(err){});
};

exports.myPurchases = function(request,response){
	var date = new Date();
	var fetchAdvertisements = "select * from ebayuser.bill where buyer_uname ='"+request.session.emailId+"'";
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else{
			if(results.length > 0){
				fs.appendFile('public/logs/userLogs.txt', '\n\tUser : '+request.session.emailId+'clicked on Show My Purchases in Profile Page at:'+date+' and the button Id is: showMyPurchases',function(err){});
				response.send({"results1":results});
			}
			else {
				console.log("No items in your collections");
				response.send({"results1":results});
				//Send invalid message to the front end
			}
		}
	},fetchAdvertisements);
};

exports.mySoldItems = function(request,response){
	var fetchAdvertisements = "select * from ebayuser.bill where s_username ='"+request.session.emailId+"'";
	var date = new Date();
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else{
			if(results.length > 0){
				console.log("result is"+results[0].buyer_uname);
				console.log("product quantity is:"+results[0].prd_quantity);
				fs.appendFile('public/logs/userLogs.txt', '\n\tUser: '+request.session.emailId+' clicked on Show Sold Items In Profile Page at:'+date+' and the button Id is: showSoldItems\n',function(err){});
				//render new page here
				response.send({"results2":results});
			}
			else {
				console.log("No items in your collections");
				//Send invalid message to the front end
			}
		}
	},fetchAdvertisements);
};


exports.getAdvertisementMainPage = function(request,response){
	var getLogin="update ebayuser.users set lastLogin ='"+lastLogin+"' where emailId ='"+request.session.emailId+"'";
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else{
			var gettime = "select lastLogin from ebayuser.users where emailId='"+request.session.emailId+"'";
			mysql.fetchData(function(err,results){
				if(err){
					throw err;
				}
				else{
					if(results.length>0){
						request.session.datelogin=results[0].lastLogin;
						
					}
					console.log("update Successfull");
						//Send invalid message to the front end
					}
			},gettime);
			console.log("update Successfull");
				//Send invalid message to the front end
			}
	},getLogin);
	
	var fetchAdvertisements = "select * from ebayuser.product where s_username !='"+request.session.emailId+"'";
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else{
			if(results.length > 0){
				console.log("result is"+results[0].s_username);
				//render new page here
				request.session.results = results;
				response.send({"results":request.session.results});
			}
			else {
				console.log("Invalid Login");
				//Send invalid message to the front end
			}
		}
	},fetchAdvertisements);
};


//add to cart
exports.ebayAddCart = function(request,response){
	var quantity = request.body.quantity;
	var sellerName = request.body.sellerName;
	//console.log("sellername"+sellerName);
	var productname = request.body.productname;
	var prdAvailableQuantity = request.body.prdAvailableQuantity;
	var productDesc = request.body.productDesc;
	var productId = request.body.productid;
	var seller_handle = request.body.seller_handle;
	var prd_price = request.body.prd_price;
	var productBuyQuantity = request.body.productBuyQuantity;
	var date = new Date();
	
	
	request.session.totalPrice+= productBuyQuantity*prd_price;
	console.log("product quantity"+productBuyQuantity);
	request.session.cart.push({	"sellerName":sellerName,
								"productname":productname,
								"prdAvailableQuantity":prdAvailableQuantity,
								"productDesc":productDesc,
								"productId":productId,
								"seller_handle":seller_handle,
								"prd_price":prd_price,
								"productBuyQuantity":productBuyQuantity,
								"totalPrice":request.session.totalPrice
								});
	console.log("quantity and price"+request.session.cart[0].productBuyQuantity);
	console.log("total price:"+request.session.totalPrice);
	fs.appendFile('public/logs/userLogs.txt', '\n\tUser: '+request.session.emailId+' added item: '+productname+' ('+productBuyQuantity+' quantity) to cart at time: '+date+' and the button Id is addToCart\n',function(err){});
	response.send({"result":"200"});
	//console.log("added to cart"+request.session.cart[0].sellerName);
	
};

exports.getCartItems=function(request,response){
	console.log("price"+JSON.stringify(request.session.cart));
	var date = new Date();
	//console.log("price 1 price 2"+request.session.cart[0].prd_price + "  "+request.session.cart[1].prd_price);
	console.log("quantity and price"+request.session.totalPrice);
	fs.appendFile('public/logs/userLogs.txt', '\n\tUser: '+request.session.emailId+' cart page was loaded at '+date+'\n',function(err){});
	response.send({"cart":request.session.cart,
					"totalPrice":request.session.totalPrice});
};

exports.removeItemFromCart = function(request,response){
    var productname = request.body.productname;
    console.log("productQuantity"+request.body.productBuyQuantity);
    var productBuyQuantity = Number(request.body.productBuyQuantity);
    var prd_price = Number(request.body.prd_price);
    var cost;
    var date = new Date();
    cost=productBuyQuantity*prd_price;
    console.log("total Price "+cost);
    console.log("total Price d"+request.session.totalPrice);
    request.session.totalPrice=request.session.totalPrice-cost ;
    console.log("total Price aafd"+request.session.totalPrice);
    var i = 0;
    
    for (i = request.session.cart.length - 1; i >= 0; i--) {
        if (request.session.cart[i].productname == productname) {
            request.session.cart.splice(i, 1);
            response.send({
                "statusCode" : 200,
                "itemsInCart": request.session.cart,
                "totalPrice": request.session.totalPrice
            });
        }
    }
    fs.appendFile('public/logs/userLogs.txt', '\n\tUser: '+request.session.emailId+' removed '+productname+'item at '+date+' and the button Id is cartRemove\n',function(err){});
};

exports.checkOut=function(request,response){
	response.send({"totalPrice":request.session.totalPrice});
};

exports.showCheckoutPage=function(request,response){
	response.render("checkOut",{firstName:request.session.firstName,"totalPrice": request.session.totalPrice});
};


exports.creditCardvalidation=function(request,response){
	var CreditCardNo = (request.body.CreditCardNo);
	var ExpirationDate = (request.body.ExpirationDate);
	var CvvNumber = (request.body.CvvNumber);
	var date = new Date();
	CreditCardNo=CreditCardNo.toString();
	CvvNumber = CvvNumber.toString();
	var Year="";
	var day="";
	var Month="";
	for(var i=0;i<4;i++){
		Year += ExpirationDate[i];
	}
	for(var j=5;j<7;j++){
	Month+=ExpirationDate[j];		
	}
	
	for(var k=8;k<10;k++){
		day+=ExpirationDate[k];
	}
	
	
	var d = new Date();
	var tday = d.getDate();
	var tmonth=d.getMonth()+1;
	var tyear=d.getYear();
	//date = Number(date);
	
	if (CreditCardNo.length == "16" && CvvNumber.length == "3" && day>=tday ){
		response.send({
			"result" : "success",
			
		});
	}
	else if (CreditCardNo.length != "16" ){
		response.send({
			"result":"inValidcard"
		});
	}
	else if (CvvNumber.length != "3" ){
		response.send({
			"result":"inValidcvv"
		});
	}
	else{
		console.log("asdfs");
		response.send({
			"result":"inValiddate"			
		});
	}
	fs.appendFile('public/logs/userLogs.txt', '\n\tUser: '+request.session.emailId+' validated credit cart info at '+date+'\n',function(err){});
};

exports.eBayShowBidders = function(request,response){
	var sellerName = request.body.sellerName;
	//console.log("sellername"+sellerName);
	var productname = request.body.productname;
	var prdAvailableQuantity = request.body.prdAvailableQuantity;
	var productDesc = request.body.productDesc;
	var productId = request.body.productid;
	var seller_handle = request.body.seller_handle;
	var prd_price = request.body.prd_price;
	var productBuyQuantity = request.body.productBuyQuantity;
	var type="bid";
	var bidders = "select * from ebayuser.bill where type='"+type+"'and productId='"+productId+"'"; 
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else{
	 	 	if(results.length > 0){
	 	 		console.log("result is:"+results[0].prd_quantity);
				response.send({"statusCode":200,"result":results});
			}
			else {
				console.log("Invalid Login");
				//Send invalid message to the front end
			}
		}
 	},bidders);

};

exports.buyProduct=function(request,response){
	var streetAddress=request.body.streetAddress;
  	var place=request.body.place;
  	var state=request.body.state;
  	var country=request.body.country;
  	var postalCode=request.body.postalCode;
  	var address;
  	var countAvailable = 0;
  	var productQuantity,i,k;
  	var flag = 0,flag1=0,flag2=0,updateProduct;
  	var date = new Date();
  	console.log("the country is:"+country);
  	console.log("the available product quantity is : "+request.session.cart[0].prdAvailableQuantity);
  	console.log("buy: "+request.session.cart[0].productBuyQuantity);
  	address=streetAddress.concat(", ",place,", ",state,", ",country,", ",postalCode);
	if(streetAddress==null && place==null && state==null && country==null && postalCode==null){
  		//
  		response.send({"result":"failure"});
  			
  	}
  	else{
  
  		
  		console.log("the address is:"+address);
  		//console.log("user name is: "+request.session.cart.productBuyQuantity);
  		
  		if(flag==0){
 		for (i=0;i<request.session.cart.length;i++){
 			var insertAdd = "insert into ebayuser.bill (productId,prd_name,prd_quantity,buyer_uname,s_username,address,totalPrice) values "+"('"+request.session.cart[i].productId+"','"+request.session.cart[i].productname+"','"+request.session.cart[i].productBuyQuantity+"','"+request.session.emailId+"','"+request.session.cart[i].sellerName+"','"+address+"','"+request.session.totalPrice+"')";
 			var  connection=mysql.getConnection(function(connection){
 				connection.query(insertAdd,function(err, rows) {
 					if(err){
 						console.log("ERROR: " + err.message);
 						//connection.release();
 					}
 					else{
 						flag1++;
 						console.log("successful");
 					}
 	 		
 				});
 				console.log("\nConnection closed..");
 				connection.release();//connection.end();
 				},function(error){
 			});
 		}
 		flag=1;
  		}
 			for(var j=0;j<request.session.cart.length;j++){
 				var updateProductQuantity = request.session.cart[j].prdAvailableQuantity - request.session.cart[j].productBuyQuantity;
 				console.log("updated successfull:  "+updateProductQuantity);
 				var updateProducts = "update ebayuser.product set prd_quantity ='"+updateProductQuantity+"' where productId ='"+request.session.cart[j].productId+"' and s_username ='"+request.session.cart[j].sellerName+"'";
 	 			mysql.fetchData(function(err,results){
 	 				if(err){
 	 					throw err;
 	 				}
 	 				else{
 	 					console.log("successfully updated data to the table");
 	 					flag2++;
 	 				}
 	 			},updateProducts);
 			}
 			request.session.cart=[];
 			fs.appendFile('public/logs/userLogs.txt', '\n\tUser: '+request.session.emailId+' checked out all the items at :'+date+' and the button Id is checkOut\n',function(err){});
 			
 		}
	
 };

 exports.getCheckoutItems = function(request,response){
	response.send({"result":request.session.cart});
};

exports.postAdvertisementBid = function(request,response){
	var itemName = request.body.itemName;
	var itemDescription=request.body.itemDescription;
    var itemPrice=request.body.itemPrice;
    var quantity=request.body.Quantity;
    var sellDate = new Date();
    var bidTime = request.body.bidTime;
    var type ="bid";
    var prd_image;
    if (itemName=="iphone 6S"){
		prd_image="./images/iPhone7.jpg";
	}
    else if (itemName=="Beats Headphone"){
    	prd_image="./images/Headphone.jpg";
    }
    else if (itemName=="Prom Dress"){
    	prd_image="./images/Dress.jpg";
    }
    else{
    	prd_image="./images/laptop.jpg";
    }
    //var bjggkg ="INSERT INTO `ebay`.`sell_product` (`email_id`, `item_name`, `item_description`, `type_of_price_tag`, `duration`, `item_price`, `item_quantity`, `date_of_sale`, `available_till`) VALUES ('" + req.session.email_id + "', '" + itemName + "', '" + itemDescription + "', '" + req.body.PriceTagType + "', '" + durationAP + "', '" + auctionPrice + "', '" + itemQuantity + "', now(), DATE_ADD(date_of_sale, INTERVAL '" + durationAP + "' DAY))";
    var insertAdd ="insert into ebayuser.product (seller_handle,s_username,prd_name,prd_desc,prd_quantity,prd_price,prd_image,type,bid_days,date_of_sale,available_till) values "+"('"+request.session.seller_handle+"','"+request.session.emailId+"','"+itemName+"','"+itemDescription+"','"+quantity+"','"+itemPrice+"','"+prd_image+"','"+type+"','"+bidTime+"',now(),DATE_ADD(date_of_sale, INTERVAL '"+bidTime+"' DAY))";
    mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else{
			 request.session.sellDate = sellDate;
			 var prd_image;
			fs.appendFile('public/logs/userLogs.txt', '\n\tuser: '+request.session.emailId+' Posted: '+itemName+' item for Bid ('+quantity+' items) for '+bidTime+' days an the button Id is bidItem\n',function(err){});
			   
			if(results.length > 0){
				console.log("success");				
				
			}
			else {
				console.log("there was no items");
				//Send invalid message to the front end
				
				response.send({
					"result":"510"
				});
			}
		}
	},insertAdd);	
};

exports.ebayBidCart = function(request, response){
    var sellerName = request.body.sellerName;
	//console.log("sellername"+sellerName);
	var productname = request.body.productname;
	var prdAvailableQuantity = request.body.prdAvailableQuantity;
	var productDesc = request.body.productDesc;
	var productId = request.body.productid;
	var seller_handle = request.body.seller_handle;
	var prd_price = request.body.prd_price;
	var productBuyQuantity = request.body.productBuyQuantity;
	var biddingPrice = request.body.biddingPrice;
	var quantity = prdAvailableQuantity - productBuyQuantity;
	var type = "bid";

    var placeBidRequestQuery = "SELECT timediff(product.available_till, now()) as timer FROM ebayuser.product where productId = '" + productId + "'";
    mysql.fetchData(function(err,results){
        if (err) {
            throw err;
        } else {
            if (results.length > 0) {
                var timer = results[0].timer;
                                
                if(!isNaN(Number(timer[0]))){
                    console.log("timer = " + results[0].timer);
                    var checkPrice = "select prd_price from ebayuser.product where type='"+type+"'and productId='"+productId+"'and s_username='"+sellerName+"'";
                   	mysql.fetchData(function(err,results){
						if(err){
							throw err;
						}
						else{
							if(results.length > 0){
								console.log(results[0].prd_price);
								console.log("bidding price : "+biddingPrice);
								if(biddingPrice>results[0].prd_price){
									var insertAdd = "insert into ebayuser.bill (productId,prd_name,prd_quantity,buyer_uname,s_username,type,totalPrice) values "+"('"+productId+"','"+productname+"','"+productBuyQuantity+"','"+request.session.emailId+"','"+sellerName+"','"+type+"','"+biddingPrice+"')";
									mysql.fetchData(function(err,results){
					 	 				if(err){
					 	 					throw err;
					 	 				}
					 	 				else{
					 	 					console.log("successfully updated data to the table");
					 	 					
					 	 				}
					 	 			},insertAdd);
				 					var update= "update ebayuser.product set prd_price='"+biddingPrice+"' where productId ='"+productId+"' and s_username ='"+sellerName+"'";
				 					mysql.fetchData(function(err,results){
				 	 	 				if(err){
				 	 	 					throw err;
				 	 	 				}
				 	 	 				else{
				 	 	 					console.log("successfully updated data to the table");
				 	 	 					
				 	 	 				}
				 	 	 			},update);
								}
					
							}
							else {
								console.log("Invalid Login");
								//Send invalid message to the front end
							}
						}
					},checkPrice);

                    response.send({ 
                        "statusCode" : 200,
                        "timer" : results[0].timer
                    });
                }
                else {
                    response.send({
                        "statusCode" : 402,
                        "error" : "Time Up! Sorry You Can't Bid Anymore, better Luck Next Time!"
                    });
                }
            }
            else {
                response.send({
                    "statusCode" : 403,
                    "error" : "Empty DB Response"
                })
                console.log("response from DB Empty");
            }
        }
    },placeBidRequestQuery);
};