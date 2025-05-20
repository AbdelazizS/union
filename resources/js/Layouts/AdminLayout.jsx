import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { Toaster } from "sonner"
import AdminNavbar from "@/Components/Admin/AdminNavbar"
import { usePage } from '@inertiajs/react';

export default function Layout({ children }) {
  const { url } = usePage();
  
  // Generate breadcrumbs based on current URL
  const generateBreadcrumbs = () => {
    const paths = url.split('/').filter(Boolean);
    if (paths[0] !== 'admin') return [];

    return paths.slice(1).map((path, index) => {
      const href = `/admin/${paths.slice(1, index + 2).join('/')}`;
      return {
        label: path.charAt(0).toUpperCase() + path.slice(1),
        href
      };
    });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 w-full min-w-0">
          <AdminNavbar breadcrumbs={generateBreadcrumbs()} />
          <div className="w-full p-4 md:p-6">
            <SidebarTrigger />
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </SidebarProvider>
  )
}
