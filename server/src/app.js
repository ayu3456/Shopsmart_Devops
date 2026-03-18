const express = require('express');
const cors = require('cors');
const prisma = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'ShopSmart Backend is running',
        timestamp: new Date().toISOString(),
    });
});

// --- CRUD Routes for Products ---

// Create Product
app.post('/api/products', async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;
        const product = await prisma.product.create({
            data: { name, description, price: parseFloat(price), stock: parseInt(stock) || 0 },
        });
        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(400).json({ error: error.message });
    }
});

// List All Products
app.get('/api/products', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(products);
    } catch (error) {
        console.error('Error listing products:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get Single Product
app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
        });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (error) {
        console.error('Error getting product:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update Product
app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock } = req.body;
        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: { name, description, price: parseFloat(price), stock: parseInt(stock) },
        });
        res.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(400).json({ error: error.message });
    }
});

// Delete Product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.product.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(400).json({ error: error.message });
    }
});

// Root Route
app.get('/', (req, res) => {
    res.send('ShopSmart Backend Service');
});

module.exports = app;
