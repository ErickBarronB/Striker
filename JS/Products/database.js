// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWefnwcX1ejPyrRyna2JDjLnSja9eAcRE",
  authDomain: "striker-fc885.firebaseapp.com",
  projectId: "striker-fc885",
  storageBucket: "striker-fc885.firebasestorage.app",
  messagingSenderId: "154360311335",
  appId: "1:154360311335:web:807be08c9982d442fb6802",
  measurementId: "G-DLWT4FRBQ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Export the database so you can use it in other files
export { database };

// Global variables for filtering
let allItems = []; // Store all items locally
let filteredItems = []; // Store filtered items


// Function to fetch all items from Firebase dynamically
async function fetchAllItems() {
    try {
        const loadedItems = [];
        
        console.log('Starting dynamic item fetch...');
        
        // Fetch all items at once using Firebase's list functionality
        const rootRef = ref(database);
        const snapshot = await get(rootRef);
        
        if (snapshot.exists()) {
            const data = snapshot.val();
            
            // Iterate through all top-level keys
            Object.keys(data).forEach(key => {
                const item = data[key];
                if (item && typeof item === 'object') {
                    // Check if it's a product item (has name, price, etc.)
                    if (item.name || item.price || item.category) {
                        item.id = key; // Add the key as an ID
                        loadedItems.push(item);
                        console.log(`${key} data:`, item);
                    }
                }
            });
        }
        
        // Store items locally and display them
        if (loadedItems.length > 0) {
            allItems = loadedItems; // Store in global variable
            filteredItems = [...loadedItems]; // Initialize filtered items
            displayAllItemCards(loadedItems);
            document.getElementById('test-display').textContent = `Loaded ${loadedItems.length}`;
            console.log(`Successfully loaded ${loadedItems.length} items`);
            
            // Initialize filter functionality
            initializeFilters();
        } else {
            document.getElementById('test-display').textContent = 'No items found';
            console.log('No items found in database');
        }
        
    } catch (error) {
        console.error('Error fetching items:', error);
        document.getElementById('test-display').textContent = 'Error loading items';
    }
}

// Function to display all items as product cards
function displayAllItemCards(items) {
    // Find the container where we'll add the cards
    const productShelf = document.querySelector('.products-container-content-productShelf-itemCardHolder');
    
    if (!productShelf) {
        console.error('Product shelf container not found');
        return;
    }
    
    // Clear existing cards (keep the container structure)
    const existingCards = productShelf.querySelectorAll('.products-container-content-productShelf-itemCard');
    existingCards.forEach(card => card.remove());
    
    // Create a card for each item
    items.forEach(item => {
        const productCard = document.createElement('div');
        productCard.className = 'products-container-content-productShelf-itemCard';
        productCard.innerHTML = `
            <img src="${item.image || 'src/Images/Products/product1.jpg'}" alt="${item.name}">
            <h3>${item.name || 'Product Name'}</h3>
            <div class="product-info">
                <p><strong>Price:</strong> $${item.price || 'N/A'}</p>
                <p><strong>Stock:</strong> ${item.stock || 'N/A'}</p>
                <p><strong>Condition:</strong> ${item.condition || 'N/A'}</p>
                <p><strong>Category:</strong> ${item.category || 'N/A'}</p>
                ${item.description ? `<p><strong>Description:</strong> ${item.description}</p>` : ''}
            </div>
        `;
        
        // Add mobile click functionality
        productCard.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                showMobileDetailCard(item);
            }
        });
        
        productShelf.appendChild(productCard);
    });
    
    console.log(`Created ${items.length} product cards`);
}

