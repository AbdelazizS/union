import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

const IconButton = ({
  icon: Icon,
  label,
  variant = 'default',
  size = 'default',
  className,
  onClick,
  href,
  ...props
}) => {
  const buttonContent = (
    <Button
      variant={variant}
      size={size}
      className={cn('flex items-center gap-2', className)}
      onClick={onClick}
      {...props}
    >
      <Icon className="h-4 w-4" />
      {label && <span>{label}</span>}
    </Button>
  );

  const content = href ? (
    <Link href={href}>
      {buttonContent}
    </Link>
  ) : buttonContent;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 10
      }}
    >
      {content}
    </motion.div>
  );
};

export default IconButton; 