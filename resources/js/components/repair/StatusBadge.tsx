    import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type RepairStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';
export type PaymentStatus = 'pending' | 'paid';
export type StockLevel = 'low' | 'medium' | 'high';

interface StatusBadgeProps {
    status: RepairStatus | PaymentStatus | StockLevel | string;
    className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
    // Repair order statuses
    pending: {
        label: 'Pending',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100',
    },
    in_progress: {
        label: 'In Progress',
        className: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100',
    },
    completed: {
        label: 'Completed',
        className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100',
    },
    overdue: {
        label: 'Overdue',
        className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100',
    },
    // Payment statuses
    paid: {
        label: 'Paid',
        className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100',
    },
    // Stock levels
    low: {
        label: 'Low Stock',
        className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100',
    },
    medium: {
        label: 'Medium',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100',
    },
    high: {
        label: 'In Stock',
        className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100',
    },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const config = statusConfig[status] || {
        label: status.replace('_', ' '),
        className: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    return (
        <Badge
            variant="outline"
            className={cn(config.className, className)}
        >
            {config.label}
        </Badge>
    );
}

export function getStockLevel(quantity: number): StockLevel {
    if (quantity <= 5) return 'low';
    if (quantity <= 20) return 'medium';
    return 'high';
}
