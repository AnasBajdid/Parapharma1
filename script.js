// Existing sign in/up toggle code
const signUpButton=document.getElementById('signUpButton');
const signInButton=document.getElementById('signInButton');
const signInForm=document.getElementById('signIn');
const signUpForm=document.getElementById('signup');

if (signUpButton && signInForm && signUpForm) {
  signUpButton.addEventListener('click',function(){
      signInForm.style.display="none";
      signUpForm.style.display="block";
  });
}

if (signInButton && signInForm && signUpForm) {
  signInButton.addEventListener('click', function(){
      signInForm.style.display="block";
      signUpForm.style.display="none";
  });
}

// Cart functionality
let cart = [];

const loggedInUserId = localStorage.getItem("loggedInUserId");

function saveCart() {
  if (loggedInUserId) {
    localStorage.setItem(`cart_${loggedInUserId}`, JSON.stringify(cart));
  } else {
    localStorage.setItem('cart_guest', JSON.stringify(cart));
  }
}

function loadCart() {
  if (loggedInUserId) {
    const savedCart = localStorage.getItem(`cart_${loggedInUserId}`);
    if (savedCart) {
      cart = JSON.parse(savedCart);
    } else {
      cart = [];
    }
  }
}

function renderCart() {
  const cartItemsDiv = document.getElementById("cart-items");
  cartItemsDiv.innerHTML = "";
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Votre panier est vide.</p>";
    return;
  }
  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.style.display = "flex";
    itemDiv.style.justifyContent = "space-between";
    itemDiv.style.alignItems = "center";
    itemDiv.style.marginBottom = "0.5rem";

    const nameSpan = document.createElement("span");
    nameSpan.textContent = `${item.name} (x${item.quantity}) - ${item.price} Dhs`;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Supprimer";
    removeButton.style.backgroundColor = "#e76f51";
    removeButton.style.color = "white";
    removeButton.style.border = "none";
    removeButton.style.borderRadius = "5px";
    removeButton.style.cursor = "pointer";
    removeButton.style.padding = "0.25rem 0.5rem";
    removeButton.addEventListener("click", () => {
      removeFromCart(index);
    });

    itemDiv.appendChild(nameSpan);
    itemDiv.appendChild(removeButton);
    cartItemsDiv.appendChild(itemDiv);
  });
}

function addToCart(product) {
  // Temporarily bypass login check for testing
  // if (!loggedInUserId) {
  //   alert("Veuillez vous connecter pour ajouter des produits au panier.");
  //   return;
  // }
  const existingIndex = cart.findIndex((item) => item.id === product.id);
  if (existingIndex !== -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1, image: product.image || "images/image-placeholder.png" });
  }
  saveCart();
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function checkout() {
  if (cart.length === 0) {
    alert("Votre panier est vide.");
    return;
  }
  // For now, just clear the cart and show confirmation
  cart = [];
  saveCart();
  renderCart();
  alert("Merci pour votre achat !");
}

loadCart();
renderCart();

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  // Add event listeners to buy buttons
  const buyButtons = document.querySelectorAll(".btn-buy");
  console.log(`Found ${buyButtons.length} buy buttons`);
  buyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      console.log("Buy button clicked");
      const productCard = button.closest(".product-card");
      const productName = productCard.querySelector(".product-info h4").textContent;
      const productPrice = productCard.querySelector(".product-price").textContent.replace("Dhs", "").trim();
      const productId = button.getAttribute("data-product-id");
      const productImage = productCard.querySelector("img") ? productCard.querySelector("img").src : "images/image-placeholder.png";
      addToCart({ id: productId, name: productName, price: productPrice, image: productImage });
    });
  });

  // Checkout button event listener
  const checkoutButton = document.getElementById("checkout-button");
  if (checkoutButton) {
    console.log("Checkout button found");
    checkoutButton.addEventListener("click", () => {
      console.log("Checkout button clicked");
      checkout();
    });
  } else {
    console.log("Checkout button not found");
  }

  // Cart icon event listener updated to navigate to cart.html
  const cartIcon = document.getElementById("cart-icon");
  if (cartIcon) {
    console.log("Cart icon found");
    cartIcon.addEventListener("click", () => {
      console.log("Cart icon clicked - navigating to cart.html");
      window.location.href = "cart.html";
    });
  } else {
    console.log("Cart icon not found");
  }
});
