<template>
  <div class="user-wrapper">
    <div class="content-box">
      <HintIcon class="action" />
      <!-- <a href="https://pro.loacg.com/docs/getting-started" target="_blank">
        <span class="action">
          <a-icon type="question-circle-o"></a-icon>
        </span>
      </a>-->
      <notice-icon class="action" />
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar" size="small" :src="avatar()" />
          <span>{{ nickname() }}</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <a-menu-item key="0">
            <a href="javascript:;" @click="showUserInfo">
              <a-icon type="user" />
              <span>个人信息</span>
            </a>
          </a-menu-item>
          <a-menu-item key="2">
            <a @click="showCustomSettings">
              <a-icon type="layout" />
              <span>个性配置</span>
            </a>
          </a-menu-item>
          <a-menu-item key="3">
            <a @click="showUserSwitch">
              <a-icon type="team" />
              <span>角色切换</span>
            </a>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="4">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout" />
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <user-info v-if="userInfoVisible" @onClose="closeUserInfo"></user-info>
      <user-switch v-if="userSwitchVisible" @onClose="closeUserSwitch"></user-switch>
    </div>
  </div>
</template>

<script>
import NoticeIcon from '@/components/NoticeIcon'
import HintIcon from './HintIcon'
import { mapActions, mapGetters } from 'vuex'

import UserInfo from '@/views/user/Info'
import UserSwitch from '@/views/user/UserSwitch'

export default {
  name: 'UserMenu',
  components: {
    NoticeIcon,
    UserInfo,
    UserSwitch,
    HintIcon
  },
  data() {
    return {
      userInfoVisible: false
    }
  },
  computed: {
    /**
     * 调整用户切换窗口为全局store控制
     * @author chenyang
     */
    userSwitchVisible: {
      get() {
        return this.$store.state.app.userSwitchVisible
      },
      set(v) {
        this.$store.commit('USER_SWITCH_TOGGLE', v)
      }
    },
    // eslint-disable-next-line vue/return-in-computed-property
    userEmail() {
      if (this.$store) {
        if (!/^([A-Za-z0-9]{1,20})@ccic-net.com.cn$/.test(this.$store.getters.userInfo.email)) {
          this.$message.error('请填写正确的邮箱')
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.userInfoVisible = true
        }
        return this.$store.getters.userInfo.email
      }
    }
  },
  methods: {
    ...mapActions(['Logout']),
    ...mapGetters(['nickname', 'avatar']),
    handleLogout() {
      const that = this

      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk() {
          return that
            .Logout({})
            .then(() => {
              window.location.reload()
            })
            .catch(err => {
              that.$message.error({
                title: '错误',
                description: err.message
              })
            })
        },
        onCancel() {}
      })
    },
    showCustomSettings() {
      this.$store.commit('SET_CUSTOM_SETTING', true)
    },
    showUserInfo() {
      this.userInfoVisible = true
    },
    closeUserInfo() {
      this.userInfoVisible = false
    },
    showUserSwitch() {
      this.userSwitchVisible = true
    },
    closeUserSwitch() {
      this.userSwitchVisible = false
    }
  }
}
</script>
