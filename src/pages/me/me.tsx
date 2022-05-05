import React, { useCallback } from 'react'
import { useUserInfo } from 'taro-hooks'

import { View } from '@tarojs/components'
import { Avatar, Cell, Flex } from '@taroify/core'
import { PageWrapper } from '@/components'

import './index.css'

export default () => {
    const [userInfo, { getUserProfile }] = useUserInfo()
    console.log(userInfo)

    const handleGetUserInfo = useCallback(() => {
        if (userInfo) return
        getUserProfile({ desc: '用于完善信息，展示昵称、头像' })
    }, [getUserProfile, userInfo])

    return (
        <PageWrapper hasTabbar>
            <Cell.Group bordered={false} inset>
                <Flex justify="start" align="end" gutter={16}>
                    <Flex.Item span={4} className="avatarSize">
                        <Avatar
                            shape="rounded"
                            src={userInfo?.avatarUrl}
                            alt="U"
                            onClick={handleGetUserInfo}
                        >
                            U
                        </Avatar>
                    </Flex.Item>
                    <Flex.Item span={20}>
                        <View
                            style={{ fontSize: 14 }}
                            onClick={handleGetUserInfo}
                        >
                            {userInfo?.nickName || '请登录'}
                        </View>
                        <View style={{ fontSize: 12 }}>
                            莫笑农家腊酒浑，丰年留客足鸡豚。
                        </View>
                    </Flex.Item>
                </Flex>
            </Cell.Group>
        </PageWrapper>
    )
}
