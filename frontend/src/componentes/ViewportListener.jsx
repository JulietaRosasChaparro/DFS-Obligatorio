import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setViewport } from '../slices/mobileSlice'

export default function ViewportListener() {
  const dispatch = useDispatch()

  useEffect(() => {
    const handleResize = () => {
      dispatch(setViewport())
    }

    // Configurar listeners
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [dispatch])

  return null // Este componente no renderiza nada
}