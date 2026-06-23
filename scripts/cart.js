const CART_KEY = 'gameDistrictCart';

const productCatalog = {
  'shadow-odyssey': {
    id: 'shadow-odyssey',
    name: 'Shadow Odyssey',
    price: 49.99,
    category: 'Aventura',
    image: 'https://images.unsplash.com/photo-1511512578047-c4d35587a80d?auto=format&fit=crop&w=800&q=80',
    details: [
      'Modo campaña de 40+ horas',
      'Resolución 4K compatible',
      'Soporte para gamepads y teclado',
      'Plataforma: PC',
    ],
  },
  'neon-frontier': {
    id: 'neon-frontier',
    name: 'Neon Frontier',
    price: 44.99,
    category: 'RPG',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    details: [
      'Exploración ciudad futurista',
      'Sistema de progresión profundo',
      'Misiones de facción y botín',
      'Plataforma: PC',
    ],
  },
  'galaxy-arena': {
    id: 'galaxy-arena',
    name: 'Galaxy Arena',
    price: 29.99,
    category: 'Multijugador',
    image: 'https://images.unsplash.com/photo-1513601461810-5a613bfb0b88?auto=format&fit=crop&w=800&q=80',
    details: [
      'Combates PvP rápidos',
      'Armas y skins personalizables',
      'Rankings globales',
      'Plataforma: PC',
    ],
  },
  'pixel-pulse': {
    id: 'pixel-pulse',
    name: 'Pixel Pulse',
    price: 19.99,
    category: 'Indie',
    image: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=800&q=80',
    details: [
      'Estilo retro con ritmo dinámico',
      'Niveles desbloqueables',
      'Banda sonora sintetizada',
      'Plataforma: PC',
    ],
  },
};

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  const cart = getCart();
  const quantity = cart.reduce((total, item) => total + item.quantity, 0);

  if (badge) {
    badge.textContent = quantity;
    badge.classList.toggle('has-items', quantity > 0);
  }
}

let currentModalProductId = null;

function openProductModal(productId) {
  const product = productCatalog[productId];
  if (!product) {
    return;
  }

  currentModalProductId = productId;
  const modal = document.getElementById('product-modal');
  if (!modal) {
    return;
  }

  modal.querySelector('.modal-title').textContent = product.name;
  modal.querySelector('.modal-category').textContent = product.category;
  modal.querySelector('.modal-price').textContent = formatCurrency(product.price);
  modal.querySelector('.modal-image img').src = product.image;
  modal.querySelector('.modal-image img').alt = `Imagen del juego ${product.name}`;
  modal.querySelector('.modal-description').textContent = product.details[0] || '';

  const specsList = modal.querySelector('.modal-specs');
  specsList.innerHTML = product.details
    .map((spec) => `<li>${spec}</li>`)
    .join('');

  modal.classList.remove('hidden');
  modal.classList.add('active');
}

function closeProductModal() {
  const modal = document.getElementById('product-modal');
  if (!modal) {
    return;
  }

  modal.classList.add('hidden');
  modal.classList.remove('active');
  currentModalProductId = null;
}

function addItemToCart(productId) {
  const product = productCatalog[productId];
  if (!product) {
    return;
  }

  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  showCartBanner('Juego agregado al carrito');
}

function clearCart() {
  saveCart([]);
}

