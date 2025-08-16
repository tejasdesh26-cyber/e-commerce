// Main frontend logic for the static demo
(function(){
  // utility
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // Cart in localStorage
  function getCart(){ return JSON.parse(localStorage.getItem('cart')||'[]'); }
  function saveCart(cart){ localStorage.setItem('cart', JSON.stringify(cart)); }
  function addToCart(id, qty=1){
    const cart = getCart();
    const found = cart.find(i=>i.id===id);
    if(found) found.qty += qty; else cart.push({id, qty});
    saveCart(cart); updateCartCount();
  }
  function updateCartCount(){
    const count = getCart().reduce((s,i)=>s+i.qty,0);
    $$('.cart-btn').forEach(el=>{ const span = el.querySelector('#cartCount'); if(span) span.textContent = count; });
    const c = document.getElementById('cartCount'); if(c) c.textContent = count;
  }

  // render product list
  function renderProducts(list){
    const grid = document.getElementById('productsGrid');
    if(!grid) return;
    grid.innerHTML = list.map(p=>`
      <div class="card product-card">
        <img class="product-image" src="${p.images[0].url}" alt="${p.title}">
        <div class="product-title">${p.title}</div>
        <div class="product-price">$${p.price.toFixed(2)}</div>
        <div style="flex:1;color:var(--muted);font-size:13px;margin:8px 0">${p.description}</div>
        <div style="display:flex;gap:8px">
          <a class="btn" href="product.html?id=${p._id}">View</a>
          <button class="add-to-cart-btn" data-id="${p._id}">Add</button>
        </div>
      </div>`).join('');
  }

  function loadAllProducts(){ renderProducts(PRODUCTS); }

  // search and category
  document.addEventListener('click', e=>{
    if(e.target.matches('#searchBtn')){
      const q = document.getElementById('searchInput').value.trim().toLowerCase();
      const filtered = PRODUCTS.filter(p=>p.title.toLowerCase().includes(q)||p.description.toLowerCase().includes(q));
      renderProducts(filtered);
    }
    if(e.target.matches('.nav-list a')){
      e.preventDefault();
      const cat = e.target.dataset.category;
      if(cat==='all') renderProducts(PRODUCTS);
      else renderProducts(PRODUCTS.filter(p=>p.category===cat));
    }
    if(e.target.matches('.add-to-cart-btn')){
      const id = e.target.dataset.id;
      addToCart(id,1);
      alert('Added to cart');
    }
  });

  // product details page
  function loadProductDetails(){
    const el = document.getElementById('productDetails');
    if(!el) return;
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const p = PRODUCTS.find(x=>x._id===id);
    if(!p){ el.innerHTML='<p>Product not found</p>'; return; }
    el.innerHTML = `
      <div style="display:flex;gap:20px;flex-wrap:wrap">
        <div style="flex:1;min-width:260px"><img class="main-image" src="${p.images[0].url}" alt="${p.title}"></div>
        <div style="flex:1;min-width:260px">
          <h2>${p.title}</h2>
          <div class="product-price">$${p.price.toFixed(2)}</div>
          <p style="color:var(--muted)">${p.description}</p>
          <div class="quantity">
            <label>Qty</label>
            <input id="qty" type="number" value="1" min="1">
          </div>
          <div style="margin-top:12px">
            <button id="buyAdd" class="add-to-cart-btn" data-id="${p._id}">Add to cart</button>
          </div>
        </div>
      </div>
    `;
  }

  // cart page render
  function renderCartPage(){
    const el = document.getElementById('cartItems');
    if(!el) return;
    const cart = getCart();
    if(cart.length===0){ el.innerHTML='<p>Your cart is empty</p>'; document.getElementById('subtotalVal').textContent='$0.00'; document.getElementById('totalVal').textContent='$0.00'; return; }
    let subtotal=0;
    el.innerHTML = cart.map(item=>{
      const p = PRODUCTS.find(x=>x._id===item.id);
      const line = p.price*item.qty; subtotal+=line;
      return `<div class="cart-item"><img src="${p.images[0].url}" alt="${p.title}"><div><div class="item-title">${p.title}</div><div>$${p.price.toFixed(2)} x ${item.qty}</div><div style="margin-top:8px"><button class="btn decr" data-id="${item.id}">-</button><button class="btn incr" data-id="${item.id}">+</button><button class="btn" data-id="${item.id}" style="margin-left:8px">Remove</button></div></div></div>`;
    }).join('');
    const shipping = subtotal>50?0:5;
    const total = subtotal+shipping;
    document.getElementById('subtotalVal').textContent=`$${subtotal.toFixed(2)}`;
    document.getElementById('shippingVal').textContent=`$${shipping.toFixed(2)}`;
    document.getElementById('totalVal').textContent=`$${total.toFixed(2)}`;
  }

  // cart interactions
  document.addEventListener('click', e=>{
    if(e.target.matches('.incr')){
      const id = e.target.dataset.id; const cart = getCart(); const it = cart.find(x=>x.id===id); if(it){ it.qty++; saveCart(cart); renderCartPage(); updateCartCount(); }
    }
    if(e.target.matches('.decr')){
      const id = e.target.dataset.id; const cart = getCart(); const it = cart.find(x=>x.id===id); if(it){ it.qty=Math.max(1,it.qty-1); saveCart(cart); renderCartPage(); updateCartCount(); }
    }
    if(e.target.matches('.cart-items .btn') && e.target.textContent.trim()==='Remove'){
      const id = e.target.dataset.id; let cart = getCart(); cart = cart.filter(x=>x.id!==id); saveCart(cart); renderCartPage(); updateCartCount();
    }
    if(e.target.matches('#buyAdd')){
      const id = e.target.dataset.id; const qty = parseInt(document.getElementById('qty').value||'1'); addToCart(id,qty); alert('Added to cart'); }
  });

  // checkout form
  document.addEventListener('submit', e=>{
    if(e.target.matches('#checkoutForm')){
      e.preventDefault();
      const cart = getCart(); if(cart.length===0){ alert('Cart empty'); return; }
      const order = { id: Date.now(), name: document.getElementById('fullName').value, address: document.getElementById('address').value, total: document.getElementById('totalVal').textContent };
      localStorage.setItem('lastOrder', JSON.stringify(order));
      localStorage.removeItem('cart');
      renderCartPage(); updateCartCount();
      document.getElementById('checkoutForm').style.display='none';
      const placed = document.getElementById('orderPlaced'); placed.style.display='block';
      document.getElementById('orderSummary').textContent = `Order #${order.id} • ${order.total}`;
    }
    if(e.target.matches('#loginForm')){
      e.preventDefault();
      localStorage.setItem('user', document.getElementById('email').value||'guest');
      alert('Signed in (demo)'); location.href='index.html';
    }
    if(e.target.matches('#signupForm')){
      e.preventDefault();
      const fn = document.getElementById('firstName').value||''; const ln = document.getElementById('lastName').value||'';
      localStorage.setItem('user', fn + ' ' + ln); alert('Account created (demo)'); location.href='index.html';
    }
  });

  // language and dark mode
  document.addEventListener('click', e=>{
    if(e.target.matches('#langBtn')){
      const next = prompt('Enter language: en / hi / mr', localStorage.getItem('lang')||'en') || 'en';
      localStorage.setItem('lang', next); location.reload();
    }
    if(e.target.matches('#darkToggle')){ document.body.classList.toggle('dark'); localStorage.setItem('dark', document.body.classList.contains('dark')?'1':'0'); }
  });

  // set years and initial states
  document.addEventListener('DOMContentLoaded', ()=>{
    $$('#year, #year2, #year3, #year4').forEach(el=>{ if(el) el.textContent = new Date().getFullYear(); });
    if(localStorage.getItem('dark')==='1') document.body.classList.add('dark');
    updateCartCount();
    loadAllProducts(); loadProductDetails(); renderCartPage(); applyTranslations && applyTranslations();
  });
})();