"use client";

import React, { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  tags: string[];
  setTags: (tags: string[]) => void;
}

const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  ({ className, tags, setTags, ...props }, ref) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.nativeEvent.isComposing) return;
      
      if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
        e.preventDefault();
        const newTag = inputValue.trim();
        if (newTag && !tags.includes(newTag)) {
          setTags([...tags, newTag]);
        }
        setInputValue('');
      } else if (e.key === 'Backspace' && inputValue === '') {
        e.preventDefault();
        setTags(tags.slice(0, -1));
      }
    };

    const removeTag = (tagToRemove: string) => {
      setTags(tags.filter((tag) => tag !== tagToRemove));
    };
    
    const handleBlur = () => {
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInputValue('');
    }

    return (
      <div
        className={cn(
          'flex flex-wrap items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          className
        )}
      >
        {tags.map((tag, index) => (
          <span
            key={index}
            className="flex items-center gap-1 rounded-full bg-secondary text-secondary-foreground px-2 py-1 text-xs font-medium"
          >
            {tag}
            <button
              type="button"
              className="rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-1"
              onClick={() => removeTag(tag)}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          ref={ref}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="flex-1 bg-transparent p-0 text-sm outline-none placeholder:text-muted-foreground"
          {...props}
        />
      </div>
    );
  }
);

TagInput.displayName = 'TagInput';

export { TagInput };
