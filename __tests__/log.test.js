const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Log = require('../lib/models/log');
const Recipe = require('../lib/models/recipe');

describe('log routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('creates a log', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    const res = await request(app)
      .post('/api/v1/logs')
      .send({
        dateOfEvent: new Date(),
        notes: 'This is fantastic! Defintely make these again',
        rating: 10,
        recipeId: recipe.id
      });

    expect(res.body).toEqual({
      id: "1",
      dateOfEvent: expect.anything(),
      notes: 'This is fantastic! Defintely make these again',
      rating: 10,
      recipeId: recipe.id
    });
  });

  it('finds all logs', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    const log = await Log.insert({
      dateOfEvent: new Date(),
      notes: 'This is fantastic! Defintely make these again',
      rating: 10,
      recipeId: recipe.id
    });

    const res = await request(app)
      .get('/api/v1/logs');

    expect(res.body).toEqual([{
      id: "1",
      dateOfEvent: expect.anything(),
      notes: 'This is fantastic! Defintely make these again',
      rating: 10,
      recipeId: recipe.id
    }]);
  });

  it('finds a log by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    const log = await Log.insert({
      dateOfEvent: new Date(),
      notes: 'This is fantastic! Defintely make these again',
      rating: 10,
      recipeId: recipe.id
    });

    const res = await request(app)
      .get(`/api/v1/logs/${log.id}`);

    expect(res.body).toEqual({
      id: "1",
      dateOfEvent: expect.anything(),
      notes: 'This is fantastic! Defintely make these again',
      rating: 10,
      recipeId: recipe.id
    });
  });
});
