import request from '@/utils/request'

export function getCycles(params) {
  return request({
    url: '/api/Cycles/getCycles',
    method: 'get',
    params
  })
}

export function createOrEditCycle(data) {
  return request({
    url: '/api/Cycles/CreateOrEdit',
    method: 'post',
    data
  })
}


