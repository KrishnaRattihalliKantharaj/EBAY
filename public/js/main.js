var ebayApplication = angular.module('mainApp',[]);
ebayApplication.controller('mainController',function($scope,$http){
	$scope.login = function(){
		$http({
			url : "/ebayLogin",
			method:"POST",
			data: {
				"emailId":$scope.emailId,
				"loginPassword":$scope.loginPassword
			}
		}).success(function(data){
			if(data.result=="200"){
				console.log("success login");
				window.location = "/success";
			}
			else if(data.result=="404"){
				$scope.invalid="Failed Login Invalid username or password";
				console.log("sdfklsdjfjdfjjf");
			}
		});
	};
	$scope.register = function(){
		var password = $scope.password;
		$http({
			url : "/ebayRegistration",
			method:"POST",
			data: {
				"regEmail":$scope.regEmail,
				"password":password,
				"firstName":$scope.firstName,
				"lastName":$scope.lastName,
				"Dob":$scope.Dob,
				"contactNo":$scope.contactNo,
				"location":$scope.location
			}
		}).success(function(data){
			if(data.result=="200"){
				console.log("successfully Registered");
			}
			if (data.result=="401"){
				console.log("failed to register, user already exsists");
			}
		});
	};
});

//Main page app and other functionalities

var mainPageApp = angular.module('mainPageApp',[]);
mainPageApp.controller('mainPageController',function($scope,$http){
	$http({
		method:"POST",
		url:"/getAdvertisementMainPage"
	}).success(function(data){
		$scope.result=data.results;

	});
//navigate to Add to Cart
	$scope.eBayAddToCart = function(username,productname,prdAvailableQuantity,productDesc,productid,seller_handle,prd_price,productBuyQuantity){
//		var quantity = document.getElementById('itemQuantity').value;
		//var quantity = $scope.itemQuantity;
		console.log("quantity"+productBuyQuantity);
		$http({
			url:"/ebayAddCart",
			method:"POST",
			data:{
				"sellerName":username,
				"productname":productname,
				"prdAvailableQuantity":prdAvailableQuantity,
				"productDesc":productDesc,
				"productid":productid,
				"seller_handle":seller_handle,
				"prd_price":prd_price,
				"productBuyQuantity":productBuyQuantity
			}
		}).success(function(data){
			if(data.result=="200"){
				window.location="/ebayCart";
			}
		});
	};

	$scope.eBayShowBidders = function(username,productname,prdAvailableQuantity,productDesc,productid,seller_handle,prd_price,productBuyQuantity,biddingPrice){
		console.log("reached BID");
		console.log("quantity"+productBuyQuantity);
		$scope.biddingSuccessDiv=false;
		$http({
			url:"/eBayShowBidders",
			method:"POST",
			data:{
				"sellerName":username,
				"productname":productname,
				"prdAvailableQuantity":prdAvailableQuantity,
				"productDesc":productDesc,
				"productid":productid,
				"seller_handle":seller_handle,
				"prd_price":prd_price,
				"productBuyQuantity":productBuyQuantity,
				"biddingPrice":biddingPrice
			}
		}).success(function(data){
			if(data.statusCode==200){
				$scope.result=data.result;
			
			}
			
		});
	};


	$scope.eBayPlaceBid = function(username,productname,prdAvailableQuantity,productDesc,productid,seller_handle,prd_price,productBuyQuantity,biddingPrice){
		console.log("reached BID");
		console.log("quantity"+productBuyQuantity);
		$scope.biddingSuccessDiv=false;
		$http({
			url:"/ebayBidCart",
			method:"POST",
			data:{
				"sellerName":username,
				"productname":productname,
				"prdAvailableQuantity":prdAvailableQuantity,
				"productDesc":productDesc,
				"productid":productid,
				"seller_handle":seller_handle,
				"prd_price":prd_price,
				"productBuyQuantity":productBuyQuantity,
				"biddingPrice":biddingPrice
			}
		}).success(function(data){
			if(data.statusCode==200){
				$scope.timer=data.timer;
				$scope.biddingSuccessDiv= !$scope.biddingSuccessDiv;
			}
			else if(data.statusCode==402){
				alert(data.error);
			}
			else if(data.statusCode==403){
				console.log(data.error);
			}
		});
	};

});


