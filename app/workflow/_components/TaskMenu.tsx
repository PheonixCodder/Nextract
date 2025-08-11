'use client'

import { AccordionTrigger, Accordion, AccordionItem, AccordionContent } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { TaskRegistry } from '@/lib/workflow/task/registry'
import { TaskType } from '@/types/task'
import React from 'react'

const TaskMenu = () => {
  return (
    <aside className='w-[340px] min-w-[340px] max-w-[240px] border-r-2 border-separate h-full p-2 px-4 overflow-auto'>
        <Accordion type='multiple' className='w-full' defaultValue={['extraction','interactions']}>
            <AccordionItem value='extraction'>
                <AccordionTrigger className='font-bold'>
                    Data Extraction
                </AccordionTrigger>
                <AccordionContent className='flex flex-col gap-1'>
                    <TaskMenuBtn taskType={TaskType.PAGE_TO_HTML} />
                    <TaskMenuBtn taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT} />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value='interactions'>
                <AccordionTrigger className='font-bold'>
                    User Interactions
                </AccordionTrigger>
                <AccordionContent className='flex flex-col gap-1'>
                    <TaskMenuBtn taskType={TaskType.FILL_INPUT} />
                    <TaskMenuBtn taskType={TaskType.CLICK_ELEMENT} />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </aside>
  )
}

export default TaskMenu

function TaskMenuBtn({ taskType }: {taskType : TaskType}) {
    const task = TaskRegistry[taskType]

    const onDragStart=(e: React.DragEvent, type: TaskType) => {
        e.dataTransfer.setData('application/reactflow', type)
        e.dataTransfer.effectAllowed = 'move'
    }

    return (
        <Button draggable onDragStart={e => onDragStart(e, taskType)} className='flex justify-between items-center gap-2 border w-full' variant={'secondary'}>
            <div className='flex gap-2 justify-between items-center'>
            <task.icon size={20} />
            {task.label}
            </div>
        </Button>
    )
}