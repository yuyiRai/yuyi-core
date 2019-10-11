/* eslint-disable */
import Vue from 'vue'
import router from '@/router'
import store from '@/store'
import { message } from 'ant-design-vue'
import { login, getLoginInfo, getInfo, logout } from '@/api/login'
import { queryGradeInfo } from '@/api/grade'
import { switchGradeAndCom, queryDefaultGradeByUser, querySelectComInfoByUser } from '@/api/power'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import { queryOneCom } from '@/api/company'

const roleCodes = ['9999', '1001', '1002', '1003', '1004', '2001', '2002', '2003', '2004', '3001', '3002', '4001', '4002']
const maxHeadCount = 6 // 只有6张头像
function getHead(role) {
  let index = 1
  if (role) {
    index = roleCodes.indexOf(role) + 1
    if (index > maxHeadCount) {
      index -= maxHeadCount
    }
  }
  return `/head/${index}.png`
}

async function mergeComInfo(loginInfo) {
  const { comCode } = loginInfo
  const { data: comInfo } = await queryOneCom(comCode)
  loginInfo.comInfo = comInfo
}

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    systemPermission: [
      { permissionId: 'table', permissionName: '表格操作', actionList: ['delete', 'edit', 'disable', 'update'] }
    ],
    customSettingVisible: false // 个性配置开关
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      Vue.ls.set(ACCESS_TOKEN, token, 7 * 24 * 60 * 60 * 1000)
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_CUSTOM_SETTING: (state, flag) => {
      state.customSettingVisible = flag
    }
  },

  actions: {
    async SwitchUser({ commit, dispatch }, [gradeid, comcode]) {
      const { data } = await switchGradeAndCom(gradeid, comcode)
      await mergeComInfo(data)
      console.log(gradeid, comcode, data)
      const stop = [message.loading("正在检测用户权限变更...", 0)]
      commit('SET_TOKEN', data.token)
      try {
        const { GenerateRoutes } = await import('@/permission')
        const res = await dispatch('GetInfo')
        // console.error('SwitchUser res', res)
        stop.push(message.loading('重新获取未读公告与通知数目'))
        await dispatch('loadUnreadNum', this.userInfo)
        await GenerateRoutes(store, router, res)
        message.success("用户权限变更完成")
      } catch (error) {
        message.error("用户权限变更失败，未知错误")
        console.error(error)
      } finally {
        setTimeout(() => {
          stop.forEach(close => close())
        }, 100);
      }
      return data;
    },
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response.data
          result.permissions = []
          commit('SET_TOKEN', result.token)
          commit('SET_INFO', result)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    async GetInfo({ commit, state: { systemPermission } }) {
      try {
        console.log('GetInfo')
        const { data: loginInfo } = await getLoginInfo()
        await mergeComInfo(loginInfo)
        // const userGrade = await queryDefaultGradeByUser(loginInfo.userCode)
        // console.log('userGrade', userGrade)

        // const userComInfo = await querySelectComInfoByUser(loginInfo.userCode, loginInfo.gradeid)
        // console.log('userComInfo', userComInfo)

        const { data: { gradetasklist } } = await queryGradeInfo({ id: loginInfo.gradeid, gradecname: loginInfo.gradecname })

        // 临时存放
        commit('SET_TOKEN', loginInfo.token)
        commit('SET_INFO', loginInfo)
        // console.log(loginInfo, gradetasklist.filter(item => item.flag === '1'))


        const roleInfo = {
          name: loginInfo.gradecname,
          id: loginInfo.gradeid
        }

        // 样例方法(Mock)
        if (gradetasklist && gradetasklist.length > 0) {

          const permissionList = []
          const validTaskList = gradetasklist.filter(item => item.flag === '1')

          while (validTaskList.length > 0) {
            const { taskcname, taskcode, parentcode } = validTaskList.shift()
            // console.error(task)
            const selfOrParent = permissionList.filter(task => task.taskcode === parentcode || task.taskcode === taskcode)
            if (selfOrParent.length === 0 || permissionList.length === 0) {
              permissionList.push({
                actionEntitySet: [],
                actionList: [],
                taskcode,
                parentcode,
                dataAccess: null,
                permissionId: taskcode,
                permissionName: roleInfo.name,
                roleId: roleInfo.id
              })
            } else {
              const parent = selfOrParent.find(task => task.taskcode === parentcode)
              if (parent) {
                const actionCode = taskcode.replace(parentcode + '.', '')
                parent.actionList.push(actionCode)
                parent.actionEntitySet.push({
                  // 权限代码
                  action: actionCode,
                  // 权限名称
                  describe: taskcname,
                  // 默认选中
                  // defaultCheck: false
                })
              }
            }
          }
          Object.assign(roleInfo, {
            permissions: permissionList.concat(systemPermission),
            permissionList: loginInfo.taskList.concat(systemPermission.map(p => p.permissionId))
          })
          console.error('role', roleInfo)
          commit('SET_ROLES', { ...roleInfo })
        } else {
          throw new Error('getLoginInfo: roles must be a non-null array !')
        }
        commit('SET_NAME', { name: loginInfo.userName, welcome: welcome() })
        commit('SET_AVATAR', getHead(loginInfo.gradeid))
        return {
          code: 0,
          message: "",
          result: {
            ...loginInfo,
            role: roleInfo
          }
        }
      } catch (e) {
        console.log(e)
        throw e
      }
    },

    // 登出
    Logout({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_ROLES', [])

        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          commit('SET_TOKEN', '')
          Vue.ls.remove(ACCESS_TOKEN)
        })
      })
    }

  }
}

export default user
