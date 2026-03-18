import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

function App() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '' });
    const [status, setStatus] = useState(null);

    useEffect(() => {
        fetchStatus();
        fetchProducts();
    }, []);

    const fetchStatus = async () => {
        try {
            const res = await fetch(`${API_URL}/api/health`);
            const data = await res.json();
            setStatus(data);
        } catch (err) {
            console.error('Error fetching health check:', err);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/products`);
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/api/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setFormData({ name: '', description: '', price: '', stock: '' });
                fetchProducts();
            }
        } catch (err) {
            console.error('Error adding product:', err);
        }
    };

    const deleteProduct = async (id) => {
        try {
            await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
            fetchProducts();
        } catch (err) {
            console.error('Error deleting product:', err);
        }
    };

    return (
        <div className="container">
            <header>
                <h1>ShopSmart</h1>
                {status && <div className="status-badge">Backend: {status.status}</div>}
            </header>

            <div className="card">
                <h2>Add New Product</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label htmlFor="price">Price</label>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="stock">Stock</label>
                            <input
                                id="stock"
                                name="stock"
                                type="number"
                                value={formData.stock}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn">
                        Add Product
                    </button>
                </form>
            </div>

            <div className="card">
                <h2>Inventory</h2>
                {loading ? (
                    <p>Loading products...</p>
                ) : (
                    <div className="product-grid">
                        {products.length === 0 ? (
                            <p>No products found. Start by adding one!</p>
                        ) : (
                            products.map((p) => (
                                <div key={p.id} className="product-card">
                                    <h3>{p.name}</h3>
                                    <p className="description">{p.description}</p>
                                    <p className="price">${parseFloat(p.price).toFixed(2)}</p>
                                    <p className="stock">In Stock: {p.stock}</p>
                                    <button
                                        onClick={() => deleteProduct(p.id)}
                                        className="btn btn-danger"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
