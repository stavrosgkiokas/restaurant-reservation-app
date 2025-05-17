const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ Load all route modules
app.use(require('./routes/auth'));
app.use(require('./routes/restaurants'));
app.use(require('./routes/reservations'));

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
