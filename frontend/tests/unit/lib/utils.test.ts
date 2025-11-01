import { cn } from '@/lib/utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      const result = cn('text-red-500', 'bg-blue-500');
      expect(result).toBe('text-red-500 bg-blue-500');
    });

    it('should handle conditional classes', () => {
      const result = cn('base-class', true && 'active', false && 'inactive');
      expect(result).toBe('base-class active');
    });

    it('should merge conflicting Tailwind classes correctly', () => {
      // tailwind-merge should keep only the last conflicting class
      const result = cn('p-4', 'p-2');
      expect(result).toBe('p-2');
    });

    it('should handle arrays of classes', () => {
      const result = cn(['class1', 'class2'], 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('should handle objects with conditional classes', () => {
      const result = cn({
        'active-class': true,
        'inactive-class': false,
      });
      expect(result).toBe('active-class');
    });

    it('should handle undefined and null values', () => {
      const result = cn('base', undefined, null, 'extra');
      expect(result).toBe('base extra');
    });

    it('should handle empty input', () => {
      const result = cn();
      expect(result).toBe('');
    });
  });
});

