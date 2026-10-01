import { ThemeToggle } from "@/components/theme-toggle";
import { headerContent } from "@/content/header";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <span className="text-lg font-semibold">{headerContent.brand}</span>
        <div className="flex items-center gap-4">
          <nav>
            <ul className="flex gap-4 text-sm">
              {headerContent.navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle label={headerContent.themeToggle.label} />
        </div>
      </div>
    </header>
  );
}
