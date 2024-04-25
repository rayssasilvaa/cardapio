const menu = document.getElementById("menu");
const carBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];


//abrir o modal do carrinho
carBtn.addEventListener("click", function(){
    cartModal.style.display = "flex";
    updateCartModal();
});

//fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none";
    };
});

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none";
});

menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn");

    if(parentButton){
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        addToCart(name, price);
    }
});

//função para add no carrinho
function addToCart(name, price){
   const existingItem = cart.find(item => item.name === name);

   if(existingItem){
    //se o item ja existe, aumenta apenas a quantidade + 1
    existingItem.quantity += 1;

   } else{
    cart.push({
        name,
        price,
        quantity: 1,
    });
   };

   updateCartModal()
};

//atualiza o carrinho
function updateCartModal(){
 cartItemsContainer.innerHTML = "";
 let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between"> 
               <div> 
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>

               </div>

                <button class="remove-btn" data-name="${item.name}">
                    Remover
                </button>

            </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;

};

//função para remover item do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-btn")){
        const name = event.target.getAttribute("data-name");

        removeItemCart(name);
    };
});

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        };

        cart.splice(index, 1);
        updateCartModal();

    };
};

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    };
});


//finalizar pedido
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkOpen();
    if(!isOpen){

        Toastify({
            text: "Estamos fechado no momento, volte mais tarde!!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
            background: "#ef4444",
            },
          }).showToast();

          return;
    };

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    };

    //enviar o pedidp para api wpp
    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price} |`
        )
    }).join("");

    const message = encodeURIComponent(cartItems)
    const phone = "12997484088"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal;
});

//verificar a hora e manipular o card horario
function checkOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 19 && hora < 23;
    //true = restaurante esta aberto
};

const spanItem = document.getElementById("date-span")
const isOpen = checkOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}

