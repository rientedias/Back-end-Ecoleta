import express from 'express';

//Import Controllers
import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';


const routes = express.Router();

//Instantiate
const pointsController = new PointsController();
const itemsController = new ItemsController()

//GET
routes.get('/items', itemsController.index);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

//POST
routes.post('/points', pointsController.create);

export default routes;