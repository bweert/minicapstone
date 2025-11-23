
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { TrendingUp, Wrench, ShoppingBasket,PhilippinePeso } from 'lucide-react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card className="relative aspect-video overflow-hidden">
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <PhilippinePeso className='h-4 w-4' />
                                Total Sales
                            </CardTitle>
                            <CardDescription>Total sales of products and repairs</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">₱45,231.89</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                                <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                                <span className="text-green-600 dark:text-green-400">+20.1%</span>
                                <span>from last month</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                        </CardFooter>
                    </Card>
                    <Card className="relative aspect-video overflow-hidden">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingBasket className='h-4 w-4' />
                                Product Sales
                            </CardTitle>
                            <CardDescription>Total sales of products </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">₱45,231.89</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                                <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                                <span className="text-green-600 dark:text-green-400">+20.1%</span>
                                <span>from last month</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                        </CardFooter>
                    </Card>
                    <Card className="relative aspect-video overflow-hidden">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wrench className="h-4 w-4" />
                                Repair Sales
                            </CardTitle>
                            <CardDescription>Total sales of repairs</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">₱45,231.89</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                                <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                                <span className="text-green-600 dark:text-green-400">+20.1%</span>
                                <span>from last month</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                        </CardFooter>
                    </Card>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4 flex items-center justify-center">
                        <span className="text-lg">total sa tanan  products ug spair parts sa cp</span>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4 flex items-center justify-center">
                        <span className="text-lg"> total sa nag-parepair</span>
                    </div>



                </div>

            </div>
        </AppLayout>
    );
}
