/**
 * IQIcon Component
 * IQ logo with gradient colors
 */

interface IQIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export function IQIcon({ className = '', width = 64, height = 48 }: IQIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 64 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M46.2117 47.1822C41.1085 48.5496 35.6967 48.1949 30.8156 46.1731C25.9346 44.1513 21.857 40.5754 19.2154 36C16.5738 31.4246 15.5157 26.1054 16.2053 20.8674C16.8949 15.6294 19.2937 10.7653 23.0295 7.02947C26.7653 3.29367 31.6294 0.894955 36.8674 0.205357C42.1054 -0.484241 47.4246 0.573813 52 3.21542C56.5754 5.85703 60.1513 9.93456 62.1731 14.8156C64.1949 19.6967 64.5496 25.1085 63.1822 30.2117L53.9093 27.727C54.7298 24.6651 54.5169 21.418 53.3039 18.4894C52.0908 15.5607 49.9452 13.1142 47.2 11.5293C44.4548 9.94429 41.2632 9.30946 38.1204 9.72322C34.9776 10.137 32.0592 11.5762 29.8177 13.8177C27.5762 16.0592 26.137 18.9776 25.7232 22.1204C25.3095 25.2632 25.9443 28.4548 27.5293 31.2C29.1142 33.9452 31.5607 36.0908 34.4894 37.3039C37.418 38.5169 40.6651 38.7298 43.727 37.9093L46.2117 47.1822Z"
        fill="url(#paint0_radial_274_3)"
      />
      <path
        d="M63.9941 41.2058L57.2058 47.9941L36.6058 27.3941L43.3941 20.6058L63.9941 41.2058Z"
        fill="url(#paint1_radial_274_3)"
      />
      <path
        d="M0 0.639999H9.59999V47.36H0V0.639999Z"
        fill="url(#paint2_radial_274_3)"
      />
      <defs>
        <radialGradient
          id="paint0_radial_274_3"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(22.95 12.8) rotate(-2.15057) scale(35.9753 47.9671)"
        >
          <stop stopColor="#FCC54C" />
          <stop offset="0.6" stopColor="#F15D22" />
          <stop offset="1" stopColor="#E23F13" />
        </radialGradient>
        <radialGradient
          id="paint1_radial_274_3"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(22.95 12.8) rotate(-2.15057) scale(35.9753 47.9671)"
        >
          <stop stopColor="#FCC54C" />
          <stop offset="0.6" stopColor="#F15D22" />
          <stop offset="1" stopColor="#E23F13" />
        </radialGradient>
        <radialGradient
          id="paint2_radial_274_3"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(22.95 12.8) rotate(-2.15057) scale(35.9753 47.9671)"
        >
          <stop stopColor="#FCC54C" />
          <stop offset="0.6" stopColor="#F15D22" />
          <stop offset="1" stopColor="#E23F13" />
        </radialGradient>
      </defs>
    </svg>
  );
}
