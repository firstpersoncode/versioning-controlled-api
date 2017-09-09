const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const chaiHttp = require('chai-http');
const {Data, Drafts} = require('../db/model');


const should = chai.should();
chai.use(chaiHttp);

// run app
describe('responds to /', () => {
  let server;
  beforeEach(() => {
    server = require('../index');
  });
  afterEach(() => {
    server.close();
  });
  it('app is working', (done) => {
    request(server)
      .get('/')
      .expect(200, done);
  });
  it('404 everything else', (done) => {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
});

// test generate keys
describe('generate random lists of keys', (done) => {
  let server;
  beforeEach(() => {
    server = require('../index');
  });
  afterEach(() => {
    server.close();
  });
  it('should generate random keys', function(done) {
    this.timeout(60000) // dont worry, it wont take until 1 minute
    request(server)
      .get('/generate')
      .end(async (err, res) => {
        res.should.have.status(200);
        await res.body.should.be.a('object');
      });

      setTimeout(done, 2000)
  });
})

// return array of keys
describe('lists of keys', (done) => {
  let server;
  beforeEach(() => {
    server = require('../index');
  });
  afterEach(() => {
    server.close();
  });
  it('should return lists of available keys', function(done) {
    this.timeout(60000) // dont worry, it wont take until 1 minute
    request(server)
      .get('/')
      .end(async (err, res) => {
        res.should.have.status(200);
        await res.body.should.be.a('object');
      });

      setTimeout(done, 2000)
  });
})

let data = {};
const key = 'testRandomKeys';

// add and update
describe('add new key and update value of key', () => {
  let server;
  beforeEach(() => {
    server = require('../index');
  });
  afterEach(() => {
    server.close();
  });

  it('should add new key into database', function(done) {
    this.timeout(60000) // dont worry, it wont take until 1 minute
    data[key] = 'generate from test file';
    request(server)
      .post('/')
      .send(data)
      .end(async (err, res) => {
        res.should.have.status(200);
        await res.body.should.be.a('object');
        await res.body.should.have.property('data');
        await res.body.data.should.have.property('key');
        await res.body.data.should.have.property('value');
      });
      setTimeout(done, 2000)
  });
  it('should update value of key in database', function(done) {
    this.timeout(60000)
    data[key] = 'updated from test file';
    request(server)
      .post('/')
      .send(data)
      .end(async (err, res) => {
        res.should.have.status(200);
        await res.body.should.be.a('object');
        await res.body.should.have.property('data');
        await res.body.data.should.have.property('key');
        await res.body.data.should.have.property('value');
      });
      setTimeout(done, 2000)
  });
});

// get key
describe('responds to /:params', () => {
  let server;
  beforeEach(() => {
    server = require('../index');
  });
  afterEach(() => {
    // remove the document generate from test
    Data.delete({});
    Drafts.delete({});
    server.close();
  });
  it('should return matched parameters from first item', function(done) {

    this.timeout(60000) // dont worry, it wont take until 1 minute

    request(server)
      .get('/' + data[key]) // match with the first item's key value
      .end(async (err, res) => {
        res.should.have.status(200);
        await res.body.should.be.a('object');
        await res.body.should.have.property('data');
        await res.body.data[0].should.have.property('key');
        await res.body.data[0].should.have.property('value');
        // done()
      });
      setTimeout(done, 2000)
  });
});
