const supabase = window.supabase;

document.addEventListener('DOMContentLoaded', () => {
    // Buscar alunos do Supabase filtrando por rota
    async function consultarAlunos(rota) {
        let query = supabase.from('alunos').select('id, nome, turma, rota');
        if (rota) query = query.eq('rota', rota);
        const { data, error } = await query;
        if (error) {
            alert('Erro ao consultar alunos');
            return [];
        }
        return data;
    }

    // Buscar presenças do dia selecionado
    async function consultarPresencas(dataSelecionada) {
        const { data, error } = await supabase
            .from('presencas')
            .select('aluno_id, presente')
            .eq('data_frequencia', dataSelecionada);
        if (error) {
            alert('Erro ao consultar presenças');
            return [];
        }
        // Retorna um mapa: { aluno_id: presente }
        const mapa = {};
        data.forEach(p => { mapa[p.aluno_id] = p.presente; });
        return mapa;
    }

    // Renderizar lista de alunos com presença marcada
    async function renderizarAlunos() {
        const rota = document.getElementById('filtro-rota').value;
        const dataSelecionada = document.getElementById('filtro-data').value;
        const alunos = await consultarAlunos(rota);
        let mapaPresencas = {};
        if (dataSelecionada) {
            mapaPresencas = await consultarPresencas(dataSelecionada);
        }
        const lista = document.getElementById('lista-alunos');
        lista.innerHTML = '';
        let relatorioHTML = '<strong>Relatório de Presença:</strong><br><ul>';
        alunos.forEach(aluno => {
            const checked = mapaPresencas[aluno.id] ? 'checked' : '';
            const presenteTexto = mapaPresencas[aluno.id] ? 'Presente' : 'Faltou';
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" data-id="${aluno.id}" ${checked} />
                <span>${aluno.nome} - Turma: ${aluno.turma} - Rota: ${aluno.rota}</span>
            `;
            lista.appendChild(li);
            // Adiciona a rota no relatório
            relatorioHTML += `<li>${aluno.nome} - ${aluno.rota} - ${presenteTexto}</li>`;
        });
        relatorioHTML += '</ul>';
        document.getElementById('relatorio').innerHTML = relatorioHTML;
    }

    // Evento do botão Carregar
    document.getElementById('btn-carregar-data').addEventListener('click', async () => {
        const dataSelecionada = document.getElementById('filtro-data').value;
        if (!dataSelecionada) {
            alert('Selecione uma data!');
            return;
        }
        await renderizarAlunos();
    });

    // Evento do botão Salvar Presenças
    document.getElementById('btn-salvar-presenca').addEventListener('click', async () => {
        const dataSelecionada = document.getElementById('filtro-data').value;
        if (!dataSelecionada) {
            alert('Selecione uma data!');
            return;
        }
        const presencas = [];
        document.querySelectorAll('#lista-alunos input[type="checkbox"]').forEach(input => {
            presencas.push({
                aluno_id: Number(input.dataset.id),
                data_frequencia: dataSelecionada,
                presente: input.checked
            });
        });
        const { error } = await supabase.from('presencas').upsert(presencas, { onConflict: ['aluno_id', 'data_frequencia'] });
        if (error) {
            alert('Erro ao salvar presenças: ' + error.message);
        } else {
            alert('Presenças salvas!');
            await renderizarAlunos(); // Atualiza a lista após salvar
        }
    });

    // Evento do botão PDF
    document.getElementById('btn-salvar-pdf').addEventListener('click', () => {
        const lista = document.getElementById('lista-alunos');
        const dataSelecionada = document.getElementById('filtro-data').value;
        let relatorio = 'Secretaria Municipal de Educação\nTransporte Escolar\n\n';
        relatorio += `Data da Frequência: ${dataSelecionada}\n\nRelatório de Frequência:\n\n`;
        lista.querySelectorAll('li').forEach(li => {
            const nome = li.querySelector('span').innerText;
            const presente = li.querySelector('input').checked ? 'Presente' : 'Faltou';
            relatorio += `${nome} - ${presente}\n`;
        });
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text(relatorio, 10, 10);
        doc.save('relatorio-frequencia.pdf');
    });
});
