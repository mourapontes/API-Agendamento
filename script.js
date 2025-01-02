const API_BASE_URL = "https://vercel.com/mourapontes-projects/api-agendamento";

const form = document.getElementById("agendamento-form");
const listaAgendamentos = document.getElementById("lista-agendamentos");

// Carrega os agendamentos ao iniciar a página
document.addEventListener("DOMContentLoaded", carregarAgendamentos);

// Evento para o formulário de agendamento
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Obtem os dados do formulário
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const servico = document.getElementById("servico").value;
  const data = document.getElementById("data").value;
  const horario = document.getElementById("horario").value;

  const novoAgendamento = { nome, email, servico, data, horario };

  try {
    // Faz o POST do novo agendamento
    const resposta = await fetch(`${API_BASE_URL}/agendamentos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoAgendamento),
    });

    if (!resposta.ok) {
      throw new Error("Erro ao criar o agendamento.");
    }

    // Reseta o formulário e recarrega a lista
    alert("Agendamento realizado com sucesso!");
    form.reset();
    carregarAgendamentos();
  } catch (error) {
    console.error(error);
    alert("Erro ao criar o agendamento. Tente novamente.");
  }
});

async function carregarAgendamentos() {
  try {
    // Faz a chamada para listar os agendamentos
    const resposta = await fetch(`${API_BASE_URL}/agendamentos`);
    if (!resposta.ok) {
      throw new Error("Erro ao carregar os agendamentos.");
    }

    const agendamentos = await resposta.json();

    // Atualiza a lista no DOM
    listaAgendamentos.innerHTML = "";
    agendamentos.forEach((agendamento) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${agendamento.nome}</strong> agendou um ${agendamento.servico} em ${formatarData(agendamento.data)} às ${agendamento.horario}.
        <button class="cancelar-btn" data-id="${agendamento.id}">Cancelar</button>
      `;
      listaAgendamentos.appendChild(li);
    });

    // Adiciona ouvintes de evento aos botões "Cancelar"
    document.querySelectorAll(".cancelar-btn").forEach((botao) => {
      botao.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        cancelarAgendamento(id);
      });
    });
  } catch (error) {
    console.error(error);
    alert("Erro ao carregar os agendamentos. Tente novamente.");
  }
}

async function cancelarAgendamento(id) {
  try {
    // Faz o DELETE do agendamento
    const resposta = await fetch(`${API_BASE_URL}/agendamentos/${id}`, {
      method: "DELETE",
    });

    if (!resposta.ok) {
      throw new Error("Erro ao cancelar o agendamento.");
    }

    alert("Agendamento cancelado com sucesso!");
    carregarAgendamentos();
  } catch (error) {
    console.error(error);
    alert("Erro ao cancelar o agendamento. Tente novamente.");
  }
}

// Função para formatar a data em um formato mais amigável
function formatarData(data) {
  // Converte a data para um formato legível (ex.: 2023-10-15 -> 15/10/2023)
  const partes = data.split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}
