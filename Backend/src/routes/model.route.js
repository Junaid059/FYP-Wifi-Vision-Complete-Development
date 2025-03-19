import express, { Router } from 'express';
import IntegrateModel from '../controller/model.controller';

const router = express.Router();

router.route('/heatmap').get(IntegrateModel);

export default router;
