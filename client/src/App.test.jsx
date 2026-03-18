import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('App Component', () => {
    beforeEach(() => {
        global.fetch = vi.fn((url) => {
            if (url.includes('/api/health')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ status: 'ok', message: 'Ready' }),
                });
            }
            if (url.includes('/api/products')) {
                return Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve([
                            {
                                id: 1,
                                name: 'Test Product',
                                description: 'Test Desc',
                                price: 10,
                                stock: 5,
                            },
                        ]),
                });
            }
            return Promise.reject(new Error('Unknown URL'));
        });
    });

    it('renders ShopSmart title and health status', async () => {
        render(<App />);
        expect(screen.getByText(/ShopSmart/i)).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText(/Backend: ok/i)).toBeInTheDocument();
        });
    });

    it('renders the add product form', () => {
        render(<App />);
        expect(screen.getByText(/Add New Product/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Price/i)).toBeInTheDocument();
    });

    it('displays products from the API', async () => {
        render(<App />);
        await waitFor(() => {
            expect(screen.getByText(/Test Product/i)).toBeInTheDocument();
            expect(screen.getByText(/Test Desc/i)).toBeInTheDocument();
        });
    });
});
