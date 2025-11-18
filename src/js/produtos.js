let id = "";
let valorSoma = [];
let arrayProdutos = [];
let numero = 1;
let abrir = false;

document.addEventListener("DOMContentLoaded", () => {
  carregarProdutos();
  carregarCarrinhoLocal();
});

function Categorias(categoria) {
  let query = "";

  if (categoria === "todas") {
    query = `*[_type == "Produtos"]{
      id,
      nome,
      preco,
      "imagem": imagem.asset->url,
      descricao,
      categoria
    }`;
  } else {
    query = `*[_type == "Produtos" && categoria == "${categoria}"]{
      id,
      nome,
      preco,
      "imagem": imagem.asset->url,
      descricao,
      categoria
    }`;
  }

  api = `https://mck847sh.api.sanity.io/v2025-10-31/data/query/production?query=${encodeURIComponent(
    query
  )}&perspective=drafts`;

  carregarProdutos();
}

window.onload = () => {
  Categorias("todas");
};

document.getElementById("selectCategoria").addEventListener("change", (e) => {
  Categorias(e.target.value);
});

async function carregarProdutos() {
  const res = await fetch(api);
  const data = await res.json();
  const produtos = data.result;

  const container = document.querySelector(".centralProdutos");
  container.innerHTML = "";

  produtos.forEach((item) => {
    const produtoDiv = document.createElement("div");
    produtoDiv.classList.add("produto");

    ScrollReveal().reveal(".produto", {
      origin: "top",
      duration: 2000,
      distance: "2%",
    });

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

    // ======== PREÇO SEM ESTILIZAÇÃO INLINE ========
    const preco = document.createElement("p");
    preco.textContent = "R$ " + item.preco;
    preco.classList.add("preco-produto"); // <-- APENAS CLASS
    descDiv.appendChild(preco);

    produtoDiv.appendChild(descDiv);

    const botao = document.createElement("button");
    botao.innerHTML = `Adicionar ao carrinho <i class="fa-solid fa-bowl-food"></i>`;
    botao.addEventListener("click", () => ProdutoCarrinhoSolo(item.id));
    produtoDiv.appendChild(botao);

    container.appendChild(produtoDiv);
  });
}

async function ProdutoCarrinhoSolo(id) {
  const res = await fetch(
    `https://mck847sh.api.sanity.io/v2025-10-31/data/query/production?query=*%5B_type+%3D%3D+%22Produtos%22+%26%26+id+%3D%3D+${id}%5D+%7B%0A++id%2C%0A++nome%2C%0A++preco%2C%0A++%22imagem%22%3A+imagem.asset-%3Eurl%2C%0A++descricao%0A%7D%0A&perspective=`
  );

  const data = await res.json();
  const produtos = data.result;
  const container = document.querySelector("#carts");

  produtos.forEach((item) => {
    const produtoExistente = container.querySelector(`[data-id='${item.id}']`);

    if (produtoExistente) {
      const qtdEl = produtoExistente.querySelector("#viuvi2");
      let qtdAtual = parseInt(qtdEl.textContent);
      qtdEl.textContent = `${qtdAtual + 1}X`;

      valorSoma.push(item.preco);
      atualizarTotal();
      salvarCarrinhoLocal();
      document.getElementById("carrinho").textContent = valorSoma.length;
      return;
    }

    const div = document.createElement("div");
    div.classList.add("ProdutoCarrinho");
    div.setAttribute("data-id", item.id);

    div.innerHTML = `
      <img id="imgCarrinho2" src="${item.imagem}" alt="${item.nome}" />
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

      atualizarTotal();
      salvarCarrinhoLocal();
      document.getElementById("carrinho").textContent = valorSoma.length;
    });

    valorSoma.push(item.preco);
    atualizarTotal();
    container.appendChild(div);
    salvarCarrinhoLocal();
    document.getElementById("carrinho").textContent = valorSoma.length;
  });
}

function atualizarTotal() {
  let soma = valorSoma.reduce((total, v) => total + v, 0);
  document.getElementById("valorReal").innerText = `Total R$ ${soma.toFixed(
    2
  )}`;
}

function salvarCarrinhoLocal() {
  const itens = [];
  const produtosNoCarrinho = document.querySelectorAll(".ProdutoCarrinho");

  produtosNoCarrinho.forEach((p) => {
    itens.push({
      id: p.getAttribute("data-id"),
      nome: p.querySelector("h4").textContent,
      descricao: p.querySelector("#viuvi").textContent,
      preco: parseFloat(
        p.querySelector("#valor").textContent.replace("R$", "")
      ),
      imagem: p.querySelector("img").src,
      quantidade: parseInt(p.querySelector("#viuvi2").textContent),
    });
  });

  localStorage.setItem("carrinho", JSON.stringify(itens));
}

function carregarCarrinhoLocal() {
  const dados = localStorage.getItem("carrinho");
  if (!dados) return;

  const itens = JSON.parse(dados);
  const container = document.querySelector("#carts");

  itens.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("ProdutoCarrinho");
    div.setAttribute("data-id", item.id);

    div.innerHTML = `
      <img src="${item.imagem}" alt="${item.nome}" />
      <div>
        <h4>${item.nome}</h4>
        <p id="viuvi">${item.descricao}</p>
        <p id="viuvi2">${item.quantidade}X</p>
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

      salvarCarrinhoLocal();
      atualizarTotal();
      document.getElementById("carrinho").textContent = valorSoma.length;
    });

    container.appendChild(div);

    for (let i = 0; i < item.quantidade; i++) valorSoma.push(item.preco);
  });

  atualizarTotal();
  document.getElementById("carrinho").textContent = valorSoma.length;
}

function Cart() {
  const cart = document.getElementById("cart");
  if (!abrir) {
    cart.classList.add("aberto");
    abrir = true;
  } else {
    cart.classList.remove("aberto");
    abrir = false;
  }
}

function Finalizar() {
  const produtosNoCarrinho = document.querySelectorAll(".ProdutoCarrinho");
  if (produtosNoCarrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  let mensagem =
    "Oi, boa tarde!\nGostaria de fazer um pedido com os seguintes itens:\n";
  let total = 0;

  produtosNoCarrinho.forEach((produto) => {
    const nome = produto.querySelector("h4").textContent;
    const qtd = produto.querySelector("#viuvi2").textContent.replace("X", "");
    const precoTexto = produto
      .querySelector("#valor")
      .textContent.replace("R$", "");
    const preco = parseFloat(precoTexto);

    mensagem += `${qtd}x ${nome} - R$ ${preco.toFixed(2)}\n`;
    total += preco * parseInt(qtd);
  });

  mensagem += `Total: R$ ${total.toFixed(2)}`;

  const numero = "554598475180";
  const mensagemEncode = encodeURIComponent(mensagem);
  const link = `https://wa.me/${numero}?text=${mensagemEncode}`;

  window.open(link, "_blank");
}

function sidebarOpen() {
  document.getElementById("menu-responsive").style.display = "flex";
}

function sidebarClose() {
  document.getElementById("menu-responsive").style.display = "none";
}
