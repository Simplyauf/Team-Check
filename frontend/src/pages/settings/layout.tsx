import { cn } from "@/lib/utils";
import {
  Building2,
  Users2,
  ShieldCheck,
  Plug,
  CreditCard,
  UserCircle,
  Bell,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const navItems = [
  {
    title: "General",
    href: "/settings/general",
    icon: Building2,
  },
  // {
  //   title: "Teams",
  //   href: "/settings/teams",
  //   icon: Users,
  // },
  // {
  //   title: "Members",
  //   href: "/settings/members",
  //   icon: Users2,
  // },
  {
    title: "Permissions",
    href: "/settings/permissions",
    icon: ShieldCheck,
  },
  {
    title: "Security",
    href: "/settings/security",
    icon: ShieldCheck,
  },
  {
    title: "Integrations",
    href: "/settings/integrations",
    icon: Plug,
  },
  {
    title: "Billing",
    href: "/settings/billing",
    icon: CreditCard,
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 p-8 pt-6 space-y-4">
      <div className="flex justify-between items-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      <Separator />
      <div className="space-y-6">
        <nav className="flex space-x-2 border-b">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent hover:text-primary"
                )
              }
            >
              <item.icon className="w-4 h-4" />
              {item.title}
            </NavLink>
          ))}
        </nav>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
