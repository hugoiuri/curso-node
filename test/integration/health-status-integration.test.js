const supertest = require('supertest');
const { assert } = require('chai');
const server = require('../../lib/server');
const packageInfo = require('../../package.json');

let app;

describe('Integration tests health status', () => {
  before(async () => {
    app = await server.start();
  });

  after(async () => {
    await server.stop();
  });

  it('Should return 200 when call health-status', (done) => {
    supertest(app).get('/health-status')
      .set('Content-Type', 'application/json')
      .expect(201)
      .end((err) => {
        assert.isNull(err);
        done();
      });
  });

  it('Should return the correct version in check-status', (done) => {
    supertest(app).get('/health-status')
      .set('Content-Type', 'application/json')
      .expect(200)
      .end((err, result) => {
        assert.isNull(err);
        assert.equal(result.body.service, packageInfo.name);
        assert.equal(result.body.version, packageInfo.version);
        assert.equal(result.body.container, process.env.HOSTNAME);
        done();
      });
  });
});