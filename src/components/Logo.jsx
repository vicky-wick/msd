// Vector take on the MSD mark: blue M + D, a tall serif S overlapping in the middle.
export default function Logo({ size = 44, showWord = false, sColor = 'currentColor', className = '' }) {
  const h = showWord ? 300 : 250
  return (
    <svg
      className={`logo ${className}`}
      viewBox={`0 0 420 ${h}`}
      height={size}
      aria-label="Mainstream Digitals"
      role="img"
      style={{ overflow: 'visible' }}
    >
      <g fontFamily="Playfair Display, serif">
        <text className="logo-m" x="22" y="212" fontSize="210" fill="#1455B8">M</text>
        <text className="logo-d" x="236" y="212" fontSize="210" fill="#1455B8">D</text>
        <text className="logo-s" x="140" y="224" fontSize="292" fontWeight="600" fill={sColor}>S</text>
      </g>
      {showWord && (
        <text
          className="logo-word"
          x="210"
          y="286"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontWeight="600"
          fontSize="30"
          letterSpacing="7"
          fill={sColor}
        >
          MAINSTREAM DIGITALS
        </text>
      )}
    </svg>
  )
}
