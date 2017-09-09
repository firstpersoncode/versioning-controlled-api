const chai = require('chai');
const request = require('supertest');
const chaiHttp = require('chai-http');
const {Data, Drafts} = require('../db/model');
const debug = require('debug')
const log = debug('debug')

const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);


describe("ROUTES TEST SESSION", () => {
  let openDB, closeDB, server;
  before(() => {
    if (process.env.NODE_ENV !== "nodb") {
      const {open, close} = require('../db');
      openDB = open;
      closeDB = close;
      openDB('mongodb://localhost/keys-api');
    }
  });
  after(() => {
    if (process.env.NODE_ENV !== "nodb") {
      closeDB();
    }
  });
  beforeEach(() => {
    server = require('../index');
  })
  afterEach(() => {
    server.close();
  })
  // run app
  describe('responds to /', () => {
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
    it('should generate 2 random keys', function(done) {
      this.timeout(60000) // dont worry, it wont take until 1 minute
      request(server)
        .get('/generate/2')
        .end(async (err, res) => {
          res.should.have.status(200);
          await res.body.should.be.a('object');
          log({result: res.body.data})
        });

        setTimeout(done, 1000)
    });
  })

  // return array of keys
  describe('lists of keys', (done) => {
    it('should return lists of available keys', function(done) {
      this.timeout(60000) // dont worry, it wont take until 1 minute
      request(server)
        .get('/')
        .end(async (err, res) => {
          res.should.have.status(200);
          await res.body.should.be.a('object');
          log({result: res.body.data})
        });

        setTimeout(done, 1000)
    });
  })


  // add, get and update
  describe('add new key, query key and update value of key', () => {
    let data = {'testRandomKeys': 'generate from test file'};

    it('should add new key into database', function(done) {
      this.timeout(60000) // dont worry, it wont take until 1 minute

      request(server)
        .post('/')
        .send(data)
        .end(async (err, res) => {
          res.should.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('key');
          log({result: res.body.data})
        });
        setTimeout(done, 1000)
    });
    it('should return matched parameters from first item', function(done) {

      this.timeout(60000) // dont worry, it wont take until 1 minute

      request(server)
        .get('/' + 'testRandomKeys') // match with the first item's key value
        .end(async (err, res) => {
          res.should.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('data');
          expect(res.body.data[0]).to.have.property('key');
          log({result: res.body.data[0]})
        });
        setTimeout(done, 1000)
    });
    it('should update value of key in database', function(done) {
      this.timeout(60000)
      data = {'testRandomKeys': 'update from test file'};
      request(server)
        .post('/')
        .send(data)
        .end(async (err, res) => {
          res.should.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('key');
          log({result: res.body.data})
        });
        setTimeout(done, 1000)
    });
  });

})
