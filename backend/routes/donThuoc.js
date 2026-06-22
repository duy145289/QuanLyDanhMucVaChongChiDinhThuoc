const express = require('express');
const { verifyToken, checkRole } = require('../middleware/auth');
const donThuocService = require('../services/donThuocService');

const router = express.Router();

function handleRouteError(res, error) {
  console.error(error);
  return res.status(error.statusCode || 500).json({
    message: error.statusCode ? error.message : 'Loi xu ly don thuoc',
    details: error.details || undefined
  });
}

router.get('/', async (_req, res) => {
  try {
    return res.json(await donThuocService.listDonThuoc());
  } catch (error) {
    return handleRouteError(res, error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const prescription = await donThuocService.getDonThuoc(req.params.id);
    if (!prescription) return res.status(404).json({ message: 'Khong tim thay don thuoc' });
    return res.json(prescription);
  } catch (error) {
    return handleRouteError(res, error);
  }
});

router.post('/draft', verifyToken, checkRole(['Admin', 'BacSi']), async (req, res) => {
  try {
    const prescription = await donThuocService.createDraft(req.body, req.user);
    return res.status(201).json(prescription);
  } catch (error) {
    return handleRouteError(res, error);
  }
});

router.post('/dose-check', verifyToken, checkRole(['Admin', 'BacSi', 'DuocSi']), (req, res) => {
  try {
    return res.json(donThuocService.checkDose(req.body));
  } catch (error) {
    return handleRouteError(res, error);
  }
});

router.post('/', verifyToken, checkRole(['Admin', 'BacSi']), async (req, res) => {
  try {
    const prescription = await donThuocService.createPrescription(req.body, req.user);
    return res.status(201).json(prescription);
  } catch (error) {
    return handleRouteError(res, error);
  }
});

module.exports = router;
