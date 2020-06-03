import express from "express";

const app = express();

app.use(express.json());

// ROTA: Endereço completo da requisição
// RECURSO: Qual entidade estamos acessando do sistema

//GET: Buscar uma ou mais informações do Back-end
//POST: Criar uma nova informação no Back-end
//PUT: Atualizar uma informação no Back-end
//DELETE: Deletar uma informação no Back-end

app.get("/", (request, response) => {
  console.log("working");
});

app.listen(3333);
