import type { Category } from '../types/category';

export async function fetchCategories({ pageParam = 0 }) {
  const response = await fetch(`http://localhost:8000/api/categories/?skip=${pageParam}&limit=9`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json() as Promise<Category[]>;
}

export async function fetchCategoryBySlug(slug: string) {
  const response = await fetch(`http://localhost:8000/api/categories/${slug}`);
  if (!response.ok) {
    throw new Error('Category not found');
  }
  return response.json() as Promise<Category>;
}