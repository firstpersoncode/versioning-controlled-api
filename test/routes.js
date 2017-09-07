const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const chaiHttp = require('chai-http');
const {Data, Drafts} = require('../db/model');

const should = chai.should();
chai.use(chaiHttp);

// run app
// return array of keys
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
  it('should return lists of available keys', (done) => {
    request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
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
    server = require('../index');
  });
  afterEach(() => {
    server.close();
  });
  it('should return matched parameters from first item', (done) => {
    if (process.env.NODE_ENV === "nodb") {
      request(server)
        .get('/' + Data[0]['key']) // match with the first item's key value
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data[0].should.have.property('key');
          res.body.data[0].should.have.property('value');
          done();
        });
    } else {
      Data.find({}, (err, data) => {
        if (err)
          throw err;

        // return data;
        request(server)
          .get('/' + data[0]['key']) // match with the first item's key value
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('data');
            res.body.data[0].should.have.property('key');
            res.body.data[0].should.have.property('value');
            done();
          });
      });
    }
  });
});

// add and update
describe('add new key and update value of key', () => {
  let server;
  let data = {};
  beforeEach(() => {
    server = require('../index');
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
        res.body.should.have.property('data');
        res.body.data.should.have.property('key');
        res.body.data.should.have.property('value');
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
        res.body.should.have.property('data');
        res.body.data.should.have.property('key');
        res.body.data.should.have.property('value');
        done();
      });
  });
});
