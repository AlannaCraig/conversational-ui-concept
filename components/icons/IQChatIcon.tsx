/**
 * IQChatIcon Component
 * Small IQ chat icon for assistant messages
 */

interface IQChatIconProps {
  className?: string;
  size?: number;
}

export function IQChatIcon({ className = '', size = 24 }: IQChatIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_2488_6317)">
        <path
          d="M20.4208 0H3.57918C1.60245 0 0 1.60245 0 3.57918V20.4208C0 22.3976 1.60245 24 3.57918 24H20.4208C22.3976 24 24 22.3976 24 20.4208V3.57918C24 1.60245 22.3976 0 20.4208 0Z"
          fill="url(#paint0_linear_2488_6317)"
        />
        <path
          d="M5.13379 6.99487H7.15603V17.2053H5.13379V6.99487ZM18.5199 15.0204C18.0563 14.5583 17.4738 13.9743 17.0525 13.5529C16.7255 13.2259 16.4961 12.9965 16.4961 12.9965L14.7829 11.2834L13.3529 12.7151L14.9635 14.3273L15.6208 14.9829L17.0882 16.4504L17.8366 17.1988L19.2683 15.7687C19.2488 15.7492 18.9332 15.4336 18.5199 15.022V15.0204ZM17.8724 8.19718C15.1539 5.4786 10.2276 6.28395 8.81712 10.6099C8.52264 11.5144 8.5259 12.4922 8.82033 13.3967C9.68424 16.0502 11.8773 17.3778 14.0687 17.3778C14.3079 17.3778 14.547 17.3615 14.7846 17.3306V15.2872C13.7043 15.5198 12.5297 15.2172 11.6918 14.3794C10.7938 13.4814 10.4668 12.1636 10.8914 10.8685C10.9223 10.7758 10.9597 10.6831 11.0037 10.5952C11.643 9.29206 12.8567 8.63969 14.0703 8.63969C14.9326 8.63969 15.7932 8.9683 16.4489 9.62398C17.085 10.2601 17.4332 11.1028 17.4332 12.0008C17.4332 12.2432 17.4071 12.4841 17.3567 12.7167H19.3984C19.6132 11.1126 19.104 9.42871 17.874 8.19881L17.8724 8.19718Z"
          fill="white"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_2488_6317"
          x1="1.04772"
          y1="1.04772"
          x2="22.9523"
          y2="22.9523"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FCC54B" />
          <stop offset="0.06" stopColor="#F6A43F" />
          <stop offset="0.13" stopColor="#F18535" />
          <stop offset="0.21" stopColor="#ED6F2D" />
          <stop offset="0.27" stopColor="#EB6128" />
          <stop offset="0.33" stopColor="#EB5D27" />
          <stop offset="0.41" stopColor="#E95723" />
          <stop offset="0.5" stopColor="#E64819" />
          <stop offset="0.52" stopColor="#E54417" />
          <stop offset="1" stopColor="#E23F14" />
        </linearGradient>
        <clipPath id="clip0_2488_6317">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
