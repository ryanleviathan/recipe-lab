const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/recipe');

describe('recipe-lab routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ],
        ingredients: [
          { amount: '2' },
          { measurements: 'cups' },
          { name: 'flour' }
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [
            { amount: '2' },
            { measurements: 'cups' },
            { name: 'flour' }
          ]
        });
      });
  });

  it('gets all recipes', async() => {
    const recipes = await Promise.all([
      { name: 'cookies', directions: [],
        ingredients: [
          { amount: '2' },
          { measurements: 'cups' },
          { name: 'flour' }
        ] },
      { name: 'cake', directions: [], 
        ingredients: [
          { amount: '2' },
          { measurements: 'cups' },
          { name: 'flour' }
        ]
      },
      { name: 'pie', directions: [],
        ingredients: [
          { amount: '2' },
          { measurements: 'cups' },
          { name: 'flour' }
        ]
      }
    ].map(recipe => Recipe.insert(recipe)));

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual(recipe);
        });
      });
  });

  it('updates a recipe by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: [
        { amount: '2' },
        { measurements: 'cups' },
        { name: 'flour' }
      ]
    });

    return request(app)
      .put(`/api/v1/recipes/${recipe.id}`)
      .send({
        name: 'good cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ],
        ingredients: [
          { amount: '25' },
          { measurements: 'cups' },
          { name: 'chicken broth' }
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'good cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [
            { amount: '25' },
            { measurements: 'cups' },
            { name: 'chicken broth' }
          ]
        });
      });
  });

  it('gets a recipe by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: [
        { amount: '2' },
        { measurements: 'cups' },
        { name: 'flour' }
      ]
    });
    const res = await request(app)
      .get(`/api/v1/recipes/${recipe.id}`);        
        
    expect(res.body).toEqual({
      id: expect.any(String),
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: [
        { amount: '2' },
        { measurements: 'cups' },
        { name: 'flour' }
      ]
    });
  });

  it('deletes a recipe by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: [
        { amount: '2' },
        { measurements: 'cups' },
        { name: 'flour' }
      ]
    });
    const res = await request(app)
      .delete(`/api/v1/recipes/${recipe.id}`);        
        
    expect(res.body).toEqual({
      id: expect.any(String),
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: [
        { amount: '2' },
        { measurements: 'cups' },
        { name: 'flour' }
      ]
    });
  });
});
