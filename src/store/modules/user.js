import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import {  Message } from 'element-ui'
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    userid: -1
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERID :(UserId) =>{
    state.userid = UserId;
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    // todo remove, fix avatar
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { Username, Password, RememberMe } = userInfo
    return new Promise((resolve, reject) => {
      login({ Username: Username.trim(), Password, RememberMe }).then(response => {
        const { token,Id } = response
        commit('SET_TOKEN', token)
        commit('SET_USERID', Id);

        setToken(token)
        resolve()
      }).catch( ({data,hideNormalError})  => {
        reject(data)
        // Hide global error handler 
        hideNormalError();

        if(data!=null && data.detail!=null){
          Message({
            message: data.detail,
            type: 'error',
            duration: 5 * 1000
          });
        }
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        if (!response) {
          return reject('Verification failed, please Login again.')
        }

        const { UserName, Id } = response

        commit('SET_NAME', UserName)
       
        commit('SET_USERID', Id)

        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

