const { createClient } = require("@libsql/client");

const db = createClient({
  url: "https://app.turso.tech/mourapontes/databases/agendamento",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MzU4MTk2MjQsImlkIjoiYjllMzE3MTctMTRhZC00ZGRjLWJjM2MtYTNlYWM0ZWNiYTNmIiwicmlkIjoiNWNlNmFhYWYtODAwOC00NmYyLThjMWMtNGFlMjQ1ZTE5NjJmIn0.SsVvHZpZcZuq4HPMf7M6qa1F284_ZYwI1JvomYeHREq7T0G0k-p7ZX7p7DsAn6ffvSL5-YzK9P_iBuTMEO4RBw"
});

module.exports = async (req, res) => {
  const { method } = req;
  switch (method) {
    case "GET":
      const agendamentos = await db.execute("SELECT * FROM agendamentos");
      res.json(agendamentos.rows);
      break;

    case "POST":
      const { nome, email, servico, data, horario } = req.body;
      await db.execute(
        "INSERT INTO agendamentos (nome, email, servico, data, horario) VALUES (?, ?, ?, ?, ?)",
        [nome, email, servico, data, horario]
      );
      res.json({ success: true });
      break;

    case "DELETE":
      const { id } = req.query;
      await db.execute("DELETE FROM agendamentos WHERE id = ?", [id]);
      res.json({ success: true });
      break;

    default:
      res.status(405).send("Método não permitido");
  }
};
