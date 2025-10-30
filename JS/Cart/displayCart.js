// Import cart functions
import { updateCartQuantity, removeFromCart, getCartItemCount, getCartTotal, clearCart } from '../cart.js';
import { calculatePromo } from './promoCalculator.js';

// Get cart from localStorage directly
function getCartFromStorage() {
    const savedCart = localStorage.getItem('strikerCart');
    return savedCart ? JSON.parse(savedCart) : [];
}

// Display cart items
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = cartItemsContainer.querySelector('.empty-cart-message');
    
    if (!cartItemsContainer) {
        console.error('Cart items container not found');
        return;
    }

    // Get current cart from localStorage
    const cart = getCartFromStorage();
    
    console.log('Displaying cart items:', cart);

    // Clear existing items (except empty message)
    const existingItems = cartItemsContainer.querySelectorAll('.cart-item');
    existingItems.forEach(item => item.remove());

    // If cart is empty, show empty message
    if (cart.length === 0) {
        if (emptyCartMessage) {
            emptyCartMessage.style.display = 'block';
        }
        updateCartSummary(cart);
        return;
    }

    // Hide empty message
    if (emptyCartMessage) {
        emptyCartMessage.style.display = 'none';
    }

    // Display each cart item
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.dataset.itemId = item.id;

        const itemTotal = (item.price * item.quantity).toFixed(2);

        cartItem.innerHTML = `
            <img src="${item.image || 'src/Images/Products/product1.jpg'}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>${item.category || 'N/A'}</p>
                <p>${item.condition || 'N/A'}</p>
            </div>
            <div class="cart-item-price">
                $${parseFloat(item.price).toFixed(2)}
            </div>
            <div class="cart-item-controls">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="decrementQuantity(&quot;${item.id}&quot;)">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="incrementQuantity(&quot;${item.id}&quot;)">+</button>
                </div>
                <button class="remove-item-btn" onclick="removeItemFromCart(&quot;${item.id}&quot;)">Remove</button>
            </div>
        `;

        // Insert before empty message or at the end
        if (emptyCartMessage) {
            cartItemsContainer.insertBefore(cartItem, emptyCartMessage);
        } else {
            cartItemsContainer.appendChild(cartItem);
        }
    });

    updateCartSummary(cart);
}

// Update cart summary calculations
function updateCartSummary(cart = null) {
    const subtotalElement = document.getElementById('cart-subtotal');
    const taxElement = document.getElementById('cart-tax');
    const totalElement = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');
    const promoSelect = document.getElementById('promo-select');

    // Calculate subtotal from provided cart or from localStorage
    if (!cart) {
        cart = getCartFromStorage();
    }
    
    const baseSubtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Get selected promo
    const selectedPromo = promoSelect ? promoSelect.value : 'none';
    
    // Calculate promo discounts
    const promoResults = calculatePromo(cart, selectedPromo);
    
    let subtotal = promoResults.subtotal;
    let discount = promoResults.discount;
    let savings = promoResults.savings;
    const valid = promoResults.valid;
    
    // If promo is not valid, show alert and reset selection
    if (!valid && selectedPromo !== 'none') {
        alert('This promotion only applies to multiple quantities of the same product. Please select the 15% discount if you have different products in your cart.');
        if (promoSelect) {
            promoSelect.value = 'none';
        }
        // Recalculate with no promo
        return updateCartSummary(cart);
    }
    
    // Tax is calculated on the original subtotal (before promo)
    const tax = baseSubtotal * 0.1;
    
    // Update tax display
    if (taxElement) {
        taxElement.textContent = `$${tax.toFixed(2)}`;
    }
    
    // Total without promo = subtotal + tax
    const totalWithoutPromo = baseSubtotal + tax;
    
    // Final total with promo = subtotal + tax - discount
    const totalWithPromo = baseSubtotal + tax - discount;

    // Update subtotal display (this one stays at the top showing tax info)
    if (subtotalElement) {
        subtotalElement.textContent = `$${baseSubtotal.toFixed(2)}`;
    }

    // Update discount and savings displays
    const discountRow = document.getElementById('discount-row');
    const discountAmount = document.getElementById('cart-discount');
    const savingsRow = document.getElementById('savings-row');
    const savingsAmount = document.getElementById('cart-savings');
    
    // Update subtotal after promo section
    const subtotalFinalElement = document.getElementById('cart-subtotal-final');
    if (subtotalFinalElement) {
        subtotalFinalElement.textContent = `$${totalWithoutPromo.toFixed(2)}`;
    }
    
    // Show or hide final total row based on discount
    const finalTotalRow = document.getElementById('final-total-row');
    const finalTotalAmount = document.getElementById('cart-total-final');
    
    if (discount > 0) {
        if (discountRow) {
            discountRow.style.display = 'flex';
            if (discountAmount) {
                discountAmount.textContent = `-$${discount.toFixed(2)}`;
            }
        }
        if (savingsRow) {
            savingsRow.style.display = 'flex';
            if (savingsAmount) {
                savingsAmount.textContent = `$${savings.toFixed(2)}`;
            }
        }
        // Show final total with promo
        if (finalTotalRow) {
            finalTotalRow.style.display = 'flex';
        }
        if (finalTotalAmount) {
            finalTotalAmount.textContent = `$${totalWithPromo.toFixed(2)}`;
        }
    } else {
        if (discountRow) discountRow.style.display = 'none';
        if (savingsRow) savingsRow.style.display = 'none';
        // Hide final total row when no promo
        if (finalTotalRow) {
            finalTotalRow.style.display = 'none';
        }
    }

    // Update total display (always shows the final total, whether with or without promo)
    if (totalElement) {
        // If discount is applied, show the discounted total
        // Otherwise show the normal total
        totalElement.textContent = `$${totalWithPromo.toFixed(2)}`;
    }

    // Enable/disable checkout button based on cart
    if (checkoutButton) {
        checkoutButton.disabled = cart.length === 0;
    }
}

// Increment quantity
window.incrementQuantity = function(itemId) {
    const cart = getCartFromStorage();
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        if (item.quantity < item.stock) {
            updateCartQuantity(itemId, item.quantity + 1);
            displayCartItems();
        } else {
            alert(`Maximum stock available: ${item.stock}`);
        }
    }
};

// Decrement quantity
window.decrementQuantity = function(itemId) {
    const cart = getCartFromStorage();
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item && item.quantity > 1) {
        updateCartQuantity(itemId, item.quantity - 1);
        displayCartItems();
    }
};

// Remove item from cart
window.removeItemFromCart = function(itemId) {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
        removeFromCart(itemId);
        displayCartItems();
    }
};

// Checkout button handler
document.addEventListener('DOMContentLoaded', function() {
    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            const cart = getCartFromStorage();
            if (cart.length > 0) {
                alert('Checkout functionality coming soon!');
                // You can implement checkout logic here
            }
        });
    }

    // Promo dropdown handler
    const promoSelect = document.getElementById('promo-select');
    if (promoSelect) {
        promoSelect.addEventListener('change', function() {
            const cart = getCartFromStorage();
            updateCartSummary(cart);
        });
    }

    // Display cart items on page load
    displayCartItems();
});

// Export functions
export { displayCartItems };

