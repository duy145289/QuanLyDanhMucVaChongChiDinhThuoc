const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const thuocRoutes = require('./routes/thuoc');
const nguoiDungRoutes = require('./routes/nguoiDung');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/thuoc', thuocRoutes);
app.use('/api/nguoidung', nguoiDungRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
