import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let app = express();
let PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
let db;

(async () => {
  db = await open({
    filename: './BD4_Assignment1/database.sqlite',
    driver: sqlite3.Database,
  });
})();

// Get All Restaurants

async function fetchAllRestaurant() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/restaurants', async (req, res) => {
  try {
    let result = await fetchAllRestaurant();
    if (result.restaurants.length === 0) {
      res.status(404).json({ message: 'No such data found' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  Get Restaurant by ID
async function fetchById(id) {
  let query = 'SELECT * FROM restaurants WHERE id = ? ';
  let response = await db.all(query, [id]);
  return { restaurant: response };
}

app.get('/restaurants/details/:id', async (req, res) => {
  try {
    let id = req.params.id;
    let result = await fetchById(id);
    if (result.restaurant.length === 0) {
      res.status(404).json({ message: 'No such data found for ' + id });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  Get Restaurants by Cuisine

async function fetchByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  let response = await db.all(query, [cuisine]);
  return { restaurants: response };
}

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  try {
    let cuisine = req.params.cuisine;
    let result = await fetchByCuisine(cuisine);
    if (result.restaurants.length === 0) {
      res.status(404).json({ message: 'No such data found for ' + cuisine });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get Restaurants by Filter

async function restaurantByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    ' SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?';
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}

app.get('/restaurants/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let hasOutdoorSeating = req.query.hasOutdoorSeating;
    let isLuxury = req.query.isLuxury;
    let result = await restaurantByFilter(isVeg, hasOutdoorSeating, isLuxury);
    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: 'No such data found!' });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Restaurants Sorted by Rating

async function sortByRating() {
  let query = 'SELECT * FROM restaurants ORDER By rating = ? ';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let result = await sortByRating();
    if (result.restaurants.length === 0) {
      res.status(404).json({ message: 'No such data found!' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Dishes
async function fetchAllDishes() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/dishes', async (req, res) => {
  try {
    let result = await fetchAllDishes();
    if (result.restaurants.length === 0) {
      res.status(404).json({ message: 'No such data found!' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Dish by ID

async function fetchDishById(id) {
  let query = 'SELECT * FROM restaurants WHERE id = ?';
  let response = await db.all(query, [id]);
  return { restaurants: response };
}

app.get('/dishes/details/:id', async (req, res) => {
  try {
    let id = req.params.id;
    let result = await fetchDishById(id);
    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: 'No such data found!' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Dishes by Filter

async function filterByDish(isVeg) {
  let query = 'SELECT * FROM restaurants WHERE isVeg = ?';
  let result = await db.all(query, [isVeg]);
  return { restaurants: result };
}

app.get('/dishes/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let result = await filterByDish(isVeg);
    if (result.restaurants.length === 0) {
      res.status(404).json({ message: 'No such data found!' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//  Get Dishes Sorted by Price

async function sortByPrice() {
  let query = 'SELECT * FROM restaurants ORDER BY priceForTwo';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let result = await sortByPrice();
    if (result.restaurants.length === 0) {
      res.status(404).json({ message: 'No such data found!' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log('Server is running on port 3000');
});
