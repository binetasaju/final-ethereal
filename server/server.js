
const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // For password hashing
const cors = require('cors')
const jwt = require('jsonwebtoken'); // For token generation
require('dotenv').config(); // Load environment variables

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT']
}))

const port = process.env.PORT || 5000; // Use environment variable for port

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// MySQL connection setup
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1); // Exit the process if connection fails
  }
  console.log('Connected to the MySQL database');
});

// Secret key for JWT
const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret_key';

// POST route for user registration
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Check if email or password is not provided
  if (!email || !password) {
    return res.status(400).send('Email and password are required.');
  }

  // Check if the email already exists
  const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkEmailQuery, [email], async (err, results) => {
    if (err) {
      console.error('Error checking email:', err);
      return res.status(500).send('Error checking email');
    }

    if (results.length > 0) {
      return res.status(400).send('Email already exists.');
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const insertUserQuery = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(insertUserQuery, [email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error inserting user into database:', err);
        return res.status(500).send('Error registering user');
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// POST route for user login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required.');
  }

  // Check if the user exists in the database
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Error fetching user from database:', err);
      return res.status(500).send('Error logging in');
    }

    if (results.length === 0) {
      return res.status(401).send('Invalid email or password');
    }

    const user = results[0];

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid email or password');
    }

    // Generate a JWT
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: '1h', // Token expires in 1 hour
    });

    res.status(200).json({ message: 'Login successful', token });
  });
});

// Middleware to authenticate routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(403); // No token provided

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = user;
    next();
  });
};

// POST route to save text entry (protected route)
app.post('/entries', authenticateToken, (req, res) => {
  const { title, content } = req.body;
  const id = req.user.id; // Get the user ID from the token

  if (!title || !content) {
    return res.status(400).send('Title and content are required.');
  }

  const query = 'INSERT INTO diary_entries (user_id, title, content) VALUES (?, ?, ?)';
  db.query(query, [id, title, content], (err, result) => {
    if (err) {
      console.error('Error inserting entry into the database:', err);
      return res.status(500).send('Error saving entry');
    }

    res.status(200).json({
      message: 'Entry saved successfully',
      entry: {
        id: result.insertId,
        title: title,
        content: content,
        created_at: new Date().toISOString(),
      },
    });
  });
});

// GET route to fetch diary entries for a logged-in user (protected route)
app.get('/entries', authenticateToken, (req, res) => {
  const id = req.user.id; // Get the user ID from the token

  const query = 'SELECT * FROM diary_entries WHERE user_id = ? ORDER BY created_at DESC';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching entries from database:', err);
      return res.status(500).send('Error fetching entries');
    }

    res.status(200).json(results);
  });
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
