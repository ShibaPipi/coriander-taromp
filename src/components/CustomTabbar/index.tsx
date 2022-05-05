import React, { useCallback } from 'react'

import { useRouter, switchTab } from '@tarojs/taro'

import { Tabbar } from '@taroify/core'
import {
    CalendarOutlined,
    TodoListOutlined,
    UserCircleOutlined
} from '@taroify/icons'

export enum PageEnum {
    Index = '/pages/index/index',
    COOKBOOK = '/pages/cookbook/cookbook',
    ME = '/pages/me/me'
}

export const CustomTabbar = () => {
    const { path } = useRouter()

    const handleSwitchTab = useCallback(
        (tab: PageEnum) => {
            if (path === tab) return

            switchTab({ url: tab })
        },
        [path]
    )

    return (
        <Tabbar bordered fixed safeArea="bottom" placeholder value={path}>
            <Tabbar.TabItem
                icon={<TodoListOutlined />}
                value={PageEnum.Index}
                onClick={() => handleSwitchTab(PageEnum.Index)}
            >
                食材
            </Tabbar.TabItem>
            <Tabbar.TabItem
                icon={<CalendarOutlined />}
                value={PageEnum.COOKBOOK}
                onClick={() => handleSwitchTab(PageEnum.COOKBOOK)}
            >
                菜谱
            </Tabbar.TabItem>
            <Tabbar.TabItem
                icon={<UserCircleOutlined />}
                value={PageEnum.ME}
                onClick={() => handleSwitchTab(PageEnum.ME)}
            >
                我的
            </Tabbar.TabItem>
        </Tabbar>
    )
}
