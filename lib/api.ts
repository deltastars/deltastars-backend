// API Client for DeltaStars Store
// This module handles all API requests

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.deltastars-ksa.com';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('auth-token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP error! status: ${response.status}`,
          response.status,
          errorData
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new ApiError('فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.');
      }
      
      throw new ApiError('حدث خطأ غير متوقع');
    }
  }

  // Products
  async getProducts(filters?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const query = params.toString();
    return this.request(`/products${query ? `?${query}` : ''}`);
  }

  async getProduct(id: number) {
    return this.request(`/products/${id}`);
  }

  // Cart
  async addToCart(productId: number, quantity: number) {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCart(itemId: number, quantity: number) {
    return this.request(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(itemId: number) {
    return this.request(`/cart/${itemId}`, {
      method: 'DELETE',
    });
  }

  async getCart() {
    return this.request('/cart');
  }

  // Orders
  async createOrder(orderData: {
    items: Array<{ productId: number; quantity: number; price: number }>;
    shippingAddress: any;
    paymentMethod: string;
    notes?: string;
  }) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders() {
    return this.request('/orders');
  }

  async getOrder(id: number) {
    return this.request(`/orders/${id}`);
  }

  // Auth
  async login(phone: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });
  }

  async register(userData: {
    name: string;
    phone: string;
    email?: string;
    password: string;
    address?: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Reviews
  async addReview(productId: number, rating: number, comment: string) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify({ productId, rating, comment }),
    });
  }

  async getProductReviews(productId: number) {
    return this.request(`/reviews/product/${productId}`);
  }

  // Wishlist
  async addToWishlist(productId: number) {
    return this.request('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  async removeFromWishlist(productId: number) {
    return this.request(`/wishlist/${productId}`, {
      method: 'DELETE',
    });
  }

  async getWishlist() {
    return this.request('/wishlist');
  }

  // Notifications
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationAsRead(id: number) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }
}

const api = new ApiClient();
export default api;
