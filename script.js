// Mock data for when Supabase config is not available
let mockProducts = [];
let mockCategories = [];

let products = []; // Will hold the current displayed products (after filtering/sorting)
let categories = []; // All categories for the filter
let cart = [];

// Supabase client
let supabase;

// DOM Elements
const productList = document.getElementById('product-list');
const cartItems = document.getElementById('cart-items');
const categoryFilter = document.getElementById('category-filter');
const sortOptions = document.getElementById('sort-options');
const subtotalEl = document.getElementById('subtotal');
const deliveryCostEl = document.getElementById('delivery-cost');
const totalEl = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout-btn');

// Initialize
async function init() {
    // Load configuration
    await loadConfig();
    
    // Initialize Supabase client if config is available
    if (typeof SUPABASE_CONFIG !== 'undefined' && SUPABASE_CONFIG.SUPABASE_URL && SUPABASE_CONFIG.SUPABASE_ANON_KEY) {
        supabase = supabase.createClient(SUPABASE_CONFIG.SUPABASE_URL, SUPABASE_CONFIG.SUPABASE_ANON_KEY);
        await fetchDataFromSupabase();
    } else {
        console.warn('Supabase config not found. Using mock data.');
        loadMockData();
    }
    
    // Set up event listeners
    categoryFilter.addEventListener('change', filterProducts);
    sortOptions.addEventListener('change', sortProducts);
    
    // Render initial state
    renderProducts();
    renderCart();
    updateCartSummary();
    
    // Mock delivery cost (will be replaced with map integration)
    setDeliveryCost(5.00);
}

// Load configuration from config.js
async function loadConfig() {
    try {
        const response = await fetch('config.js');
        if (response.ok) {
            // If config.js exists, it will be executed and define SUPABASE_CONFIG globally
            // Wait a bit for it to load
            return new Promise((resolve) => {
                const checkConfig = () => {
                    if (typeof SUPABASE_CONFIG !== 'undefined') {
                        resolve();
                    } else {
                        setTimeout(checkConfig, 100);
                    }
                };
                checkConfig();
            });
        }
    } catch (e) {
        // config.js not found, that's okay
    }
}

// Fetch data from Supabase
async function fetchDataFromSupabase() {
    if (!supabase) return;
    
    try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
            .from('categories')
            .select('id, name');
        
        if (categoriesError) throw categoriesError;
        
        categories = categoriesData.map(cat => ({ id: cat.id, name: cat.name }));
        
        // Populate category filter dropdown
        populateCategoryFilter();
        
        // Fetch products with category name
        const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select(`
                id,
                name,
                price,
                image_url,
                categories!inner(name)
            `);
        
        if (productsError) throw productsError;
        
        // Transform data
        mockProducts = productsData.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image_url,
            category: product.categories.name
        }));
        
        // Set products to the fetched data
        products = [...mockProducts];
        
        console.log('Fetched data from Supabase:', { categories, products });
    } catch (error) {
        console.error('Error fetching data from Supabase:', error);
        loadMockData();
    }
}

// Load mock data
function loadMockData() {
    mockCategories = [
        { id: 1, name: 'Vegetables' },
        { id: 2, name: 'Fruits' },
        { id: 3, name: 'Dairy' },
        { id: 4, name: 'Bakery' },
        { id: 5, name: 'Meat' },
        { id: 6, name: 'Pantry' }
    ];
    categories = [...mockCategories];
    
    mockProducts = [
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
    
    products = [...mockProducts];
    
    // Populate category filter dropdown with mock data
    populateCategoryFilter();
}

// Populate category filter dropdown
function populateCategoryFilter() {
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        categoryFilter.appendChild(option);
    });
}

// Filter products based on selected category
function filterProducts() {
    const selectedCategory = categoryFilter.value;
    
    if (selectedCategory === 'all') {
        products = [...mockProducts];
    } else {
        products = mockProducts.filter(product => product.category === selectedCategory);
    }
    
    // Reset sort to default when filtering changes
    sortOptions.value = 'default';
    sortProducts(); // Apply current sort (default)
}

// Sort products based on selected option
function sortProducts() {
    const sortBy = sortOptions.value;
    
    let sortedProducts = [...products]; // Work on a copy
    
    switch (sortBy) {
        case 'price-low-high':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high-low':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-az':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-za':
            sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default:
            // Default: no sorting (or we could sort by ID or something)
            break;
    }
    
    // Update the products array for rendering
    products = sortedProducts;
    
    // Re-render products
    renderProducts();
}

// Render products
function renderProducts() {
    productList.innerHTML = '';
    
    if (products.length === 0) {
        productList.innerHTML = '<p class="no-products">No products found.</p>';
        return;
    }
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-card-content">
                <h3>${product.name}</h3>
                <div class="category">${product.category}</div>
                <p class="price">$${product.price.toFixed(2)}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
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
                <span class="quantity">${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
                <button onclick="removeFromCart(${item.id})" class="remove-btn">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    
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