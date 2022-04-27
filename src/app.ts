import { Component } from 'react'
// import { getStorageSync, setStorageSync } from '@tarojs/taro'

// import { FRIGE_ITEM_LIST_STORAGE_KEY, TODO_LIST_STORAGE_KEY } from './storage'

import './app.css'

class App extends Component {
    // componentDidMount() {
    //     this.init()
    // }

    // init() {
    //     if (!getStorageSync(TODO_LIST_STORAGE_KEY)) {
    //         setStorageSync(TODO_LIST_STORAGE_KEY, [])
    //     }
    //     if (!getStorageSync(FRIGE_ITEM_LIST_STORAGE_KEY)) {
    //         setStorageSync(FRIGE_ITEM_LIST_STORAGE_KEY, [])
    //     }
    // }

    // this.props.children 是将要会渲染的页面
    render() {
        return this.props.children
    }
}

export default App
