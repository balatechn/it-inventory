import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-[#070B47] text-white hover:bg-[#0a1060] focus-visible:ring-[#070B47]',
        secondary: 'bg-[#6A89A7] text-white hover:bg-[#5a7997] focus-visible:ring-[#6A89A7]',
        destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
        outline: 'border border-[#6A89A7] text-[#070B47] hover:bg-gray-50 focus-visible:ring-[#6A89A7]',
        ghost: 'text-[#070B47] hover:bg-gray-100 focus-visible:ring-[#070B47]',
        link: 'text-[#070B47] underline-offset-4 hover:underline',
        success: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-600',
        warning: 'bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-md px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
