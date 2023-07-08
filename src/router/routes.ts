
//对外暴露配置路由(常量)
export const constantRoute = [
    {
        path: '/login',
        component: () => import('@/views/login/index.vue'),
        name: 'login',
        meta: {
            title: '登录', //菜单标题
            hidden: true,//是否在菜单需要展示
            icon: "Promotion" //菜单图标-支持element-plus图标
        }
    },
    {
        path: '/',
        component: () => import('@/layout/index.vue'),
        name: 'layout',
        meta: {
            hidden: false, //是否在菜单需要展示
        },
        redirect: '/home',
        children: [
            {
                path: '/home',
                component: () => import('@/views/home/index.vue'),
                name: 'home',
                meta: {
                    title: '首页', //菜单标题
                    hidden: false, //是否在菜单需要展示
                    icon: 'HomeFilled'
                }
            }
        ]
    },
    {
        path: '/screen',
        component: () => import('@/views/screen/index.vue'),
        name: 'Screen',
        meta: {
            hidden: false,
            title: '数据大屏',
            icon: 'Platform'
        }
    },
]


//异步路由
export const asyncRoute=[
    //权限管理
    {
        path: '/acl',
        component: () => import('@/layout/index.vue'),
        name: 'Acl',
        meta: {
            title: '权限管理',
            icon: 'Lock'
        },
        redirect:'/acl/user',
        children: [
            {
                path: '/acl/user',
                component: () => import('@/views/acl/user/index.vue'),
                name: 'User',
                meta: {
                    title: '用户管理',
                    icon: 'User'
                }
            },
            {
                path: '/acl/role',
                component: () => import('@/views/acl/role/index.vue'),
                name: 'Role',
                meta: {
                    title: '角色管理',
                    icon: 'UserFilled',
                },
            },
            {
                path: '/acl/permission',
                component: () => import('@/views/acl/permission/index.vue'),
                name: 'Permission',
                meta: {
                    title: '菜单管理',
                    icon: 'Monitor',
                },
            },

        ]
    },
    //产品管理
    {
        path: '/product',
        component: () => import('@/layout/index.vue'),
        name: 'Product',
        meta: {
            title: '商品管理',
            icon: 'Goods'
        },
        redirect:'/product/trademark',
        children: [
            {
                path: '/product/trademark',
                component: () => import('@/views/product/trademark/index.vue'),
                name: 'Trademark',
                meta: {
                    title: '品牌管理',
                    icon: 'ShoppingCartFull'
                }
            },
            {
                path: '/product/attr',
                component: () => import('@/views/product/attr/index.vue'),
                name: 'Attr',
                meta: {
                    title: '属性管理',
                    icon: 'Orange'
                }
            },
            {
                path: '/product/spu',
                component: () => import('@/views/product/spu/index.vue'),
                name: 'Spu',
                meta: {
                    title: 'SPU管理',
                    icon: 'Calendar'
                }
            },
            {
                path: '/product/sku',
                component: () => import('@/views/product/sku/index.vue'),
                name: 'Sku',
                meta: {
                    title: 'SKU管理',
                    icon: 'Refrigerator'
                }
            },

        ]
    },
]


//任意路由
export const anyRoute=[
    //404 任意路由
    {
        //404---任意路径
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/404/index.vue'),
        name: '404',
        meta: {
            title: '404', //菜单标题
            hidden: true, //是否在菜单需要展示
            icon: 'Lock'
        }
    },
]