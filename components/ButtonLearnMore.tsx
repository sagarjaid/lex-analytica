import Link from "next/link";

interface ButtonLearnMoreProps {
  href: string;
  text: string;
  className?: string;
}

const ButtonLearnMore = ({
  href,
  text,
  className = "",
}: ButtonLearnMoreProps) => {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 bg-base-100 border border-base-300 hover:bg-base-200 px-4 py-2 w-fit text-base-content transition-colors duration-200 ${className}`}
    >
      <span className="text-sm font-semibold">{text}</span>
      <svg
        className="w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
        />
      </svg>
    </Link>
  );
};

export default ButtonLearnMore;
