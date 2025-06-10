import { 
  Home, 
  Building2, 
  Calendar, 
  Users, 
  Settings, 
  FileText, 
  DollarSign,
  Tag,
  MessageSquare,
  HelpCircle,
  Handshake,
  Layers,
  ClipboardList,
  Percent,
  Clock
} from "lucide-react"
import { Link } from "@inertiajs/react"
import { cn } from "@/lib/utils"
import { useState } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"

// Menu items for cleaning services company
const menuItems = [
  {
    title: "Dashboard",
    url: route('dashboard'),
    icon: Home,
  },
  {
    title: "Services Management",
    icon: Layers,
    submenu: [
      {
        title: "Service Categories",
        url: route('admin.service-categories.index'),
        description: "Manage cleaning, security, and education categories"
      },
      {
        title: "Services",
        url: route('admin.services.index'),
        description: "Manage all services across categories"
      }
    ]
  },
  {
    title: "Bookings",
    url: route('admin.bookings.index'),
    icon: Calendar,
  },
  {
    title: "Coupons",
    url: route('admin.coupons.index'),
    icon: Percent,
    description: "Manage discount coupons and promotions"
  },
  {
    title: "Testimonials",
    url: route('admin.testimonials.index'),
    icon: MessageSquare,
  },
  {
    title: "Partners",
    url: route('admin.partners.index'),
    icon: Handshake,
  },
  {
    title: "FAQs",
    url: route('admin.faqs.index'),
    icon: HelpCircle,
  },
  {
    title: "Reports",
    icon: FileText,
    submenu: [
      {
        title: "Service Analytics",
        url: route('admin.reports.services'),
        description: "Service performance and metrics"
      },
      {
        title: "Booking Reports",
        url: route('admin.reports.bookings'),
        description: "Booking statistics and trends"
      },
      {
        title: "Financial Reports",
        url: route('admin.reports.financial'),
        description: "Revenue and financial analytics"
      }
    ]
  },
  // {
  //   title: "Settings",
  //   url: route('admin.settings.index'),
  //   icon: Settings,
  // },
]

export function AppSidebar() {
  const [openSubmenus, setOpenSubmenus] = useState({})

  const toggleSubmenu = (title) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  return (
    <Sidebar className="bg-white border-r border-gray-200 shadow-sm">
      <SidebarHeader className="border-b border-gray-200 bg-white/50 backdrop-blur-sm">
        <Link href={route('dashboard')} className="flex items-center justify-center p-6">
          <img src="/images/logo.png" alt="Company Logo" className="h-12 w-auto object-contain" />
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.submenu ? (
                    <>
                      <SidebarMenuButton
                        onClick={() => toggleSubmenu(item.title)}
                        className="flex items-center justify-between w-full px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-primary-600 transition-all duration-200 group"
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                          <span className="font-medium">{item.title}</span>
                        </div>
                      </SidebarMenuButton>
                      {openSubmenus[item.title] && (
                        <SidebarMenuSub>
                          {item.submenu.map((subItem) => (
                            <SidebarMenuSubButton
                              key={subItem.title}
                              asChild
                              className="px-6 py-2.5 text-sm text-gray-500 hover:text-primary-600 hover:bg-gray-50/50 transition-all duration-200"
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          ))}
                        </SidebarMenuSub>
                      )}
                    </>
                  ) : (
                    <SidebarMenuButton asChild>
                      <Link 
                        href={item.url}
                        className="flex items-center space-x-3 px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-primary-600 transition-all duration-200 group"
                      >
                        <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
