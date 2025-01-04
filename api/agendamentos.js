const { createClient } = require("@libsql/client");

// Variáveis de ambiente para proteger dados sensíveis
const db = createClient({
  url: process.env.DATABASE_URL, // Configure isso em sua variável de ambiente
  authToken: process.env.AUTH_TOKEN // Configure isso também
});

// Função de API — assíncrona
module.exports = async (req, res) => {
  const { method } = req;

  try {
    switch (method) {
      case "GET":
        // Busca por todos os agendamentos
        const agendamentos = await db.execute("SELECT * FROM agendamentos");
        res.status(200).json(agendamentos.rows); // Retorno bem-sucedido
        break;

      case "POST":
        // Obtenção e validação dos dados do corpo da requisição
        const { nome, email, servico, data, horario } = req.body;
        if (!nome || !email || !servico || !data || !horario) {
          res.status(400).json({ error: "Todos os campos são obrigatórios" });
          return;
        }

        // Inserindo o agendamento no banco
        await db.execute(
          "INSERT INTO agendamentos (nome, email, servico, data, horario) VALUES (?, ?, ?, ?, ?)",
          [nome, email, servico, data, horario]
        );
        res.status(201).json({ success: true });
        break;

      case "DELETE":
        // Obtenção e validação do ID
        const { id } = req.query;
        if (!id) {
          res.status(400).json({ error: "O ID do agendamento é obrigatório" });
          return;
        }

        // Exclusão do agendamento
        await db.execute("DELETE FROM agendamentos WHERE id = ?", [id]);
        res.status(200).json({ success: true });
        break;

      default:
        // Método HTTP não permitido
        res.setHeader("Allow", ["GET", "POST", "DELETE"]);
        res.status(405).json({ error: `Método ${method} não permitido` });
        break;
    }
  } catch (error) {
    // Tratamento de erro (geral)
    console.error("Erro no endpoint de agendamentos:", error);
    res.status(500).json({ error: "Erro interno no servidor, tente novamente mais tarde" });
  }
};
