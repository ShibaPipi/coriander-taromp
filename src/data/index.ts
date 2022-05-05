export interface Dish {
    id: number
    name: string
}

export const dishes: Dish[] = [
    { id: 1, name: '肉末茄子' },
    { id: 2, name: '清炒青笋' },
    { id: 3, name: '香煎三文鱼尾' }
]

export const dishesMap = dishes.reduce(
    (acc, curr) => ({ ...acc, [curr.id]: curr }),
    {} as Record<number, Dish>
)
