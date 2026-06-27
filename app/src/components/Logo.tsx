interface LogoProps {
  className?: string;
  color?: string;
}

export default function Logo({ className = '', color = '#1A1A1A' }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="0"
        y="34"
        fill={color}
        fontFamily="Inter, sans-serif"
        fontSize="22"
        fontWeight="700"
        letterSpacing="0.5"
      >
        KORVANTIS IMPERIAL BANK
      </text>
    </svg>
  );
}
