import { Button } from '@/components/ui/button';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto rounded-2xl border border-gray-200 bg-gray-50 p-2 scrollbar-hide">
        <div className="flex gap-2 w-max">
          {/* All Products button */}
          <Button
            onClick={() => onCategoryChange(null)}
            variant={selectedCategory === null ? 'default' : 'outline'}
            className={`rounded-2xl whitespace-nowrap transition-all ${
              selectedCategory === null
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'border-gray-300 hover:border-gray-400 hover:bg-white'
            }`}
          >
            All Products
          </Button>

          {/* Category buttons */}
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => onCategoryChange(category)}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className={`rounded-2xl whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-white'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
