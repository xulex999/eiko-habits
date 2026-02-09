import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, className = '', children, ...props }, ref) => {
    const baseStyles = 'font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] focus:ring-[var(--primary)]',
      secondary: 'bg-[var(--subtle-bg)] text-[var(--text-primary)] hover:bg-[var(--border)] focus:ring-[var(--border)]',
      outline: 'border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--subtle-bg)] focus:ring-[var(--border)]',
      ghost: 'text-[var(--text-secondary)] hover:bg-[var(--subtle-bg)] hover:text-[var(--text-primary)] focus:ring-[var(--subtle-bg)]',
      destructive: 'bg-[var(--destructive)] text-white hover:bg-[var(--destructive)]/90 focus:ring-[var(--destructive)]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
