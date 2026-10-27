import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/useAuth";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/generator", label: "Generator" },
  { path: "/states", label: "State formats" },
];

export function Header() {
  const location = useLocation();
  const { configured, user, profile, signInWithGoogle, signOut } = useAuth();

  const navLink = (path: string, label: string) => {
    const active = location.pathname === path;
    return (
      <Link
        key={path}
        to={path}
        aria-current={active ? "page" : undefined}
        className={cn(
          "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
          active
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="container flex h-[68px] max-w-7xl items-center justify-between gap-5">
        <Link to="/" aria-label="PDF417 Pro home" className="flex shrink-0 items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm shadow-primary/25">
            P
          </span>
          <span className="text-[15px] font-bold tracking-tight text-foreground">
            PDF417<span className="text-primary">.PRO</span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => navLink(item.path, item.label))}
          {navLink("/account", "Credits")}
          {profile?.is_admin && navLink("/admin", "Admin")}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {user ? (
            <>
              <Link
                to="/account"
                className="hidden rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:border-primary/40 sm:inline-flex"
              >
                {profile?.credit_balance ?? "—"} credits
              </Link>
              <button
                type="button"
                onClick={async () => {
                  const error = await signOut();
                  if (error) toast.error(error);
                }}
                title={user.email ?? undefined}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Sign out
              </button>
            </>
          ) : (
            <Button
              size="sm"
              disabled={!configured}
              onClick={async () => {
                const error = await signInWithGoogle();
                if (error) toast.error(error);
              }}
              className="rounded-full px-4"
            >
              Sign in
            </Button>
          )}
        </div>
      </div>
      <nav aria-label="Mobile navigation" className="container flex max-w-7xl gap-1 overflow-x-auto pb-2 md:hidden">
        {navItems.map((item) => navLink(item.path, item.label))}
        {navLink("/account", "Credits")}
        {profile?.is_admin && navLink("/admin", "Admin")}
      </nav>
    </header>
  );
}
