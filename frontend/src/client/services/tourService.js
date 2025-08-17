// src/client/services/tourService.js
import { api } from "./api";

// Mock dùng khi API fail
const mockTours = [
  {
    id: 1,
    title: "Ultimate Vietnam Travel Guide for Adventurers",
    location: "Sapa, Vietnam",
    price: 75,
    duration_days: 8,
    rating: 4.8,
    image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=740&h=518&q=80",
    short_desc: "Khám phá núi rừng Tây Bắc và văn hoá địa phương.",
  },
  {
    id: 2,
    title: "Hidden Gems in Southeast Asia You Must Visit",
    location: "Bangkok, Thailand",
    price: 65,
    duration_days: 10,
    rating: 4.6,
    image_url: "https://images.unsplash.com/photo-1583417267826-aebc4d1542e1?auto=format&fit=crop&w=740&h=518&q=80",
    short_desc: "Ẩm thực đường phố và đền chùa cổ kính.",
  },
  {
    id: 3,
    title: "Island Escape: Blue Sea & White Sand",
    location: "Malé, Maldives",
    price: 120,
    duration_days: 6,
    rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=740&h=518&q=80",
    short_desc: "Resort view biển và hoạt động lặn ngắm san hô.",
  },
];

export const tourService = {
  async getAll(params = {}) {
    try {
      const res = await api.get("/tours/", { params });
      return res.data?.data || res.data || [];
    } catch (e) {
      console.warn("API /tours/ lỗi, dùng mock:", e?.message);
      return mockTours;
    }
  },
  async getById(id) {
    try {
      const res = await api.get(`/tours/${id}`);
      return res.data?.data || res.data;
    } catch (e) {
      console.warn("API /tours/{id} lỗi, dùng mock:", e?.message);
      return mockTours.find((t) => String(t.id) === String(id)) || null;
    }
  },
};
