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
    img.addEventListener("click", () => {
      let id = item.id;
      console.log(id);
    });
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
    botao.addEventListener("click", Carrinho);
    produtoDiv.appendChild(botao);

    container.appendChild(produtoDiv);
  });
}

async function CarrinhoSobre() {
  const res = await fetch(
    `'https://mck847sh.api.sanity.io/v2025-10-30/data/query/production?query=*%5B_type+%3D%3D+%22Produtos%22%5D%7B%0A++id%3C%0A++nome%2C%0A++preco%2C%0A++%22imagem%22%3A+imagem.asset-%3Eurl%2C%0A++descricao%0A%7D%0A&perspective=drafts'`
  );
}

document.addEventListener("DOMContentLoaded", carregarProdutos);

let numero = 1;
let abrir = false;

function Carrinho() {
  document.getElementById("carrinho").textContent = numero++;
}

function Cart() {
  if (!abrir) {
    document.getElementById("cart").style.display = "flex";
    abrir = true;
  } else {
    document.getElementById("cart").style.display = "none";
    abrir = false;
  }
}







