import { Request, Response } from 'express'
import knex from '../database/connection'
class PointsController {
    constructor() { }

    async index(request: Request, response: Response) {
        const { city, uf, items } = request.query;

        try {
            const parsedItems = String(items)
                .split(',')
                .map(item => Number(item.trim()));

            const points = await knex('points')
                .join('point_items', 'points.id', '=', 'point_items.point_id')
                .whereIn('point_items.item_id', parsedItems)
                .where('city', String(city))
                .where('uf', String(uf))
                .distinct()
                .select('points.*');
            if( points.length === 0 ){

                return  response
                .status(404)
                .json({sucess:false,message:'No collection points were found'})
            }    

            return response.status(200).json({success:true, points});

        }
        catch (error) {

            response.status(500).json(error);
        }
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;
        try {

            const point = await knex('points').where('id', id).first();

            if (!point) {
                return response.status(404).json({
                    success: false,
                    message: 'Point not found'
                })
            }
            const item = await knex('items')
                .join('point_items', 'items.id', '=', 'point_items.item_id')
                .where('point_items.point_id', id)
                .select('items.title')

            response.status(200).json({ point, item });

        }
        catch (error) {

            response.status(500).json(error);

        }

    }
    
    async create(request: Request, response: Response) {

        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;

        try {

            const trx = await knex.transaction();

            const point = {
                image: 'https://images.unsplash.com/photo-1580913428023-02c695666d61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
                name,
                email,
                whatsapp,
                latitude,
                longitude,
                city,
                uf,
            }

            const insertedIds = await trx('points').insert(point);

            const point_id = insertedIds[0];

            const pointItems = items.map((item_id: number) => {

                return {
                    item_id,
                    point_id,
                };

            });

            await trx('point_items').insert(pointItems);

            await trx.commit()

            return response
                .status(201)
                .json({

                    id: point_id,
                    ...point,

                });

        }
        catch (erro) {

            return response
                .status(500)
                .json(erro);

        }


    }
}
export default PointsController;