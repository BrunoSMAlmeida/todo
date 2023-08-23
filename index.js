const button = document.querySelector('.button-add-task');
const input = document.querySelector('.input-task');
const listaCompleta = document.querySelector('.list-tasks');
const messageContainer = document.querySelector('.message');

let minhaListaDeItens = [];

function adicionarNovaTarefa() {
  minhaListaDeItens.push({
    tarefa: input.value,
    concluida: false,
  });

  input.value = '';

  mostrarTarefas();
}

function mostrarTarefas() {
  let novaLi = '';

  minhaListaDeItens.forEach((item, posicao) => {
    novaLi =
      novaLi +
      `
        <li class="task ${item.concluida && 'done'}">
            <img src="./img/checked.png" alt="check-na-tarefa" onclick="concluirTarefa(${posicao})">
            <p>${item.tarefa}</p>
            <img src="./img/trash.png" alt="tarefa-para-o-lixo" onclick="confirmarExclusao(${posicao})">
        </li>
        
        `;
  });

  listaCompleta.innerHTML = novaLi;

  localStorage.setItem('lista', JSON.stringify(minhaListaDeItens));
}

function concluirTarefa(posicao) {
  minhaListaDeItens[posicao].concluida = !minhaListaDeItens[posicao].concluida;

  mostrarTarefas();
  exibirMensagem("Boa, uma tarefa a menos!");
}

function deletarItem(posicao) {
  minhaListaDeItens.splice(posicao, 1);

  mostrarTarefas();
}

function confirmarExclusao(posicao) {
  const tarefa = minhaListaDeItens[posicao];

  if (!tarefa.concluida) {
    const resposta = confirm("Tem certeza que deseja excluir essa tarefa?");
    if (resposta) {
      deletarItem(posicao);
    }
  } else {
    deletarItem(posicao);
  }
}

function recarregarTarefas() {
  const tarefasDoLocalStorage = localStorage.getItem('lista');

  if (tarefasDoLocalStorage) {
    minhaListaDeItens = JSON.parse(tarefasDoLocalStorage);
  }

  mostrarTarefas();
}

function exibirMensagem(mensagem) {
  messageContainer.textContent = mensagem;
  setTimeout(() => {
    messageContainer.textContent = '';
  }, 2000);
}

function agendarNotificacao() {
  const agora = new Date();
  const horas = agora.getHours();
  const minutos = agora.getMinutes();

  if (horas === 10 && minutos === 0) {
    const tarefasNaoFeitas = minhaListaDeItens.filter(item => !item.concluida);
    if (tarefasNaoFeitas.length > 0) {
      alert("Você tem tarefas a fazer!");
    }
  }

  if (horas === 22 && minutos === 0) {
    const tarefasNaoConcluidas = minhaListaDeItens.filter(item => !item.concluida);
    if (tarefasNaoConcluidas.length > 0) {
      alert("Você tem tarefas a concluir!");
    }
  }
}

setInterval(agendarNotificacao, 60000);

// Adicionando evento ao pressionar a tecla Enter no campo de entrada
input.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Evita o comportamento padrão de um Enter em um campo de entrada
    adicionarNovaTarefa();
  }
});

recarregarTarefas();
button.addEventListener('click', adicionarNovaTarefa);
