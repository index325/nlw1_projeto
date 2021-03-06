import { Request, Response } from "express";
import knex from "../database/connection";

class PointsController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    console.log(parsedItems);

    let qb = knex("points").join(
      "point_items",
      "points.id",
      "=",
      "point_items.point_id"
    );

    if (items) {
      qb.whereIn("point_items.item_id", parsedItems);
    }

    const points = await qb
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("points.*");

    const serializedPoints = points.map((point) => {
      return {
        ...point,
        image_url: `http://192.168.15.10:3333/uploads/${point.image}`,
      };
    });

    return response.json(serializedPoints);
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
      address,
    } = request.body;

    const trx = await knex.transaction();
    // let itemVerify;

    // items.split(",").map(async (item: number) => {
    //   itemVerify = await knex("items").select("*").where("id", item);
    //   if (itemVerify.length === 0 || itemVerify.length < 0) {
    //     return response.json({
    //       message: `O item de número ${item} não foi encontrado`,
    //     });
    //   }
    // });

    try {
      const point = {
        image: request.file.filename,
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
        address,
      };

      const pointInserted = await trx("points").insert(point).returning(["id"]);

      const point_id = pointInserted[0].id;

      const pointItems = items
        .split(",")
        .map((item: string) => Number(item.trim()))
        .map((item_id: number) => {
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

    const serializedPoint = {
      ...point,
      image_url: `https://raw.githubusercontent.com/index325/nlw1_projeto/774c6d22cd8b51c9b6fa4cd3288b89df06409d37/server/uploads/${point.image}`,
    };

    const items = await knex("items")
      .join("point_items", "items.id", "=", "point_items.item_id")
      .where("point_items.point_id", id)
      .select("*");

    return response.json({ point: serializedPoint, items });
  }
}

export default PointsController;