// Filtering Functions
function initializeFilters() {
    console.log('Initializing filters...');
    
    // Initialize sounds
    const hoverSound = new Audio("src/Audio/ButtonHover.mp3");
    const clickSound = new Audio("src/Audio/ButtonClick.mp3");
    let waitTime = 300;
    
    // Get filter elements
    const searchInput = document.querySelector('input[type="text"]');
    const buttons = document.querySelectorAll('.filter-buttons button');
    const selectAllButton = buttons[0]; // First button (Select All)
    const applyButton = buttons[1]; // Second button (Apply Filters)
    const clearButton = buttons[2]; // Third button (Clear Filters)
    
    console.log('Found buttons:', buttons.length);
    console.log('Apply button text:', applyButton ? applyButton.textContent : 'Not found');
    
    if (searchInput && applyButton) {
        // Search functionality
        searchInput.addEventListener('input', debounce(handleSearch, 300));
        
        // Apply filters button
        applyButton.addEventListener('click', handleApplyFilters);
        
        // Select all button
        if (selectAllButton) {
            selectAllButton.addEventListener('click', handleSelectAll);
        }
        
        // Clear filters button
        if (clearButton) {
            clearButton.addEventListener('click', handleClearFilters);
        }
        
        // Apply sort button
        const applySortButton = document.querySelector('.apply-sort-btn');
        if (applySortButton) {
            applySortButton.addEventListener('click', handleApplySort);
        }
        
        // Add sound effects to all filter buttons
        addSoundEffects(buttons, hoverSound, clickSound, waitTime);
        if (applySortButton) {
            addSoundEffects([applySortButton], hoverSound, clickSound, waitTime);
        }
        
        // Add sound effects to search button
        const searchButton = document.querySelector('.products-container-content-searchHolder button');
        if (searchButton) {
            addSoundEffects([searchButton], hoverSound, clickSound, waitTime);
        }
        
        console.log('Filter event listeners attached');
    } else {
        console.error('Filter elements not found');
        console.log('Search input found:', !!searchInput);
        console.log('Apply button found:', !!applyButton);
    }
}

// Function to add sound effects to buttons
function addSoundEffects(buttons, hoverSound, clickSound, waitTime) {
    buttons.forEach(button => {
        if (button) {
            // Hover sound effect
            button.addEventListener('mouseenter', () => {
                hoverSound.currentTime = 0;
                hoverSound.play().catch(e => console.log("Button hover sound error:", e));
            });
            
            // Click sound effect (without navigation delay since these are filter buttons)
            button.addEventListener('click', () => {
                clickSound.currentTime = 0;
                clickSound.play().catch(e => console.log("Button click sound error:", e));
            });
        }
    });
}

// Debounce function to limit search frequency
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle search input
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    console.log('Searching for:', searchTerm);
    
    // Apply search and current category filters
    applyFilters(searchTerm);
}

// Handle apply filters button
function handleApplyFilters() {
    console.log('Apply filters button clicked!');
    
    const searchInput = document.querySelector('input[type="text"]');
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    console.log('Search term:', searchTerm);
    console.log('Total items before filter:', allItems.length);
    
    applyFilters(searchTerm);
}

// Handle select all button
function handleSelectAll() {
    console.log('Selecting all categories...');
    
    // Check all category checkboxes
    const categoryCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    categoryCheckboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
    
    console.log(`Selected all ${categoryCheckboxes.length} categories`);
}

// Handle clear filters button
function handleClearFilters() {
    console.log('Clearing all filters...');
    
    // Clear search input
    const searchInput = document.querySelector('input[type="text"]');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Uncheck all category checkboxes
    const categoryCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    categoryCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Reset to show all items
    filteredItems = [...allItems];
    displayAllItemCards(filteredItems);
    
    // Update display
    updateItemCount();
}

