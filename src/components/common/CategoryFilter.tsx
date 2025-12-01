// src/components/common/CategoryFilter.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { getCategories } from '@/lib/api';
import type { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  onSelectCategory: (categoryId: string | null) => void;
  selectedCategoryId: string | null;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ onSelectCategory, selectedCategoryId }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data.filter(category => category.name !== '테마'));
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading || error) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 p-4 border-b bg-white">
      <Button
        variant={selectedCategoryId === null ? 'default' : 'outline'}
        onClick={() => onSelectCategory(null)}
        className={cn(selectedCategoryId === null ? 'bg-blue-500 text-white' : 'text-gray-700')}
      >
        전체
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategoryId === category.id ? 'default' : 'outline'}
          onClick={() => onSelectCategory(category.id)}
          className={cn(selectedCategoryId === category.id ? 'bg-blue-500 text-white' : 'text-gray-700')}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
