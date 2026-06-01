interface FolderIconProps {
  size?: number;
  className?: string;
}

export function FolderIcon({ size = 24, className = '' }: FolderIconProps) {
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
        d="M2 9C2 7.34315 3.34315 6 5 6H9.58579C9.851 6 10.1054 6.10536 10.2929 6.29289L11.7071 7.70711C11.8946 7.89464 12.149 8 12.4142 8H19C20.6569 8 22 9.34315 22 11V17C22 18.6569 20.6569 20 19 20H5C3.34315 20 2 18.6569 2 17V9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
