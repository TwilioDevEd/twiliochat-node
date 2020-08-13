var expect = require('chai').expect;
var supertest = require('supertest');
var app = require('../app.js');

describe('token', function() {
  describe('POST /token', function() {
    it('generates a token', function(done) {
      supertest(app)
        .post('/token')
        .send({ page: '/dashboard' })
        .expect(res => expect(res.text).to.contain('{"token":"'))
        .expect(200, done);
    });
  });

  describe('GET /token', function() {
    it('generates a token', function(done) {
      supertest(app)
        .get('/token')
        .query({ identity: 'testing123'})
        .expect(res => expect(res.text).to.contain('"token":"'))
        .expect(res => expect(res.text).to.contain('"identity":"testing123"'))
        .expect(200, done);
    });
  });
});
