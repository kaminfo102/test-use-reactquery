import React from 'react';
import { QueryProvider } from './providers/QueryProvider';
import { CategoryList } from './CategoryList';

export function CategoryListWithProvider() {
  return (
    <QueryProvider>
      <CategoryList />
    </QueryProvider>
  );
}