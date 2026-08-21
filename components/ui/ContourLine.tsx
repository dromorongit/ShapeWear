type LineColor = 'pink' | 'gold'

interface ContourLineProps {
  color?: LineColor
  opacity?: number
  className?: string
}

const ContourLine = ({ color = 'pink', opacity = 1, className = '' }: ContourLineProps) => {
  const strokeColor = color === 'pink' ? '#E0479C' : '#F0B429'

  return (
    <svg
      viewBox="0 0 200 100"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-auto ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <path
        d="M10,85 C30,85 45,70 70,55 C95,40 110,65 130,55 C150,45 165,30 170,20 C175,10 180,5 190,5"
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ContourLine
