// --- PWA Service Worker Registration ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

// --- Data ---
let defaultProducts = [
    { id: 1, name: "Rose Face Cream", price: 2500, rating: 5, reviews: 24, category: "skincare", image: "Rose Face Cream.jpg", desc: "A luxurious and deeply hydrating cream enriched with natural rose extracts. Perfect for achieving a radiant and youthful glow.", ingredients: ["Rose Water", "Shea Butter", "Vitamin E", "Jojoba Oil"] },
    { id: 2, name: "Aloe Vera Gel", price: 1800, rating: 4, reviews: 18, category: "skincare", image: "Aloe Vera Gel.jpg", desc: "Pure, soothing aloe vera gel to calm irritated skin and provide lightweight moisture. Ideal for daily use.", ingredients: ["100% Pure Aloe Vera", "Tea Tree Extract"] },
    { id: 3, name: "Neem Toner", price: 1500, rating: 4, reviews: 22, category: "skincare", image: "Neem Toner.jpg", desc: "Clarifying toner with natural neem extracts to balance oil production and purify pores.", ingredients: ["Neem Extract", "Witch Hazel", "Rose Water"] },
    { id: 4, name: "Coconut Moisturizer", price: 2200, rating: 5, reviews: 27, category: "skincare", image: "Coconut Moisturizer.jpg", desc: "Rich and creamy moisturizer that deeply nourishes dry skin, leaving it soft and supple.", ingredients: ["Virgin Coconut Oil", "Cocoa Butter", "Glycerin"] },
    { id: 5, name: "Lavender Oil", price: 2800, rating: 5, reviews: 35, category: "oils", image: "Lavender Oil best seller.jpg", desc: "100% pure essential lavender oil for relaxation, aromatherapy, and skin soothing.", ingredients: ["Pure Lavender Essential Oil"] },
    { id: 6, name: "Tea Tree Oil", price: 3500, rating: 4, reviews: 19, category: "oils", image: "Eucalyptus Oil.jpg", desc: "Potent natural remedy for blemishes and skin irritations with antibacterial properties.", ingredients: ["Pure Tea Tree Essential Oil"] },
    { id: 7, name: "Eucalyptus Oil", price: 2600, rating: 5, reviews: 28, category: "oils", image: "Eucalyptus Oil.jpg", desc: "Invigorating essential oil perfect for clearing congestion and refreshing the mind.", ingredients: ["Pure Eucalyptus Essential Oil"] },
    { id: 8, name: "Rosemary Oil", price: 3000, rating: 4, reviews: 23, category: "oils", image: "Rosemary Oil.jpg", desc: "Stimulating oil known for promoting hair growth and improving focus and memory.", ingredients: ["Pure Rosemary Essential Oil"] },
    { id: 9, name: "Jojoba Oil", price: 4200, rating: 5, reviews: 41, category: "oils", image: "Jojoba Oil.jpg", desc: "Versatile carrier oil that closely mimics the skin's natural sebum for ultimate hydration.", ingredients: ["100% Cold-pressed Jojoba Oil"] },
    { id: 10, name: "Oatmeal Soap", price: 800, rating: 5, reviews: 33, category: "soaps", image: "Oatmeal Soap.jpg", desc: "Gentle exfoliating soap that soothes dry and itchy skin while providing a rich lather.", ingredients: ["Colloidal Oatmeal", "Olive Oil", "Coconut Milk"] },
    { id: 11, name: "Charcoal Soap", price: 950, rating: 4, reviews: 26, category: "soaps", image: "Charcoal Soap.jpg", desc: "Deep cleansing soap that draws out impurities and toxins for a clearer complexion.", ingredients: ["Activated Charcoal", "Tea Tree Oil", "Shea Butter"] },
    { id: 12, name: "Honey Soap", price: 1100, rating: 5, reviews: 38, category: "soaps", image: "Honey Soap.jpg", desc: "Nourishing soap bar that locks in moisture and provides natural antibacterial benefits.", ingredients: ["Raw Honey", "Goat Milk", "Almond Oil"] },
    { id: 13, name: "Raw Honey", price: 1800, rating: 5, reviews: 45, category: "foods", image: "Raw Honey.jpg", desc: "100% pure, unpasteurized raw honey packed with antioxidants and natural enzymes.", ingredients: ["Raw Organic Honey"] },
    { id: 14, name: "Chia Seeds", price: 2200, rating: 4, reviews: 32, category: "foods", image: "Chia Seeds.jpg", desc: "Nutrient-dense superfood rich in omega-3 fatty acids, fiber, and essential proteins.", ingredients: ["Organic Black Chia Seeds"] },
    { id: 15, name: "Chamomile Tea", price: 1500, rating: 5, reviews: 39, category: "teas", image: "Chamomile Tea.jpg", desc: "Calming herbal tea blend perfect for winding down and promoting restful sleep.", ingredients: ["Dried Chamomile Flowers"] }
];

