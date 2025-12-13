import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
    title: string;
    value: string | number;
    description?: string;
    subtitle?: string;
    icon: LucideIcon;
    iconColor?: string;
    iconBgColor?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

export function StatsCard({
    title,
    value,
    description,
    subtitle,
    icon: Icon,
    iconColor = 'text-primary',
    iconBgColor = 'bg-primary/10',
    trend,
    className,
}: StatsCardProps) {
    return (
        <Card className={cn('transition-shadow hover:shadow-md', className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className={cn('rounded-full p-2', iconBgColor)}>
                    <Icon className={cn('h-4 w-4', iconColor)} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
                )}
                {description && (
                    <p className="text-xs text-muted-foreground mt-1">{description}</p>
                )}
                {trend && (
                    <p
                        className={cn(
                            'text-xs mt-1',
                            trend.isPositive ? 'text-green-600' : 'text-red-600'
                        )}
                    >
                        {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
