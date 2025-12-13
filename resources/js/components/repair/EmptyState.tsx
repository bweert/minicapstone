import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Plus, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    createRoute?: string;
    createLabel?: string;
    onCreateClick?: () => void;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    createRoute,
    createLabel = 'Create New',
    onCreateClick,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="rounded-full bg-muted p-4 mb-4">
                <Icon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-sm">
                {description}
            </p>
            {createRoute && (
                <Button asChild>
                    <Link href={createRoute}>
                        <Plus className="mr-2 h-4 w-4" />
                        {createLabel}
                    </Link>
                </Button>
            )}
            {onCreateClick && (
                <Button onClick={onCreateClick}>
                    <Plus className="mr-2 h-4 w-4" />
                    {createLabel}
                </Button>
            )}
        </div>
    );
}
