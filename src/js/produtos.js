let id = "";
let valorSoma = [];
let numero = 1;
let abrir = false;

document.addEventListener("DOMContentLoaded", carregarProdutos);

async function carregarProdutos() {
  const res = await fetch(
    "https://mck847sh.api.sanity.io/v2025-10-30/data/query/production?query=*%5B_type+%3D%3D+%22Produtos%22%5D%7B%0A++id%2C%0A++nome%2C%0A++preco%2C%0A++%22imagem%22%3A+imagem.asset-%3Eurl%2C%0A++descricao%0A%7D%0A&perspective=drafts"
  );
  const data = await res.json();
  const produtos = data.result;

  const container = document.querySelector(".centralProdutos");

  produtos.forEach((item) => {
    const produtoDiv = document.createElement("div");
    produtoDiv.classList.add("produto");

    const img = document.createElement("img");
    img.src = item.imagem || "https://via.placeholder.com/200";
    produtoDiv.appendChild(img);

    const descDiv = document.createElement("div");
    descDiv.classList.add("description");

    const nome = document.createElement("h2");
    nome.textContent = item.nome;
    descDiv.appendChild(nome);

    const descricao = document.createElement("p");
    descricao.textContent = item.descricao;
    descDiv.appendChild(descricao);

    produtoDiv.appendChild(descDiv);

    const botao = document.createElement("button");
    botao.innerHTML = `Adicionar ao carrinho <i class="fa-solid fa-bowl-food"></i>`;
    botao.addEventListener("click", () => ProdutoCarrinhoSolo(item.id));
    produtoDiv.appendChild(botao);

    container.appendChild(produtoDiv);
  });
}

async function ProdutoCarrinhoSolo(id) {
  document.getElementById("cart").style.height = "380px";

  const res = await fetch(
    `https://mck847sh.api.sanity.io/v2025-10-31/data/query/production?query=*%5B_type+%3D%3D+%22Produtos%22+%26%26+id+%3D%3D+${id}%5D+%7B%0A++id%2C%0A++nome%2C%0A++preco%2C%0A++%22imagem%22%3A+imagem.asset-%3Eurl%2C%0A++descricao%0A%7D%0A&perspective=`
  );

  const data = await res.json();
  const produtos = data.result;
  const container = document.querySelector("#carts");

produtos.forEach((item) => {
  const container = document.querySelector("#carts");

 
  const produtoExistente = container.querySelector(`[data-id='${item.id}']`);

  if (produtoExistente) {
  
    const qtdEl = produtoExistente.querySelector("#viuvi2");
    let qtdAtual = parseInt(qtdEl.textContent);
    qtdEl.textContent = `${qtdAtual + 1}X`;

  
    valorSoma.push(item.preco);
    let soma = valorSoma.reduce((total, v) => total + v, 0);
    document.getElementById("valorReal").innerText = `Total R$ ${soma}`;
    return; 
  }

 
  const div = document.createElement("div");
  div.classList.add("ProdutoCarrinho");
  div.setAttribute("data-id", item.id);

  div.innerHTML = `
    <img src="${item.imagem}" alt="${item.nome}" />
    <div>
      <h4>${item.nome}</h4>
      <p id="viuvi">${item.descricao}</p>
      <p id="viuvi2">1X</p>
    </div>
    <div class="val-Lixeira">
      <p id="valor">R$${item.preco}</p>
      <i id="lixeira" class="fa-solid fa-trash"></i>
    </div>
  `;


  div.querySelector("#lixeira").addEventListener("click", () => {
    const qtdEl = div.querySelector("#viuvi2");
    let qtdAtual = parseInt(qtdEl.textContent);

    if (qtdAtual > 1) {
  
      qtdEl.textContent = `${qtdAtual - 1}X`;

    
      const index = valorSoma.indexOf(item.preco);
      if (index !== -1) valorSoma.splice(index, 1);
    } else {
  
      div.remove();

      const index = valorSoma.indexOf(item.preco);
      if (index !== -1) valorSoma.splice(index, 1);
    }


    let soma = valorSoma.reduce((total, v) => total + v, 0);
    document.getElementById("valorReal").innerText = `Total R$ ${soma}`;
  });


  valorSoma.push(item.preco);
  let soma = valorSoma.reduce((total, v) => total + v, 0);
  document.getElementById("valorReal").innerText = `Total R$ ${soma}`;

  container.appendChild(div);
});



  document.getElementById("carrinho").textContent = numero++;
}

function Cart() {
  const cart = document.getElementById("cart");
  if (!abrir) {
    cart.style.display = "flex";
    abrir = true;
  } else {
    cart.style.display = "none";
    abrir = false;
  }
}







