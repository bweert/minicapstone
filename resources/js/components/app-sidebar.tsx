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
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { SquareUserRound, PhilippinePeso, Cog ,LayoutGrid,ShoppingBasket,Weight,Columns4,Wrench } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'categories',
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
        href: 'pos',
        icon: Weight,
    },
    {
        title: 'Repair Products',
        href: '#',
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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
