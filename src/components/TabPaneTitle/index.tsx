import React, { FC, ReactNode } from 'react'

import { View } from '@tarojs/components'

interface TabPaneTitleProps {
    title: string
    icon?: ReactNode
}

export const TabPaneTitle: FC<TabPaneTitleProps> = ({ title, icon }) => {
    return (
        <>
            <View style={{ marginRight: 4 }}>{icon}</View>
            {title}
        </>
    )
}
