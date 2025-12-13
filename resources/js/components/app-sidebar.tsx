import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as categoriesIndex } from '@/routes/categories';
import { index as productsIndex } from '@/routes/products';
import {index as transactionsIndex} from '@/routes/transactions';
import {index as posIndex} from '@/routes/pos';
import { type NavItem } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { 
    Newspaper,
    SquareUserRound, 
    PhilippinePeso, 
    Cog,
    LayoutGrid,
    ShoppingBasket,
    Weight,
    Columns4,
    Wrench,
    Users,
    ClipboardList,
    Settings2,
    Package,
    CreditCard,
    BarChart3,
} from 'lucide-react';
import AppLogo from './app-logo';
import { useMemo } from 'react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Categories',
        href: categoriesIndex(),
        icon: Columns4,
    },
    {
        title: 'Products',
        href: productsIndex() ,
        icon: ShoppingBasket,
    },
    {
        title: 'Point of Sales',
        href: posIndex(),
        icon: Weight,
    },
    {
        title: 'Transactions',
        href: transactionsIndex(),
        icon: Newspaper,
    },
];

// Repair Management Navigation Items
const repairNavItems: NavItem[] = [
    {
        title: 'Customers',
        href: '/customers',
        icon: Users,
    },
    {
        title: 'Repair Orders',
        href: '/repair-orders',
        icon: ClipboardList,
    },
    {
        title: 'Services',
        href: '/repair-services',
        icon: Settings2,
    },
    {
        title: 'Spare Parts',
        href: '/spare-parts',
        icon: Package,
    },
    {
        title: 'Payments',
        href: '/payments',
        icon: CreditCard,
    },
];

const footerNavItems: NavItem[] = [
   //footer nav items can be added here
];  

export function AppSidebar() {
    const { props } = usePage();
    const products = Array.isArray((props as any).products) ? (props as any).products : [];
    
    // Calculate low stock count from props
    const lowStockCount = useMemo(() => {
        if (!Array.isArray(products)) return 0;
        return products.filter((product: any) => product.stock_quantity <= 10).length;
    }, [products]);
    
    // Create nav items with dynamic badge
    const navItems = mainNavItems.map(item => {
        if (item.title === 'Products' && lowStockCount > 0) {
            return {
                ...item,
                badge: lowStockCount.toString(),
                badgeVariant: 'destructive' as const,
            };
        }
        return item;
    });
    
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
                <NavMain items={repairNavItems} label="Repair Management" />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