let products = JSON.parse(localStorage.getItem('pn_products')) || defaultProducts;

let socialLinks = JSON.parse(localStorage.getItem('pn_social')) || [
    { id: 'facebook', name: 'Facebook', icon: 'ri-facebook-fill', url: 'https://facebook.com', active: true },
    { id: 'instagram', name: 'Instagram', icon: 'ri-instagram-line', url: 'https://instagram.com', active: true },
    { id: 'whatsapp', name: 'WhatsApp', icon: 'ri-whatsapp-line', url: 'https://wa.me/923017521245', active: true },
    { id: 'tiktok', name: 'TikTok', icon: 'ri-tiktok-fill', url: 'https://tiktok.com', active: false },
    { id: 'youtube', name: 'YouTube', icon: 'ri-youtube-fill', url: 'https://youtube.com', active: false },
    { id: 'linkedin', name: 'LinkedIn', icon: 'ri-linkedin-fill', url: 'https://linkedin.com', active: false }
];

const bestSellersIds = [1, 13, 5]; // Rose Face Cream, Raw Honey, Lavender Oil

// Current State
let currentProduct = null;
let currentQuantity = 1;
let cart = JSON.parse(localStorage.getItem('pn_cart')) || [];

// --- DOM Elements ---
const productsGrid = document.getElementById('products-grid');
const bestSellersGrid = document.getElementById('best-sellers-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const categoryBtns = document.querySelectorAll('.category-btn');

// Modals
const modalOverlay = document.getElementById('modal-overlay');
const productModal = document.getElementById('product-modal');
const checkoutModal = document.getElementById('checkout-modal');
const closeBtns = document.querySelectorAll('.close-modal');

// --- Helper Functions ---
function formatPrice(price) {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(price).replace('PKR', 'Rs.');
}

function generateStars(rating) {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHtml += '<i class="ri-star-fill text-accent text-lg"></i>';
        } else {
            starsHtml += '<i class="ri-star-line text-gray-300 text-lg"></i>';
        }
    }
    return starsHtml;
}

