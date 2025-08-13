'use client'

import { Period } from '@/types/analytics'
import React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from 'next/navigation';

const MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
    ] as const

const PeriodSelector = ({periods, selectedPeriod}:{periods : Period[], selectedPeriod : Period}) => {
    const router = useRouter()
    const searchParams = useSearchParams()

  return (
    <Select defaultValue={`${selectedPeriod.month}-${selectedPeriod.year}`} onValueChange={(value)=>{
        const [month, year] = value.split('-')
        const params = new URLSearchParams()
        params.set('month', month)
        params.set('year', year)
        router.push(`?${params.toString()}`)
    }}>
        <SelectTrigger className='w-[180px]'>
            <SelectValue />
        </SelectTrigger>
        <SelectContent>
            {periods.map((period, index)=>(
                <SelectItem value={`${period.month}-${period.year}`} key={index}>
                    {`${MONTH_NAMES[period.month]}-${period.year}`}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
  )
}

export default PeriodSelector
