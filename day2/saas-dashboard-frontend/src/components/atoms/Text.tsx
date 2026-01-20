import React from 'react';

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'heading1' | 'heading2' | 'heading3' | 'body' | 'caption';
  children: React.ReactNode;
  as?: React.ElementType;
}

const Text: React.FC<TextProps> = ({
  variant = 'body',
  children,
  as: Component = 'p',
  className = '',
  ...props
}) => {
  const variantStyles = {
    heading1: 'text-4xl font-extrabold',
    heading2: 'text-3xl font-bold',
    heading3: 'text-2xl font-semibold',
    body: 'text-base',
    caption: 'text-sm text-gray-500',
  }[variant];

  return (
    <Component className={`${variantStyles} ${className}`} {...props}>
      {children}
    </Component>
  );
};

export default Text;
