import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, X, Filter } from 'lucide-react';

interface FilterOption {
    value: string;
    label: string;
}

interface SearchFilterProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    filters?: {
        name: string;
        value: string;
        onChange: (value: string) => void;
        options: FilterOption[];
        placeholder?: string;
    }[];
    onClearFilters?: () => void;
    showClearButton?: boolean;
}

export function SearchFilter({
    searchValue,
    onSearchChange,
    searchPlaceholder = 'Search...',
    filters = [],
    onClearFilters,
    showClearButton = false,
}: SearchFilterProps) {
    const hasActiveFilters = searchValue || filters.some((f) => f.value && f.value !== 'all');

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Search Input */}
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9 pr-9"
                    />
                    {searchValue && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Filter Dropdowns */}
                <div className="flex flex-wrap gap-2">
                    {filters.map((filter) => (
                        <Select
                            key={filter.name}
                            value={filter.value}
                            onValueChange={filter.onChange}
                        >
                            <SelectTrigger className="w-[160px]">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder={filter.placeholder || filter.name} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All {filter.name}</SelectItem>
                                {filter.options.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ))}
                </div>

                {/* Clear Filters Button */}
                {showClearButton && hasActiveFilters && onClearFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearFilters}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <X className="mr-2 h-4 w-4" />
                        Clear Filters
                    </Button>
                )}
            </div>

            {/* Active Filters Indicator */}
            {hasActiveFilters && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Filter className="h-4 w-4" />
                    <span>Filters applied</span>
                </div>
            )}
        </div>
    );
}
