import express from 'express';
import { serviceController } from '../controllers/index.js';

const serviceRouter = express.Router();

serviceRouter.get('/', serviceController.fetchAllService);
serviceRouter.post('/', serviceController.addService);
serviceRouter.put('/:id', serviceController.updateService);
serviceRouter.delete('/:id', serviceController.deleteService);

export default serviceRouter;
