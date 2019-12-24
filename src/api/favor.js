import request from '@/utils/request'


export function favors(data) {
  return request({
    url: '/favors/favors',
    method: 'GET',
    params: data
  })
}

export function getFavorList(data) {
  return request({
    url: '/photo/favor_photo_list',
    method: 'GET',
    params: data
  })
}