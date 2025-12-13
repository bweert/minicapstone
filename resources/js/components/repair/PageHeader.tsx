import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface PageHeaderProps {
    title: string;
    description?: string;
    createRoute?: string;
    createLabel?: string;
    onCreateClick?: () => void;
    actions?: React.ReactNode;
}

export function PageHeader({
    title,
    description,
    createRoute,
    createLabel = 'Add New',
    onCreateClick,
    actions,
}: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                {description && (
                    <p className="text-muted-foreground mt-1">{description}</p>
                )}
            </div>
            <div className="flex items-center gap-2">
                {actions}
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
        </div>
    );
}
