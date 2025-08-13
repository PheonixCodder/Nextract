import React from 'react'

const HomePage = () => {
  return (
    <div>
      Home
    </div>
  )
}

async function PeriodSelectorWrapper(){
  const periods = await GetPeriods()
  return <div></div>
}

export default HomePage