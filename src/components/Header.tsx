import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/useAuth";

const navItems = [
  { path: "/states", label: "States", icon: "📍" },
  { path: "/", label: "Main", icon: "🏠" },
  { path: "/generator", label: "Generator", icon: "📊" },
];

export function Header() {
  const location = useLocation();
  const { configured, user, profile, signInWithGoogle, signOut } = useAuth();

  return (
    <header className="w-full bg-nav-background">
      <div className="container flex h-12 items-center justify-between">
        <Link to="/" className="text-lg font-bold tracking-tight text-nav-foreground-active font-mono">
          PDF417.PRO
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-sm font-mono rounded transition-colors",
                  isActive
                    ? "text-nav-foreground-active"
                    : "text-nav-foreground hover:text-nav-foreground-active"
                )}
              >
                <span className="text-xs">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
          <Link
            to="/account"
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-sm font-mono rounded transition-colors",
              location.pathname === "/account" ? "text-nav-foreground-active" : "text-nav-foreground hover:text-nav-foreground-active"
            )}
          >
            Credits
          </Link>
          {profile?.is_admin && (
            <Link
              to="/admin"
              className={cn(
                "px-3 py-1.5 text-sm font-mono rounded transition-colors",
                location.pathname === "/admin" ? "text-nav-foreground-active" : "text-nav-foreground hover:text-nav-foreground-active"
              )}
            >
              Admin
            </Link>
          )}
          {user ? (
            <button
              type="button"
              onClick={async () => {
                const error = await signOut();
                if (error) toast.error(error);
              }}
              title={user.email ?? undefined}
              className="px-3 py-1.5 text-sm font-mono text-nav-foreground hover:text-nav-foreground-active"
            >
              Sign out
            </button>
          ) : (
            <button
              type="button"
              disabled={!configured}
              onClick={async () => {
                const error = await signInWithGoogle();
                if (error) toast.error(error);
              }}
              className="px-3 py-1.5 text-sm font-mono text-nav-foreground hover:text-nav-foreground-active disabled:opacity-50"
            >
              Google sign in
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
