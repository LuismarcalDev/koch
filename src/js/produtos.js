async function carregarProdutos() {
  const res = await fetch(
    'https://mck847sh.api.sanity.io/v2025-10-21/data/query/production?query=*[_type == "Produtos"]{nome, preco, "imagem": imagem.asset->url, descricao}&perspective=drafts'
  );
  const data = await res.json();
  const produtos = data.result;

  const container = document.querySelector('.centralProdutos');

  produtos.forEach(item => {

    const produtoDiv = document.createElement('div');
    produtoDiv.classList.add('produto');


    const img = document.createElement('img');
    img.src = item.imagem || 'https://via.placeholder.com/200';
    produtoDiv.appendChild(img);


    const descDiv = document.createElement('div');
    descDiv.classList.add('description');

    const nome = document.createElement('h2');
    nome.textContent = item.nome;
    descDiv.appendChild(nome);

    const descricao = document.createElement('p');
    descricao.textContent = item.descricao;
    descDiv.appendChild(descricao);

    produtoDiv.appendChild(descDiv);


    const botao = document.createElement('button');
    botao.innerHTML = `Adicionar ao carrinho <i class="fa-solid fa-bowl-food"></i>`;
    botao.addEventListener('click', Carrinho);
    produtoDiv.appendChild(botao);


    container.appendChild(produtoDiv);
  });
}


document.addEventListener('DOMContentLoaded', carregarProdutos);


let numero = 1


function Carrinho(){
  
    document.getElementById("carrinho").textContent = numero++;
}
