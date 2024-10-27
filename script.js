// Horários disponíveis para agendamento
const horariosManha = ["08:00", "08:40", "09:20", "10:00", "10:40", "11:20"];
const horariosTarde = ["14:00", "14:40", "15:20", "16:00", "16:40", "17:20"];

// Preencher o campo de horários
const selectHora = document.getElementById("hora");
[...horariosManha, ...horariosTarde].forEach(hora => {
    const option = document.createElement("option");
    option.value = hora;
    option.textContent = hora;
    selectHora.appendChild(option);
});

// Função para agendar
function agendar(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const data = document.getElementById("data").value;
    const hora = document.getElementById("hora").value;

    const agendamento = `${data} - ${hora} - ${nome}`;
    const lista = document.getElementById("lista-agendamentos");

    const li = document.createElement("li");
    li.textContent = agendamento;
    lista.appendChild(li);

    alert("Agendamento realizado com sucesso!");
    document.getElementById("form-agendamento").reset();
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
