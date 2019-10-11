<template>
  <a-card :tabList="tabList" :activeTabKey="activeTabKey" @tabChange="tabChange" :bordered="false">
    <div class="notice" v-if="activeTabKey === 'notice'">
      <a-spin :spinning="spinning">
        <h3 v-if="noticeList && noticeList.length === 0">暂无</h3>
        <template v-else>
          <a-list :dataSource="noticeList" :pagination="page && noticePage">
            <a-list-item slot="renderItem" slot-scope="notice">
              <AMLNoticeLine
                :key="notice.id"
                :unread="notice.readFlag === '0'"
                :important="notice.importance === '1'"
                @click="showProfile(notice, true)"
              >{{ notice.title }}</AMLNoticeLine>
            </a-list-item>
          </a-list>
        </template>
      </a-spin>
    </div>
    <div class="notice" v-else>
      <a-spin :spinning="spinning">
        <h3 v-if="notifyList && notifyList.length === 0">暂无</h3>
        <a-list v-else :dataSource="notifyList" :pagination="page && notifyPage">
          <a-list-item slot="renderItem" slot-scope="notice">
            <AMLNoticeLine
              :key="notice.id"
              :unread="notice.readFlag === '0'"
              :important="notice.importance === '1'"
              @click="showProfile(notice, true)"
            >{{ notice.title }}</AMLNoticeLine>
          </a-list-item>
        </a-list>
      </a-spin>
      <a-pagination
        v-if="page && notifyList && notifyList.length > 0"
        v-model="notifyPage.current"
        :total="notifyPage.total"
        :pageSize="notifyPage.pageSize"
        showSizeChanger
        @change="notifyPageChange"
        @showSizeChange="notifySizeChange"
      ></a-pagination>
    </div>

    <notice-detail
      ref="detail"
      v-model="detailVisible"
      mode="details"
      :fromHome="true"
      @visible:update="$emit('close')"
      @more="$emit('more')"
      :noMore="noMore"
      :id="noticeId"
    ></notice-detail>
  </a-card>
</template>
<script>
import { queryNoticesTitle, queryMainNotices, updateReadStatus } from '@/api/notice'
import NoticeDetail from '@/views/manage/notice/Detail'
import { mapGetters } from 'vuex'

export default {
  props: {
    page: {
      type: Boolean,
      default: true
    },
    noMore: {
      type: Boolean,
      default: true
    }
  },
  components: {
    NoticeDetail
  },
  data() {
    return {
      visible: this.$store.getters.noticeVisible,
      activeTabKey: 'notice',
      tabList: [{ key: 'notice', tab: '公告' }, { key: 'notify', tab: '系统通知' }],
      noticeList: [],
      notifyList: [],
      noticePage: {
        current: 1,
        showSizeChanger: true,
        total: 0,
        pageSize: 5,
        pageSizeOptions: ['5', '10', '20', '30', '50'],
        onShowSizeChange: (current, pageSize) => {
          this.noticePage.current = current
          this.noticePage.pageSize = pageSize
          this.getNotice()
        },
        onChange: current => {
          this.noticePage.current = current
          this.getNotice()
        }
      },
      notifyPage: {
        current: 1,
        showSizeChanger: true,
        total: 0,
        pageSize: 5,
        pageSizeOptions: ['5', '10', '20', '30', '50'],
        onShowSizeChange: (current, pageSize) => {
          this.notifyPage.current = current
          this.notifyPage.pageSize = pageSize
          this.getNotify()
        },
        onChange: current => {
          this.notifyPage.current = current
          this.getNotify()
        }
      },
      noticeId: '',
      detailVisible: false,
      spinning: false,
      listWidth: 0
    }
  },
  updated() {
    this.$nextTick(() => {
      if (this.$refs.list) {
        this.listWidth = Math.max(this.$refs.list.$el.offsetWidth - 30, 0)
      }
    })
  },
  created() {
    this.initPage()
  },
  watch: {
    gradeid() {
      this.tabChange(this.activeTabKey)
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'gradeid']),
    fetch() {
      const defaultPage = { pageNum: 1, pageSize: 5 }
      return {
        notice: (anncornotice, p) => queryMainNotices({ anncornotice, ...(this.page ? p : defaultPage) }),
        notify: (anncornotice, p) => queryMainNotices({ anncornotice, ...(this.page ? p : defaultPage) })
      }
    }
  },
  methods: {
    initPage() {
      this.getNotice()
      this.getNotify()
      if (this.activeTabKey !== 'notice') {
        this.activeTabKey = 'notice'
      }
    },
    getNotice() {
      this.spinning = true
      this.fetch
        .notice('0', {
          pageNum: this.noticePage.current,
          pageSize: this.noticePage.pageSize
        })
        .then(({ data }) => {
          this.noticeList = data.data || data
          // const { annceCode, comCName, userCode } = (this.notifyList = res.data.data)
          // console.log({ annceCode, comCName, userCode })
          this.noticePage.total = data.total
        })
        .catch(err => {
          if (err) {
            this.noticeList = []
          }
        })
        .finally(() => {
          this.spinning = false
        })
    },
    getNotify() {
      this.spinning = true
      this.fetch
        .notify('1', {
          pageNum: this.notifyPage.current,
          pageSize: this.notifyPage.pageSize
        })
        .then(({ data }) => {
          this.notifyList = data.data || data
          // const { annceCode, comCName, userCode } = (this.notifyList = res.data.data)
          // console.log({ annceCode, comCName, userCode })
          this.notifyPage.total = data.total
        })
        .catch(err => {
          if (err) {
            this.notifyList = []
          }
        })
        .finally(() => {
          this.spinning = false
        })
    },
    tabChange(key) {
      this.activeTabKey = key
      if (key === 'notice') {
        this.getNotice()
      } else {
        this.getNotify()
      }
    },
    /**
     * 查看详情
     * @param {Object} notice 当前点击的公告或通知
     * @param {Boolean} flag true代表公告，false代表通知
     */
    async showProfile(notice, flag) {
      this.$nextTick(() => {
        this.$refs.detail.open(notice)
        this.$emit('open')
      })
      // 修改状态为已读
      // 并更新铃铛未读数量
      await this.$store.dispatch('updateUnreadNum', notice)
      // 更新公告或通知列表
      if (flag) {
        this.getNotice()
      } else {
        this.getNotify()
      }
    },
    closeProfile() {
      this.detailVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.notice {
  /deep/ .anticon {
    margin-right: 2px;
  }
  h3 {
    color: #999;
    text-align: center;
  }
  .ant-list-item {
    padding: 0;
  }
}
</style>
