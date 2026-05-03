const express = require('express');
const db = require('./db');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Home page
app.get('/', (req, res) => {
  res.render('home');
});

// Recipe listing page
app.get('/recipes', async (req, res) => {
  try {
    const [recipes] = await db.query('SELECT * FROM recipes ORDER BY protein');
    // Group by protein
    const grouped = {};
    recipes.forEach(r => {
      if (!grouped[r.protein]) grouped[r.protein] = [];
      grouped[r.protein].push(r);
    });
    res.render('recipes', { grouped });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// Single recipe page
app.get('/recipe/:id', async (req, res) => {
  try {
    const [recipes] = await db.query('SELECT * FROM recipes WHERE id = ?', [req.params.id]);
    if (recipes.length === 0) return res.status(404).send('Recipe not found');

    const [ingredients] = await db.query(`
      SELECT i.name, i.info, ri.quantity
      FROM recipe_ingredients ri
      JOIN ingredients i ON ri.ingredient_id = i.id
      WHERE ri.recipe_id = ?
    `, [req.params.id]);

    res.render('recipe', { recipe: recipes[0], ingredients });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// Add recipe page
app.get('/add', async (req, res) => {
  try {
    const [ingredients] = await db.query('SELECT * FROM ingredients');
    res.render('add', { ingredients, success: false, error: null });
  } catch (err) {
    res.status(500).send('Database error');
  }
});

app.post('/add', async (req, res) => {
  const { name, protein, description, instructions, ingredient_ids, quantities } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO recipes (name, protein, description, instructions) VALUES (?, ?, ?, ?)',
      [name, protein, description, instructions]
    );
    const recipeId = result.insertId;

    if (ingredient_ids) {
      const ids = Array.isArray(ingredient_ids) ? ingredient_ids : [ingredient_ids];
      const qtys = Array.isArray(quantities) ? quantities : [quantities];
      for (let i = 0; i < ids.length; i++) {
        await db.query(
          'INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES (?, ?, ?)',
          [recipeId, ids[i], qtys[i] || '']
        );
      }
    }

    const [ingredients] = await db.query('SELECT * FROM ingredients');
    res.render('add', { ingredients, success: true, error: null });
  } catch (err) {
    console.error(err);
    const [ingredients] = await db.query('SELECT * FROM ingredients');
    res.render('add', { ingredients, success: false, error: 'Failed to add recipe. Please try again.' });
  }
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));