import express, { Router } from 'express';
const router = express.Router();

import {
    getConnectionsCount,
    getConnectionsRequest,
    getUsersCount,
    addUser,
    addConnection,
    addConnectionRequest,
} from "../controller/admin.controller.js";

import { sendEmail,sendDetailsEmail } from '../controller/emailservice.controller.js';

router.route('/get-users-count').get(getUsersCount);
router.route('/get-connections-count').get(getConnectionsCount);
router.route('/get-connections-request').get(getConnectionsRequest);
router.route('/add-user').post(addUser);
router.route('/add-connection').post(addConnection);
router.route('/add-connection-request').post(addConnectionRequest);

router.route('/send-email').post(sendEmail);
router.route('/send-email-details').post(sendDetailsEmail);

export default router;