// --- Render Products ---
function renderProductCard(product, isBestSeller = false) {
    return `
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-soft transition-all duration-300 group cursor-pointer border border-gray-100 flex flex-col h-full reveal-up" onclick="openProductModal(${product.id})">
            <div class="relative aspect-square overflow-hidden bg-gray-50">
                ${isBestSeller ? '<span class="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-sm">Best Seller</span>' : ''}
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
            </div>
            <div class="p-6 flex flex-col flex-grow">
                <div class="flex items-center gap-1 mb-2">
                    ${generateStars(product.rating)}
                    <span class="text-xs text-gray-400 ml-1">(${product.reviews})</span>
                </div>
                <h3 class="text-xl font-serif font-semibold text-gray-900 mb-2">${product.name}</h3>
                <p class="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">${product.desc}</p>
                <div class="flex items-center justify-between mt-auto">
                    <span class="text-lg font-bold text-sage">${formatPrice(product.price)}</span>
                    <button class="bg-accent hover:bg-accent-hover text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm" onclick="event.stopPropagation(); openProductModal(${product.id})">
                        ${isBestSeller ? 'View Details' : 'Buy Now'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderProducts(filter = 'all') {
    productsGrid.innerHTML = '';
    const filteredProducts = filter === 'all' ? products : products.filter(p => p.category === filter);
    
    filteredProducts.forEach((product, index) => {
        const cardHtml = renderProductCard(product);
        productsGrid.insertAdjacentHTML('beforeend', cardHtml);
    });
    
    // Re-trigger scroll reveal for new elements
    setTimeout(handleScrollReveal, 50);
}

function renderBestSellers() {
    bestSellersGrid.innerHTML = '';
    const bestSellers = products.filter(p => bestSellersIds.includes(p.id));
    
    // Custom sort to match requested order: Rose Face Cream, Raw Honey, Lavender Oil
    bestSellers.sort((a, b) => bestSellersIds.indexOf(a.id) - bestSellersIds.indexOf(b.id));

    bestSellers.forEach((product) => {
        // Find best seller specific image if exists
        let bsProduct = {...product};
        if(bsProduct.id === 1) bsProduct.image = "Rose Face Cream best seller.jpg";
        if(bsProduct.id === 13) bsProduct.image = "Raw Honey best seller.jpg";
        if(bsProduct.id === 5) bsProduct.image = "Lavender Oil best seller.jpg";

        const cardHtml = renderProductCard(bsProduct, true);
        bestSellersGrid.insertAdjacentHTML('beforeend', cardHtml);
    });
}

// --- Filtering Logic ---
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active class
        filterBtns.forEach(b => {
            b.classList.remove('bg-sage', 'text-white', 'shadow-md');
            b.classList.add('bg-transparent', 'text-gray-600');
        });
        btn.classList.remove('bg-transparent', 'text-gray-600');
        btn.classList.add('bg-sage', 'text-white', 'shadow-md');
        
        const filter = btn.getAttribute('data-filter');
        renderProducts(filter);
    });
});

categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        
        // Scroll to products section
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        
        // Trigger filter button click to update UI and grid
        const targetFilterBtn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
        if(targetFilterBtn) {
            targetFilterBtn.click();
        }
    });
});

// --- Modal Logic ---
function openProductModal(productId) {
    currentProduct = products.find(p => p.id === productId);
    currentQuantity = 1;
    
    if (!currentProduct) return;

    // Populate Data
    document.getElementById('modal-img').src = currentProduct.image;
    document.getElementById('modal-title').textContent = currentProduct.name;
    document.getElementById('modal-price').textContent = formatPrice(currentProduct.price);
    document.getElementById('modal-desc').textContent = currentProduct.desc;
    document.getElementById('modal-stars').innerHTML = generateStars(currentProduct.rating) + `<span class="text-sm text-gray-500 ml-2">(${currentProduct.reviews} Reviews)</span>`;
    
    const ingredientsList = document.getElementById('modal-ingredients');
    ingredientsList.innerHTML = '';
    currentProduct.ingredients.forEach(ing => {
        ingredientsList.innerHTML += `<li class="text-sm text-gray-600 flex items-center gap-2"><i class="ri-check-line text-sage"></i>${ing}</li>`;
    });
    
    updateQuantityDisplay();

    // Show Modal
    modalOverlay.classList.add('modal-backdrop-show');
    productModal.classList.remove('hidden');
    // Small timeout to allow display:block to apply before changing opacity/transform
    setTimeout(() => {
        productModal.classList.add('modal-show');
        document.body.classList.add('modal-open');
    }, 10);
}

function openCartModal() {
    if (cart.length === 0) {
        alert("Your cart is empty! Please add products before checking out.");
        return;
    }
    
    // Hide Product Modal
    productModal.classList.remove('modal-show');
    
    setTimeout(() => {
        productModal.classList.add('hidden');
        
        // Populate Checkout Data with Cart Items
        let summaryHtml = '<h4 class="font-medium text-gray-900 mb-3 border-b border-gray-200 pb-2">Order Summary</h4>';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.product.price * item.quantity;
            total += itemTotal;
            summaryHtml += `
            <div class="flex justify-between items-center mb-2">
                <span class="text-gray-600">${item.product.name} <span class="text-xs font-bold text-gray-500">(x${item.quantity})</span></span>
                <span class="font-medium text-gray-900">${formatPrice(itemTotal)}</span>
            </div>`;
        });
        
        summaryHtml += `
        <div class="flex justify-between items-center text-lg font-bold text-gray-900 pt-3 border-t border-gray-200 mt-3">
            <span>Total:</span>
            <span id="checkout-total" class="text-sage">${formatPrice(total)}</span>
        </div>`;
        
        const summaryContainer = document.querySelector('#checkout-modal .bg-gray-50');
        if (summaryContainer) {
            summaryContainer.innerHTML = summaryHtml;
        }
        
        // Show Checkout Modal
        checkoutModal.classList.remove('hidden');
        modalOverlay.classList.add('modal-backdrop-show');
        setTimeout(() => {
            checkoutModal.classList.add('modal-show');
            document.body.classList.add('modal-open');
        }, 10);
    }, 100); // Shorter wait
}

function closeModal() {
    productModal.classList.remove('modal-show');
    checkoutModal.classList.remove('modal-show');
    modalOverlay.classList.remove('modal-backdrop-show');
    
    setTimeout(() => {
        productModal.classList.add('hidden');
        checkoutModal.classList.add('hidden');
        document.body.classList.remove('modal-open');
    }, 300);
}

// Quantity Logic
function updateQuantityDisplay() {
    document.getElementById('qty-value').textContent = currentQuantity;
}

document.getElementById('qty-minus').addEventListener('click', () => {
    if (currentQuantity > 1) {
        currentQuantity--;
        updateQuantityDisplay();
    }
});

document.getElementById('qty-plus').addEventListener('click', () => {
    if (currentQuantity < 10) { // arbitrary max
        currentQuantity++;
        updateQuantityDisplay();
    }
});

document.getElementById('btn-add-cart').addEventListener('click', () => {
    if (!currentProduct) return;
    
    const existingItem = cart.find(item => item.product.id === currentProduct.id);
    if (existingItem) {
        existingItem.quantity += currentQuantity;
    } else {
        cart.push({ product: currentProduct, quantity: currentQuantity });
    }
    localStorage.setItem('pn_cart', JSON.stringify(cart));
    
    const cartCountElement = document.getElementById('cart-count');
    const cartCountMobileElement = document.getElementById('cart-count-mobile');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        // Add a quick visual bounce to the cart icon
        const cartBtn = cartCountElement.parentElement;
        cartBtn.classList.remove('animate-bounce');
        void cartBtn.offsetWidth; // trigger reflow
        cartBtn.classList.add('animate-bounce');
    }
    if (cartCountMobileElement) {
        cartCountMobileElement.textContent = totalItems;
    }
    
    // Open cart automatically instead of closing product modal
    openCartModal();
});

// Close Modals events
closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
modalOverlay.addEventListener('click', closeModal);

// --- Form Submission (WhatsApp Integration) ---
document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (cart.length === 0) return;
    
    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const address = document.getElementById('cust-address').value.trim();
    
    if(!name || !phone || !address) return;

    let orderDetailsText = '';
    let totalAmount = 0;

    cart.forEach(item => {
        const itemTotal = item.product.price * item.quantity;
        totalAmount += itemTotal;
        orderDetailsText += `- ${item.product.name} (x${item.quantity}) = Rs. ${itemTotal}\n`;
    });
    
    const message = `*New Order - Pure Nature* 🌿\n\n` +
        `*Customer Details:*\n` +
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Address: ${address}\n\n` +
        `*Order Details:*\n` +
        orderDetailsText +
        `\n*Total Amount: Rs. ${totalAmount}*\n\n` +
        `*Payment Method: JazzCash*\n` +
        `I will share the payment screenshot shortly.\n\n` +
        `Please confirm my order. Thank you!`;
        
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/923017521245?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    closeModal();
    
    // Reset form and cart
    document.getElementById('checkout-form').reset();
    cart = [];
    localStorage.removeItem('pn_cart');
    const cartCountElement = document.getElementById('cart-count');
    const cartCountMobileElement = document.getElementById('cart-count-mobile');
    if (cartCountElement) {
        cartCountElement.textContent = '0';
    }
    if (cartCountMobileElement) {
        cartCountMobileElement.textContent = '0';
    }
});

