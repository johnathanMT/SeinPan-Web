// lucide-react 1.x ships no brand logos, so these are drawn inline.
interface IconProps {
  size?: number;
  className?: string;
}

export function FacebookIcon({ size = 18, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

export function MessengerIcon({ size = 18, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2C6.48 2 2 6.14 2 11.25c0 2.92 1.46 5.52 3.74 7.24V22l3.42-1.88c.9.25 1.85.38 2.84.38 5.52 0 10-4.14 10-9.25S17.52 2 12 2Zm1.07 12.47-2.56-2.73-5 2.73 5.5-5.84 2.61 2.73 4.95-2.73-5.5 5.84Z" />
    </svg>
  );
}

export function ViberIcon({ size = 18, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2.6c5.1 0 8.6 2.5 8.6 7.5v1.4c0 5-3.5 7.5-8.6 7.5-.9 0-1.8-.1-2.6-.3L6.3 21v-3.1c-1.9-1.2-2.9-3.4-2.9-6.4v-1.4c0-5 3.5-7.5 8.6-7.5Z" />
      <path
        d="M9.3 7.4c.3-.3.8-.3 1 .1l.8 1.3c.2.3.1.7-.1.9l-.5.5c.4 1 1.2 1.8 2.2 2.2l.5-.5c.3-.3.7-.3.9-.1l1.3.8c.4.2.4.7.1 1l-.6.6c-.6.6-1.6.7-2.4.3a7.2 7.2 0 0 1-3.8-3.8c-.4-.8-.3-1.8.3-2.4Z"
        fill="currentColor"
        stroke="none"
      />
      <path d="M13.2 5.6a4 4 0 0 1 3.5 3.5" />
      <path d="M13.2 7.6a2 2 0 0 1 1.6 1.6" />
    </svg>
  );
}
