import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const getBackendBaseUrl = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl && (apiUrl.startsWith('http://') || apiUrl.startsWith('https://'))) {
    return apiUrl.replace(/\/api\/?$/, '');
  }
  return '';
};

export const getMediaUrl = (path: string | null | undefined): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const baseUrl = getBackendBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
};

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface BusinessData {
  id: number;
  slug?: string;
  business_name: string;
  category: string;
  description: string | null;
  address: string | null;
  area: string | null;
  city: string | null;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  google_map_url: string | null;
  is_verified: boolean;
  average_rating: number;
  total_reviews: number;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  logo_url: string | null;
  distance?: number;
}

export interface CategoryData {
  id: number;
  name: string;
  icon: string;
  slug: string;
}

export interface TestimonialData {
  id: number;
  name: string;
  role: string;
  text: string;
  avatar_url: string | null;
  rating: number;
}

export interface BrandData {
  id: number;
  name: string;
  color: string;
}

export interface StatsData {
  businesses: number;
  reviews: number;
  cities: number;
  users: number;
}

export interface TopPick {
  title: string;
  img: string;
  listings: string;
}

export interface HomepageData {
  categories: CategoryData[];
  featured_businesses: BusinessData[];
  top_picks: TopPick[];
  testimonials: TestimonialData[];
  brands: BrandData[];
  stats: StatsData;
}

export const fetchHomepage = async (): Promise<HomepageData> => {
  const { data } = await api.get<HomepageData>('/homepage');
  return data;
};

export const searchBusinesses = async (params: {
  q?: string;
  city?: string;
  category?: string;
  sort_by?: string;
}): Promise<BusinessData[]> => {
  const { data } = await api.get<BusinessData[]>('/search', { params });
  return data;
};

export const login = async (credentials: any) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

export default api;
