import request from '@/utils/request'

export function getPhotoLogList(data) {
  return request({
    url: '/modify/photo/list',
    method: 'POST',
    params:data
  })
}

export function getUserLogList(data) {
  return request({
    url: '/modify/user/list',
    method: 'POST',
    params:data
  })
}