// --- Scroll Reveal Animation ---
function handleScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const windowHeight = window.innerHeight;
    const elementVisible = 100; // Trigger point

    reveals.forEach((reveal) => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
        }
    });
}

window.addEventListener('scroll', handleScrollReveal);

// --- Navbar & Mobile Menu ---
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-md');
        navbar.classList.remove('py-4');
        navbar.classList.add('py-2');
    } else {
        navbar.classList.remove('shadow-md');
        navbar.classList.add('py-4');
        navbar.classList.remove('py-2');
    }
});

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    renderBestSellers();
    renderFooterSocialLinks();
    handleScrollReveal(); // Trigger once on load
    
    // Update cart count from localStorage
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    const cartCountMobileElement = document.getElementById('cart-count-mobile');
    if (cartCountElement) cartCountElement.textContent = totalItems;
    if (cartCountMobileElement) cartCountMobileElement.textContent = totalItems;
});

// --- Admin Panel Logic ---
let adminPassword = localStorage.getItem('pn_admin_pass') || 'admin';
const adminModal = document.getElementById('admin-modal');
const adminLoginModal = document.getElementById('admin-login-modal');
const adminProductEditModal = document.getElementById('admin-product-edit-modal');
const tabProducts = document.getElementById('admin-tab-products');
const tabSocial = document.getElementById('admin-tab-social');
const tabSettings = document.getElementById('admin-tab-settings');
const btnTabProducts = document.getElementById('tab-btn-products');
const btnTabSocial = document.getElementById('tab-btn-social');
const btnTabSettings = document.getElementById('tab-btn-settings');

