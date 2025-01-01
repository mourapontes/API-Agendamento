const API_BASE_URL = "https://api-agendamento.vercel.app/api";

const form = document.getElementById("agendamento-form");
const listaAgendamentos = document.getElementById("lista-agendamentos");

// Carrega os agendamentos ao iniciar a página
document.addEventListener("DOMContentLoaded", carregarAgendamentos);

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const servico = document.getElementById("servico").value;
  const data = document.getElementById("data").value;
  const horario = document.getElementById("horario").value;

  const novoAgendamento = { nome, email, servico, data, horario };
  await fetch(`${API_BASE_URL}/agendamentos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novoAgendamento),
  });

  form.reset();
  carregarAgendamentos();
});

async function carregarAgendamentos() {
  const resposta = await fetch(`${API_BASE_URL}/agendamentos`);
  const agendamentos = await resposta.json();

  listaAgendamentos.innerHTML = "";
  agendamentos.forEach((agendamento) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${agendamento.nome}</strong> agendou um ${agendamento.servico} em ${agendamento.data} às ${agendamento.horario}.
      <button onclick="cancelarAgendamento(${agendamento.id})">Cancelar</button>
    `;
    listaAgendamentos.appendChild(li);
  });
}

async function cancelarAgendamento(id) {
  await fetch(`${API_BASE_URL}/agendamentos?id=${id}`, { method: "DELETE" });
  carregarAgendamentos();
}
