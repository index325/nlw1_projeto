import { Request, Response } from "express";
import knex from "../database/connection";

class itemsController {
  async index(request: Request, response: Response) {
    const items = await knex("items").select("*");

    const serializedItems = items.map((item) => {
      return {
        id: item.id,
        title: item.title,
        image_url: `https://raw.githubusercontent.com/index325/nlw1_projeto/774c6d22cd8b51c9b6fa4cd3288b89df06409d37/server/uploads/${item.image}`,
      };
    });

    return response.json(serializedItems);
  }
}

export default itemsController;