function openAdminAuth(e) {
    e.preventDefault();
    adminLoginModal.classList.remove('hidden');
    setTimeout(() => {
        adminLoginModal.classList.remove('opacity-0');
        document.body.classList.add('overflow-hidden');
    }, 10);
    document.getElementById('admin-password-input').value = '';
    document.getElementById('login-error').classList.add('hidden');
}

function closeAdminLogin() {
    adminLoginModal.classList.add('opacity-0');
    setTimeout(() => {
        adminLoginModal.classList.add('hidden');
        if(!adminModal.classList.contains('opacity-0') === false) {
             document.body.classList.remove('overflow-hidden');
        }
    }, 300);
}

document.getElementById('admin-login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const pass = document.getElementById('admin-password-input').value;
    if (pass === adminPassword) {
        closeAdminLogin();
        openAdminPanel();
    } else {
        document.getElementById('login-error').classList.remove('hidden');
    }
});

function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('ri-eye-off-line');
        icon.classList.add('ri-eye-line');
    } else {
        input.type = 'password';
        icon.classList.remove('ri-eye-line');
        icon.classList.add('ri-eye-off-line');
    }
}

function openAdminPanel() {
    adminModal.classList.remove('hidden');
    setTimeout(() => {
        adminModal.classList.remove('opacity-0');
        document.body.classList.add('overflow-hidden');
    }, 10);
    renderAdminProducts();
    renderAdminSocialLinks();
}

