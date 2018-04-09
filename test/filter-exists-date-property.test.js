'use strict';

const app = require('../server/server');
const request = require('supertest');
const expect = require('./expect');

describe('Filter with exists clause', () => {
  it('should filter data with deleted property - date type', async() => {
    const filter = JSON.stringify({where: {deleted: {exists: true}}});
    const res = await request(app).get(`/api/Messages?filter=${filter}`);
    console.log(res.body);
    const errorResponse = res.body.error;
    expect(errorResponse).to.be.undefined();
  });

  it('should filter data with created property - any type', async() => {
    const filter = JSON.stringify({where: {created: {exists: true}}});
    const res = await request(app).get(`/api/Messages?filter=${filter}`);
    const errorResponse = res.body.error;
    expect(errorResponse).to.be.undefined();
    const messages = res.body;
    expect(messages).to.be.instanceOf(Array); ;
  });
});
