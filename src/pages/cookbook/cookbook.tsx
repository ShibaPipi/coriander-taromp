import React, { useCallback, useState } from 'react'
import { assocPath } from 'ramda'

import { useDishList } from '@/api'
import { dishesMap } from '@/data'

import {
    Button,
    Cell,
    Collapse,
    Dialog,
    Grid,
    Picker,
    Popup,
    Tabs
} from '@taroify/core'
import {
    CalendarOutlined,
    OrdersOutlined,
    PhotoOutlined,
    Plus
} from '@taroify/icons'
import { PageWrapper, TabPaneTitle } from '@/components'

import './cookbook.css'

enum Days {
    MONDAY = 'Monday',
    TUESDAY = 'Tuesday',
    WEDNESDAY = 'Wednesday',
    THURSDAY = 'Thursday',
    FRIDAY = 'Friday',
    SATURDAY = 'Saturday',
    SUNDAY = 'Sunday'
}

enum Meal {
    LUNCH = 'lunch',
    DINNER = 'dinner'
}

type Menus = Record<Days, { lunch: number[]; dinner: number[] }>

const days = [
    { key: Days.MONDAY, title: '星期一' },
    { key: Days.TUESDAY, title: '星期二' },
    { key: Days.WEDNESDAY, title: '星期三' },
    { key: Days.THURSDAY, title: '星期四' },
    { key: Days.FRIDAY, title: '星期五' },
    { key: Days.SATURDAY, title: '星期六' },
    { key: Days.SUNDAY, title: '星期日' }
]

export default () => {
    const [menus, setMenus] = useState<Menus>({} as Menus)
    const [activeMenu, setActiveMenu] = useState<Days>(Days.MONDAY)
    const [pickerVisible, setPickerVisible] = useState<boolean>(false)
    const [mealType, setMealType] = useState<Meal>(Meal.LUNCH)
    const [dialogOpen, setDialogOpen] = useState(false)

    const { list: dishList } = useDishList()

    console.log('menus => ', menus)
    console.log(mealType)

    const addMealButton = (type: Meal) => (
        <Button
            block
            variant="outlined"
            size="small"
            icon={<Plus />}
            onClick={() => {
                setMealType(type)
                setPickerVisible(true)
            }}
        >
            添加
        </Button>
    )

    const handlePickerConfirm = useCallback(
        (values: number[]) => {
            const val = values[0]
            setMenus(prevData =>
                assocPath(
                    [activeMenu, mealType],
                    prevData?.[activeMenu]?.[mealType]
                        ? [...prevData[activeMenu][mealType], val]
                        : [val],
                    prevData
                )
            )
            setPickerVisible(false)
        },
        [activeMenu, mealType]
    )

    const handleClearMenu = useCallback(() => {
        if (!menus) return
        setMenus({} as Menus)
        setDialogOpen(false)
    }, [menus])

    return (
        <PageWrapper hasTabbar>
            <Tabs sticky>
                <Tabs.TabPane
                    title={
                        <TabPaneTitle
                            title="菜单"
                            icon={<CalendarOutlined />}
                        />
                    }
                >
                    <Cell.Group inset>
                        <Collapse
                            bordered={false}
                            accordion
                            value={activeMenu}
                            onChange={setActiveMenu}
                        >
                            {days.map(({ key, title }) => (
                                <Collapse.Item
                                    key={key}
                                    bordered={false}
                                    title={title}
                                    value={key}
                                >
                                    <Cell.Group title="午餐">
                                        <Grid
                                            columns={
                                                menus?.[key]?.lunch?.length
                                            }
                                        >
                                            {menus?.[key]?.lunch?.map(id => (
                                                <Grid.Item
                                                    key={id}
                                                    icon={<PhotoOutlined />}
                                                    text={dishesMap[id].name}
                                                />
                                            ))}
                                        </Grid>
                                        {menus?.[key]?.lunch?.length === 2
                                            ? null
                                            : addMealButton(Meal.LUNCH)}
                                    </Cell.Group>
                                    <Cell.Group title="晚餐">
                                        <Grid
                                            columns={
                                                menus?.[key]?.dinner?.length
                                            }
                                        >
                                            {menus?.[key]?.dinner?.map(id => (
                                                <Grid.Item
                                                    key={id}
                                                    icon={<PhotoOutlined />}
                                                    text={dishesMap[id].name}
                                                />
                                            ))}
                                        </Grid>
                                        {menus?.[key]?.dinner?.length === 2
                                            ? null
                                            : addMealButton(Meal.DINNER)}
                                    </Cell.Group>
                                </Collapse.Item>
                            ))}
                        </Collapse>
                        <Button
                            block
                            color="danger"
                            size="mini"
                            shape="round"
                            variant="outlined"
                            onClick={() => setDialogOpen(true)}
                        >
                            清空
                        </Button>
                    </Cell.Group>
                </Tabs.TabPane>
                <Tabs.TabPane
                    title={
                        <TabPaneTitle title="菜谱" icon={<OrdersOutlined />} />
                    }
                ></Tabs.TabPane>
            </Tabs>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <Dialog.Content>确定要清空菜单吗？</Dialog.Content>
                <Dialog.Actions>
                    <Button onClick={() => setDialogOpen(false)}>取消</Button>
                    <Button onClick={handleClearMenu}>确认</Button>
                </Dialog.Actions>
            </Dialog>
            <Popup
                open={pickerVisible}
                onClose={() => setPickerVisible(false)}
                rounded
                placement="bottom"
            >
                <Popup.Backdrop />
                <Picker
                    onCancel={() => setPickerVisible(false)}
                    onConfirm={handlePickerConfirm}
                >
                    <Picker.Toolbar>
                        <Picker.Button>取消</Picker.Button>
                        <Picker.Title>好饭不怕晚</Picker.Title>
                        <Picker.Button>确认</Picker.Button>
                    </Picker.Toolbar>
                    <Picker.Column>
                        {dishList.map(({ id, name }) => (
                            <Picker.Option key={id} value={id}>
                                {name}
                            </Picker.Option>
                        ))}
                    </Picker.Column>
                </Picker>
            </Popup>
        </PageWrapper>
    )
}
