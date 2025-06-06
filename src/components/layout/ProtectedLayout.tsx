
'use client';

import React, { useEffect, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger, SidebarHeader, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';
import { AppLogo } from '@/components/layout/app-logo';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Button } from '@/components/ui/button';
import { BellIcon, LogOut, SettingsIcon } from 'lucide-react';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== '/login') {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading application...</p>
      </div>
    );
  }

  if (!isAuthenticated && pathname !== '/login') {
    // This case should ideally be handled by the useEffect redirect,
    // but as a fallback, render nothing or a minimal loading state.
    return null;
  }

  if (pathname === '/login') {
    return <>{children}</>; // Render login page without sidebar/header
  }

  return (
    <SidebarProvider defaultOpen={true} collapsible="icon">
      <Sidebar side="left" variant="sidebar" className="flex flex-col">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <AppLogo src="/logo.png" width={32} height={32} alt="Quoriam Foods Logo" />
            <h1 className="text-xl font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">Quoriam Foods</h1>
          </div>
        </SidebarHeader>
        <SidebarContent className="flex-1 overflow-y-auto">
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="p-2 mt-auto border-t border-sidebar-border space-y-1">
          <div className="text-xs text-muted-foreground px-2 group-data-[collapsible=icon]:hidden">
            {user?.email && <p>Logged in as: {user.email}</p>}
            {user?.role && <p>Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>}
          </div>
          <Button variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:justify-center">
            <SettingsIcon className="w-5 h-5" />
            <span className="ml-2 group-data-[collapsible=icon]:hidden">Settings</span>
          </Button>
          <Button variant="ghost" onClick={logout} className="w-full justify-start group-data-[collapsible=icon]:justify-center">
            <LogOut className="w-5 h-5" />
            <span className="ml-2 group-data-[collapsible=icon]:hidden">Logout</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-background/80 backdrop-blur-sm border-b">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          <div className="hidden font-medium md:block">
            {/* Could show current page title here */}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <BellIcon className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            {/* User Avatar/Menu Placeholder */}
          </div>
        </header>
        <main className="flex-1 p-4 overflow-auto md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
