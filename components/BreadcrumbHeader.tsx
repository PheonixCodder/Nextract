'use client'

import { usePathname } from 'next/navigation'
import React from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from './ui/breadcrumb'
import { MobileSidebar } from './Sidebar'

const BreadcrumbHeader = () => {
    const pathName = usePathname()
    const paths = pathName === '/' ? [''] : pathName.split('/')
    console.log(paths)
  return (
    <div className='flex items-center flex-start'>
        <MobileSidebar />
        <Breadcrumb>
        <BreadcrumbList>
        {paths.map(( path, index )=>(
            <React.Fragment key={index}>
                <BreadcrumbItem>
                <BreadcrumbLink className='capitalize' href={`/${path}`}>
                {path === '' ? 'Home' : path}
                </BreadcrumbLink>
                </BreadcrumbItem>
                {index !== paths.length -1 && <BreadcrumbSeparator />}
            </React.Fragment>
        ))}
        </BreadcrumbList>
        </Breadcrumb>
    </div>
  )
}

export default BreadcrumbHeader
