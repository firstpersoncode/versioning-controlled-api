const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const chaiHttp = require('chai-http');
const {data, drafts} = require('../db');

const should = chai.should();
const PORT = process.env.PORT || 7000;
chai.use(chaiHttp);
console.log("Test running on PORT: ", PORT);

// run app
// return array of keys
describe('responds to /', () => {
  let server;
  beforeEach(() => {
    server = require('../index').listen(PORT);
  });
  afterEach(() => {
    server.close();
  });
  it('app is working', (done) => {
    request(server)
      .get('/')
      .expect(200, done);
  });
  it('should return array of available keys', (done) => {
    request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
  });
  it('404 everything else', (done) => {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
});

// get key
describe('responds to /:params', () => {
  let server;
  beforeEach(() => {
    server = require('../index').listen(PORT);
  });
  afterEach(() => {
    server.close();
  });
  it('should return matched parameters', (done) => {
    request(server)
      .get('/' + data[0]['key'])
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('key');
        res.body.should.have.property('value');
        done();
      });
  });
});

// add and update
describe('add new key and update value of key', () => {
  let server;
  let data = {};
  beforeEach(() => {
    server = require('../index').listen(PORT);
  });
  afterEach(() => {
    server.close();
  });
  it('should add new key into database', (done) => {
    data['testRandomKeys'] = 'generate from test file';
    request(server)
      .post('/')
      .send(data)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('newData');
        res.body.newData.should.have.property('key');
        res.body.newData.should.have.property('value');
        done();
      });
  });
  it('should update value of key in database', (done) => {
    data['testRandomKeys'] = 'updated from test file';
    request(server)
      .post('/')
      .send(data)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('result');
        res.body.result.should.have.property('key');
        res.body.result.should.have.property('value');
        done();
      });
  });
});
