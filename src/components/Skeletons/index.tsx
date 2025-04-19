import React from 'react'
import './styles.scss'

function Skeleton({ shape, styles }: any) {
  return (
    <div className={`skeleton ${shape}`} style={{...styles}}/>
  )
}

export default Skeleton