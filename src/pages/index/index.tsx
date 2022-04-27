import React, { useCallback, useMemo, useState } from 'react'
import { all, assocPath, concat, filter, reduce, remove } from 'ramda'

import {
    Button,
    Cell,
    Checkbox,
    Empty,
    Field,
    Flex,
    Input,
    Popup,
    SwipeCell,
    Tabs,
    Tag
} from '@taroify/core'
import { DesktopOutlined, TodoListOutlined } from '@taroify/icons'
import { PageWrapper } from '../../components'

import './index.css'

interface TodoItem {
    text: string
    isComplete: boolean
}

interface FoodItem {
    text: string
    hasEaten: boolean
}

export default () => {
    const [inputVal, setInputVal] = useState<string>('')
    const [todoList, setTodoList] = useState<TodoItem[]>([])

    const [foodList, setFoodList] = useState<FoodItem[]>([])

    const [popupVisible, setPopupVisible] = useState<boolean>(false)

    const isAllTodoItemChecked = useMemo(
        () => all(({ isComplete }) => isComplete)(todoList),
        [todoList]
    )

    const isAllFoodItemChecked = useMemo(
        () => all(({ hasEaten }) => hasEaten)(foodList),
        [foodList]
    )

    const handleAddItem = useCallback(() => {
        if (!inputVal) return

        setTodoList(prevList => [
            ...prevList,
            { text: inputVal, isComplete: false }
        ])
        setInputVal('')
        setPopupVisible(false)
    }, [inputVal])

    const handleDeleteTodoItem = useCallback(
        (index: number) => setTodoList(prevList => remove(index, 1, prevList)),
        []
    )

    const handleTodoCheckboxChange = useCallback(
        (value: boolean, index: number) =>
            setTodoList(prevList =>
                assocPath([index, 'isComplete'], value, prevList)
            ),
        []
    )

    const handleTodoCellClick = useCallback(
        (index: number) =>
            setTodoList(prevList =>
                assocPath(
                    [index, 'isComplete'],
                    !prevList[index].isComplete,
                    prevList
                )
            ),
        []
    )

    const toggleSelectAllTodoItem = useCallback(
        (checked: boolean) =>
            setTodoList(prevList =>
                prevList.map(item => ({
                    ...item,
                    isComplete: checked
                }))
            ),
        []
    )

    const handleStore = useCallback(() => {
        // 将选中的加入冰箱
        setFoodList(prevList =>
            concat(
                prevList,
                reduce(
                    (acc, { text, isComplete }) =>
                        isComplete ? [...acc, { text, hasEaten: false }] : acc,
                    [],
                    todoList
                )
            )
        )

        // 更新清单，过滤选中的
        setTodoList(prevList =>
            filter(({ isComplete }) => !isComplete, prevList)
        )
    }, [todoList])

    const handleDeleteFoodItem = useCallback(
        (index: number) => setFoodList(prevList => remove(index, 1, prevList)),
        []
    )

    const handleFoodCheckboxChange = useCallback(
        (value: boolean, index: number) =>
            setFoodList(prevList =>
                assocPath([index, 'hanEaten'], value, prevList)
            ),
        []
    )

    const handleFoodCellClick = useCallback(
        (index: number) =>
            setFoodList(prevList =>
                assocPath(
                    [index, 'hasEaten'],
                    !prevList[index].hasEaten,
                    prevList
                )
            ),
        []
    )

    const toggleSelectAllFoodItem = useCallback(
        (checked: boolean) =>
            setFoodList(prevList =>
                prevList.map(item => ({
                    ...item,
                    hasEaten: checked
                }))
            ),
        []
    )

    const handleDoneEating = useCallback(
        () =>
            setFoodList(prevList =>
                prevList.filter(({ hasEaten }) => !hasEaten)
            ),
        []
    )

    return (
        <PageWrapper>
            <Tabs sticky>
                <Tabs.TabPane
                    title={
                        <>
                            <TodoListOutlined style={{ marginRight: 4 }} />
                            食材清单
                        </>
                    }
                >
                    <Cell.Group clickable inset bordered={false}>
                        {todoList.length > 0 ? (
                            <>
                                {todoList.map(({ text, isComplete }, index) => (
                                    <SwipeCell key={index}>
                                        <Cell
                                            title={text}
                                            onClick={() =>
                                                handleTodoCellClick(index)
                                            }
                                        >
                                            <Flex justify="end" align="center">
                                                {isComplete && (
                                                    <Tag
                                                        style={{
                                                            backgroundColor:
                                                                '#ffe1e1',
                                                            color: '#ad0000',
                                                            marginRight: 16
                                                        }}
                                                    >
                                                        已购
                                                    </Tag>
                                                )}
                                                <Checkbox
                                                    checked={isComplete}
                                                    onClick={e =>
                                                        e.preventDefault()
                                                    }
                                                    onChange={checked =>
                                                        handleTodoCheckboxChange(
                                                            checked,
                                                            index
                                                        )
                                                    }
                                                />
                                            </Flex>
                                        </Cell>
                                        <SwipeCell.Actions side="right">
                                            <Button
                                                variant="contained"
                                                color="danger"
                                                onClick={() =>
                                                    handleDeleteTodoItem(index)
                                                }
                                            >
                                                删除
                                            </Button>
                                        </SwipeCell.Actions>
                                    </SwipeCell>
                                ))}
                                <Cell title="全选">
                                    <Flex justify="end" align="center">
                                        <Checkbox
                                            checked={isAllTodoItemChecked}
                                            onChange={checked =>
                                                toggleSelectAllTodoItem(checked)
                                            }
                                        />
                                    </Flex>
                                </Cell>
                            </>
                        ) : (
                            <Empty>
                                <Empty.Image />
                                <Empty.Description>
                                    <Flex direction="column">
                                        <Flex.Item>日啖荔枝三百颗，</Flex.Item>
                                        <Flex.Item>不辞长做干饭人。</Flex.Item>
                                    </Flex>
                                </Empty.Description>
                            </Empty>
                        )}
                        {/* <FixedView position="bottom" safeArea="bottom"> */}
                        <Button.Group block variant="contained" shape="round">
                            <Button
                                color="info"
                                onClick={() => setPopupVisible(true)}
                            >
                                添加食材
                            </Button>
                            {todoList.length > 0 && (
                                <Button color="primary" onClick={handleStore}>
                                    放入冰箱
                                </Button>
                            )}
                        </Button.Group>
                    </Cell.Group>
                    <Popup
                        open={popupVisible}
                        onClose={() => setPopupVisible(false)}
                        rounded
                        placement="bottom"
                        style={{ height: '30%' }}
                    >
                        <Popup.Close />
                        <Cell.Group inset style={{ marginTop: '64px' }}>
                            <Field align="start" label="食材">
                                <Input
                                    value={inputVal}
                                    placeholder="请输入要购买的食材"
                                    onChange={({ detail: { value } }) =>
                                        setInputVal(value as string)
                                    }
                                />
                            </Field>
                            <Button
                                block
                                color="primary"
                                shape="round"
                                onClick={handleAddItem}
                            >
                                加入清单
                            </Button>
                        </Cell.Group>
                    </Popup>
                </Tabs.TabPane>
                <Tabs.TabPane
                    title={
                        <>
                            <DesktopOutlined style={{ marginRight: 4 }} />
                            冰箱
                        </>
                    }
                >
                    <Cell.Group inset>
                        {foodList.length > 0 ? (
                            <>
                                {foodList.map(({ text, hasEaten }, index) => (
                                    <SwipeCell key={index}>
                                        <Cell
                                            title={text}
                                            onClick={() =>
                                                handleFoodCellClick(index)
                                            }
                                        >
                                            <Flex justify="end" align="center">
                                                {hasEaten && (
                                                    <Tag
                                                        color="success"
                                                        style={{
                                                            marginRight: 16
                                                        }}
                                                    >
                                                        吃了
                                                    </Tag>
                                                )}
                                                <Checkbox
                                                    checked={hasEaten}
                                                    onClick={e =>
                                                        e.preventDefault()
                                                    }
                                                    onChange={checked =>
                                                        handleFoodCheckboxChange(
                                                            checked,
                                                            index
                                                        )
                                                    }
                                                />
                                            </Flex>
                                        </Cell>
                                        <SwipeCell.Actions side="right">
                                            <Button
                                                variant="contained"
                                                color="danger"
                                                onClick={() =>
                                                    handleDeleteFoodItem(index)
                                                }
                                            >
                                                删除
                                            </Button>
                                        </SwipeCell.Actions>
                                    </SwipeCell>
                                ))}
                                <Cell title="全选">
                                    <Flex justify="end" align="center">
                                        <Checkbox
                                            checked={isAllFoodItemChecked}
                                            onChange={checked =>
                                                toggleSelectAllFoodItem(checked)
                                            }
                                        />
                                    </Flex>
                                </Cell>
                            </>
                        ) : (
                            <Empty>
                                <Empty.Image />
                                <Empty.Description>
                                    <Flex direction="column">
                                        <Flex.Item>仰天大笑出门去，</Flex.Item>
                                        <Flex.Item>我辈岂是囤货人。</Flex.Item>
                                    </Flex>
                                </Empty.Description>
                            </Empty>
                        )}
                        <Button
                            block
                            color="success"
                            shape="round"
                            onClick={handleDoneEating}
                        >
                            吃完了
                        </Button>
                    </Cell.Group>
                </Tabs.TabPane>
            </Tabs>
            {/* </FixedView> */}
        </PageWrapper>
    )
}
