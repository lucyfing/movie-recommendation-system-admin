import axios from 'axios'
import { message } from 'antd'

const Axios = axios.create({
    timeout: 2000
})

/* 请求拦截器 */
Axios.interceptors.request.use(config => {
  // 如果存在token，请求携带这个token
//   if (window.sessionStorage.getItem('tokenStr')) {
//     config.headers.authentication = window.sessionStorage.getItem('tokenStr')
//   }
  return config
}, error => {
  message.error('request', error)
})

/* 配置axios响应拦截器，为了方便统一处理错误提示*/
Axios.interceptors.response.use(success => {
  // 判断业务逻辑错误
//   if (success.status && success.status == 200) {
//     if (success.data.code == 500 || success.data.code == 401 || success.data.code == 403) {
//       // Message.error({ message: success.data.msg })
//       return
//     }
//     if (success.data.msg) {
//       // Message.success({ message: success.data.msg })
//     }
//   }
  return success
}, error => {
    message.error('response: ', error)
//   if (error.response.code == 504 || error.response.code == 404) {
//     message.error({ message: '服务器被吃啦' })
//   } else if (error.response.code == 403) {
//     Message.error({ message: '权限不足，请联系管理员' })
//   } else if (error.response.code == 401) {
//     Message.error({ message: '尚未登录，请登录' })
//     router.replace('/')
//   } else {
//     if (error.response.data.msg) {
//       Message.error({ message: error.response.data.msg })
//     } else {
//       // Message.error({ message: '未知错误！' })
//     }
//   }
})


// 传送json格式的post请求
export const postRequest = (url: string, params: any) => {
  return axios({
    method: 'post',
    url: `${url}`,
    data: params
  })
}

// 传送JSON格式的put请求
export const putRequest = (url: string, params: any) => {
  return Axios({
    method: 'put',
    url: `${url}`,
    data: params
  })
}

// 传送JSON格式的get请求
export const getRequest = (url: string, params?: any) => {
  return Axios({
    method: 'get',
    url: `${url}`,
    params: params
  })
}

// 传送JSON格式的delete请求
export const deleteRequest = (url: string, params: any) => {
  return Axios({
    method: 'delete',
    url: url,
    params: params
  })
}
