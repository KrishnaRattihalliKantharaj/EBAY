/**
 * New node file
 */
var request = require('request')
, express = require('express')
,assert = require("assert")
,http = require("http");

describe('http tests', function(){

	it('Login', function(done) {
		request.post(
			    'http://localhost:3000/ebayLogin',
			    { form: { emailId: 'krishna@gmail.com',loginPassword:'krishna' } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });

	it('Load Login Page', function(done){
		http.get('http://localhost:3000/', function(res) {
			assert.equal(200, res.statusCode);
			done();
		});
	});

	it('Checkout Page', function(done){
		http.get('http://localhost:3000/showCheckoutPage', function(res) {
			assert.equal(200, res.statusCode);
			done();
		});
	});
		it('Ebay Cart', function(done){
		http.get('http://localhost:3000/ebayCart', function(res) {
			assert.equal(200, res.statusCode);
			done();
		});
	});
	it('Registration page', function(done){
		request.post(
			    'http://localhost:3000/ebayRegistration',
			    { form: {regEmail: "krishnark1667@gmail.com", password: "krishna", firstName: "krishna", lastName: "rk", location: "San Jose", password: "krishna", regEmail: "krishnark@gmail.com"} },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	});

});