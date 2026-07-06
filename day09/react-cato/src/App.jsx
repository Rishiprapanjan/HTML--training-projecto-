import { useState, useEffect } from 'react'
import shopeaseLogo from './assets/shopease_logo.png'
import './App.css'

// Premium Electronics Mock Products
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "MacBook Pro 16\" M3 Max",
    category: "Laptops",
    price: 3499,
    originalPrice: 3999,
    rating: 4.9,
    reviews: 142,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80",
    description: "The ultimate developer powerhouse. Featuring the M3 Max chip, 48GB Unified Memory, and a stunning 16-inch Liquid Retina XDR display. Experience extreme performance and exceptional battery life up to 22 hours.",
    specs: {
      "Processor": "Apple M3 Max (16-core CPU)",
      "Memory": "48GB Unified Memory",
      "Storage": "1TB Superfast SSD",
      "Display": "16.2\" Liquid Retina XDR (120Hz)",
      "Battery": "Up to 22 hours runtime",
      "Color": "Space Black"
    }
  },
  {
    id: 2,
    name: "iPhone 15 Pro Max 512GB",
    category: "Smartphones",
    price: 1399,
    originalPrice: 1599,
    rating: 4.8,
    reviews: 284,
    badge: "Featured",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=80",
    description: "Forged in titanium, featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever with 5x optical zoom capability.",
    specs: {
      "Chip": "A17 Pro chip with 6-core GPU",
      "Display": "6.7\" Super Retina XDR OLED",
      "Camera": "48MP Main | 12MP Ultra Wide | 5x Telephoto",
      "Material": "Aerospace-grade Titanium",
      "Weight": "221 grams",
      "Battery": "Up to 29 hours video playback"
    }
  },
  {
    id: 3,
    name: "Sony WH-1000XM5 ANC",
    category: "Audio",
    price: 348,
    originalPrice: 399,
    rating: 4.7,
    reviews: 512,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
    description: "Industry-leading noise canceling headphones with dual processors, 8 microphones, Auto NC Optimizer, and exceptional call quality. Delivers pure, distraction-free listening comfort.",
    specs: {
      "Driver": "30mm specially designed dome driver",
      "Battery Life": "Up to 30 hours (ANC On)",
      "Charging": "Quick charge (3 mins for 3 hours)",
      "Bluetooth": "Version 5.2 | Multi-point connection",
      "Weight": "250 grams",
      "Sensors": "Wearing sensor for auto pause/play"
    }
  },
  {
    id: 4,
    name: "Apple Watch Ultra 2 GPS",
    category: "Wearables",
    price: 799,
    originalPrice: 799,
    rating: 4.9,
    reviews: 95,
    badge: "New",
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&auto=format&fit=crop&q=80",
    description: "The rugged and capable sports watch designed for athletes and outdoor explorers. Featuring the bright Always-On Retina display, advanced fitness metrics, and modular Ultra watch face.",
    specs: {
      "Case Size": "49mm Titanium Case",
      "Brightness": "Up to 3000 nits peak",
      "GPS": "Precision dual-frequency GPS",
      "Water Resistance": "100m water resistant",
      "Battery": "Up to 36 hours normal use",
      "Health Sensors": "Blood Oxygen | ECG | Heart Rate | Temp"
    }
  },
  {
    id: 5,
    name: "iPad Pro 13\" M4 OLED",
    category: "Wearables",
    price: 1299,
    originalPrice: 1399,
    rating: 4.8,
    reviews: 64,
    badge: "New",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80",
    description: "Impossibly thin design with the groundbreaking performance of the M4 chip, a breakthrough Tandem OLED display, and superfast Wi-Fi 6E connectivity. Supports Apple Pencil Pro.",
    specs: {
      "Chip": "Apple M4 chip (9-core CPU)",
      "Display": "13\" Ultra Retina XDR Tandem OLED",
      "Storage": "256GB High-speed Storage",
      "Thickness": "5.1 mm (Thinnest Apple product)",
      "Cameras": "12MP Wide Back | 12MP Landscape TrueDepth",
      "Audio": "Four-speaker audio system"
    }
  },
  {
    id: 6,
    name: "Keychron Q1 Max Keyboard",
    category: "Accessories",
    price: 219,
    originalPrice: 249,
    rating: 4.6,
    reviews: 82,
    badge: "Featured",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&auto=format&fit=crop&q=80",
    description: "Premium full-metal custom mechanical keyboard with hot-swappable switches, double-gasket design, custom sound absorbing foam, and multi-mode wireless connection (2.4Ghz/Bluetooth/Wired).",
    specs: {
      "Layout": "75% ANSI layout",
      "Body Material": "Full CNC machined aluminum",
      "Connectivity": "2.4 GHz | Bluetooth 5.1 | Type-C Wired",
      "Hot-swappable": "Yes (3-pin & 5-pin MX mechanical switches)",
      "Stabilizers": "Screw-in PCB stabilizers",
      "Backlight": "South-facing RGB LED"
    }
  },
  {
    id: 7,
    name: "Logitech MX Master 3S Mouse",
    category: "Accessories",
    price: 99,
    originalPrice: 99,
    rating: 4.8,
    reviews: 320,
    badge: "",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=80",
    description: "The legendary productivity mouse. Redesigned with Quiet Click switches and an 8K DPI sensor for speed and accuracy on any surface. Features the MagSpeed electromagnetic scroll wheel.",
    specs: {
      "Sensor": "Darkfield high precision (8000 DPI)",
      "Scroll Wheel": "MagSpeed Electromagnetic wheel",
      "Quiet Clicks": "Yes (90% less click noise)",
      "Battery": "Rechargeable Li-Po (Up to 70 days)",
      "Buttons": "7 customizable buttons",
      "Wireless": "Logi Bolt USB | Bluetooth Low Energy"
    }
  },
  {
    id: 8,
    name: "Bose QuietComfort Ultra Buds",
    category: "Audio",
    price: 299,
    originalPrice: 329,
    rating: 4.7,
    reviews: 174,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80",
    description: "Revolutionary spatial audio earbuds with custom sound calibration (CustomTune technology), premium quiet modes, and soft umbrella-shaped tips for secure, luxurious wear all day.",
    specs: {
      "Spatial Audio": "Immersive Audio virtualization",
      "Battery Life": "Up to 6 hours (4 hours Immersive)",
      "Water Resistance": "IPX4 sweat/water resistant",
      "Codec Support": "Snapdragon Sound | aptX Adaptive",
      "Noise Control": "Quiet | Aware | Immersion presets",
      "Case charging": "USB-C | Wireless charging compatible"
    }
  }
];

