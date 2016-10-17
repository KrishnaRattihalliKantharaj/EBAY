
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , url = require('url')
  , path = require('path')
//Importing the 'client-sessions' module
  ,fs = require('fs')
  , session = require('client-sessions');


var eLoginAndRegister=require('./routes/eLoginAndRegister');
var app = express();

//all environments
//configure the sessions with our application

app.use(session({   
	  
	cookieName: 'session',    
	secret: 'cmpe273_test_string',    
	duration: 30 * 60 * 1000,    //setting the time for active session
	activeDuration: 5 * 60 * 1000,  })); // setting time for the session to be active when the window is open // 5 minutes set currently

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', routes.index);
app.get('/users', user.list);
app.post('/ebayLogin',eLoginAndRegister.ebayValidateLogin);
app.post('/getAdvertisementMainPage',eLoginAndRegister.getAdvertisementMainPage);
app.post('/ebayRegistration',eLoginAndRegister.ebayRegister);
app.post('/postAdvertisement',eLoginAndRegister.postAdvertisement);
app.post('/fetchAdvertisement',eLoginAndRegister.fetchAdvertisement);
app.post('/ebayAddCart',eLoginAndRegister.ebayAddCart);
app.post('/getCartItems',eLoginAndRegister.getCartItems);
app.post('/checkOut',eLoginAndRegister.checkOut);
app.post('/removeItemFromCart',eLoginAndRegister.removeItemFromCart);
app.post('/creditCardvalidation',eLoginAndRegister.creditCardvalidation);
app.post('/buyProduct',eLoginAndRegister.buyProduct);
app.post('/myPurchases',eLoginAndRegister.myPurchases);
app.post('/mySoldItems',eLoginAndRegister.mySoldItems);
app.post('/getCheckoutItems',eLoginAndRegister.getCheckoutItems);
app.post('/postAdvertisementBid',eLoginAndRegister.postAdvertisementBid);
app.post('/ebayBidCart',eLoginAndRegister.ebayBidCart);
app.post('/eBayShowBidders',eLoginAndRegister.eBayShowBidders);

app.get('/showCheckoutPage',eLoginAndRegister.showCheckoutPage);
app.get('/ebayCart',eLoginAndRegister.ebayCart);
app.get('/success',eLoginAndRegister.ebayMainPage);
app.get('/logout',eLoginAndRegister.logout);
app.get('/profile',eLoginAndRegister.profile);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
