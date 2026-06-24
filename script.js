let cartItems = [];
let favItems = [];

function updateCartCount() {
    const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const badge = document.querySelector('.cart-badge');
    if(badge) { badge.textContent = totalQty; badge.style.opacity = totalQty > 0 ? '1' : '0'; }
}

function updateFavCount() {
    const totalQty = favItems.length;
    const badge = document.querySelector('.fav-badge');
    if(badge) { badge.textContent = totalQty; badge.style.opacity = totalQty > 0 ? '1' : '0'; }
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('cart-subtotal');
    const taxEl = document.getElementById('cart-tax');
    const totalEl = document.getElementById('cart-total');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (cartItems.length === 0) {
        container.innerHTML = '<div class="empty-state">Your cart is currently empty.</div>';
        subtotalEl.textContent = 'Rs. 0.00';
        taxEl.textContent = 'Rs. 0.00';
        totalEl.textContent = 'Rs. 0.00';
        return;
    }
    
    let subtotal = 0;
    
    cartItems.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        
        const row = document.createElement('div');
        row.className = 'sidebar-item';
        row.innerHTML = `
            <img src="${item.img}" class="sidebar-item-img" alt="${item.title}">
            <div class="sidebar-item-details">
                <h4 class="sidebar-item-title">${item.title}</h4>
                <p class="sidebar-item-desc">${item.desc}</p>
                <div class="sidebar-item-price-row">
                    <div class="sidebar-qty">
                        <button class="sidebar-qty-btn cart-minus" data-index="${index}">-</button>
                        <span class="sidebar-qty-val">${item.qty}</span>
                        <button class="sidebar-qty-btn cart-plus" data-index="${index}">+</button>
                    </div>
                    <span class="sidebar-item-price">Rs. ${itemTotal.toLocaleString('en-IN')}.00</span>
                    <button class="sidebar-del-btn cart-del" data-index="${index}">&#128465;</button>
                </div>
            </div>
        `;
        container.appendChild(row);
    });
    
    const tax = subtotal * 0.18;
    const grandTotal = subtotal + tax;
    
    subtotalEl.textContent = 'Rs. ' + subtotal.toLocaleString('en-IN') + '.00';
    taxEl.textContent = 'Rs. ' + tax.toLocaleString('en-IN') + '.00';
    totalEl.textContent = 'Rs. ' + grandTotal.toLocaleString('en-IN') + '.00';
    
    // Add event listeners to the generated buttons
    container.querySelectorAll('.cart-minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            if (cartItems[index].qty > 1) {
                cartItems[index].qty--;
            } else {
                cartItems.splice(index, 1);
            }
            updateCartCount();
            renderCart();
        });
    });
    
    container.querySelectorAll('.cart-plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            cartItems[index].qty++;
            updateCartCount();
            renderCart();
        });
    });
    
    container.querySelectorAll('.cart-del').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            cartItems.splice(index, 1);
            updateCartCount();
            renderCart();
        });
    });
}

function renderFav() {
    const container = document.getElementById('fav-items-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (favItems.length === 0) {
        container.innerHTML = '<div class="empty-state">Your favorites list is empty.</div>';
        return;
    }
    
    favItems.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'sidebar-item';
        row.innerHTML = `
            <img src="${item.img}" class="sidebar-item-img" alt="${item.title}">
            <div class="sidebar-item-details">
                <h4 class="sidebar-item-title">${item.title}</h4>
                <p class="sidebar-item-desc">${item.desc}</p>
                <div class="sidebar-item-price-row">
                    <button class="btn btn-reserve btn-sm add-from-fav" data-index="${index}" style="padding: 0.4rem 1rem; font-size: 0.8rem;">Add to Cart</button>
                    <button class="sidebar-del-btn fav-del" data-index="${index}">&#128465;</button>
                </div>
            </div>
        `;
        container.appendChild(row);
    });
    
    container.querySelectorAll('.fav-del').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            favItems.splice(index, 1);
            updateFavCount();
            renderFav();
        });
    });
    
    container.querySelectorAll('.add-from-fav').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            const item = favItems[index];
            const existing = cartItems.find(c => c.title === item.title);
            if (existing) {
                existing.qty++;
            } else {
                cartItems.push({...item, qty: 1});
            }
            updateCartCount();
            renderCart();
            showToast(item.title + ' added to cart!');
        });
    });
}

function toggleSidebar(id) {
    const sidebar = document.getElementById(id);
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    } else {
        sidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}
