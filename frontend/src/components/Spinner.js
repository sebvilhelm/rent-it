import React from 'react'

const sizeObj = {
  small: 28,
  medium: 38,
  large: 75,
}

const SVG = ({ size }) => (
  <svg
    width={sizeObj[size]}
    height={sizeObj[size]}
    viewBox="0 0 38 38"
    xmlns="http://www.w3.org/2000/svg"
    stroke="#22a3bb"
  >
    <g fill="none" fillRule="evenodd">
      <g transform="translate(1 1)" strokeWidth="2">
        <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
        <path d="M36 18c0-9.94-8.06-18-18-18">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 18 18"
            to="360 18 18"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
      </g>
    </g>
  </svg>
)

function Spinner({ size }) {
  return <SVG size={size || 'small'} />
}

export default Spinner
