/**
 * New node file
 */
var request = require('request')
, express = require('express')
,assert = require("assert")
,http = require("http");

describe('http tests', function(){

	it('Login API', function(done){
		http.get('http://localhost:3000/ebayLogin', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	it('Advertisements Loading API', function(done){
		http.get('http://localhost:3000/getAdvertisementMainPage', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	it('Get Passport Session', function(done){
		http.get('http://localhost:3000/fetchAdvertisement', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	it('Sold Items Display API', function(done){
		http.get('http://localhost:3000/mySoldItems', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	it('Load Profile API', function(done){
		http.get('http://localhost:3000/profile', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
});