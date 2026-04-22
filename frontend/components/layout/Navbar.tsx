"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bus, LogIn, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { isAuthenticated, isStaff, logout } from "@/services/auth";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [staff, setStaff] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setAuthed(isAuthenticated());
    setStaff(isStaff());
  }, [pathname]);

  function handleLogout() {
    logout();
    router.push("/");
  }

  const links = [
    { href: "/viajes", label: "Viajes" },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-primary text-xl">
          <Bus className="h-6 w-6" />
          <span>TicketWay</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname.startsWith(l.href) ? "text-primary" : "text-muted-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {staff && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin">
                <LayoutDashboard className="h-4 w-4" />
                Admin
              </Link>
            </Button>
          )}
          {authed ? (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Salir
            </Button>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/login">
                <LogIn className="h-4 w-4" />
                Administrador
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
          {staff && (
            <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary">
              Admin Panel
            </Link>
          )}
          {authed ? (
            <button onClick={handleLogout} className="text-sm font-medium text-left text-muted-foreground hover:text-primary">
              Cerrar sesión
            </button>
          ) : (
            <Link href="/admin/login" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary">
              Administrador
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
