import Link from "next/link";

const ITEMS = [
  { href: "/", label: "Home" },
  { href: "/", label: "Decks" },
  { href: "/stats", label: "Stats" },
  { href: "/settings", label: "Settings" },
] as const;

export function BottomNav({ active }: { active: "Home" | "Decks" | "Stats" | "Settings" }) {
  return (
    <nav className="flex items-center justify-around border-t border-border bg-surface px-0 py-3 pb-5">
      {ITEMS.map((item) => {
        const isActive = item.label === active;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-2.5 text-[11px] font-semibold ${
              isActive ? "text-primary" : "text-ink-soft"
            }`}
          >
            {item.label}
            <span className={`h-1 w-1 rounded-full ${isActive ? "bg-primary" : "bg-transparent"}`} />
          </Link>
        );
      })}
    </nav>
  );
}
