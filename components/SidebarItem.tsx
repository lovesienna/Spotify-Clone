import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

interface SidebarItemProps {
  icon: IconType;
  label: string;
  active?: boolean;
  href: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon, //element로 사용할 수 있게 icon,을 이렇게 바꾼다.
  label,
  active,
  href,
}) => {
  return (
    <Link
      href={href}
      className={twMerge(
        `
  flex
  flex-row
  h-auto
    items-center
    w-full
    gap-x-4
    text-md
    font-medium
    cursor-pointer
    hover:text-white
transition
text-neutral-400
py-1
`,
        active && "text-white" //액티브가 트루면 텍스트 화이트 (hover)
      )}
    >
      <Icon size={26} />
      <p className="truncate w-full">{label}</p>
    </Link>
  );
};

export default SidebarItem;
