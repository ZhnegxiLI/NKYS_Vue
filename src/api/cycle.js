import request from '@/utils/request'

export function getCycles() {
  return request({
    url: 'api/Cycles/getCycles',
    method: 'get'
  })
}

