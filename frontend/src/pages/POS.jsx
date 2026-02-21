import { useState, useEffect, useRef } from "react";
import {
  getProducts,
  getProductByBarcode,
  createSale,
  getTodaysSales,
} from "../services/api";
import "./POS.css";

function POS({ user }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [todayStats, setTodayStats] = useState({ sales: 0, revenue: 0 });
  const [showBill, setShowBill] = useState(false);
  const [lastSale, setLastSale] = useState(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    loadProducts();
    loadTodayStats();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts(search);
      setProducts(data.filter((p) => p.stock > 0));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTodayStats = async () => {
    try {
      const data = await getTodaysSales();
      const revenue = data.reduce((sum, sale) => sum + sale.totalAmount, 0);
      setTodayStats({ sales: data.length, revenue });
    } catch (err) {
      console.error(err);
    }
  };

  const handleBarcodeSubmit = async (e) => {
    e.preventDefault();
    if (!barcode.trim()) return;

    try {
      const product = await getProductByBarcode(barcode);
      addToCart(product);
      setBarcode("");
    } catch (err) {
      setError("Product not found");
      setTimeout(() => setError(""), 3000);
    }
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          setError("Not enough stock");
          setTimeout(() => setError(""), 3000);
          return prev;
        }
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prev,
        { productId: product.id, product, quantity: 1, price: product.price },
      ];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > item.product.stock) {
              setError("Not enough stock");
              setTimeout(() => setError(""), 3000);
              return item;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const tax = subtotal * 0.05;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setProcessing(true);
    setError("");

    try {
      const items = cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const sale = await createSale(items);
      setLastSale(sale);
      setShowBill(true);
      setCart([]);
      loadTodayStats();
      loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const printBill = () => {
    window.print();
  };

  const closeBill = () => {
    setShowBill(false);
    setLastSale(null);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="pos-page">
      <div className="pos-left">
        <div className="pos-top-bar">
          <div className="pos-title-area">
            <h1>POS Billing</h1>
            <div className="today-stats">
              <span className="stats-label">Today's:</span>
              <span className="stats-value">{todayStats.sales} sales</span>
              <span className="stats-divider">|</span>
              <span className="stats-revenue">${todayStats.revenue.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="pos-controls">
          <form className="barcode-form" onSubmit={handleBarcodeSubmit}>
            <div className="input-with-icon">
              <input
                type="text"
                placeholder="Scan or enter barcode..."
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                ref={searchInputRef}
              />
            </div>
            <button type="submit" className="add-btn">Add</button>
          </form>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="products-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => addToCart(product)}
            >
              <h3>{product.name}</h3>
              <p className="price">${product.price.toFixed(2)}</p>
              <p className="stock">Stock: {product.stock}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pos-right">
        <div className="cart-section">
          <h2>Cart ({cart.length} items)</h2>

          <div className="cart-items">
            {cart.length === 0 ? (
              <p className="empty-cart">Cart is empty</p>
            ) : (
              cart.map((item) => (
                <div key={item.productId} className="cart-item">
                  <div className="item-info">
                    <h4>{item.product.name}</h4>
                    <p>${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="item-controls">
                    <button onClick={() => updateQuantity(item.productId, -1)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)}>
                      +
                    </button>
                  </div>
                  <div className="item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="cart-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Tax (5%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="total-row grand-total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={cart.length === 0 || processing}
          >
            {processing ? "Processing..." : "Complete Sale"}
          </button>
        </div>
      </div>

      {showBill && lastSale && (
        <div className="bill-modal">
          <div className="bill-content">
            <div className="bill-header">
              <h2>Supermarket POS</h2>
              <p>Sale #{lastSale.id}</p>
              <p>{new Date(lastSale.createdAt).toLocaleString()}</p>
            </div>
            <div className="bill-items">
              {lastSale.saleItems.map((item) => (
                <div key={item.id} className="bill-item">
                  <span>
                    {item.product.name} x{item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="bill-totals">
              <div className="bill-row">
                <span>Subtotal:</span>
                <span>${lastSale.subtotal.toFixed(2)}</span>
              </div>
              <div className="bill-row">
                <span>Tax (5%):</span>
                <span>${lastSale.tax.toFixed(2)}</span>
              </div>
              <div className="bill-row total">
                <span>Total:</span>
                <span>${lastSale.totalAmount.toFixed(2)}</span>
              </div>
            </div>
            <div className="bill-footer">
              <p>Thank you for shopping!</p>
            </div>
            <div className="bill-actions">
              <button onClick={printBill}>Print</button>
              <button onClick={closeBill}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default POS;
