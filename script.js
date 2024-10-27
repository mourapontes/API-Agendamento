// Horários disponíveis para agendamento
const horariosManha = ["08:00", "08:40", "09:20", "10:00", "10:40", "11:20"];
const horariosTarde = ["14:00", "14:40", "15:20", "16:00", "16:40", "17:20"];

// Lista para armazenar os agendamentos realizados
let agendamentos = [];

// Preencher o campo de horários
const selectHora = document.getElementById("hora");
[...horariosManha, ...horariosTarde].forEach(hora => {
    const option = document.createElement("option");
    option.value = hora;
    option.textContent = hora;
    selectHora.appendChild(option);
});

// Função para verificar se o horário já está agendado
function horarioDisponivel(data, hora) {
    return !agendamentos.some(ag => ag.data === data && ag.hora === hora);
}

// Função para realizar o agendamento
function agendar(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const data = document.getElementById("data").value;
    const hora = document.getElementById("hora").value;

    if (horarioDisponivel(data, hora)) {
        agendamentos.push({ nome, data, hora });
        const lista = document.getElementById("lista-agendamentos");

        const li = document.createElement("li");
        li.textContent = `${data} - ${hora} - ${nome}`;
        lista.appendChild(li);

        alert("Agendamento realizado com sucesso!");
        document.getElementById("form-agendamento").reset();
    } else {
        alert("Erro: Este horário já está agendado.");
    }
}

// Função para mostrar a área do administrador
function mostrarAdmin() {
    const senha = prompt("Digite a senha de administrador:");
    if (senha === "admin123") {
        document.getElementById("admin-panel").classList.remove("hidden");
    } else {
        alert("Senha incorreta!");
    }
}
