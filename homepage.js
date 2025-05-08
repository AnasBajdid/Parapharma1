
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
  //YOUR COPIED FIREBASE PART SHOULD BE HERE
  //WATCH THIS VIDEO TO LEARN WHAT TO PUT HERE   https://youtu.be/_Xczf06n6x0
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, (user) => {
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  if (loggedInUserId) {
    window.location.href = "Anas.html";
    console.log(user);
    const docRef = doc(db, "users", loggedInUserId);
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          document.getElementById("loggedUserFName").innerText = userData.firstName;
          document.getElementById("loggedUserEmail").innerText = userData.email;
          document.getElementById("loggedUserLName").innerText = userData.lastName;
        } else {
          console.log("no document found matching id");
        }
      })
      .catch((error) => {
        console.log("Error getting document");
      });
  } else {
    console.log("User Id not Found in Local storage");
  }
});

// Cart management
let cart = [];

const loggedInUserId = localStorage.getItem("loggedInUserId");

function saveCart() {
  if (loggedInUserId) {
    localStorage.setItem(`cart_${loggedInUserId}`, JSON.stringify(cart));
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
  if (!loggedInUserId) {
    alert("Veuillez vous connecter pour ajouter des produits au panier.");
    return;
  }
  const existingIndex = cart.findIndex((item) => item.id === product.id);
  if (existingIndex !== -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
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

const logoutButton = document.getElementById("logout");

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("loggedInUserId");
  signOut(auth)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Error Signing out:", error);
    });
});

document.addEventListener("DOMContentLoaded", () => {
  // Add event listeners to buy buttons
  document.querySelectorAll(".btn-buy").forEach((button) => {
    button.addEventListener("click", () => {
      const productCard = button.closest(".product-card");
      const productName = productCard.querySelector(".product-info h4").textContent;
      const productPrice = productCard.querySelector(".product-price").textContent.replace("Dhs", "").trim();
      const productId = button.getAttribute("data-product-id");
      addToCart({ id: productId, name: productName, price: productPrice });
    });
  });

  // Checkout button event listener
  const checkoutButton = document.getElementById("checkout-button");
  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      checkout();
    });
  }

  // Cart icon toggle event listener
  const cartIcon = document.getElementById("cart-icon");
  const cartSection = document.getElementById("cart-section");
  if (cartIcon && cartSection) {
    console.log("Cart icon event listener attached");
    cartIcon.addEventListener("click", () => {
      console.log("Cart icon clicked");
      if (cartSection.style.display === "none" || cartSection.style.display === "") {
        cartSection.style.display = "block";
      } else {
        cartSection.style.display = "none";
      }
    });
  }
});
