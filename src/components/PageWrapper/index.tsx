import React, { FC, PropsWithChildren } from 'react'

import { View } from '@tarojs/components'
import { CustomTabbar } from '../CustomTabbar'

interface PageWrapperProps {
    hasTabbar?: boolean
}

export const PageWrapper: FC<PropsWithChildren<PageWrapperProps>> = ({
    hasTabbar = false,
    children
}) => {
    return (
        <View style={{ height: '100vh' }}>
            <View style={{ height: hasTabbar ? 'calc(100% - 84px)' : '100%' }}>
                {children}
            </View>
            {hasTabbar && (
                <View>
                    <CustomTabbar />
                </View>
            )}
        </View>
    )
}
