'use client'

import { UploadDialog } from '@/components/dialog/UploadDialog'
import { useEffect, useState } from 'react'


export const DialogProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <UploadDialog />
    </>
  )
}