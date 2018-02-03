const request = require('supertest');

const expect = require('./expect');

const app = require('./../server/server');
const {Game, Player} = app.models;

describe('Dynamic coerce', () => {
  let httpServer;

  async function createData() {
    try {
      await Game.create([
        {name: 'Game one', mature: true, type: 1},
        {name: 'Game two', mature: true, type: 2},
        {name: 'Game three', mature: false, type: 23},
        {name: 'Game four', type: 23},
        {name: 'Game five', mature: false},
      ]);
      await Player.create([
        {name: 'Matteo', primary: true},
        {name: 'Antonio', primary: true, age: 34},
        {name: 'Daniele', primary: true, age: 36},
        {name: 'Alessandro', age: 25},
      ]);
    } catch (err) {
      throw err;
    }
  }

  async function deleteAllData() {
    try {
      await Game.destroyAll();
      await Player.destroyAll();
    } catch (err) {
      throw err;
    }
  }

  before(async() => {
    try {
      httpServer = await app.start();
      db = app.dataSources.arangodb;
      await db.automigrate();
      await deleteAllData();
      await createData();
    } catch (err) {
      throw err;
    }
  });

  after(async() => {
    try {
      await deleteAllData();
      httpServer.close();
    } catch (err) {
      throw err;
    }
  });

  describe('With definition property', async() => {
    let where = {and: [{mature: true}, {type: 1}]};
    const filter = JSON.stringify({where: where});
    where = JSON.stringify(where);

    it('find', async() => {
      const result = await request(app)
        .get(`/api/games?filter=${filter}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
      const games = result.body;
      expect(games).to.have.lengthOf(1);
      const game = games[0];
      expect(game.mature).to.be.equal(true);
      expect(game.type).to.be.equal(1);
      expect(game.name).to.be.equal('Game one');
    });

    it('count', async() => {
      const result = await request(app)
        .get(`/api/games/count?where=${where}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
      const count = result.body.count;
      expect(count).to.be.equal(1);
    });
  });

  describe('Without definition property', async() => {
    let where = {and: [{primary: true}, {age: {gte: 34}}]};
    const filter = JSON.stringify({where: where});
    where = JSON.stringify(where);

    it('find', async() => {
      const result = await request(app)
        .get(`/api/players?filter=${filter}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
      const players = result.body;
      expect(players).to.have.lengthOf(2);
    });

    it('count', async() => {
      const result = await request(app)
        .get(`/api/players/count?where=${where}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
      const count = result.body.count;
      expect(count).to.be.equal(2);
    });
  });
});