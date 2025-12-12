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
import { SquareUserRound, PhilippinePeso, Cog ,LayoutGrid,ShoppingBasket,Weight,Columns4,Wrench } from 'lucide-react';
import AppLogo from './app-logo';
import { useState, useMemo, useEffect } from 'react';

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
        icon: Cog,
    },
    {
        title: 'Repairs',
        href: '#',
        icon: Wrench,
    },
    {
        title: 'Sales',
        href: '#',
        icon: PhilippinePeso,
    },
];

const footerNavItems: NavItem[] = [
   //footer nav items can be added here
];  

export function AppSidebar() {
    const { props } = usePage();
    const products = (props as any).products || [];
    
    // Calculate low stock count from props
    const lowStockCount = useMemo(() => {
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
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
