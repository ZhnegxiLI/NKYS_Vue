import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'api/Account/Login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/Account/GetUserInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/Account/Logout',
    method: 'post'
  })
}
