interface ReportIconProps {
  size?: number;
  className?: string;
}

export function ReportIcon({ size = 24, className = '' }: ReportIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M20.9878 21H9.98779C6.68796 21 5.03804 21 4.01292 19.9749C2.98779 18.9497 2.98779 17.2998 2.98779 14V3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6.98779 7C7.61637 5.87847 8.4691 5 9.78109 5C15.328 5 12.2102 17 18.1709 17C19.4922 17 20.3398 16.1157 20.9878 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M10.9999 11.0006H10.9874M11.0124 11.0006C11.0124 11.0144 11.0012 11.0256 10.9874 11.0256C10.9736 11.0256 10.9624 11.0144 10.9624 11.0006C10.9624 10.9868 10.9736 10.9756 10.9874 10.9756C11.0012 10.9756 11.0124 10.9868 11.0124 11.0006Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.9999 11.0006H6.9874M7.0124 11.0006C7.0124 11.0144 7.00121 11.0256 6.9874 11.0256C6.97359 11.0256 6.9624 11.0144 6.9624 11.0006C6.9624 10.9868 6.97359 10.9756 6.9874 10.9756C7.00121 10.9756 7.0124 10.9868 7.0124 11.0006Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.9999 11.0006H20.9874M21.0124 11.0006C21.0124 11.0144 21.0012 11.0256 20.9874 11.0256C20.9736 11.0256 20.9624 11.0144 20.9624 11.0006C20.9624 10.9868 20.9736 10.9756 20.9874 10.9756C21.0012 10.9756 21.0124 10.9868 21.0124 11.0006Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.9999 11.0006H16.9874M17.0124 11.0006C17.0124 11.0144 17.0012 11.0256 16.9874 11.0256C16.9736 11.0256 16.9624 11.0144 16.9624 11.0006C16.9624 10.9868 16.9736 10.9756 16.9874 10.9756C17.0012 10.9756 17.0124 10.9868 17.0124 11.0006Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
