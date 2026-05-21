interface TaskIconProps {
  size?: number;
  className?: string;
}

export function TaskIcon({ size = 24, className = '' }: TaskIconProps) {
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
        d="M14.4961 2.00024H9.49609C8.66767 2.00024 7.99609 2.67182 7.99609 3.50024C7.99609 4.32867 8.66767 5.00024 9.49609 5.00024H14.4961C15.3245 5.00024 15.9961 4.32867 15.9961 3.50024C15.9961 2.67182 15.3245 2.00024 14.4961 2.00024Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.99609 15.0002H11.4247M7.99609 11.0002H15.9961"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.9961 3.50024C17.5496 3.54706 18.4761 3.72032 19.1174 4.36161C19.9961 5.24029 19.9961 6.65448 19.9961 9.48287V15.9997C19.9961 18.8282 19.9961 20.2424 19.1174 21.1211C18.2387 21.9997 16.8245 21.9997 13.9961 21.9997H9.99609C7.16767 21.9997 5.75346 21.9997 4.87478 21.1211C3.9961 20.2424 3.9961 18.8282 3.99609 15.9998L3.99611 9.48293C3.9961 6.6545 3.9961 5.24028 4.87478 4.3616C5.51606 3.72031 6.44261 3.54705 7.99599 3.50024"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
