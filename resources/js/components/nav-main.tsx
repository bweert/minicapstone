import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [], label = 'Platform' }: { items: NavItem[]; label?: string }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={page.url.startsWith(
                                resolveUrl(item.href),
                            )}
                            tooltip={{ children: item.title }}
                            className="relative"
                        >
                            <Link href={item.href} prefetch className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    {item.icon && 
                                        <item.icon size={18} strokeWidth={2} className="flex-shrink-0" />
                                    }
                                    <span>{item.title}</span>
                                </span>
                            </Link>
                        </SidebarMenuButton>
                        {(item as any).badge && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                {(item as any).badge}
                            </span>
                        )}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
