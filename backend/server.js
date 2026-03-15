const express      = require('express');
const mongoose     = require('mongoose');
const cors         = require('cors');
const cookieParser = require('cookie-parser');
const dotenv       = require('dotenv');

dotenv.config();

const app = express();

// ─── Core middleware ──────────────────────────────────
app.use(cors({
  origin:      process.env.NODE_ENV === 'production'
                 ? (process.env.FRONTEND_URL || false)
                 : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,   // required — lets browser send cookies cross-origin
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());            // parse req.cookies

// ─── Routes ──────────────────────────────────────────
app.use('/api/auth',   require('./routes/auth.routes'));
app.use('/api/notes',  require('./routes/notes'));
app.use('/api/tags',   require('./routes/tags'));
app.use('/api/users',  require('./routes/users'));
app.use('/api/shared', require('./routes/shared'));

// ─── Health check ─────────────────────────────────────
app.get('/api/health', (_req, res) =>
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
);

// ─── Global error handler ─────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ─── Start ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅  MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀  Server on port ${PORT}  [${process.env.NODE_ENV || 'development'}]`);
    });
  })
  .catch(err => {
    console.error('❌  MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;