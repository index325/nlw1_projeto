import express from "express";
import knex from "./database/connection";

const routes = express.Router();

routes.get("/items", async (request: any, response: any) => {
  const items = await knex("items").select("*");

  const serializedItems = items.map((item) => {
    return {
      id: item.id,
      title: item.title,
      image_url: `http://localhost:3333/uploads/${item.image}`,
    };
  });

  return response.json(serializedItems);
});

routes.post("/points", async (request: any, response: any) => {
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

  try {
    const point = await knex("points")
      .insert({
        image: "image-fake",
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
      })
      .returning(["id"]);

    const point_id = point[0].id;

    const pointItems = items.map((item_id: number) => {
      return {
        item_id,
        point_id,
      };
    });

    await knex("point_items").insert(pointItems);

    return response.json({ success: true });
  } catch (err) {
    console.log(err);
  }
});

export default routes;
