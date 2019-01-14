import { useState, useRef } from 'react'

function useFocus() {
  const [hasFocus, setHasFocus] = useState(false)
  const timer = useRef()

  const onFocus = event => {
    clearTimeout(timer.current)
    setHasFocus(true)
  }
  const onBlur = event => {
    timer.current = setTimeout(() => setHasFocus(false))
  }

  return [hasFocus, onFocus, onBlur]
}

export default useFocus
