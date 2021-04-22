import request from '@/utils/request'

export function getCycles() {
  return request({
    url: '/api/Cycles/getCycles',
    method: 'get'
  })
}

export function createOrEditCycle(data) {
  return request({
    url: '/api/Cycles/CreateOrEdit',
    method: 'post',
    data
  })
}


