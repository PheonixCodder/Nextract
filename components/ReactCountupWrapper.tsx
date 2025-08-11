'use client'

import React, { useEffect } from 'react'
import CountUp from 'react-countup'

const ReactCountUpWrapper = ({value}: {value: number}) => {
    const [mounted, setMounted] = React.useState(false)
    useEffect(()=>{
        setMounted(true)
    },[])
    if (!mounted) return '-'
  return (
    <CountUp duration={1} preserveValue end={value} decimal='0' />
  )
}

export default ReactCountUpWrapper
