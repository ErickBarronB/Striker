// Check if cart has multiple different products
function hasMultipleDifferentProducts(cart) {
    return cart.length > 1;
}

// Promo calculator functions
export function calculatePromo(cart, promoType) {
    if (!cart || cart.length === 0) {
        return {
            subtotal: 0,
            discount: 0,
            savings: 0,
            total: 0,
            valid: true
        };
    }

    // Calculate base subtotal
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    let discount = 0;
    let savings = 0;
    let valid = true;

    // Check if promo is valid for this cart
    if (promoType === '50off' || promoType === '3x2') {
        if (hasMultipleDifferentProducts(cart)) {
            valid = false;
        } else {
            switch (promoType) {
                case '50off':
                    discount = calculate50Off(cart);
                    break;
                case '3x2':
                    discount = calculate3x2(cart);
                    break;
            }
        }
    } else if (promoType === '10percent') {
        discount = calculate10Percent(subtotal);
    }

    savings = discount;
    const total = subtotal - discount;

    return {
        subtotal,
        discount,
        savings,
        total,
        valid
    };
}

// 50% off Second Item promotion
function calculate50Off(cart) {
    let discount = 0;
    
    // Get all items with quantity >= 2
    const eligibleItems = cart.filter(item => item.quantity >= 2);
    
    eligibleItems.forEach(item => {
        // Calculate how many pairs of 2 we have
        const pairs = Math.floor(item.quantity / 2);
        // Apply 50% discount to one item per pair
        const itemDiscount = item.price * 0.5 * pairs;
        discount += itemDiscount;
    });
    
    return discount;
}

// 3x2 promotion (Buy 3, Pay for 2)
function calculate3x2(cart) {
    let discount = 0;
    
    // Get all items with quantity >= 3
    const eligibleItems = cart.filter(item => item.quantity >= 3);
    
    eligibleItems.forEach(item => {
        // Calculate how many sets of 3 we have
        const setsOfThree = Math.floor(item.quantity / 3);
        // Apply discount: get 1 free item per set of 3
        const itemDiscount = item.price * setsOfThree;
        discount += itemDiscount;
    });
    
    return discount;
}

// 15% off for purchases over $1,000
function calculate10Percent(subtotal) {
    if (subtotal >= 1000) {
        return subtotal * 0.15;
    }
    return 0;
}