//profile controller
var myProfile = angular.module('myProfile',[]);
myProfile.controller('myProfileController',function($scope,$http){
    $http({
        method:"POST",
        url:"/fetchAdvertisement"
    }).success(function(data){
        $scope.result=data.result;
    });
	$scope.myVar = false;
	$scope.myVar1=false;
    $scope.sellItem = function() {
        $scope.myVar = !$scope.myVar;
    };
    $scope.myAdvertisements=function(){
    	$scope.myVar1= !$scope.myVar1;
    };
 	$scope.showBid=function(){
    	$scope.myVar4= !$scope.myVar4;
    };

    $scope.postAdvertisement=function(){
    	
        $http({
            url:"/postAdvertisement",
            method:"POST",
            data:{
                "itemName":$scope.itemName,
                "itemDescription":$scope.itemDescription,
                "itemPrice":$scope.itemPrice,
                "Quantity":$scope.Quantity
            }
        }).success(function(data){
            //$scope.Result=data.result;
        	if(data.result=="501"){
        		console.log("no items in cart");
        	}
        	else{
        		$scope.itemName="";
                $scope.itemDescription="";
                $scope.itemPrice="";
                $scope.Quantity="";
        	}
            
        });

    };

     $scope.postAdvertisementBid=function(){
    	
        $http({
            url:"/postAdvertisementBid",
            method:"POST",
            data:{
                "itemName":$scope.itemName,
                "itemDescription":$scope.itemDescription,
                "itemPrice":$scope.itemPrice,
                "Quantity":$scope.Quantity,
                "bidTime":$scope.bidTime
            }
        }).success(function(data){
            //$scope.Result=data.result;
        	if(data.result=="510"){
        		console.log("no items in cart");
        	}
        	else{
        		$scope.itemName="";
                $scope.itemDescription="";
                $scope.itemPrice="";
                $scope.Quantity="";
                $scope.bidTime="";
        	}
            
        });

    };

    $scope.myVar2 = false;
    $scope.myPurchases = function(){
    	$scope.myVar2= !$scope.myVar2;
    	$http({
    		method:"POST",
    		url:"/myPurchases"
    	}).success(function(data){
    		$scope.results1=data.results1;
    		console.log("data is :"+data.results1[0].s_username);
    	});
    };

    $scope.myVar3 = false;
    $scope.mySoldItems = function(){
    	$scope.myVar3= !$scope.myVar3;
    	$http({
    		method:"POST",
    		url:"/mySoldItems"
    	}).success(function(data){
    		$scope.results2=data.results2;
    		console.log("data is :"+data.results2[0].s_username);
    	});
    };
});


//cart app and controller
var myCartApp = angular.module('myCartApp',[]);
myCartApp.controller('myCartController',function($http,$scope){
	$scope.showCart = function() {
    	$scope.myVar = !$scope.myVar;
    	$http({
    		url:"/getCartItems",
    		method:"POST"
    	}).success(function(data){
    		$scope.cart=data.cart;
    		$scope.totalPrice=data.totalPrice;
    		
    	});

    };
    $scope.checkOut=function(){
    	$http({
    		url:"/checkOut",
    		method:"POST"
    	}).success(function(data){
    		if (data.totalPrice!= 0) {
    			window.location="/showCheckoutPage";
    		}
    		else{
    			$scope.err="No Items in Cart";
    		}
    	});
    }

    $scope.removeItemFromCart = function(itemName,productBuyQuantity,prd_price){
		$http({
			method : "POST",
			url : "/removeItemFromCart",
			data : {
				"productname" : itemName,
				"productBuyQuantity" : productBuyQuantity,
				"prd_price":prd_price
			}
		}).success(function(data){
			if(data.statusCode == 200){
				$scope.cart = data.itemsInCart;
				$scope.totalPrice = data.totalPrice;
				
			}
			else
				console.log("Failed Removing the object");
		});
	};
});

//checkout page
var checkoutApp = angular.module('checkoutApp',[]);
checkoutApp.controller('checkoutController',function($scope,$http){
	$http({
		url:"/getCheckoutItems",
		method:"POST"
	}).success(function(data){
		$scope.checkoutItems = data.result;
	});
	$scope.buyProduct=function(){
		$http({
			url:"/buyProduct",
			method:"POST",
			data:{
				"streetAddress":$scope.streetAddress,
				"place":$scope.place,
				"state":$scope.state,
				"country":$scope.country,
				"postalCode":$scope.postalCode
			}
		}).success(function(data){
			if(data.result=="failure"){
				console.log("fdssaf");
			}
			if(data.result=="success"){
				window.location="/profile";
			}
		})


	}
	$scope.ValidateCard = function(){
		$scope.Result="";
		$scope.Result1="";
		$http({
			url:"/creditCardvalidation",
			method:"POST",
			data: {
				"CreditCardNo":$scope.CNum,
	  			"ExpirationDate":$scope.ExpDate,
	  			"CvvNumber":$scope.CvvNo
	  		}
		}).success(function(data){
	  		console.log(data.result);
	  		if(data.result == "success"){
	  		$scope.Result1="valid credit Card info";
	  		}
	  		else if(data.result == "inValidcard"){
	  		$scope.Result="Invalid card number";
	  		}
	  		else if(data.result == "inValidcvv"){
	  		$scope.Result="Invalid CVV";
	  		}
	  		else if(data.result == "inValiddate"){
	  		$scope.Result="Invalid Expiration Date";
	  		}
		});
	}
	
});




