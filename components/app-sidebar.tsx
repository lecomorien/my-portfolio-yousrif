"use client"

import * as React from "react"
import {
  IconBook,
  IconChartBar,
  IconChartLine,
  IconDashboard,
  IconFolder,
  IconInnerShadowTop,
  IconLayoutDashboard,
  IconListDetails,
  IconSchool,
  IconSearch,
  IconUsers,
} from "@tabler/icons-react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"


const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconLayoutDashboard,
      highlight: true,
    },
    {
      title: "Profile",
      url: "/dashboard/profiles",
      icon: IconChartBar,
      highlight: false,
    },
    {
      title: "Services",
      url: "/dashboard/services",
      icon: IconChartBar,
      highlight: false,
    },
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: IconFolder,
      highlight: false,
    },
    {
      title: "Skills",
      url: "/dashboard/skills",
      icon: IconFolder,
      highlight: false,
    },
    {
      title: "Experiences",
      url: "/dashboard/experiences",
      icon: IconChartBar,
      highlight: false,
    },
    {
      title: "Messages",
      url: "/dashboard/messages",
      icon: IconChartBar,
      highlight: false,
    },
    {
      title: "Categorie pour les projets",
      url: "/dashboard/categories",
      icon: IconChartBar,
      highlight: false,
    },
    {
      title: "Categorie pour les skills",
      url: "/dashboard/skill_categories",
      icon: IconChartBar,
      highlight: false,
    },
    {
      title: "Navs",
      url: "/dashboard/navlinks",
      icon: IconChartBar,
      highlight: false, 
    },
    {
      title: "Highlights",
      url: "/dashboard/profile_highlights",
      icon: IconChartBar,
      highlight: false, 
    },
    {
      title: "Stats",
      url: "/dashboard/profile_stats",
      icon: IconChartBar,
      highlight: false, 
    },
  ],
  navSecondary: [
    {
      title: "Search",
      url: "/dashboard/search",
      icon: IconSearch,
    },
  ],


}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
