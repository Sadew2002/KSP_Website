import create from 'zustand';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('authToken') || null,
  isLoading: false,
  error: null,

  setUser: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('authToken', token);
    set({ user, token, error: null });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    set({ user: null, token: null });
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

export const useCartStore = create((set) => ({
  items: [],
  loading: false,

  setCart: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (itemId) => set((state) => ({
    items: state.items.filter((item) => item.id !== itemId),
  })),
  updateItem: (itemId, quantity) => set((state) => ({
    items: state.items.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    ),
  })),
  clearCart: () => set({ items: [] }),
  setLoading: (loading) => set({ loading }),
}));

export const useProductStore = create((set) => ({
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,

  setProducts: (products) => set({ products }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
