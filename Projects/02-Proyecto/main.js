
/*----- VISIBILITY DE USER MENU -----*/
const userIcon = document.querySelector('.user__icon');
const userMenu = document.getElementById('user-menu');

userIcon.addEventListener('click', (e) => {
    e.stopPropagation(); // Evita que el clic se propague y cierre el menú de inmediato
    userMenu.classList.toggle('show');
});

// Cerrar el menú al hacer clic fuera
document.addEventListener('click', (e) => {
    if (!document.getElementById('user-container').contains(e.target)) {
        userMenu.classList.remove('show');
    }
});

window.addEventListener('scroll', () => {
    if (userMenu.classList.contains('show')) {
        userMenu.classList.remove('show');
    }
});




// EVENTOS PARA EL PANEL LATERAL DEL CARRITO DE COMPRAS
document.addEventListener('DOMContentLoaded', () => {
    const isUserLoggedIn = () => !!localStorage.getItem('loggedInUser');


    const productsData = {
        "Coffee beans": { pricePerKg: 70000, stockKg: 1000 },
        "Ground coffee": { pricePerKg: 62000, stockKg: 500 }
    };

    const cartToggle = document.getElementById('cart-container');
    const cartPanel = document.getElementById('cart-panel');
    const cartOverlay = document.getElementById('overlay');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartCount = document.getElementById('cart-count');
    const cartContentContainer = document.getElementById('grid-shopping-cart-products');
    const cartFooterTotal = document.querySelector('#cart-panel .cart__footer strong + span');
    const emptyCartBtn = document.getElementById('empty-cart-btn');
    const checkoutBtn = document.querySelector('.checkout__btn');
    const body = document.body;

    // Estructura carrito: { "Producto|kg": { productName, quantity, kgPerUnit, pricePerKg } }
    let cart = {};

    const openCart = () => {
        cartPanel.classList.add("open");
        cartOverlay.classList.add("show");
        body.classList.add("no-scroll");
        cartToggle.setAttribute('aria-expanded', 'true');
    };
    const closeCart = () => {
        cartPanel.classList.remove("open");
        cartOverlay.classList.remove("show");
        body.classList.remove("no-scroll");
        cartToggle.setAttribute('aria-expanded', 'false');
    };

    const loadCart = () => {
        const savedCart = localStorage.getItem('cart');
        cart = savedCart ? JSON.parse(savedCart) : {};
    };
    const saveCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    const updateCartCount = () => {
        const totalItems = Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);
        cartCount.textContent = totalItems;
    };

    const updateCartTotal = () => {
        const total = Object.values(cart).reduce(
        (acc, item) => acc + item.quantity * item.kgPerUnit * item.pricePerKg,
        0
        );
        cartFooterTotal.textContent = `$${total.toLocaleString('es-CO')},00 COP`;
    };

    const getProductImage = (name) => {
        const images = {
        'coffee beans': '/Proyectos/01-Proyecto-ecocafe/assets/img/coffee-beans.jpg',
        'ground coffee': '/Proyectos/01-Proyecto-ecocafe/assets/img/cup-of-coffee.jpeg'
        };
        return images[name.toLowerCase()] || '';
    };

    const renderCart = () => {
        cartContentContainer.innerHTML = '';

        if (Object.keys(cart).length === 0) {
        cartContentContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
        updateCartCount();
        updateCartTotal();
        return;
        }

        for (const key in cart) {
        const item = cart[key];
        const productDiv = document.createElement('div');
        productDiv.classList.add('cart__content');
        productDiv.setAttribute('role', 'region');
        productDiv.setAttribute('aria-label', `Producto en carrito: ${item.productName}, presentación ${item.kgPerUnit} kg`);

        productDiv.innerHTML = `
            <img src="${getProductImage(item.productName)}" alt="Imagen del producto ${item.productName}" />
            <div class="container__item--info">
            <div class="item__info">
                <strong>${item.productName}</strong>
                <p>Presentación en kg: <strong>${item.kgPerUnit} kg</strong></p>
                <p>Unidades: <strong>${item.quantity}</strong></p>
                <div class="item__quantity--control" aria-label="Controles de cantidad para ${item.productName}">
                <button aria-label="Disminuir cantidad" data-key="${key}" class="btn-decrease">-</button>
                <span aria-live="polite" aria-atomic="true">${item.quantity}</span>
                <button aria-label="Aumentar cantidad" data-key="${key}" class="btn-increase">+</button>
                </div>
            </div>
            <p class="item__total" aria-label="Total por producto">$${(item.pricePerKg * item.kgPerUnit * item.quantity).toLocaleString('es-CO')},00 COP</p>
            </div>
            <button class="remove-item" aria-label="Eliminar producto ${item.productName} presentación ${item.kgPerUnit} kg" data-key="${key}">&times;</button>
        `;

        cartContentContainer.appendChild(productDiv);
        }

        // Eventos botones cantidad y eliminar
        cartContentContainer.querySelectorAll('.btn-decrease').forEach(btn => {
        btn.addEventListener('click', () => adjustQuantity(btn.dataset.key, -1));
        });
        cartContentContainer.querySelectorAll('.btn-increase').forEach(btn => {
        btn.addEventListener('click', () => adjustQuantity(btn.dataset.key, 1));
        });
        cartContentContainer.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => removeItem(btn.dataset.key));
        });

        updateCartCount();
        updateCartTotal();
    };

    // Ajustar cantidad con clave compuesta (producto|kg)
    const adjustQuantity = (key, delta) => {
        if (!cart[key]) return;

        const item = cart[key];
        const newQty = item.quantity + delta;
        if (newQty < 1) {
        delete cart[key];
        } else {
        const totalKgAfter = newQty * item.kgPerUnit;

        // Calcular stock total para ese producto sumando todos los kg de ese producto con distintas presentaciones
        const totalKgInCartForProduct = Object.entries(cart).reduce((acc, [k, v]) => {
            if (v.productName === item.productName && k !== key) {
            return acc + v.quantity * v.kgPerUnit;
            }
            return acc;
        }, 0);

        if (totalKgInCartForProduct + totalKgAfter <= productsData[item.productName].stockKg) {
            item.quantity = newQty;
        } else {
            alert(`Stock insuficiente para ${item.productName}. Stock disponible: ${productsData[item.productName].stockKg - totalKgInCartForProduct} kg.`);
            return;
        }
        }

        saveCart();
        renderCart();
    };

    // Remover item por clave compuesta
    const removeItem = (key) => {
        if (cart[key]) {
        delete cart[key];
        saveCart();
        renderCart();
        }
    };

    // Listeners en productos
    const addProductListeners = () => {
        document.querySelectorAll('.product__card').forEach(card => {
        const btnAdd = card.querySelector('.btn__add--product');
        const productName = card.querySelector('.product__card--title').textContent.trim();
        const quantityInput = card.querySelector('.quantity__input');
        const btnIncrease = card.querySelector('.btn__increase');
        const btnDecrease = card.querySelector('.btn__decrease');
        const priceDisplay = card.querySelector('.container__price--purchase span');
        const kiloButtons = card.querySelectorAll('.product__list--item');

        let selectedKg = 1;
        const pricePerKg = productsData[productName].pricePerKg;

        kiloButtons.forEach((btn, i) => {
            if (i === 0) btn.classList.add('active');
        });
        priceDisplay.textContent = `$${(pricePerKg * selectedKg).toLocaleString('es-CO')},00 COP`;

        kiloButtons.forEach(btn => {
            btn.addEventListener('click', () => {
            kiloButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedKg = parseInt(btn.getAttribute('data-kilo'), 10);
            updatePrice();
            });
        });

        btnIncrease.addEventListener('click', () => {
            let qty = parseInt(quantityInput.value);
            const totalKgAfter = (qty + 1) * selectedKg;
            if (totalKgAfter <= productsData[productName].stockKg) {
            quantityInput.value = qty + 1;
            updatePrice();
            } else {
            alert(`No hay suficiente stock para ${productName} con esta presentación.`);
            }
        });

        btnDecrease.addEventListener('click', () => {
            let qty = parseInt(quantityInput.value);
            if (qty > 1) {
            quantityInput.value = qty - 1;
            updatePrice();
            }
        });

        const updatePrice = () => {
            const qty = parseInt(quantityInput.value);
            const totalPrice = pricePerKg * selectedKg * qty;
            priceDisplay.textContent = `$${totalPrice.toLocaleString('es-CO')},00 COP`;
        };

        btnAdd.addEventListener('click', () => {
            if (!isUserLoggedIn()) {
            alert('Para agregar productos al carrito debes iniciar sesión.');
            return;
            }
            const qty = parseInt(quantityInput.value);
            const key = `${productName}|${selectedKg}`;

            // Calcular total kg en carrito para este producto sin contar esta presentación
            let totalKgOtherPresentations = Object.entries(cart).reduce((acc, [k, v]) => {
            if (v.productName === productName && k !== key) {
                return acc + v.quantity * v.kgPerUnit;
            }
            return acc;
            }, 0);

            const newTotalKgForThisKey = (cart[key] ? cart[key].quantity : 0) * selectedKg + qty * selectedKg;

            if (totalKgOtherPresentations + newTotalKgForThisKey > productsData[productName].stockKg) {
            alert(`No hay suficiente stock para ${productName}. Stock disponible: ${productsData[productName].stockKg - totalKgOtherPresentations} kg.`);
            return;
            }

            if (cart[key]) {
            cart[key].quantity += qty;
            } else {
            cart[key] = {
                productName,
                quantity: qty,
                kgPerUnit: selectedKg,
                pricePerKg
            };
            }

            saveCart();
            renderCart();
            openCart();
        });
        });
    };

    emptyCartBtn.addEventListener('click', () => {
        cart = {};
        saveCart();
        renderCart();
    });

    checkoutBtn.addEventListener('click', () => {
        if (!isUserLoggedIn()) {
        alert('Debes iniciar sesión para realizar la compra.');
        return;
        }
        if (Object.keys(cart).length === 0) {
        alert('El carrito está vacío.');
        return;
        }
        alert('Compra realizada con éxito. Gracias por tu compra.');
        cart = {};
        saveCart();
        renderCart();
        closeCart();
    });

    cartToggle.addEventListener('click', () => {
        openCart();
    });
    closeCartBtn.addEventListener('click', () => {
        closeCart();
    });
    cartOverlay.addEventListener('click', () => {
        closeCart();
    });

    loadCart();
    renderCart();
    addProductListeners();
});








