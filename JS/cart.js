// Cart management system
let cart = []; // Array to store all items in the cart

// Function to add item to cart
function addToCart(item) {
    // Check if item has stock available
    if (!item.stock || item.stock <= 0) {
        alert('Sorry, this item is out of stock!');
        return false;
    }

    // Check if item already exists in cart
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
        // If item exists, increment quantity (if quantity <= stock)
        if (existingItem.quantity < item.stock) {
            existingItem.quantity++;
            console.log(`Updated quantity for ${item.name}: ${existingItem.quantity}`);
        } else {
            alert(`You've reached the maximum stock available for ${item.name}!`);
            return false;
        }
    } else {
        // If item doesn't exist, add it to cart
        const cartItem = {
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            stock: item.stock,
            category: item.category,
            condition: item.condition,
            quantity: 1
        };
        cart.push(cartItem);
        console.log(`Added ${item.name} to cart`);
    }

    // Save to localStorage
    saveCartToStorage();
    
    // Update cart UI
    updateCartBadge();
    
    return true;
}

// Function to remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCartToStorage();
    updateCartBadge();
    console.log('Item removed from cart');
}

// Function to update item quantity in cart
function updateCartQuantity(itemId, newQuantity) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(itemId);
        } else if (newQuantity <= item.stock) {
            item.quantity = newQuantity;
            saveCartToStorage();
            updateCartBadge();
        } else {
            alert(`Maximum stock available: ${item.stock}`);
        }
    }
}

// Function to get total items in cart
function getCartItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Function to get cart total price
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Function to clear cart
function clearCart() {
    cart = [];
    saveCartToStorage();
    updateCartBadge();
    console.log('Cart cleared');
}

// Function to save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('strikerCart', JSON.stringify(cart));
    console.log('Cart saved to localStorage');
}

// Function to load cart from localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('strikerCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        console.log('Cart loaded from localStorage:', cart.length, 'items');
        updateCartBadge();
    }
}

// Function to update cart badge in navigation
function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const count = getCartItemCount();
        badge.textContent = count > 0 ? count : '';
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Initialize cart on page load
function initCart() {
    loadCartFromStorage();
}

// Export functions for use in other files
export { 
    cart, 
    addToCart, 
    removeFromCart, 
    updateCartQuantity, 
    getCartItemCount, 
    getCartTotal, 
    clearCart, 
    initCart,
    updateCartBadge 
};

// Make functions globally available
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.getCartItemCount = getCartItemCount;
window.getCartTotal = getCartTotal;
window.clearCart = clearCart;

