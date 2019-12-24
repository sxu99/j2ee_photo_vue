import request from '@/utils/request'

export function getPhotoList() {
  return request({
    url: '/photo/list',
    method: 'POST',
  })
}

export function getPhotoDetail(data) {
  return request({
    url: '/photo/photo_detail',
    method: 'GET',
    params: data
  })
}

export function getScaleList() {
  return request({
    url: '/photo/scale_list',
    method: 'GET'
  })
}

export function getCountryList() {
  return request({
    url: '/photo/country_list',
    method: 'GET'
  })
}

export function getSortedPhoto(data) {
  return request({
    url: '/photo/photo_list_by_condition',
    method: 'post',
    params:data
  })
}

export function deletePhoto(data) {
  return request({
    url: '/photo/delete',
    method: 'post',
    params:data
  })
}

export function deletePhotoList(data) {
  return request({
    url: '/photo/delete_list',
    method: 'post',
    data
  })
}
