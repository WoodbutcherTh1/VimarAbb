"use client";

import { SHOWROOM_CONTACT } from "@/lib/showroomConfig";

export default function WhatsAppFloat() {
  const number = SHOWROOM_CONTACT.whatsappNumber;
  if (!number) return null;

  return (
    <a
      href={`https://wa.me/${number}?text=${encodeURIComponent(
        "Hello KAHANA Electrical, I'd like to ask about your products."
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] shadow-lg shadow-emerald-900/25 transition-transform hover:scale-105"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white" aria-hidden="true">
        <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2.05 22l5.3-1.39a9.87 9.87 0 0 0 4.69 1.19c5.46 0 9.9-4.44 9.9-9.9a9.83 9.83 0 0 0-2.9-7A9.83 9.83 0 0 0 12.04 2Zm0 18.13c-1.54 0-3.05-.41-4.36-1.2l-.31-.19-3.13.82.84-3.05-.2-.31a8.16 8.16 0 0 1-1.26-4.35c0-4.52 3.67-8.19 8.19-8.19a8.13 8.13 0 0 1 5.79 2.4 8.13 8.13 0 0 1 2.4 5.79c0 4.52-3.68 8.19-8.19 8.19Zm4.49-6.13c-.25-.12-1.46-.72-1.69-.8-.22-.08-.39-.12-.55.13-.16.24-.63.8-.77.96-.14.16-.28.18-.53.06-.24-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.01-.38.11-.5.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.3-.22.24-.86.84-.86 2.05 0 1.21.88 2.37 1 2.54.12.16 1.73 2.64 4.19 3.7.59.26 1.04.41 1.4.52.59.19 1.12.16 1.54.1.47-.07 1.46-.6 1.66-1.17.2-.58.2-1.07.14-1.17-.06-.1-.22-.16-.47-.28Z" />
      </svg>
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-navy-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        Chat with us
      </span>
    </a>
  );
}