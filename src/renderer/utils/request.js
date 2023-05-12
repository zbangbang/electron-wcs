import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import router from '@/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 请求超时时间，100s
const requestTimeOut = 10000 * 1000
const success = 200
// 更换令牌的时间区间
const checkRegion = 5 * 60 * 1000
// 提示信息显示时长
const messageDuration = 5 * 1000

// 系统全局请求对象
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API,
  // baseURL: 'http://192.168.2.14:8088/wcs/',
  baseURL: 'http://127.0.0.1:8088/wcs/',
  timeout: requestTimeOut,
  responseType: 'json',
  validateStatus(status) {
    return status === success
  }
})

service.interceptors.request.use(
  config => {
    let _config = config
    try {
    } catch (e) {
      console.error(e)
    }
    return _config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  config => {
    return config
  },
  error => {
    if (error.response) {
      const errorMessage =
        error.response.data === null
          ? '系统内部异常，请联系网站管理员'
          : error.response.data.message
      switch (error.response.status) {
        case 404:
          Message({
            message: '很抱歉，资源未找到',
            type: 'error',
            duration: messageDuration
          })
          break
        case 403:
          Message({
            message: '很抱歉，您暂无该操作权限',
            type: 'error',
            duration: messageDuration
          })
          break
        case 401:
          Message({
            message: '很抱歉，认证已失效，请重新登录',
            type: 'error',
            duration: messageDuration
          })
          router.push('/login')
          break
        case 500:
          if (errorMessage.indexOf('验证码') !== -1) {
            Message({
              message: errorMessage,
              type: 'error',
              duration: messageDuration
            })
            break
          }
        default:
          if (errorMessage === 'refresh token无效') {
            MessageBox.alert('登录已过期，请重新登录', '温馨提示', {
              confirmButtonText: '确定',
              showClose: false,
              callback: action => {
                router.push('/login')
              }
            })
          } else {
            // Message({
            //   message: errorMessage,
            //   type: 'error',
            //   duration: messageDuration
            // })
          }
          break
      }
    }
    return Promise.reject(error)
  }
)

const request = {
  // refresh(url, params) {
  //   params['grant_type'] = 'refresh_token'
  //   return refresh_service.post(url, params, {
  //     transformRequest: [(params) => {
  //       return tansParams(params)
  //     }],
  //     headers: {
  //       'Authorization': authorizationValue
  //     }
  //   })
  // },
  // login(url, params) {
  //   params['grant_type'] = 'password'
  //   return service.post(url, params, {
  //     transformRequest: [
  //       params => {
  //         return tansParams(params)
  //       }
  //     ],
  //     headers: {
  //       Authorization: authorizationValue
  //     }
  //   })
  // },
  jsonPost(url, data) {
    return service.post(url, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  jsonPut(url, data) {
    return service.put(url, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  post(url, params) {
    return service.post(url, params, {
      transformRequest: [
        params => {
          return tansParams(params)
        }
      ],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  put(url, params) {
    return service.put(url, params, {
      transformRequest: [
        params => {
          return tansParams(params)
        }
      ],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  get(url, params) {
    let _params
    if (Object.is(params, undefined)) {
      _params = ''
    } else {
      _params = '?'
      for (const key in params) {
        // eslint-disable-next-line no-prototype-builtins
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _params += `${key}=${params[key]}&`
        }
      }
    }
    return service.get(`${url}${_params}`)
  },
  getbuffer(url, params) {
    let _params
    if (Object.is(params, undefined)) {
      _params = ''
    } else {
      _params = '?'
      for (const key in params) {
        // eslint-disable-next-line no-prototype-builtins
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _params += `${key}=${params[key]}&`
        }
      }
    }
    return service.get(`${url}${_params}`, { responseType: 'arraybuffer' })
  },
  getBlob(url, params) {
    let _params
    if (Object.is(params, undefined)) {
      _params = ''
    } else {
      _params = '?'
      for (const key in params) {
        // eslint-disable-next-line no-prototype-builtins
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _params += `${key}=${params[key]}&`
        }
      }
    }
    return service.get(`${url}${_params}`, { responseType: 'blob' })
  },
  delete(url, params) {
    let _params
    if (Object.is(params, undefined)) {
      _params = ''
    } else {
      _params = '?'
      for (const key in params) {
        // eslint-disable-next-line no-prototype-builtins
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _params += `${key}=${params[key]}&`
        }
      }
    }
    return service.delete(`${url}${_params}`)
  },
  download(url, params, filename) {
    NProgress.start()
    return service
      .post(url, params, {
        transformRequest: [
          params => {
            return tansParams(params)
          }
        ],
        responseType: 'blob'
      })
      .then(r => {
        const content = r.data
        const blob = new Blob([content])
        if ('download' in document.createElement('a')) {
          const elink = document.createElement('a')
          elink.download = filename
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href)
          document.body.removeChild(elink)
        } else {
          navigator.msSaveBlob(blob, filename)
        }
        NProgress.done()
      })
      .catch(r => {
        console.error(r)
        NProgress.done()
        Message({
          message: '下载失败',
          type: 'error',
          duration: messageDuration
        })
      })
  },
  // get方式获取压缩文件
  downloadZip(url, params, fileName) {
    NProgress.start()
    let _params
    if (Object.is(params, undefined)) {
      _params = ''
    } else {
      _params = '?'
      for (const key in params) {
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _params += `${key}=${params[key]}&`
        }
      }
    }
    return service
      .get(`${url}${_params}`, { responseType: 'blob' })
      .then(r => {
        const data = r.data
        // // 获取http头部的文件名信息，是后端返回的文件名，不用可以注释
        // const fileName = r.headers['content-disposition'].split('=')[1]
        const blob = new Blob([data], { type: 'application/zip' })

        if ('download' in document.createElement('a')) {
          const elink = document.createElement('a')
          if (fileName) {
            elink.download = fileName
          }
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href)
          document.body.removeChild(elink)
        } else {
          navigator.msSaveBlob(blob, fileName)
        }
        NProgress.done()
      })
      .catch(error => {
        NProgress.done()
        Message({
          message: '下载失败',
          type: 'error',
          duration: messageDuration
        })
      })
  },
  downloadGet(url, params, filename) {
    NProgress.start()
    let _params
    if (Object.is(params, undefined)) {
      _params = ''
    } else {
      _params = '?'
      for (const key in params) {
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _params += `${key}=${params[key]}&`
        }
      }
    }
    return service
      .get(`${url}${_params}`, { responseType: 'blob' })
      .then(r => {
        const content = r.data
        const blob = new Blob([content])
        if ('download' in document.createElement('a')) {
          const elink = document.createElement('a')
          elink.download = filename
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href)
          document.body.removeChild(elink)
        } else {
          navigator.msSaveBlob(blob, filename)
        }
        NProgress.done()
      })
      .catch(r => {
        console.error(r)
        NProgress.done()
        Message({
          message: '下载失败',
          type: 'error',
          duration: messageDuration
        })
      })
  },
  upload(url, params) {
    return service.post(url, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  formPut(url, params) {
    return service.put(url, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

function tansParams(params) {
  let result = ''
  if (!params) return result
  Object.keys(params).forEach(key => {
    if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
      result +=
        encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
    }
  })
  return result
}

// async function queryRefreshToken(config, refreshToken) {
//   const result = await request.refresh('auth/oauth/token', {
//     refresh_token: refreshToken
//   })
//   if (result.status === success) {
//     saveData(result.data)
//     config.headers['Authorization'] = 'bearer ' + getToken()
//   }
//   return config
// }

export default request
