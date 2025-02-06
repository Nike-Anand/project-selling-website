export interface Project {
  id: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  technologies: string[];
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  reviews: Review[];
  previewImage: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Review {
  id: string;
  userId: string;
  projectId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  purchasedProjects: string[];
  wishlist: string[];
  cart: string[];
}