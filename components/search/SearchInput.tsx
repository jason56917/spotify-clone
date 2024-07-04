'use client'

import { useDebounce } from '@/hooks/useDebounce'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import qs from 'query-string'
import { Input } from '../ui/input'

export const SearchInput = () => {
  const router = useRouter()
  const [value, setValue] = useState<string>('')
  const debouncedValue = useDebounce<string>(value, 500)

  useEffect(() => {
    const query = {
      title: debouncedValue,
    }
    const url = qs.stringifyUrl({
      url: '/search',
      query,
    })

    router.push(url)
  }, [debouncedValue, router])

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={'What do you want to listen to ?'}
      className={'bg-neutral-900 focus-visible:ring-transparent focus-visible:ring-offset-0'}
    />
  )
}