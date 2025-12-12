import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { TrendingUp, Wrench, ShoppingBasket, DollarSign, Package, BadgeCheck, AlertTriangle, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;
    
    const stats = [
        {
            title: "Total Sales",
            description: "Total sales of products and repairs",
            value: "₱45,231.89",
            change: "+20.1%",
            changeText: "from last month",
            icon: DollarSign,
            trend: "up"
        },
        {
            title: "Product Sales",
            description: "Total sales of products",
            value: "₱45,231.89",
            change: "+20.1%",
            changeText: "from last month",
            icon: ShoppingBasket,
            trend: "up"
        },
        {
            title: "Repair Sales",
            description: "Total sales of repairs",
            value: "₱45,231.89",
            change: "+20.1%",
            changeText: "from last month",
            icon: Wrench,
            trend: "up"
        },
        {
            title: "Inventory Overview",
            description: "Products & spare parts on hand",
            value: "1,248 items",
            change: "+5.4%",
            changeText: "stock replenished",
            icon: Package,
            trend: "up"
        },
        {
            title: "Total Sold Items",
            description: "Units across products & repairs",
            value: "1,254",
            change: "+12.6%",
            changeText: "units vs last month",
            icon: BadgeCheck,
            trend: "up"
        },
        {
            title: "Low Stock Items",
            description: "Items below reorder threshold",
            value: "17",
            change: null,
            changeText: "Needs immediate restock",
            icon: AlertTriangle,
            trend: "warning",
            details: [
                "iPhone 12 glass – 3 remaining",
                "Samsung batteries – 5 remaining",
                "Charger cables – 9 remaining"
            ]
        }
    ];
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Welcome Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 shadow-lg md:p-8">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
                    <div className="relative flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                            <User className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white md:text-3xl">
                                Welcome Back, {auth.user?.name || 'Admin'}! 👋
                            </h1>
                            <p className="mt-1 text-sm text-white/90 md:text-base">
                                Here's a summary of your store's performance.                   
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card 
                                key={index}
                                className="group border border-border shadow-sm transition-all hover:shadow-md rounded-2xl"
                            >
                                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                    <div className="space-y-1">
                                        <CardTitle className="text-sm font-medium">
                                            {stat.title}
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            {stat.description}
                                        </CardDescription>
                                    </div>
                                    <div className={`rounded-lg p-2 ${
                                        stat.trend === 'warning' 
                                            ? 'bg-orange-50 text-orange-600' 
                                            : 'bg-blue-50 text-blue-600'
                                    }`}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="text-2xl font-bold">
                                        {stat.value}
                                    </div>
                                    {stat.change && (
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <TrendingUp className="h-3 w-3 text-green-600" />
                                            <span className="font-medium text-green-600">{stat.change}</span>
                                            <span>{stat.changeText}</span>
                                        </div>
                                    )}
                                    {!stat.change && (
                                        <div className="text-xs text-muted-foreground">
                                            {stat.changeText}
                                        </div>
                                    )}
                                    {stat.details && (
                                        <ul className="space-y-1 text-xs text-muted-foreground">
                                            {stat.details.map((detail, i) => (
                                                <li key={i}>• {detail}</li>
                                            ))}
                                        </ul>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}