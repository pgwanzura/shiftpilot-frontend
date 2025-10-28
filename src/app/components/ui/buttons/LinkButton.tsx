import Link from 'next/link';
import { Icon } from '@/app/components/ui';
import { IconName } from '@/config/icons';
{
}

interface LinkButtonProps {
  href: string;
  title: string;
  className?: string;
  icon?: IconName;
}

export default function LinkButton({
  href,
  title,
  className = '',
  icon,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-all duration-200 ${className}`}
    >
      {icon && <Icon name={icon} className="mr-2" />}
      {title}
    </Link>
  );
}
