import { useState, useEffect } from 'react'

// 列舉型別: T，T指的是變數
// 定義參數型別
// return 型別
export const useDebounce = <T>(
  value: T,
  // 預設為300
  delay: number = 300
): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
