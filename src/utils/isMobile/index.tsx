import { useState, useEffect } from 'react'

const useIsMobile = () => {
    const [width, setWidth] = useState<number>(window.innerWidth)

    const handleChangeWidth = () => {
        setWidth(window.innerWidth)
    }

    useEffect(() => {
        window.addEventListener('resize', handleChangeWidth)

        return () => {
            window.removeEventListener('resize', handleChangeWidth)
        }
    }, [])

  return width <= 768;
}

export default useIsMobile