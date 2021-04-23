import request from '@/utils/request'

export function getDepartments(params) {
  return request({
    url: '/api/Departments/getDepartments',
    method: 'get',
    params
  })
}

export function createOrEditDepartment(data) {
  return request({
    url: '/api/Departments/CreateOrEdit',
    method: 'post',
    data
  })
}

export function getGroups(params) {
  return request({
    url: '/api/Departments/getGroups',
    method: 'get',
    params
  })
}

export function createOrEditGroup(data) {
  return request({
    url: '/api/Departments/CreateOrEditGroup',
    method: 'post',
    data
  })
}