document.addEventListener('DOMContentLoaded', () => {
    const kiloButtons = document.querySelectorAll('.product__list--item');
    const decreaseBtn = document.querySelector('.btn__decrease');
    const increaseBtn = document.querySelector('.btn__increase');
    const quantityInput = document.querySelector('.quantity__input');
    const priceDisplay = document.querySelector('.container__price--purchase span');
    const addToCartBtn = document.querySelector('.btn__add--product');

    const pricePerKg = 70000; // Valor base por kg
    let selectedKg = 1; // valor por defecto
    let quantity = 1;

    // Resalta el botón activo y actualiza selectedKg
    kiloButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            kiloButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedKg = parseInt(btn.getAttribute('data-kilo'));
            updatePrice();
        });
    });

    decreaseBtn.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            quantityInput.value = quantity;
            updatePrice();
        }
    });

    increaseBtn.addEventListener('click', () => {
        quantity++;
        quantityInput.value = quantity;
        updatePrice();
    });

    const updatePrice = () => {
        const totalKg = selectedKg * quantity;
        const totalPrice = totalKg * pricePerKg;
        priceDisplay.textContent = `$${totalPrice.toLocaleString('es-CO')}`;
    };

    addToCartBtn.addEventListener('click', () => {
        const totalKg = selectedKg * quantity;
        const totalPrice = totalKg * pricePerKg;
        const product = {
            name: "Coffee beans",
            kilos: totalKg,
            price: totalPrice
        };

        // Aquí puedes guardar en localStorage o enviarlo al carrito:
        console.log("Producto agregado:", product);
        alert(`Agregado al carrito: ${totalKg}kg - $${totalPrice.toLocaleString('es-CO')}`);
    });

    // Inicializa al cargar
    kiloButtons[0].click(); // Marca por defecto 1kg
});


