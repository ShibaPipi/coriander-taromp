export default {
    pages: ['pages/index/index', 'pages/me/me', 'pages/cookbook/cookbook'],
    window: {
        backgroundTextStyle: 'light',
        navigationBarBackgroundColor: '#fff',
        navigationBarTitleText: 'WeChat',
        navigationBarTextStyle: 'black'
    },
    tabBar: {
        custom: true,
        list: [
            {
                pagePath: 'pages/index/index'
            },
            {
                pagePath: 'pages/cookbook/cookbook'
            },
            {
                pagePath: 'pages/me/me'
            }
        ]
    }
}
