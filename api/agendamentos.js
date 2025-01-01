const { createClient } = require("@libsql/client");

const db = createClient({
  url: "libsql://agendamento-mourapontes.aws-us-east-1.turso.io",
  authToken: "INSIRA_SUA_AUTH_TOKEN"
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
