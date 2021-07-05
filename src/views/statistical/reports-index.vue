<template>
  <d2-container ref="container">
    <div class="entry-box">
      <div class="entry-item">
        <div class="entry-title">发货信息</div>
        <div class="entry-info-container">
          <div class="entry-info">
            <div class="entry-content" @click="goOrder">
              <p class="num">{{ info.notShipped }}</p>
              <p class="desc">待处理</p>
            </div>
            <div class="entry-content" @click="yifa">
              <p class="num">{{ info.shipped }}</p>
              <p class="desc">已发</p>
            </div>
          </div>
        </div>
      </div>
      <div class="entry-item">
        <div class="entry-title">销售信息</div>
        <div class="entry-info-container">
          <div class="entry-info">
            <div class="entry-content">
              <p class="num">{{ info.soldDay }}</p>
              <p class="desc">今日</p>
            </div>
            <div class="entry-content" @click="yifa">
              <p class="num">{{ info.soldWeek }}</p>
              <p class="desc">本周</p>
            </div>
            <div class="entry-content" @click="yifa">
              <p class="num">{{ info.soldMonth }}</p>
              <p class="desc">本月</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="entry-box">
      <div class="entry-item">
        <div class="entry-title">热销地区</div>
        <div class="entry-info-container">
          <el-row>
            <el-col :span="12">
              <div class="examples__block__map examples__block__map--usa">
                <svg-map
                  style="width: 70%;margin-top: 10px;"
                  :map="USA"
                  :location-class="getLocationClass"
                  @mouseover="pointLocation"
                  @mouseout="unpointLocation"
                  @mousemove="moveOnLocation"
                />
                <div
                  class="examples__block__map__tooltip"
                  :style="tooltipStyle"
                >
                  {{ pointedLocation.name }} : {{ pointedLocation.count }}
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="margin-top: 10px;margin-left: 20px;">
                <h3>销量最高10个地区</h3>
                <div style="margin-top: 20px;">
                  <template v-for="(item,index) in locationData.zhouData.slice(0, 10)">
                    <h2 :key="index">{{ item.zhou.toUpperCase() }} : {{ item.count }}</h2>
                  </template>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </d2-container>
</template>

<script>
import { getInfo } from '@/api/statistical/reports'
import { SvgMap } from "vue-svg-map"
import USA from "@svg-maps/usa"
import { mapActions, mapState } from 'vuex'
import { find, sumBy } from 'lodash'

export default {
  name: "reports-index",
  components: {
    SvgMap
  },
  data () {
    return {
      loading: false,
      info: [],
      USA,
      pointedLocation: {
        name: '',
        count: 0,
      },
      tooltipStyle: null,
    }
  },
  computed: {
    ...mapState('erp/reports', [
      'locationData',
    ])
  },
  methods: {
    ...mapActions('erp/reports', [
      'loadLocationData',
    ]),
    init () {
      Promise.all([
        getInfo()
      ]).then(values => {
        this.info = values[0]
      })
      // getInfo().then(values => {
      //   this.info = values
      // })
    },
    yifa () {
      console.log(123)
    },
    goOrder () {
      this.$router.push({ name: 'ebay-order-index' })
    },
    pointLocation (event) {
      const location = this.getLocationName(event.target)
      const zhou = find(this.locationData.zhouData, { zhou: location.id })
      this.pointedLocation.name = location.name
      if (zhou) {
        this.pointedLocation.count = zhou.count
      } else {
        this.pointedLocation.count = 0
      }
    },
    unpointLocation (event) {
      // this.pointedLocation = null
      this.tooltipStyle = { display: 'none' }
    },
    moveOnLocation (event) {
      this.tooltipStyle = {
        display: 'block',
        top: `${event.clientY + 10}px`,
        left: `${event.clientX - 100}px`,
      }
    },
    getLocationClass (location, index) {
      // Generate heat map
      const zhou = find(this.locationData.zhouData, { zhou: location.id })
      const total = sumBy(this.locationData.zhouData, 'count')
      // console.log(total)
      if (zhou) {
        const i = Math.round(zhou.count / total * 100)
        console.log([zhou.zhou, zhou.count, i, i % 4])
        // console.log(i % 4)
        return `svg-map__location svg-map__location--heat${i % 4}`
      }
    },
    getLocationName (node) {
      return { id: node.attributes.id.value, name: node.attributes.name.value }
    }
  },
  async mounted () {
    await this.loadLocationData()
    await this.init()
  }
}
</script>

<style>
.entry-box {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: nowrap;
  flex-wrap: nowrap;
  -ms-flex-pack: distribute;
  justify-content: space-around;
  margin-bottom: 18px;
}
.entry-item {
  display: inline-block;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  border-radius: 3px;
  overflow: hidden;
}
.entry-item+.entry-item {
  margin-left: 12px;
}
.entry-item .entry-title {
  height: 47px;
  background-color: #58c0de;
  font-size: 18px;
  color: #fff;
  line-height: 47px;
  padding-left: 10px;
}
.entry-item .entry-info-container {
  position: relative;
}
.entry-item .entry-info {
  width: calc(100% - 20px);
  height: 88px;
  padding: 10px 10px 5px;
  background-color: #fff;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: nowrap;
  flex-wrap: nowrap;
  -ms-flex-pack: distribute;
  justify-content: space-around;
}
.entry-item .entry-content {
  flex-basis: 30%;
  height: 55px;
  padding-top: 8px;
  padding-bottom: 10px;
  cursor: pointer;
}
.entry-content:hover {
  color: #409EFF;
}
.entry-item .entry-content .num {
  text-align: center;
  font-size: 26px;
  font-weight: 700;
}
.entry-item .entry-content .desc {
  text-align: center;
  color: #909399;
  margin-top: 5px;
  font-size: 14px;
}
</style>
<style src="vue-svg-map/dist/index.css"></style>
