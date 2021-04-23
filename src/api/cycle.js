import request from '@/utils/request'

export function getCycles(data) {
  return request({
    url: '/api/Cycles/getCycles',
    method: 'get',
    data
  })
}

export function createOrEditCycle(data) {
  return request({
    url: '/api/Cycles/CreateOrEdit',
    method: 'post',
    data
  })
}


