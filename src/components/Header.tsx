import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/useAuth";
import { useSiteSettings } from "@/contexts/useSiteSettings";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/generator", label: "Generator" },
  { path: "/states", label: "State formats" },
];

export function Header() {
  const location = useLocation();
  const { configured, user, profile, signInWithGoogle, signOut } = useAuth();
  const { settings } = useSiteSettings();

  const navLink = (path: string, label: string) => {
    const active = location.pathname === path;
    return (
      <Link
        key={path}
        to={path}
        aria-current={active ? "page" : undefined}
        className={cn(
          "shrink-0 whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium transition-colors sm:px-3.5",
          active
            ? "bg-white/10 text-white"
            : "text-[#aeb5ba] hover:bg-white/10 hover:text-white",
        )}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#202427] text-white shadow-sm">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-3 sm:gap-5 sm:px-6">
        <Link to="/" aria-label={`${settings.site_name} home`} className="flex min-w-0 shrink items-center gap-2.5">
          {settings.logo_url ? (
            <img src={settings.logo_url} alt="" className="h-9 max-w-36 object-contain" />
          ) : (
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#07584e] text-sm font-bold text-white shadow-sm shadow-[#07584e]/20">
              {settings.site_name.charAt(0).toUpperCase()}
            </span>
          )}
          <span className="truncate text-lg font-bold tracking-tight text-white">{settings.site_name}</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => navLink(item.path, item.label))}
          {navLink("/account", "Credits")}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {user ? (
            <>
              <Link
                to="/account"
                className="hidden rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:border-white/30 sm:inline-flex"
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
                className="rounded-full px-3 py-2 text-sm font-medium text-[#aeb5ba] hover:bg-white/10 hover:text-white"
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
              className="rounded-md bg-blue-600 px-4 text-white hover:bg-blue-500"
            >
              Sign in
            </Button>
          )}
        </div>
      </div>
      <nav aria-label="Mobile navigation" className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-1 border-t border-white/10 px-2 py-2 md:hidden">
        {navItems.map((item) => navLink(item.path, item.label))}
        {navLink("/account", "Credits")}
      </nav>
    </header>
  );
}
