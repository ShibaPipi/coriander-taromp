import React, { FC } from 'react'

import { View } from '@tarojs/components'

import './index.css'

interface BlockTitleProps {
    title: string | number
}

export const BlockTitle: FC<BlockTitleProps> = ({ title }) => {
    return <View className="block-title-wrapper">{title}</View>
}
