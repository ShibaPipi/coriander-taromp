import React, { useCallback, useMemo, useState } from 'react'
import { all, assocPath, concat, filter, reduce, remove } from 'ramda'

import {
    Button,
    Cell,
    Checkbox,
    Empty,
    Field,
    FixedView,
    Flex,
    Popup,
    SwipeCell,
    Tabs,
    Tag,
    Textarea
} from '@taroify/core'
import { ShopCollectOutlined, ShopOutlined } from '@taroify/icons'
import { PageWrapper, TabPaneTitle } from '@/components'

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
    const [activeTabPane, setActiveTabPane] = useState<'todo' | 'food'>('todo')
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

        switch (activeTabPane) {
            case 'todo':
                setTodoList(prevList => [
                    ...prevList,
                    { text: inputVal, isComplete: false }
                ])
                break
            case 'food':
                setFoodList(prevList => [
                    ...prevList,
                    { text: inputVal, hasEaten: false }
                ])
                break
            default:
                return
        }

        setInputVal('')
        setPopupVisible(false)
    }, [activeTabPane, inputVal])

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
        // ????????????????????????
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

        // ??????????????????????????????
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
        <PageWrapper hasTabbar>
            <Tabs sticky value={activeTabPane} onChange={setActiveTabPane}>
                <Tabs.TabPane
                    value="todo"
                    title={
                        <TabPaneTitle
                            title="????????????"
                            icon={<ShopOutlined />}
                        />
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
                                                        ??????
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
                                                ??????
                                            </Button>
                                        </SwipeCell.Actions>
                                    </SwipeCell>
                                ))}
                                <Cell title="??????">
                                    <Flex justify="end" align="center">
                                        <Checkbox
                                            checked={isAllTodoItemChecked}
                                            onChange={toggleSelectAllTodoItem}
                                        />
                                    </Flex>
                                </Cell>
                            </>
                        ) : (
                            <Empty>
                                <Empty.Image />
                                <Empty.Description>
                                    <Flex direction="column">
                                        <Flex.Item>????????????????????????</Flex.Item>
                                        <Flex.Item>????????????????????????</Flex.Item>
                                    </Flex>
                                </Empty.Description>
                            </Empty>
                        )}
                        <Button.Group block variant="contained" shape="round">
                            <Button
                                color="info"
                                onClick={() => setPopupVisible(true)}
                            >
                                ????????????
                            </Button>
                            {todoList.length > 0 && (
                                <Button color="primary" onClick={handleStore}>
                                    ????????????
                                </Button>
                            )}
                        </Button.Group>
                    </Cell.Group>
                </Tabs.TabPane>
                <Tabs.TabPane
                    value="food"
                    title={
                        <TabPaneTitle
                            title="??????"
                            icon={<ShopCollectOutlined />}
                        />
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
                                                        ??????
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
                                                ??????
                                            </Button>
                                        </SwipeCell.Actions>
                                    </SwipeCell>
                                ))}
                                <Cell title="??????">
                                    <Flex justify="end" align="center">
                                        <Checkbox
                                            checked={isAllFoodItemChecked}
                                            onChange={toggleSelectAllFoodItem}
                                        />
                                    </Flex>
                                </Cell>
                            </>
                        ) : (
                            <Empty>
                                <Empty.Image />
                                <Empty.Description>
                                    <Flex direction="column">
                                        <Flex.Item>????????????????????????</Flex.Item>
                                        <Flex.Item>????????????????????????</Flex.Item>
                                    </Flex>
                                </Empty.Description>
                            </Empty>
                        )}
                        <Button.Group block variant="contained" shape="round">
                            <Button
                                color="info"
                                onClick={() => setPopupVisible(true)}
                            >
                                ????????????
                            </Button>
                            {foodList.length > 0 && (
                                <Button
                                    block
                                    color="success"
                                    shape="round"
                                    onClick={handleDoneEating}
                                >
                                    ?????????
                                </Button>
                            )}
                        </Button.Group>
                    </Cell.Group>
                </Tabs.TabPane>
            </Tabs>
            <Popup
                open={popupVisible}
                onClose={() => setPopupVisible(false)}
                rounded
                placement="bottom"
                style={{ height: '40%' }}
            >
                <Popup.Close />
                <Cell.Group inset style={{ marginTop: '64px' }}>
                    <Field align="start" label="??????">
                        <Textarea
                            autoHeight
                            limit={50}
                            style={{ height: 48 }}
                            value={inputVal}
                            placeholder="??????????????????"
                            onChange={({ detail: { value } }) =>
                                setInputVal(value as string)
                            }
                        />
                    </Field>
                </Cell.Group>
                <FixedView position="bottom" safeArea="bottom">
                    <Cell.Group inset>
                        <Button
                            block
                            color="info"
                            shape="round"
                            onClick={handleAddItem}
                        >
                            ????????????
                        </Button>
                    </Cell.Group>
                </FixedView>
            </Popup>
        </PageWrapper>
    )
}
