'use client'

import { Button } from '@/components/ui/button'
import { PlayIcon } from 'lucide-react'
import React from 'react'

const ExecuteBtn = ({workflowId}:{workflowId : string}) => {
  return (
    <Button className='flex items-center gap-2' variant={'outline'}>
        <PlayIcon size={16} className='stroke-orange-400' />
        <span>Execute</span>
    </Button>
  )
}

export default ExecuteBtn
