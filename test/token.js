var expect = require('chai').expect;
var supertest = require('supertest');
var app = require('../app.js');


describe('token', function() {
  describe('POST /token', function() {
    it('generates a token', function(done) {
      var agent = supertest(app);
      agent
        .post('/token')
        .send({
          page: '/dashboard',
        })
        .expect(function(response) {
          expect(response.text).to.contain('{"token":"');
        })
        .expect(200, done);
    });
  });
});
