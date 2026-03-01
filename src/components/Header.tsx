import { Link, useLocation } from "react-router-dom";
import { MapPin, Home, Barcode } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/states", label: "States", icon: MapPin },
  { path: "/", label: "Main", icon: Home },
  { path: "/generator", label: "Generator", icon: Barcode },
];

export function Header() {
  const location = useLocation();

  return (
    <header className="w-full" style={{ backgroundColor: 'hsl(220 15% 20%)' }}>
      <div className="container flex h-12 items-center justify-between">
        <Link to="/" className="text-lg font-bold tracking-tight text-white">
          PDF417.PRO
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors",
                  isActive
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-200"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
