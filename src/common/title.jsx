import React from 'react'

const Title = ({title, className}) => {
  return (
    <div className={`text-2xl font-bold text-center ${className}`}>
      {title}
    </div>
  )
}

export default Title;