const cart = [];

cartelera.forEach((pelis) => {
    const content = document.createElement("div");
    content.innerHTML = `
    <img src="${pelis.img}">
    <h3>${pelis.carteleraName}</h3>
    <p>$ ${pelis.price} </p>
    `;
    shopContent.append(content);

});