const API_BASE_URL = "https://api-agendamento-sand.vercel.app/"; // Certifique-se de que esta URL está correta.

const form = document.getElementById("agendamento-form");
const listaAgendamentos = document.getElementById("lista-agendamentos");

// Carrega os agendamentos quando a página é carregada
document.addEventListener("DOMContentLoaded", carregarAgendamentos);

// Evento de submissão do formulário para criar um novo agendamento
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const servico = document.getElementById("servico").value;
  const data = document.getElementById("data").value;
  const horario = document.getElementById("horario").value;

  const novoAgendamento = { nome, email, servico, data, horario };

  try {
    // Envia o novo agendamento para a API
    const resposta = await fetch(`${API_BASE_URL}/agendamentos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoAgendamento),
    });

    if (!resposta.ok) {
      throw new Error("Erro ao criar o agendamento. Verifique os dados enviados.");
    }

    alert("Agendamento realizado com sucesso!");
    form.reset(); // Limpa o formulário
    carregarAgendamentos(); // Atualiza a lista de agendamentos
  } catch (error) {
    console.error(error);
    alert("Erro ao criar o agendamento. Tente novamente mais tarde.");
  }
});

// Carrega os agendamentos existentes
async function carregarAgendamentos() {
  try {
    const resposta = await fetch(`${API_BASE_URL}/agendamentos`);
    if (!resposta.ok) {
      throw new Error("Erro ao carregar os agendamentos.");
    }

    const agendamentos = await resposta.json();

    // Limpa a lista antes de preencher com os novos dados
    listaAgendamentos.innerHTML = "";
    agendamentos.forEach((agendamento) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${agendamento.nome}</strong> agendou um <em>${agendamento.servico}</em> em ${formatarData(
        agendamento.data
      )} às ${agendamento.horario}.
        <button class="cancelar-btn" data-id="${agendamento.id}">Cancelar</button>
      `;
      listaAgendamentos.appendChild(li);
    });

    // Adiciona evento de clique para cada botão "Cancelar"
    document.querySelectorAll(".cancelar-btn").forEach((botao) => {
      botao.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        cancelarAgendamento(id);
      });
    });
  } catch (error) {
    console.error(error);
    alert("Não foi possível carregar os agendamentos. Tente novamente mais tarde.");
  }
}

// Cancela um agendamento baseado no ID
async function cancelarAgendamento(id) {
  try {
    const resposta = await fetch(`${API_BASE_URL}/agendamentos/${id}`, {
      method: "DELETE",
    });

    if (!resposta.ok) {
      throw new Error("Erro ao cancelar o agendamento.");
    }

    alert("Agendamento cancelado com sucesso!");
    carregarAgendamentos(); // Atualiza a lista de agendamentos
  } catch (error) {
    console.error(error);
    alert("Erro ao cancelar o agendamento. Tente novamente.");
  }
}

// Formata a data para um formato mais amigável
function formatarData(data) {
  const partes = data.split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}