function App() {
  const [products] = useState(INITIAL_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Sync Theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Categories
  const categories = ['All', 'Laptops', 'Smartphones', 'Audio', 'Wearables', 'Accessories'];

  // Filter Products
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Cart Functions
  const addToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, amount) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === productId) {
          const nextQty = item.quantity + amount;
          return nextQty > 0 ? { ...item, quantity: nextQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutSuccess(true);
    setCart([]);
    setTimeout(() => {
      setCheckoutSuccess(false);
      setIsCartOpen(false);
    }, 3000);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="app-container">
      {/* Premium Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo-wrapper" onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}>
            <img src={shopeaseLogo} alt="ShopEase Logo" className="logo-img" />
            <h1 className="logo-text">ShopEase</h1>
          </div>

          <div className="search-container">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search premium electronics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="header-actions">
            <button 
              className="theme-toggle-btn" 
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            <button 
              className="cart-toggle-btn" 
              onClick={() => setIsCartOpen(true)}
              title="Open Shopping Cart"
            >
              🛒
              {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Interactive Hero Banner */}
        <section className="hero-section">
          <div className="hero-content">
            <span className="hero-tag">Summer Tech Fest</span>
            <h2 className="hero-title">Experience the <span>Next Gen</span> of Electronics</h2>
            <p className="hero-desc">
              Upgrade your setup with professional tools designed for creators, developers, and music lovers. Exclusive discount tags inside.
            </p>
            <button className="hero-btn" onClick={() => {
              const el = document.getElementById('catalog-products');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Shop Premium Deals ➜
            </button>
          </div>
        </section>

        {/* Categories Tab Slider */}
        <nav className="categories-container">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Catalog List Header */}
        <div className="section-header" id="catalog-products">
          <h2>{selectedCategory} Products</h2>
          <span className="results-count">Showing {filteredProducts.length} items</span>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map(product => {
              const isInCart = cart.some(item => item.id === product.id);
              return (
                <article className="product-card" key={product.id}>
                  {product.badge && (
                    <span className={`card-badge ${
                      product.badge === 'Sale' ? 'badge-sale' : 
                      product.badge === 'New' ? 'badge-new' : 'badge-featured'
                    }`}>
                      {product.badge}
                    </span>
                  )}
                  <div className="product-image-container" onClick={() => setSelectedProduct(product)}>
                    <img src={product.image} alt={product.name} className="product-img" loading="lazy" />
                  </div>
                  <div className="product-details">
                    <span className="product-category">{product.category}</span>
                    <h3 className="product-name" onClick={() => setSelectedProduct(product)}>
                      {product.name}
                    </h3>
                    <div className="product-rating">
                      <span className="rating-stars">{"★".repeat(Math.floor(product.rating))}</span>
                      <span className="rating-count">({product.reviews})</span>
                    </div>
                    <div className="product-footer">
                      <div className="price-container">
                        {product.originalPrice > product.price && (
                          <span className="original-price">${product.originalPrice}</span>
                        )}
                        <span className="discount-price">${product.price}</span>
                      </div>
                      <button 
                        className={`add-cart-btn ${isInCart ? 'added' : ''}`}
                        onClick={() => addToCart(product)}
                        title="Add to Cart"
                      >
                        {isInCart ? '✓' : '＋'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div style={{ padding: '60px', color: 'var(--text-muted)' }}>
            <h3>No products match your search.</h3>
            <p>Try refining your search terms or choosing a different category.</p>
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedProduct(null)}>✕</button>
            <div className="modal-image-sec">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="modal-img" />
            </div>
            <div className="modal-info-sec">
              {selectedProduct.badge && (
                <span className={`modal-badge ${
                  selectedProduct.badge === 'Sale' ? 'badge-sale' : 
                  selectedProduct.badge === 'New' ? 'badge-new' : 'badge-featured'
                }`}>
                  {selectedProduct.badge}
                </span>
              )}
              <h2 className="modal-title">{selectedProduct.name}</h2>
              <div className="product-rating" style={{ marginBottom: '14px' }}>
                <span className="rating-stars">{"★".repeat(Math.floor(selectedProduct.rating))}</span>
                <span className="rating-count">{selectedProduct.rating} / 5.0 ({selectedProduct.reviews} customer reviews)</span>
              </div>
              <p className="modal-desc">{selectedProduct.description}</p>
              
              <div className="modal-specs">
                {Object.entries(selectedProduct.specs).map(([name, val]) => (
                  <div className="spec-row" key={name}>
                    <span className="spec-name">{name}</span>
                    <span className="spec-val">{val}</span>
                  </div>
                ))}
              </div>

              <div className="modal-buy-section">
                <div className="modal-price-box">
                  <span className="modal-price">${selectedProduct.price}</span>
                </div>
                <button 
                  className={`modal-add-btn ${cart.some(item => item.id === selectedProduct.id) ? 'added' : ''}`}
                  onClick={() => addToCart(selectedProduct)}
                >
                  {cart.some(item => item.id === selectedProduct.id) ? 'Added to Cart ✓' : 'Add to Cart 🛒'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shopping Cart Sidebar Drawer */}
      {isCartOpen && (
        <>
          <div className="cart-drawer-overlay" onClick={() => setIsCartOpen(false)} />
          <div className="cart-drawer">
            <div className="cart-header">
              <h2 className="cart-title">🛒 Shopping Cart</h2>
              <button className="cart-close-btn" onClick={() => setIsCartOpen(false)}>✕</button>
            </div>

            <div className="cart-body">
              {checkoutSuccess ? (
                <div className="empty-cart-state" style={{ animation: 'popIn 0.3s ease' }}>
                  <span className="empty-cart-icon">🎉</span>
                  <h3>Order Confirmed!</h3>
                  <p style={{ textAlign: 'center' }}>Thank you for shopping at ShopEase. Your package is preparing for delivery.</p>
                </div>
              ) : cart.length > 0 ? (
                cart.map(item => (
                  <div className="cart-item" key={item.id}>
                    <div className="cart-item-img-box">
                      <img src={item.image} alt={item.name} className="cart-item-img" />
                    </div>
                    <div className="cart-item-details">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <span className="cart-item-price">${item.price}</span>
                    </div>
                    <div className="cart-item-actions">
                      <div className="qty-selector">
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>－</button>
                        <span className="qty-val">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>＋</button>
                      </div>
                      <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-cart-state">
                  <span className="empty-cart-icon">🛍️</span>
                  <h3>Your cart is empty</h3>
                  <p>Browse products and add items to your cart.</p>
                </div>
              )}
            </div>

            {!checkoutSuccess && cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <span>${cartTotal}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Shipping</span>
                  <span style={{ color: 'var(--success)', fontWeight: '600' }}>FREE</span>
                </div>
                <div className="cart-summary-row cart-summary-total">
                  <span>Total Amount</span>
                  <span>${cartTotal}</span>
                </div>
                <button className="checkout-btn" onClick={handleCheckout}>
                  Secure Checkout ➜
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Styled Footer matching the template structure */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h2 className="footer-logo">ShopEase</h2>
            <p>
              Your trusted destination for premium gadgets, smartphones, laptops, headphones, and accessories. Experience elite tech tailored for efficiency.
            </p>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#catalog-products">🏠 Home</a></li>
              <li><a href="#catalog-products">🛒 Products</a></li>
              <li><a href="#catalog-products">🔥 Deals</a></li>
              <li><a href="#catalog-products">📞 Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Customer Support</h3>
            <ul>
              <li>Email: support@shopease.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>Available: 24 × 7</li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social">
              <a href="#" className="social-link" title="Facebook">📘</a>
              <a href="#" className="social-link" title="Instagram">📸</a>
              <a href="#" className="social-link" title="Twitter">🐦</a>
              <a href="#" className="social-link" title="YouTube">▶</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 <strong>ShopEase</strong>. All Rights Reserved.</p>
          <p>Designed with ❤️ using React JS</p>
        </div>
      </footer>
    </div>
  )
}

export default App