// Main filtering function
function applyFilters(searchTerm = '') {
    console.log('=== APPLYING FILTERS ===');
    console.log('Search term:', searchTerm);
    console.log('All items:', allItems.length);
    
    let items = [...allItems];
    console.log('Starting with items:', items.length);
    
    // Apply search filter
    if (searchTerm) {
        items = items.filter(item => 
            item.name && item.name.toLowerCase().includes(searchTerm)
        );
        console.log('After search filter:', items.length);
    }
    
    // Apply category filters
    const checkedCategories = getCheckedCategories();
    console.log('Checked categories:', checkedCategories);
    
    if (checkedCategories.length > 0) {
        console.log('Items before category filter:', items.length);
        items = items.filter(item => {
            const itemCategory = item.category ? item.category.toLowerCase() : '';
            const isMatch = checkedCategories.includes(itemCategory);
            console.log(`Item "${item.name}" (${itemCategory}) matches:`, isMatch);
            return isMatch;
        });
        console.log('After category filter:', items.length);
    }
    
    // Update filtered items and display
    filteredItems = items;
    console.log('Final filtered items:', filteredItems.length);
    
    displayAllItemCards(filteredItems);
    updateItemCount();
    
    console.log('=== FILTERING COMPLETE ===');
}

// Get checked categories
function getCheckedCategories() {
    const checkedCategories = [];
    const categoryCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    
    categoryCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            // Use the checkbox name attribute as the category
            checkedCategories.push(checkbox.name.toLowerCase());
        }
    });
    
    return checkedCategories;
}

// Update item count display
function updateItemCount() {
    const testDisplay = document.getElementById('test-display');
    if (testDisplay) {
        testDisplay.textContent = `Showing ${filteredItems.length} of ${allItems.length} items`;
    }
}

// Sorting Functions
function handleApplySort() {
    console.log('Applying sort...');
    
    // Get current filtered items
    let itemsToSort = [...filteredItems];
    
    // Apply sorting
    itemsToSort = applySorting(itemsToSort);
    
    // Update display
    filteredItems = itemsToSort;
    displayAllItemCards(filteredItems);
    updateItemCount();
    
    console.log('Sort applied successfully');
}

function applySorting(items) {
    let sortedItems = [...items];
    
    // Get sort options
    const priceSort = document.getElementById('price-sort').value;
    const stockSort = document.getElementById('stock-sort').value;
    const conditionSort = document.getElementById('condition-sort').value;
    
    console.log('Sort options:', { priceSort, stockSort, conditionSort });
    
    // Apply condition sorting first (priority sorting)
    if (conditionSort === 'new' || conditionSort === 'used') {
        sortedItems.sort((a, b) => {
            const aCondition = a.condition ? a.condition.toLowerCase() : '';
            const bCondition = b.condition ? b.condition.toLowerCase() : '';
            
            // If both match the selected condition, maintain current order
            if (aCondition === conditionSort && bCondition === conditionSort) return 0;
            
            // If a matches selected condition but b doesn't, a comes first
            if (aCondition === conditionSort && bCondition !== conditionSort) return -1;
            
            // If b matches selected condition but a doesn't, b comes first
            if (bCondition === conditionSort && aCondition !== conditionSort) return 1;
            
            // If neither matches, maintain current order
            return 0;
        });
    }
    
    // Apply price sorting
    if (priceSort === 'low-high') {
        sortedItems.sort((a, b) => {
            const aPrice = parseFloat(a.price) || 0;
            const bPrice = parseFloat(b.price) || 0;
            return aPrice - bPrice;
        });
    } else if (priceSort === 'high-low') {
        sortedItems.sort((a, b) => {
            const aPrice = parseFloat(a.price) || 0;
            const bPrice = parseFloat(b.price) || 0;
            return bPrice - aPrice;
        });
    }
    
    // Apply stock sorting
    if (stockSort === 'high-stock') {
        sortedItems.sort((a, b) => {
            const aStock = parseInt(a.stock) || 0;
            const bStock = parseInt(b.stock) || 0;
            return bStock - aStock;
        });
    } else if (stockSort === 'low-stock') {
        sortedItems.sort((a, b) => {
            const aStock = parseInt(a.stock) || 0;
            const bStock = parseInt(b.stock) || 0;
            return aStock - bStock;
        });
    }
    
    console.log(`Sorted ${sortedItems.length} items`);
    return sortedItems;
}

