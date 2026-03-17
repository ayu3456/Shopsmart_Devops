const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/db');

describe('ShopSmart API Tests', () => {
    
    // Clear DB between tests if needed, or just run them sequentially
    // Before all tests, we can seed or clean
    
    describe('GET /api/health', () => {
        it('should return 200 and status ok', async () => {
            const res = await request(app).get('/api/health');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('status', 'ok');
        });
    });

    describe('Product CRUD Operations', () => {
        let createdProductId;

        it('should create a new product', async () => {
            const res = await request(app)
                .post('/api/products')
                .send({
                    name: 'Test Laptop',
                    description: 'High performance laptop',
                    price: 999.99,
                    stock: 10
                });
            
            if (res.statusCode !== 201) console.error(res.body);
            
            expect(res.statusCode).toEqual(201);
            expect(res.body.name).toBe('Test Laptop');
            createdProductId = res.body.id;
        });

        it('should list all products', async () => {
            const res = await request(app).get('/api/products');
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('should get a single product by ID', async () => {
            const res = await request(app).get(`/api/products/${createdProductId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.id).toBe(createdProductId);
        });

        it('should update a product', async () => {
            const res = await request(app)
                .put(`/api/products/${createdProductId}`)
                .send({
                    name: 'Updated Laptop',
                    price: 899.99,
                    stock: 5
                });
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.name).toBe('Updated Laptop');
            expect(res.body.price).toBe(899.99);
        });

        it('should delete a product', async () => {
            const res = await request(app).delete(`/api/products/${createdProductId}`);
            expect(res.statusCode).toEqual(204);

            // Verify deletion
            const checkRes = await request(app).get(`/api/products/${createdProductId}`);
            expect(checkRes.statusCode).toEqual(404);
        });
    });
});
