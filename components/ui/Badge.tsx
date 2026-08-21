type BadgeVariant = 'inStock' | 'lowStock' | 'outOfStock' | 'sale'

interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  inStock: 'bg-blush text-plum',
  lowStock: 'bg-gold/20 text-plum',
  outOfStock: 'bg-ink/10 text-ink',
  sale: 'bg-pink text-white',
}

const Badge = ({ variant, children, className = '' }: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-2.5 py-0.5 font-body text-small ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

export default Badge
