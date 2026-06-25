import { IconProps } from '@/lib/svg-icon-loader';

export function TaskListIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M14.4961 2.00049H9.49609C8.66767 2.00049 7.99609 2.67207 7.99609 3.50049C7.99609 4.32892 8.66767 5.00049 9.49609 5.00049H14.4961C15.3245 5.00049 15.9961 4.32892 15.9961 3.50049C15.9961 2.67207 15.3245 2.00049 14.4961 2.00049Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.99609 15.0005H11.4247M7.99609 11.0005H15.9961" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.9961 3.50049C17.5496 3.54731 18.4761 3.72057 19.1174 4.36186C19.9961 5.24054 19.9961 6.65473 19.9961 9.48312V15.9999C19.9961 18.8284 19.9961 20.2426 19.1174 21.1213C18.2387 21.9999 16.8245 21.9999 13.9961 21.9999H9.99609C7.16767 21.9999 5.75346 21.9999 4.87478 21.1213C3.9961 20.2426 3.9961 18.8284 3.99609 16L3.99611 9.48318C3.9961 6.65475 3.9961 5.24053 4.87478 4.36185C5.51606 3.72056 6.44261 3.5473 7.99599 3.50049" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