// Show logged-in user's first name and handle auth-related UI
document.addEventListener("DOMContentLoaded", () => {
    const greeting = document.getElementById("user-greeting");
    const loginLink = document.querySelector('a[href*="/Proyectos/01-Proyecto-ecocafe/page 2/login.html"]');
    const registerLink = document.querySelector('a[href*="/Proyectos/01-Proyecto-ecocafe/page 2/register.html"]');
    const logoutBtn = document.getElementById("logout-btn");

    const users = JSON.parse(localStorage.getItem("users") || "{}");
    const loggedInEmail = localStorage.getItem("loggedInUser");
    const userMenu = document.getElementById("user-menu");

    if (loggedInEmail && users[loggedInEmail]) {
        const user = users[loggedInEmail];
        const firstName = user.name.split(" ")[0];
        greeting.textContent = `${firstName}`;

        loginLink.style.display = "none";
        registerLink.style.display = "none";
        logoutBtn.style.display = "block";
    } else {
        greeting.textContent = "";
        loginLink.style.display = "block";
        registerLink.style.display = "block";
        logoutBtn.style.display = "none";
    }

    logoutBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("loggedInUser");
        location.reload();
    });

    if (loggedInEmail) {
        userMenu.innerHTML = `
            <a href="#" id="logout-link">Cerrar sesión</a>
        `;

        document.getElementById("logout-link").addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("loggedInUser");
            window.location.reload();
        });
    } else {
        userMenu.innerHTML = `
            <a href="/Proyectos/01-Proyecto-ecocafe/page 2/login.html">Iniciar sesión</a>
            <a href="/Proyectos/01-Proyecto-ecocafe/page 2/register.html">Registrarse</a>
        `;
    }
});



// EVENTO PARA ITEM DE CANTIDAD DE PRODUCTO
const items = document.querySelectorAll('.product__list--item');

items.forEach(item => {
    item.addEventListener('click', () => {
        items.forEach(el => el.classList.remove('activo')); // Quita la clase a todos
        item.classList.add('activo'); // Agrega la clase al clicado
    });
});



// CONTADOR INPUT NUMERICO PERSONALIZADO.
document.addEventListener("DOMContentLoaded", () => {
    const decreaseBtn = document.querySelector(".btn__decrease");
    const increaseBtn = document.querySelector(".btn__increase");
    const quantityInput = document.querySelector(".quantity__input");

    decreaseBtn.addEventListener("click", () => {
        let value = parseInt(quantityInput.value, 10);
        if (value > 1) {
        quantityInput.value = value - 1;
        }
    });

    increaseBtn.addEventListener("click", () => {
        let value = parseInt(quantityInput.value, 10);
        quantityInput.value = value + 1;
    });
});
