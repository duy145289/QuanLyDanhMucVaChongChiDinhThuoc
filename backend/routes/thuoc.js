const express = require('express');
const { verifyToken, checkRole } = require('../middleware/auth');
const thuocService = require('../services/thuocService');
const { MEDICINE_CATEGORIES, MEDICINE_UNITS } = require('../constants/medicineCatalog');

const router = express.Router();

function handleRouteError(res, error, fallbackMessage) {
  console.error(error);
  return res.status(error.statusCode || 500).json({
    message: error.statusCode ? error.message : fallbackMessage,
    details: error.details || undefined
  });
}

router.get('/meta/options', (_req, res) => {
  return res.json({
    categories: MEDICINE_CATEGORIES,
    units: MEDICINE_UNITS
  });
});

router.get('/search', async (req, res) => {
  try {
    const items = await thuocService.searchThuoc({
      keyword: req.query.q || '',
      limit: req.query.limit
    });
    return res.json(items);
  } catch (error) {
    return handleRouteError(res, error, 'Loi tim kiem thuoc');
  }
});

router.get('/low-inventory', async (_req, res) => {
  try {
    const items = await thuocService.listThuoc({ keyword: '' });
    const lowInventory = items.filter((item) => (
      Number(item.tonKhoHienTai || 0) < Number(item.tonToiThieu || 0)
    ));

    return res.json({
      count: lowInventory.length,
      data: lowInventory
    });
  } catch (error) {
    return handleRouteError(res, error, 'Loi tinh toan ton toi thieu');
  }
});

router.get('/', async (req, res) => {
  const keyword = (req.query.q || '').trim();

  try {
    const items = await thuocService.listThuoc({ keyword });
    return res.json(items);
  } catch (error) {
    return handleRouteError(res, error, 'Loi lay danh sach thuoc');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const medicine = await thuocService.getThuoc(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: 'Khong tim thay thuoc' });
    }

    return res.json(medicine);
  } catch (error) {
    return handleRouteError(res, error, 'Loi lay chi tiet thuoc');
  }
});

router.post('/', verifyToken, checkRole(['Admin', 'BacSi', 'DuocSi']), async (req, res) => {
  try {
    const medicine = await thuocService.createThuoc(req.body);
    return res.status(201).json(medicine);
  } catch (error) {
    return handleRouteError(res, error, 'Loi them thuoc hoac trung ma ATC');
  }
});

router.put('/:id', verifyToken, checkRole(['Admin', 'BacSi', 'DuocSi']), async (req, res) => {
  try {
    const medicine = await thuocService.updateThuoc(req.params.id, req.body);

    if (!medicine) {
      return res.status(404).json({ message: 'Khong tim thay thuoc' });
    }

    return res.json(medicine);
  } catch (error) {
    return handleRouteError(res, error, 'Loi cap nhat thuoc');
  }
});

router.delete('/:id', verifyToken, checkRole(['Admin']), async (req, res) => {
  try {
    const deleted = await thuocService.deleteThuoc(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Khong tim thay thuoc de xoa' });
    }

    return res.json({ message: 'Da xoa thuoc thanh cong' });
  } catch (error) {
    return handleRouteError(res, error, 'Khong the xoa thuoc dang co rang buoc du lieu');
  }
});

module.exports = router;
