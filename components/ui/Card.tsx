import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  bg?: 'white' | 'blush'
}

const Card = ({ children, className = '', bg = 'white' }: CardProps) => {
  const bgClass = bg === 'blush' ? 'bg-blush' : 'bg-white'

  return (
    <div className={`rounded-md shadow-soft ${bgClass} ${className}`}>
      {children}
    </div>
  )
}

export default Card
