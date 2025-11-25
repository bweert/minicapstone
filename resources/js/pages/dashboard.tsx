
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { TrendingUp, Wrench, ShoppingBasket, PhilippinePeso, ListCheck, BadgeCheck, ArrowDown, Sparkles } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Full-width welcome banner */}
                <div className="relative w-full overflow-hidden rounded-xl bg-indigo-600 p-8 shadow-lg">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                <Sparkles className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">
                                    Hello, {auth.user?.name || 'Admin'}! 👋
                                </h1>
                                <p className="mt-1 text-lg text-white/90">
                                    Welcome back to your dashboard
                                </p>
                            </div>
                        </div>
                        
                    </div>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card className="relative min-h-[130px] overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-lime-400 text-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm text-white/90">
                                <PhilippinePeso className="h-3.5 w-3.5 text-white" />
                                Total Sales
                            </CardTitle>
                            <CardDescription className="text-xs text-emerald-100">
                                Total sales of products and repairs
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-semibold">₱45,231.89</p>
                            <div className="flex items-center gap-1.5 text-xs text-emerald-50">
                                <TrendingUp className="h-3 w-3 text-lime-200" />
                                <span>+20.1%</span>
                                <span>from last month</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="relative min-h-[130px] overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400 text-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm text-orange-50/90">
                                <ShoppingBasket className="h-3.5 w-3.5 text-white" />
                                Product Sales
                            </CardTitle>
                            <CardDescription className="text-xs text-orange-100">
                                Total sales of products
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-semibold">₱45,231.89</p>
                            <div className="flex items-center gap-1.5 text-xs text-amber-50">
                                <TrendingUp className="h-3 w-3 text-yellow-200" />
                                <span>+20.1%</span>
                                <span>from last month</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="relative min-h-[130px] overflow-hidden bg-gradient-to-br from-amber-700 via-amber-600 to-yellow-400 text-zinc-50">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm text-zinc-100">
                                <Wrench className="h-3.5 w-3.5 text-yellow-200" />
                                Repair Sales
                            </CardTitle>
                            <CardDescription className="text-xs text-amber-100/90">
                                Total sales of repairs
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-semibold text-white">₱45,231.89</p>
                            <div className="flex items-center gap-1.5 text-xs text-amber-50/90">
                                <TrendingUp className="h-3 w-3 text-lime-200" />
                                <span>+20.1%</span>
                                <span>from last month</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="relative min-h-[130px] overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-slate-500 text-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm text-indigo-50">
                                <ListCheck className="h-3.5 w-3.5 text-yellow-200" />
                                Inventory Overview
                            </CardTitle>
                            <CardDescription className="text-xs text-indigo-100/90">
                                Products & spare parts on hand
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-1">
                            <p className="text-xl font-semibold">1,248 items</p>
                            <div className="text-xs text-indigo-50 flex items-center gap-1.5">
                                <TrendingUp className="h-3 w-3 text-lime-200" />
                                <span>+5.4% stock replenished</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="relative min-h-[130px] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 text-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm text-slate-100">
                                <BadgeCheck className="h-3.5 w-3.5 text-gradient-200" />
                                Total Sold Items
                            </CardTitle>
                            <CardDescription className="text-xs text-slate-300/90">
                                Units across products & repairs
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-semibold">1,254</p>
                            <div className="flex items-center gap-1.5 text-xs text-emerald-200 mt-0.5">
                                <TrendingUp className="h-3 w-3 text-emerald-200" />
                                <span>+12.6% units vs last month</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="relative min-h-[130px] overflow-hidden bg-gradient-to-br from-rose-700 via-rose-600 to-orange-500 text-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm text-white/90">
                            <ArrowDown className="h-3.5 w-3.5 text-white-200" />
                                Low Stock Items
                            </CardTitle>
                            <CardDescription className="text-xs text-white/70">
                                Items below reorder threshold
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-1">
                            <p className="text-xl font-semibold">17</p>
                            <div className="text-xs text-white/80">Needs immediate restock</div>
                            <ul className="text-xs text-white/70 space-y-0.5 leading-tight">
                                <li>• iPhone 12 glass – 3 remaining</li>    
                                <li>• Samsung batteries – 5 remaining</li>
                                <li>• Charger cables – 9 remaining</li>
                            </ul>
                        </CardContent>
                    </Card>




                </div>

            </div>
        </AppLayout>
    );
}
