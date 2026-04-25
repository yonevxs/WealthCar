interface CarIconProps {
  className?: string;
}

export default function CarIcon({ className = "w-6 h-6" }: CarIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Car body */}
      <path
        d="M4 16H2V11L5.5 6H18.5L22 11V16H20"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Windows */}
      <path
        d="M6 11L7.5 7H16.5L18 11H6Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left wheel */}
      <circle cx="7.5" cy="16.5" r="1.5" stroke="currentColor" strokeWidth="1.6" />
      {/* Right wheel */}
      <circle cx="16.5" cy="16.5" r="1.5" stroke="currentColor" strokeWidth="1.6" />
      {/* Undercarriage between wheels */}
      <path
        d="M9 16.5H15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
