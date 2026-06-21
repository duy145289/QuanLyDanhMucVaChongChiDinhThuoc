const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const auditLog = require('./middleware/auditLog');
const thuocRoutes = require('./routes/thuoc');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(auditLog);

app.use('/api/thuoc', thuocRoutes);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend Quan Ly Danh Muc Va Chong Chi Dinh Thuoc dang hoat dong'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
