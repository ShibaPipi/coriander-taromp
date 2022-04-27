import React from 'react'

import { View } from '@tarojs/components'

import './index.css'

export const PageWrapper = ({ children }) => {
    return <View className="pageWrapper">{children}</View>
}
