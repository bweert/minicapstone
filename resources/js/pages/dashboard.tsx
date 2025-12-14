import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { 
    TrendingUp, TrendingDown, ShoppingBasket, DollarSign, 
    Package, AlertTriangle, User, Receipt, Tags, Users, 
    ArrowRight, Calendar, Banknote, CreditCard, ShoppingCart,
    ImageIcon, BarChart3, RotateCcw, Wrench
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardStats {
    totalRevenue: number;
    todayRevenue: number;
    thisMonthRevenue: number;
    revenueChange: number;
    totalTransactions: number;
    todayTransactions: number;
    thisMonthTransactions: number;
    transactionsChange: number;
    totalProducts: number;
    totalStock: number;
    lowStockCount: number;
    outOfStockCount: number;
    inventoryValue: number;
    totalCategories: number;
    categoriesWithProducts: number;
    totalCustomers: number;
    repairOrdersCount: number;
    pendingRepairs: number;
    completedRepairs: number;
    cashSales: number;
    gcashSales: number;
    posRefundedAmount: number;
    posRefundedCount: number;
    posPartialRefunds: number;
    posFullRefunds: number;
    repairRefundedAmount: number;
    repairRefundedCount: number;
}

interface Transaction {
    id: number;
    reference_number: string;
    total: number;
    payment_method: 'cash' | 'gcash';
    created_at: string;
    items?: { quantity: number }[];
}

interface LowStockItem {
    id: number;
    name: string;
    stock_quantity: number;
    SKU: string;
}

interface TopProduct {
    id: number;
    name: string;
    image?: string;
    total_sold: number;
    total_revenue: number;
}

interface DailySale {
    date: string;
    day: string;
    sales: number;
    count: number;
}

interface Props {
    stats: DashboardStats;
    recentTransactions: Transaction[];
    lowStockItems: LowStockItem[];
    topProducts: TopProduct[];
    dailySales: DailySale[];
}

export default function Dashboard({ stats, recentTransactions, lowStockItems, topProducts, dailySales }: Props) {
    const { auth } = usePage<SharedData>().props;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-PH', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Find max sales for chart scaling
    const maxSales = Math.max(...(dailySales?.map(d => d.sales) || [0]), 1);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Welcome Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 shadow-lg md:p-8">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
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
                        <div className="hidden md:flex items-center gap-3">
                            
                        </div>
                    </div>
                </div>

                {/* Main Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Total Revenue */}
                    <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Revenue
                            </CardTitle>
                            <div className="rounded-full bg-green-100 p-2">
                                <DollarSign className="h-4 w-4 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats?.totalRevenue || 0)}</div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                {(stats?.revenueChange || 0) >= 0 ? (
                                    <TrendingUp className="h-3 w-3 text-green-600" />
                                ) : (
                                    <TrendingDown className="h-3 w-3 text-red-600" />
                                )}
                                <span className={(stats?.revenueChange || 0) >= 0 ? 'text-green-600' : 'text-red-600'}>
                                    {(stats?.revenueChange || 0) >= 0 ? '+' : ''}{stats?.revenueChange || 0}%
                                </span>
                                <span>vs last month</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Transactions */}
                    <Card className="border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Transactions
                            </CardTitle>
                            <div className="rounded-full bg-blue-100 p-2">
                                <Receipt className="h-4 w-4 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalTransactions || 0}</div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                {(stats?.transactionsChange || 0) >= 0 ? (
                                    <TrendingUp className="h-3 w-3 text-green-600" />
                                ) : (
                                    <TrendingDown className="h-3 w-3 text-red-600" />
                                )}
                                <span className={(stats?.transactionsChange || 0) >= 0 ? 'text-green-600' : 'text-red-600'}>
                                    {(stats?.transactionsChange || 0) >= 0 ? '+' : ''}{stats?.transactionsChange || 0}%
                                </span>
                                <span>vs last month</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Products */}
                    <Card className="border-l-4 border-l-purple-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Products
                            </CardTitle>
                            <div className="rounded-full bg-purple-100 p-2">
                                <Package className="h-4 w-4 text-purple-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats?.totalStock || 0} total units in stock
                            </p>
                        </CardContent>
                    </Card>

                    {/* Low Stock Alert */}
                    <Card className={`border-l-4 ${(stats?.lowStockCount || 0) > 0 ? 'border-l-orange-500' : 'border-l-green-500'}`}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Low Stock Items
                            </CardTitle>
                            <div className={`rounded-full p-2 ${(stats?.lowStockCount || 0) > 0 ? 'bg-orange-100' : 'bg-green-100'}`}>
                                <AlertTriangle className={`h-4 w-4 ${(stats?.lowStockCount || 0) > 0 ? 'text-orange-600' : 'text-green-600'}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${(stats?.lowStockCount || 0) > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                                {stats?.lowStockCount || 0}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats?.outOfStockCount || 0} out of stock
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Secondary Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
                            <Tags className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalCategories || 0}</div>
                            <p className="text-xs text-muted-foreground">{stats?.categoriesWithProducts || 0} with products</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Value</CardTitle>
                            <ShoppingBasket className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats?.inventoryValue || 0)}</div>
                            <p className="text-xs text-muted-foreground">At selling price</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Sales</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats?.todayRevenue || 0)}</div>
                            <p className="text-xs text-muted-foreground">{stats?.todayTransactions || 0} transactions</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Customers</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalCustomers || 0}</div>
                            <p className="text-xs text-muted-foreground">Registered customers</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts and Tables Row */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Sales Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Sales Last 7 Days
                            </CardTitle>
                            <CardDescription>Daily revenue overview</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {dailySales?.map((day, index) => (
                                    <div key={index} className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">{day.day} ({day.date})</span>
                                            <span className="font-medium">{formatCurrency(day.sales)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Progress 
                                                value={(day.sales / maxSales) * 100} 
                                                className="h-2 flex-1"
                                            />
                                            <span className="text-xs text-muted-foreground w-20 text-right">
                                                {day.count} orders
                                            </span>
                                        </div>
                                    </div>
                                )) || (
                                    <p className="text-muted-foreground text-center py-4">No sales data available</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Methods */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Payment Methods
                            </CardTitle>
                            <CardDescription>Sales breakdown by payment type</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-green-100 p-2">
                                            <Banknote className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Cash</p>
                                            <p className="text-sm text-muted-foreground">Physical payments</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-green-600">{formatCurrency(stats?.cashSales || 0)}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {(stats?.totalRevenue || 0) > 0 ? Math.round(((stats?.cashSales || 0) / stats.totalRevenue) * 100) : 0}% of total
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 border border-blue-200">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-blue-100 p-2">
                                            <CreditCard className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">GCash</p>
                                            <p className="text-sm text-muted-foreground">Digital payments</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-blue-600">{formatCurrency(stats?.gcashSales || 0)}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {(stats?.totalRevenue || 0) > 0 ? Math.round(((stats?.gcashSales || 0) / stats.totalRevenue) * 100) : 0}% of total
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-green-600">Cash</span>
                                    <span className="text-blue-600">GCash</span>
                                </div>
                                <div className="h-3 rounded-full bg-gray-200 overflow-hidden flex">
                                    <div 
                                        className="bg-green-500 h-full transition-all"
                                        style={{ width: `${(stats?.totalRevenue || 0) > 0 ? ((stats?.cashSales || 0) / stats.totalRevenue) * 100 : 50}%` }}
                                    />
                                    <div 
                                        className="bg-blue-500 h-full transition-all"
                                        style={{ width: `${(stats?.totalRevenue || 0) > 0 ? ((stats?.gcashSales || 0) / stats.totalRevenue) * 100 : 50}%` }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Refund Statistics */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* POS Refunds */}
                    <Card className="border-l-4 border-l-orange-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <RotateCcw className="h-5 w-5 text-orange-600" />
                                POS Refunds (Product Sales)
                            </CardTitle>
                            <CardDescription>Refunds from product transactions</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                                    <p className="text-sm text-muted-foreground">Total Refunded</p>
                                    <p className="text-2xl font-bold text-orange-600">{formatCurrency(stats?.posRefundedAmount || 0)}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-gray-50 border">
                                    <p className="text-sm text-muted-foreground">Transactions Affected</p>
                                    <p className="text-2xl font-bold">{stats?.posRefundedCount || 0}</p>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-orange-400"></span>
                                    <span className="text-muted-foreground">Partial Refund:</span>
                                    <span className="font-medium">{stats?.posPartialRefunds || 0}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                    <span className="text-muted-foreground">Fully Refunded:</span>
                                    <span className="font-medium">{stats?.posFullRefunds || 0}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Repair Refunds */}
                    <Card className="border-l-4 border-l-red-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wrench className="h-5 w-5 text-red-600" />
                                Repair Refunds
                            </CardTitle>
                            <CardDescription>Refunds from repair order payments</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                                    <p className="text-sm text-muted-foreground">Total Refunded</p>
                                    <p className="text-2xl font-bold text-red-600">{formatCurrency(stats?.repairRefundedAmount || 0)}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-gray-50 border">
                                    <p className="text-sm text-muted-foreground">Payments Refunded</p>
                                    <p className="text-2xl font-bold">{stats?.repairRefundedCount || 0}</p>
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50">
                                <p className="text-sm text-muted-foreground">
                                    Combined refunds: <span className="font-medium text-foreground">{formatCurrency((stats?.posRefundedAmount || 0) + (stats?.repairRefundedAmount || 0))}</span>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Section */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Recent Transactions */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Receipt className="h-5 w-5" />
                                    Recent Transactions
                                </CardTitle>
                                <CardDescription>Latest sales activity</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/transactions" className="gap-1">
                                    View All <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {recentTransactions?.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Reference</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Payment</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentTransactions.map((transaction) => (
                                            <TableRow key={transaction.id} className="cursor-pointer hover:bg-muted/50">
                                                <TableCell className="font-mono text-sm font-medium text-primary">
                                                    <Link href={`/transactions/${transaction.id}`}>
                                                        {transaction.reference_number}
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {formatDate(transaction.created_at)}
                                                </TableCell>
                                                <TableCell>
                                                    {transaction.payment_method === 'cash' ? (
                                                        <Badge className="bg-green-100 text-green-700 gap-1">
                                                            <Banknote className="h-3 w-3" />
                                                            Cash
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-blue-100 text-blue-700 gap-1">
                                                            <CreditCard className="h-3 w-3" />
                                                            GCash
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right font-medium text-green-600">
                                                    {formatCurrency(transaction.total)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                    <Receipt className="h-12 w-12 mb-2 opacity-50" />
                                    <p>No transactions yet</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Low Stock Items */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                                    Low Stock Alert
                                </CardTitle>
                                <CardDescription>Items needing restock</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/products" className="gap-1">
                                    View All <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {lowStockItems?.length > 0 ? (
                                <div className="space-y-3">
                                    {lowStockItems.map((item) => (
                                        <div 
                                            key={item.id} 
                                            className="flex items-center justify-between p-3 rounded-lg border bg-orange-50/50"
                                        >
                                            <div>
                                                <p className="font-medium text-sm">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">SKU: {item.SKU}</p>
                                            </div>
                                            <Badge 
                                                variant="outline" 
                                                className={item.stock_quantity === 0 
                                                    ? 'border-red-300 bg-red-100 text-red-700' 
                                                    : 'border-orange-300 bg-orange-100 text-orange-700'
                                                }
                                            >
                                                {item.stock_quantity} left
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                    <Package className="h-12 w-12 mb-2 opacity-50 text-green-500" />
                                    <p className="text-green-600">All items well stocked!</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Top Selling Products */}
                {topProducts?.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                Top Selling Products
                            </CardTitle>
                            <CardDescription>Best performers this period</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                                {topProducts.map((product, index) => (
                                    <div 
                                        key={product.id}
                                        className="flex flex-col items-center p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="relative mb-3">
                                            {product.image ? (
                                                <img
                                                    src={`/storage/${product.image}`}
                                                    alt={product.name}
                                                    className="h-16 w-16 rounded-lg object-cover border"
                                                />
                                            ) : (
                                                <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                                                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                            )}
                                            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center">
                                                {index + 1}
                                            </Badge>
                                        </div>
                                        <p className="font-medium text-sm text-center line-clamp-2">{product.name}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{product.total_sold} sold</p>
                                        <p className="text-sm font-semibold text-green-600 mt-1">
                                            {formatCurrency(product.total_revenue)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Frequently used actions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
                                <Link href="/pos">
                                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                                    <span>Open POS</span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
                                <Link href="/products/create">
                                    <Package className="h-6 w-6 text-purple-600" />
                                    <span>Add Product</span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
                                <Link href="/categories/create">
                                    <Tags className="h-6 w-6 text-green-600" />
                                    <span>Add Category</span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
                                <Link href="/transactions">
                                    <Receipt className="h-6 w-6 text-orange-600" />
                                    <span>View Transactions</span>
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
