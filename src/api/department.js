import request from '@/utils/request'

export function getDepartments(data) {
  return request({
    url: '/api/Departments/getDepartments',
    method: 'get',
    data
  })
}

export function createOrEditDepartment(data) {
  return request({
    url: '/api/Departments/CreateOrEdit',
    method: 'post',
    data
  })
}


