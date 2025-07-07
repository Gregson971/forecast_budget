import Link from 'next/link';

type MenuItemProps = {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
};

export default function MenuItem({ href, children, onClick }: MenuItemProps) {
  return (
    <Link href={href} className='text-gray-300 hover:text-white px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-300 font-medium' onClick={onClick}>
      {children}
    </Link>
  );
}