function closeAdminPanel() {
    adminModal.classList.add('opacity-0');
    setTimeout(() => {
        adminModal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }, 300);
}

function switchAdminTab(tab) {
    // Hide all
    tabProducts.classList.replace('block', 'hidden');
    tabSocial.classList.replace('block', 'hidden');
    tabSettings.classList.replace('block', 'hidden');
    
    // Reset buttons
    const activeClass = "w-full text-left px-5 py-4 bg-sage text-white rounded-xl font-bold shadow-md transition-all";
    const inactiveClass = "w-full text-left px-5 py-4 bg-white text-gray-700 hover:bg-gray-50 rounded-xl font-bold shadow-sm transition-all";
    
    btnTabProducts.className = inactiveClass;
    btnTabSocial.className = inactiveClass;
    btnTabSettings.className = inactiveClass;
    
    // Show selected
    if (tab === 'products') {
        tabProducts.classList.replace('hidden', 'block');
        btnTabProducts.className = activeClass;
    } else if (tab === 'social') {
        tabSocial.classList.replace('hidden', 'block');
        btnTabSocial.className = activeClass;
    } else if (tab === 'settings') {
        tabSettings.classList.replace('hidden', 'block');
        btnTabSettings.className = activeClass;
    }
}

// Admin Settings Password Logic
document.getElementById('admin-change-password-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newPass = document.getElementById('new-password-input').value;
    adminPassword = newPass;
    localStorage.setItem('pn_admin_pass', adminPassword);
    
    const successMsg = document.getElementById('password-success');
    successMsg.classList.remove('hidden');
    setTimeout(() => {
        successMsg.classList.add('hidden');
        document.getElementById('admin-change-password-form').reset();
    }, 3000);
});

// Admin Products
function renderAdminProducts() {
    const list = document.getElementById('admin-products-list');
    list.innerHTML = '';
    products.forEach(p => {
        list.innerHTML += `
            <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td class="p-4"><img src="${p.image}" class="w-12 h-12 object-cover rounded-md shadow-sm"></td>
                <td class="p-4 font-medium">${p.name}</td>
                <td class="p-4">${formatPrice(p.price)}</td>
                <td class="p-4">
                    <button onclick="openProductEditModal(${p.id})" class="text-blue-500 hover:text-blue-700 mr-3"><i class="ri-edit-2-line text-lg"></i></button>
                    <button onclick="deleteProduct(${p.id})" class="text-red-500 hover:text-red-700"><i class="ri-delete-bin-line text-lg"></i></button>
                </td>
            </tr>
        `;
    });
}

