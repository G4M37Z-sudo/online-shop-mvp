// Mock product data - will be replaced with Supabase fetch
const products = [
    {
        id: 1,
        name: "Fresh Tomatoes",
        price: 2.99,
        image: "https://via.placeholder.com/300x200?text=Tomatoes",
        category: "Vegetables"
    },
    {
        id: 2,
        name: "Organic Apples",
        price: 4.50,
        image: "https://via.placeholder.com/300x200?text=Apples",
        category: "Fruits"
    },
    {
        id: 3,
        name: "Whole Milk",
        price: 3.20,
        image: "https://via.placeholder.com/300x200?text=Milk",
        category: "Dairy"
    },
    {
        id: 4,
        name: "Brown Bread",
        price: 2.50,
        image: "https://via.placeholder.com/300x200?text=Bread",
        category: "Bakery"
    },
    {
        id: 5,
        name: "Chicken Breast",
        price: 8.99,
        image: "https://via.placeholder.com/300x200?text=Chicken",
        category: "Meat"
    },
    {
        id: 6,
        name: "Olive Oil",
        price: 12.99,
        image: "https://via.placeholder.com/300x200?text=Olive+Oil",
        category: "Pantry"
    }
];

let cart = [];

// DOM Elements
const productList = document.getElementById('product-list');
const cartItems = document.getElementById('cart-items');
const subtotalEl = document.getElementById('subtotal');
const deliveryCostEl = document.getElementById('delivery-cost');
const totalEl = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout-btn');

// Initialize
function init() {
    renderProducts();
    renderCart();
    updateCartSummary();
    
    // Mock delivery cost calculation (will be replaced with map integration)
    setDeliveryCost(5.00); // $5 flat for now
}

// Render products
function renderProducts() {
    productList.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(card);
    });
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    renderCart();
    updateCartSummary();
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
    updateCartSummary();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            renderCart();
            updateCartSummary();
        }
    }
}

// Render cart
function renderCart() {
    cartItems.innerHTML = '';
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="cart-item-controls">
                <button onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
                <button onclick="removeFromCart(${item.id})" style="background: #e74c3c; margin-left: 0.5rem;">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    
    // Delivery cost already set
    const deliveryCost = parseFloat(deliveryCostEl.textContent.replace('$', '')) || 0;
    const total = subtotal + deliveryCost;
    totalEl.textContent = `$${total.toFixed(2)}`;
}

// Set delivery cost (placeholder for map integration)
function setDeliveryCost(cost) {
    deliveryCostEl.textContent = `$${cost.toFixed(2)}`;
    updateCartSummary();
}

// Checkout (mock)
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // In a real app, we would integrate with Stripe test mode here
    // For MVP, we'll just show a confirmation
    const total = parseFloat(totalEl.textContent.replace('$', ''));
    alert(`Thank you for your purchase!\nTotal charged: $${total.toFixed(2)}\n\n(This is a mock checkout - no real payment processed)`);
    
    // Clear cart after "purchase"
    cart = [];
    renderCart();
    updateCartSummary();
});

// Initialize on load
document.addEventListener('DOMContentLoaded', init);