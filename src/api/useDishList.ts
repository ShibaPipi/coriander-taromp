import { useMemo } from 'react'

import { dishes } from '../data'

export const useDishList = () => {
    const list = useMemo(() => dishes, [])

    return { list }
}