function openProductEditModal(id) {
    const form = document.getElementById('admin-product-form');
    if (id) {
        const p = products.find(x => x.id === id);
        document.getElementById('edit-modal-title').textContent = 'Edit Product';
        document.getElementById('edit-id').value = p.id;
        document.getElementById('edit-name').value = p.name;
        document.getElementById('edit-price').value = p.price;
        document.getElementById('edit-category').value = p.category;
        document.getElementById('edit-desc').value = p.desc;
        
        // Handle Image preview
        document.getElementById('edit-image-data').value = p.image || '';
        if(p.image) {
            document.getElementById('edit-image-preview').src = p.image;
            document.getElementById('edit-image-preview').classList.remove('hidden');
            document.getElementById('edit-image-placeholder').classList.add('hidden');
            document.getElementById('btn-remove-image').classList.remove('hidden');
        } else {
            removeUploadedImage();
        }
    } else {
        document.getElementById('edit-modal-title').textContent = 'Add New Product';
        form.reset();
        document.getElementById('edit-id').value = '';
        removeUploadedImage();
    }
    
    adminProductEditModal.classList.remove('hidden');
    setTimeout(() => {
        adminProductEditModal.classList.remove('opacity-0');
    }, 10);
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Str = e.target.result;
            document.getElementById('edit-image-data').value = base64Str;
            const preview = document.getElementById('edit-image-preview');
            preview.src = base64Str;
            preview.classList.remove('hidden');
            document.getElementById('edit-image-placeholder').classList.add('hidden');
            document.getElementById('btn-remove-image').classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

function removeUploadedImage() {
    document.getElementById('edit-image-data').value = '';
    document.getElementById('edit-image-file').value = '';
    const preview = document.getElementById('edit-image-preview');
    preview.src = '';
    preview.classList.add('hidden');
    document.getElementById('edit-image-placeholder').classList.remove('hidden');
    document.getElementById('btn-remove-image').classList.add('hidden');
}

function closeProductEditModal() {
    adminProductEditModal.classList.add('opacity-0');
    setTimeout(() => {
        adminProductEditModal.classList.add('hidden');
    }, 300);
}

document.getElementById('admin-product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const idVal = document.getElementById('edit-id').value;
    const pData = {
        name: document.getElementById('edit-name').value,
        price: parseInt(document.getElementById('edit-price').value),
        category: document.getElementById('edit-category').value,
        image: document.getElementById('edit-image-data').value || 'placeholder.jpg',
        desc: document.getElementById('edit-desc').value,
        rating: 5, reviews: 0, ingredients: ["Organic Ingredients"]
    };

    if (idVal) {
        // Edit existing
        const idx = products.findIndex(x => x.id == idVal);
        products[idx] = { ...products[idx], ...pData };
    } else {
        // Add new
        pData.id = Date.now(); // unique ID
        products.push(pData);
    }

    // Save & Re-render
    localStorage.setItem('pn_products', JSON.stringify(products));
    renderAdminProducts();
    renderProducts(); // Update public UI
    closeProductEditModal();
});

function deleteProduct(id) {
    if (confirm("Are you sure you want to delete this product?")) {
        products = products.filter(x => x.id !== id);
        localStorage.setItem('pn_products', JSON.stringify(products));
        renderAdminProducts();
        renderProducts();
    }
}

// Admin Social Links
function renderAdminSocialLinks() {
    const list = document.getElementById('admin-social-list');
    list.innerHTML = '';
    socialLinks.forEach(link => {
        list.innerHTML += `
            <div class="flex flex-col md:flex-row md:items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div class="flex items-center gap-3 w-40">
                    <input type="checkbox" id="social-active-${link.id}" ${link.active ? 'checked' : ''} class="w-5 h-5 text-sage rounded focus:ring-sage">
                    <label for="social-active-${link.id}" class="font-bold text-gray-700 flex items-center gap-2"><i class="${link.icon} text-xl"></i> ${link.name}</label>
                </div>
                <div class="flex-grow">
                    <input type="text" id="social-url-${link.id}" value="${link.url}" placeholder="https://${link.id}.com/yourpage" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                </div>
            </div>
        `;
    });
}

function saveSocialLinks() {
    socialLinks.forEach(link => {
        link.active = document.getElementById(`social-active-${link.id}`).checked;
        link.url = document.getElementById(`social-url-${link.id}`).value;
    });
    localStorage.setItem('pn_social', JSON.stringify(socialLinks));
    renderFooterSocialLinks();
    alert("Social links updated successfully!");
}

function renderFooterSocialLinks() {
    const container = document.getElementById('footer-social-links');
    if (!container) return;
    
    container.innerHTML = '';
    socialLinks.forEach(link => {
        if (link.active) {
            container.innerHTML += `
                <a href="${link.url}" target="_blank" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-sage hover:text-white transition-all shadow-sm">
                    <i class="${link.icon} text-xl"></i>
                </a>
            `;
        }
    });
}
