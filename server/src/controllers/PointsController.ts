import { Request, Response } from "express";
import knex from "../database/connection";

class PointsController {
  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;

    const trx = await knex.transaction();

    try {
      const point = {
        image: "image-fake",
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
      };
      const pointInserted = await trx("points").insert(point).returning(["id"]);

      const point_id = pointInserted[0].id;

      const pointItems = items.map((item_id: number) => {
        return {
          item_id,
          point_id,
        };
      });

      await trx("point_items").insert(pointItems);

      await trx.commit();

      return response.json({
        point_id,
        ...point,
      });
    } catch (err) {
      console.log(err);
    }
  }
}

export default PointsController;