function renderCartPage() {
  const cartList = document.getElementById('cart-list');
  const totalAmount = document.getElementById('cart-total');
  const totalItems = document.getElementById('cart-count');
  const emptyNote = document.getElementById('cart-empty-note');

  if (!cartList || !totalAmount || !totalItems) {
    return;
  }

  const cart = getCart();
  cartList.innerHTML = '';

  if (cart.length === 0) {
    if (emptyNote) {
      emptyNote.classList.remove('hidden');
    }

    cartList.innerHTML = '<div class="empty-cart"><h3>Tu carrito está vacío</h3><p>Añade juegos desde el catálogo para verlos aquí.</p><a class="button button-secondary" href="productos.html">Ir al catálogo</a></div>';
    totalAmount.textContent = formatCurrency(0);
    totalItems.textContent = '0';
    return;
  }

  if (emptyNote) {
    emptyNote.classList.add('hidden');
  }

  cart.forEach((item) => {
    const product = document.createElement('article');
    product.className = 'cart-item';
    product.innerHTML = `
      <div>
        <span class="badge badge-soft">${item.category}</span>
        <h3>${item.name}</h3>
        <p>${item.quantity} × ${formatCurrency(item.price)}</p>
      </div>
      <div class="cart-item-actions">
        <span class="cart-item-total">${formatCurrency(item.price * item.quantity)}</span>
        <button class="button button-secondary button-sm" type="button" data-remove-item="${item.id}">Eliminar</button>
      </div>
    `;
    cartList.appendChild(product);
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalAmount.textContent = formatCurrency(total);
  totalItems.textContent = String(cart.reduce((sum, item) => sum + item.quantity, 0));
}

function initAddToCartButtons() {
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-show-product]');
    if (!trigger) {
      return;
    }

    event.preventDefault();
    const productId = trigger.dataset.productId;
    openProductModal(productId);
  });
}

function initProductModalActions() {
  const modal = document.getElementById('product-modal');
  const buyButton = document.getElementById('modal-buy-button');
  const cancelButton = document.getElementById('modal-cancel-button');

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal || event.target.closest('[data-modal-close]')) {
        closeProductModal();
      }
    });
  }

  if (buyButton) {
    buyButton.addEventListener('click', () => {
      if (!currentModalProductId) {
        return;
      }
      addItemToCart(currentModalProductId);
      closeProductModal();
      showCartBanner('Juego agregado al carrito');
    });
  }

  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      closeProductModal();
    });
  }
}

function initCartButtons() {
  const confirmButton = document.getElementById('confirm-purchase');
  const cancelButton = document.getElementById('cancel-purchase');

  if (confirmButton) {
    confirmButton.addEventListener('click', () => {
      const cart = getCart();
      if (cart.length === 0) {
        showCartBanner('No tienes productos en el carrito.', 'warning');
        return;
      }
      clearCart();
      renderCartPage();
      showThankYouModal();
    });
  }

  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      const cart = getCart();
      if (cart.length === 0) {
        showCartBanner('El carrito ya está vacío.', 'warning');
        return;
      }
      clearCart();
      renderCartPage();
      showCartBanner('Compra cancelada y carrito vaciado.', 'warning');
    });
  }
}

function initRemoveItemButtons() {
  document.addEventListener('click', (event) => {
    const removeButton = event.target.closest('[data-remove-item]');
    if (!removeButton) {
      return;
    }

    const productId = removeButton.dataset.removeItem;
    const cart = getCart().filter((item) => item.id !== productId);
    saveCart(cart);
    renderCartPage();
    showCartBanner('Producto eliminado del carrito.', 'warning');
  });
}

function showCartBanner(message, type = 'success') {
  const banner = document.getElementById('cart-banner');
  if (!banner) {
    return;
  }

  banner.textContent = message;
  banner.className = `message-banner ${type}`;
  banner.classList.remove('hidden');

  window.clearTimeout(window.cartBannerTimeout);
  window.cartBannerTimeout = window.setTimeout(() => {
    banner.classList.add('hidden');
  }, 2800);
}

function showThankYouModal() {
  const modal = document.getElementById('thank-you-modal');
  if (!modal) {
    return;
  }

  modal.classList.remove('hidden');
  modal.classList.add('visible');

  window.clearTimeout(window.thankModalTimeout);
  window.thankModalTimeout = window.setTimeout(() => {
    modal.classList.add('animate');
  }, 20);

  window.clearTimeout(window.closeThankModalTimeout);
  window.closeThankModalTimeout = window.setTimeout(() => {
    closeThankYouModal();
  }, 3200);
}

function closeThankYouModal() {
  const modal = document.getElementById('thank-you-modal');
  if (!modal) {
    return;
  }

  modal.classList.add('hidden');
  modal.classList.remove('visible', 'animate');
}

function initCartPage() {
  updateCartBadge();
  initAddToCartButtons();
  initProductModalActions();
  initCartButtons();
  initRemoveItemButtons();
  renderCartPage();
}

document.addEventListener('DOMContentLoaded', initCartPage);
