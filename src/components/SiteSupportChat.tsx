import { MessageCircle } from "lucide-react";

export function SiteSupportChat() {
  return (
    <a
      href="https://t.me/PDF417_PRO"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact site support on Telegram"
      className="fixed bottom-5 right-4 z-50 inline-flex h-12 items-center gap-2 rounded-full bg-[#07584e] px-4 text-sm font-semibold text-white shadow-lg shadow-[#07584e]/25 transition-colors hover:bg-[#06483f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#07584e] focus-visible:ring-offset-2"
    >
      <MessageCircle aria-hidden="true" className="h-5 w-5" />
      <span>Site support</span>
    </a>
  );
}