function showToast(msg) {
    const container = document.getElementById('toast-container');
    if(!container) return;
    const toast = document.createElement('div');
    toast.style.cssText = 'background:#fff; color:#2A2522; padding:1rem 1.5rem; border-radius:4px; border-left:3px solid #C9A86A; box-shadow:0 10px 30px rgba(0,0,0,0.1); opacity:0; transform:translateY(20px); transition:all 0.3s ease; font-family:var(--font-body); font-size:0.9rem;';
    toast.innerText = msg;
    container.appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }));
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {

    // Sidebar logic
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) {
        overlay.addEventListener('click', () => {
            document.querySelectorAll('.sidebar-drawer.open').forEach(d => d.classList.remove('open'));
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    const closeCart = document.getElementById('close-cart-btn');
    if (closeCart) closeCart.addEventListener('click', () => toggleSidebar('cart-sidebar'));
    
    const closeFav = document.getElementById('close-fav-btn');
    if (closeFav) closeFav.addEventListener('click', () => toggleSidebar('fav-sidebar'));
    
    const clearCart = document.getElementById('clear-cart-btn');
    if (clearCart) clearCart.addEventListener('click', () => { cartItems = []; updateCartCount(); renderCart(); });
    
    const clearFav = document.getElementById('clear-fav-btn');
    if (clearFav) clearFav.addEventListener('click', () => { favItems = []; updateFavCount(); renderFav(); });

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', () => {
        if (cartItems.length > 0) {
            showToast('Checkout flow initiated...');
            toggleSidebar('cart-sidebar');
        } else {
            showToast('Your cart is empty.');
        }
    });

    renderCart();
    renderFav();

    // Sticky Navigation
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for elegant scroll reveals
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);



    // Observe other elements
    const elementsToAnimate = document.querySelectorAll('.editorial-layout, .banner-content, .about-layout, .testimonial-card, .timeline-container, .features-grid, .faq-container');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-up');
        observer.observe(el);
    });

    // Hero Slider
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length > 0) {
        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        }

        function nextSlide() {
            let nextIndex = (currentSlide + 1) % slides.length;
            showSlide(nextIndex);
        }

        function prevSlide() {
            let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(prevIndex);
        }

        function startSlideTimer() {
            slideInterval = setInterval(nextSlide, 5000);
        }

        function resetSlideTimer() {
            clearInterval(slideInterval);
            startSlideTimer();
        }

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetSlideTimer();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetSlideTimer();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                resetSlideTimer();
            });
        });

        startSlideTimer();
    }

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            question.classList.toggle('active');
            const answer = question.nextElementSibling;
            
            if (question.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = 0;
            }
        });
    });
    // Category Navigation (Smooth Scroll)
    const filterBtns = document.querySelectorAll('.filter-btn');
    const navbarHeight = document.getElementById('navbar').offsetHeight;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                // Smooth scroll to target section, accounting for fixed navbar
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Optional: Update active button on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = ['cakes', 'sundaes', 'cupcakes', 'cookies', 'minidonuts'];
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                if (pageYOffset >= sectionTop - navbarHeight - 150) {
                    current = sectionId;
                }
            }
        });

        filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-target') === current) {
                btn.classList.add('active');
            }
        });
    });

    // Like button toggle
    const likeIcons = document.querySelectorAll('.like-icon');
    likeIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const gridItem = icon.closest('.grid-item');
            if (!gridItem) return;
            
            const title = gridItem.querySelector('.card-title').textContent;
            const desc = gridItem.querySelector('.card-desc').textContent;
            const img = gridItem.querySelector('img').src;
            const price = 2400;

            icon.classList.toggle('liked');
            if (icon.classList.contains('liked')) {
                icon.style.fill = 'var(--color-accent-gold)';
                icon.style.color = 'var(--color-accent-gold)';
                
                if (!favItems.find(f => f.title === title)) {
                    favItems.push({ title, desc, img, price });
                    updateFavCount();
                    renderFav();
                }
                showToast('Added to favorites!');
            } else {
                icon.style.fill = 'none';
                icon.style.color = '#fff';
                
                favItems = favItems.filter(f => f.title !== title);
                updateFavCount();
                renderFav();
                showToast('Removed from favorites.');
            }
        });
    });

    // Add to cart button feedback
    const addBtns = document.querySelectorAll('.add-btn');
    addBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const gridItem = btn.closest('.grid-item');
            if (gridItem) {
                const title = gridItem.querySelector('.card-title').textContent;
                const desc = gridItem.querySelector('.card-desc').textContent;
                const img = gridItem.querySelector('img').src;
                const price = 2400;
                
                const existing = cartItems.find(c => c.title === title);
                if (existing) {
                    existing.qty++;
                } else {
                    cartItems.push({ title, desc, img, price, qty: 1 });
                }
                updateCartCount();
                renderCart();
            }

            const originalText = btn.textContent;
            btn.textContent = 'Added!';
            btn.style.backgroundColor = 'var(--color-accent-gold)';
            btn.style.color = '#fff';
            showToast('Added to your cart!');
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
                btn.style.color = '';
            }, 2000);
        });
    });
    // Product Modal Logic
    const modal = document.getElementById('product-modal');
    const modalClose = document.getElementById('modal-close');
    const gridItems = document.querySelectorAll('.grid-item');
    
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');
    const qtyDisplay = document.getElementById('qty-display');
    const modalPrice = document.getElementById('modal-price');
    
    const basePrice = 2400; // Placeholder price
    let currentQty = 1;

    function updateModalPrice() {
        const total = basePrice * currentQty;
        const formattedTotal = 'Rs. ' + total.toLocaleString('en-IN') + '.00';
        modalPrice.textContent = formattedTotal;
    }

    gridItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Prevent opening modal if clicking like or add-to-cart buttons
            if (e.target.closest('.like-icon') || e.target.closest('.add-btn')) {
                return;
            }
            
            const img = item.querySelector('img').src;
            const title = item.querySelector('.card-title').textContent;
            const desc = item.querySelector('.card-desc').textContent;
            
            modalImg.src = img;
            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            
            // Reset quantity
            currentQty = 1;
            qtyDisplay.textContent = currentQty;
            updateModalPrice();
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    qtyMinus.addEventListener('click', () => {
        if (currentQty > 1) {
            currentQty--;
            qtyDisplay.textContent = currentQty;
            updateModalPrice();
        }
    });

    qtyPlus.addEventListener('click', () => {
        currentQty++;
        qtyDisplay.textContent = currentQty;
        updateModalPrice();
    });

    const modalAddBtn = document.getElementById('modal-add-btn');
    if (modalAddBtn) {
        modalAddBtn.addEventListener('click', function() {
            const originalText = this.textContent;
            this.textContent = 'Added!';
            this.style.backgroundColor = 'var(--color-accent-gold)';
            this.style.color = '#fff';
            
            const title = document.getElementById('modal-title').textContent;
            const desc = document.getElementById('modal-desc').textContent;
            const img = document.getElementById('modal-img').src;
            const price = 2400;
            
            const existing = cartItems.find(c => c.title === title);
            if (existing) {
                existing.qty += currentQty;
            } else {
                cartItems.push({ title, desc, img, price, qty: currentQty });
            }
            updateCartCount();
            renderCart();
            showToast('Added ' + currentQty + ' item(s) to your cart!');
            document.getElementById('product-modal').classList.remove('active'); // Close modal

            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '';
                this.style.color = '';
            }, 2000);
        });
    }

    // Product Slider Logic
    const sliderWrappers = document.querySelectorAll('.slider-wrapper');
    sliderWrappers.forEach(wrapper => {
        const prevBtn = wrapper.querySelector('.slider-btn.prev');
        const nextBtn = wrapper.querySelector('.slider-btn.next');
        const container = wrapper.querySelector('.grid-container');

        if (prevBtn && nextBtn && container) {
            prevBtn.addEventListener('click', () => {
                // Scroll by width of one item + gap, roughly 25% of the container for desktop
                const item = container.querySelector('.grid-item');
                const scrollAmount = item ? item.offsetWidth + 32 : container.clientWidth / 2;
                container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });

            nextBtn.addEventListener('click', () => {
                const item = container.querySelector('.grid-item');
                const scrollAmount = item ? item.offsetWidth + 32 : container.clientWidth / 2;
                container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }
    });

    const favNav = document.querySelector('.nav-icon[aria-label="Favorites"]');
    if(favNav) favNav.addEventListener('click', e => { e.preventDefault(); toggleSidebar('fav-sidebar'); });
    const cartNav = document.querySelector('.nav-icon[aria-label="Cart"]');
    if(cartNav) cartNav.addEventListener('click', e => { e.preventDefault(); toggleSidebar('cart-sidebar'); });

});
