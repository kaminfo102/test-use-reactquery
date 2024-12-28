import React from 'react';
import { CategoryCard } from './CategoryCard';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchCategories } from '../lib/api/categories';
import type { Category } from '../lib/types/category';

export function CategoryList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length === 9 ? pages.length * 9 : undefined;
    },
  });

  if (status === 'pending') return <div>Loading...</div>;
  if (status === 'error') return <div>Error fetching categories</div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.pages.map((group, i) => (
          <React.Fragment key={i}>
            {group.map((category: Category) => (
              <CategoryCard
                key={category.id}
                title={category.title}
                description={category.description}
                imageUrl={category.image_url}
                href={`/categories/${category.slug}`}
                testCount={category.test_count}
                tags={[]}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
      
      {isFetchingNextPage && (
        <div className="text-center">Loading more...</div>
      )}
      
      {hasNextPage && !isFetchingNextPage && (
        <button
          onClick={() => fetchNextPage()}
          className="w-full py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
        >
          Load More
        </button>
      )}
      
      {!hasNextPage && (
        <p className="text-center text-muted-foreground">
          تمام دسته‌بندی‌ها نمایش داده شده‌اند
        </p>
      )}
    </div>
  );
}