import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { BottomNav } from "@/components/bottom-nav";
import { toggleNotifyAction, toggleSoundAction, logoutFromSettingsAction } from "@/app/actions/settings";

function SettingsRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border py-3.5 last:border-none">
      <span className="text-sm">{label}</span>
      {children}
    </div>
  );
}

function Switch({ on }: { on: boolean }) {
  return (
    <span
      className={`relative inline-block h-6 w-10.5 flex-shrink-0 rounded-full transition-colors ${
        on ? "bg-primary" : "bg-surface-sunken"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
          on ? "translate-x-4.5" : ""
        }`}
      />
    </span>
  );
}

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-5 pt-6 pb-3.5">
        <Link href="/" aria-label="Back to home" className="text-ink-soft">
          ‹
        </Link>
        <span className="font-serif text-[17px] font-semibold">Settings</span>
        <span className="w-4" />
      </header>

      <main className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 pb-5">
        <div className="flex items-center gap-3.5 pb-1.5">
          <div className="flex h-13 w-13 flex-shrink-0 items-center justify-center rounded-full bg-primary font-serif text-xl font-semibold text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[15px] font-semibold">{user.name}</span>
            <span className="text-[12.5px] text-ink-soft">{user.email}</span>
          </div>
        </div>

        <div className="flex flex-col">
          <Link href="/premium" className="flex items-center justify-between gap-3 border-b border-border py-3.5">
            <span className="text-sm">Subscription</span>
            <span className="text-[13px] font-semibold text-accent">
              {user.isPremium ? "Premium" : "Free plan →"}
            </span>
          </Link>

          <form action={toggleNotifyAction}>
            <button type="submit" className="w-full">
              <SettingsRow label="Daily reminder notifications">
                <Switch on={user.notifyEnabled} />
              </SettingsRow>
            </button>
          </form>

          <form action={toggleSoundAction}>
            <button type="submit" className="w-full">
              <SettingsRow label="Study sounds">
                <Switch on={user.soundEnabled} />
              </SettingsRow>
            </button>
          </form>
        </div>

        <form action={logoutFromSettingsAction}>
          <button type="submit" className="w-full py-3.5 text-center text-[13.5px] font-bold text-again">
            Log Out
          </button>
        </form>

        <span className="text-center text-[11px] text-ink-soft">FlashMaster v1.0.0</span>
      </main>

      <BottomNav active="Settings" />
    </div>
  );
}
