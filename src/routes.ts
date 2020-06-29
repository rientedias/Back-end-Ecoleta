import express from 'express';
import knex from './database/connection';

//Import Controllers
import PointsControllers from './controllers/PointsController';
import PointsController from './controllers/PointsController';


const routes = express.Router();

const pointsController = new PointsController();

routes.get('/items', async (request, response) => {

  const items = await knex('items').select('*');

  const serializedItems = items.map(item => {
    return {
      id: item.id,
      title: item.title,
      image_url: `http://localhost:3333/uploads/${item.image}`
    }
  })
  return response.json(serializedItems)
});

routes.post('/points', pointsController.create);

routes.get('/points', async (request, response) => {

  const points = await knex('items').where('id','>', 0).del();

  return response.json(points)

});

export default routes;