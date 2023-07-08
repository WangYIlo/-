import { defineConfig,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
//mock插件提供方法
import { viteMockServe } from 'vite-plugin-mock'

//引入svg需要用到的插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/
export default defineConfig(({command,mode})=>{

  let env=loadEnv(mode,process.cwd())

  return{
    plugins: [vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
        svgoOptions:{
          plugins:[
            {
              name:"removeAttrs",
              params:{
                attrs:"fill"
              }
            }
          ]
        }
      }),
      viteMockServe({
        localEnabled: command === 'serve',
      })
    ],
      resolve: {
        alias: {
          "@": path.resolve("./src") // 相对路径别名配置，使用 @ 代替 src
        }
      },
      //scss 全局变量一个配置
      css: {
        preprocessorOptions: {
          scss: {
            javascriptEnabled: true,
            additionalData: '@import "./src/styles/variable.scss";',
          },
        },
      },
    //代理跨域
    server:{
      proxy: {
        '/api': {
          //获取数据的服务器地址设置
          target: 'http://sph-api.atguigu.cn',
          //需要代理跨域
          changeOrigin: true,
          //路径重写
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    }  
  }
})
