import { twMerge } from "tailwind-merge"

type LoadingProps = {
  size?: number
  className?: string
}

const Loading = ({ size = 24, className }: LoadingProps) => {
  const klassName = "animate-spin text-gray-500 mx-auto"
  return (
    <svg
      className={twMerge(klassName, className)}
      style={{ width: size, height: size }}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

export default Loading