// Mobile Detail Card Functions
function showMobileDetailCard(item) {
    // Create mobile detail card modal if it doesn't exist
    let mobileDetailCard = document.querySelector('.mobile-detail-card');
    
    if (!mobileDetailCard) {
        mobileDetailCard = document.createElement('div');
        mobileDetailCard.className = 'mobile-detail-card';
        mobileDetailCard.innerHTML = `
            <div class="mobile-detail-card-content">
                <button class="mobile-detail-card-close" onclick="closeMobileDetailCard()">&times;</button>
                <img src="${item.image || 'src/Images/Products/product1.jpg'}" alt="${item.name}">
                <h3>${item.name || 'Product Name'}</h3>
                <div class="product-details">
                    <p><strong>Price:</strong> $${item.price || 'N/A'}</p>
                    <p><strong>Stock:</strong> ${item.stock || 'N/A'}</p>
                    <p><strong>Condition:</strong> ${item.condition || 'N/A'}</p>
                    <p><strong>Category:</strong> ${item.category || 'N/A'}</p>
                    ${item.description ? `<p><strong>Description:</strong> ${item.description}</p>` : ''}
                </div>
            </div>
        `;
        // Append to body and ensure it's at the end of DOM
        document.body.appendChild(mobileDetailCard);
        
        // Force the modal to be on top
        mobileDetailCard.style.position = 'fixed';
        mobileDetailCard.style.zIndex = '99999';
        mobileDetailCard.style.top = '0';
        mobileDetailCard.style.left = '0';
        mobileDetailCard.style.width = '100%';
        mobileDetailCard.style.height = '100%';
    } else {
        // Update existing modal with new item data
        const content = mobileDetailCard.querySelector('.mobile-detail-card-content');
        content.innerHTML = `
            <button class="mobile-detail-card-close" onclick="closeMobileDetailCard()">&times;</button>
            <img src="${item.image || 'src/Images/Products/product1.jpg'}" alt="${item.name}">
            <h3>${item.name || 'Product Name'}</h3>
            <div class="product-details">
                <p><strong>Price:</strong> $${item.price || 'N/A'}</p>
                <p><strong>Stock:</strong> ${item.stock || 'N/A'}</p>
                <p><strong>Condition:</strong> ${item.condition || 'N/A'}</p>
                <p><strong>Category:</strong> ${item.category || 'N/A'}</p>
                ${item.description ? `<p><strong>Description:</strong> ${item.description}</p>` : ''}
            </div>
        `;
    }
    
    // Show the modal
    mobileDetailCard.classList.add('active');
    
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
    
    // Add click outside to close functionality
    mobileDetailCard.addEventListener('click', function(e) {
        if (e.target === mobileDetailCard) {
            closeMobileDetailCard();
        }
    });
    
    // Add ESC key to close functionality
    const handleEscapeKey = function(e) {
        if (e.key === 'Escape') {
            closeMobileDetailCard();
            document.removeEventListener('keydown', handleEscapeKey);
        }
    };
    document.addEventListener('keydown', handleEscapeKey);
    
    console.log('Mobile detail card opened for:', item.name);
}

function closeMobileDetailCard() {
    const mobileDetailCard = document.querySelector('.mobile-detail-card');
    if (mobileDetailCard) {
        mobileDetailCard.classList.remove('active');
        
        // Restore body scrolling
        document.body.style.overflow = 'auto';
        
        console.log('Mobile detail card closed');
    }
}

// Make closeMobileDetailCard globally accessible
window.closeMobileDetailCard = closeMobileDetailCard;

// Hide mobile detail card when switching back to desktop
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        const mobileDetailCard = document.querySelector('.mobile-detail-card');
        if (mobileDetailCard && mobileDetailCard.classList.contains('active')) {
            closeMobileDetailCard();
        }
    }
});

// Call the function when the module loads
fetchAllItems();