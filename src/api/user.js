import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/getInfo',
    method: 'post',
    data:{ token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getUserList() {
  return request({
    url: '/user/all_user',
    method: 'get'
  })
}

export function updateUserRole(data) {
  return request({
    url: '/user/update_role',
    method: 'post',
    params:data
  })
}

export function regerister(data) {
  return request({
    url: '/user/register',
    method: 'post',
    params:data
  })
}