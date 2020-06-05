import { Request, Response } from "express";
import knex from "../database/connection";

class PointsController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    const points = await knex("points")
      .join("point_items", "points.id", "=", "point_items.point_id")
      .whereIn("point_items.item_id", parsedItems)
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("points.*");

    return response.json(points);
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
      items,
    } = request.body;

    const trx = await knex.transaction();
    let itemVerify;

    items.map(async (item: number) => {
      itemVerify = await knex("items").select("*").where("id", item);
      if (itemVerify.length === 0 || itemVerify.length < 0) {
        return response.json({
          message: `O item de número ${item} não foi encontrado`,
        });
      }
    });

    try {
      const point = {
        image:
          "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
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
  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex("points").where("id", id).first();

    if (!point) {
      return response
        .status(400)
        .json({ message: "Ponto de coleta não encontrado" });
    }

    const items = await knex("items")
      .join("point_items", "items.id", "=", "point_items.item_id")
      .where("point_items.point_id", id)
      .select("*");

    return response.json({ point, items });
  }
}

export default PointsController;
