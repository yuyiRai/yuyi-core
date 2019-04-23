/* eslint-disable */
import { Component, Inject, Prop, Vue, Watch } from 'vue-property-decorator';
import SelectAndSearchItem from './SelectAndSearchItem'
import { watch } from 'fs';
import { Observer } from 'mobx-vue'
// import 'Reflect-metadata';

@Observer
@Component({})
export default class AddressInputItem extends Vue {
  @Prop({type: Object, required: true}) itemConfig
  @Prop({type: String}) searchAddress
  @Prop({type: Object}) value 
  @Prop({type: Boolean}) disabled
  @Prop({type: Boolean}) viewOnly
  @Prop({type: Object, default:() => (
    {
      city: 'surveyCity',
      area: 'surveyArea',
      province: 'surveyProvince',
      address: 'surveyAddress'
    }
  )}) props

  get province(){
    return this.value[this.props.province]
  }
  set province(v){
    this.$set(this.value, this.props.province, v)
  }
  get area(){
    return this.value[this.props.area]
  }
  set area(v){
    this.$set(this.value, this.props.area, v)
  }
  get address(){
    // console.log(this.value, this.props.address)
    return this.value[this.props.address]
  }
  set address(v){
    this.$set(this.value, this.props.address, v)
  }
  get city(){
    return this.value[this.props.city]
  }
  set city(v){
    this.$set(this.value, this.props.city, v)
  }
  get selectList(){
    return this.$store.state.taskDispatcher
  }

  get viewString(){
    return Utils.zipEmptyData([this.value['provinceName'], this.value['cityName'], this.value['areaName'], this.address]).join('-')
  }

  provinceOptions = []
  cityOptions = []
  areaOptions = []
  loading1 = true
  loading2 = true
  loading3 = true

  render(h){
    const { itemConfig, disabled, provinceOptions, cityOptions, areaOptions } = this;
    const { type, label, code, remoteMethod, ...other} = itemConfig
    const commonProps = {
      attr:{
        style: "width: 100%",
      },
      props: {
        disabled,
      }
    }
    const colStyle = {'display': this.viewOnly?'none':undefined}
    return (
      // <el-form ref='form' model={this.value}>
        <el-row type='flex' gutter={2} class={['address-input-item', { 'viewOnly': this.viewOnly }]}>
          { this.viewOnly && <el-col span={24}>{this.viewString}</el-col>}
          {[<el-col span={4} style={colStyle}>
            <el-form-item prop={this.props.province}>
              <SelectAndSearchItem key='a' style="width: 100%" v-loading={this.loading1} {...commonProps} type="select" 
                itemConfig={{...other, options: provinceOptions, label: label+'省', nameCode: 'provinceName'}} value={this.province} onChange={this.onProvinceChange}  onChange-with={this.onChangeWith}/>
            </el-form-item>
          </el-col>,
          <el-col span={4} style={colStyle}>
            <SelectAndSearchItem key='b' style="width: 100%" v-loading={this.loading2} {...commonProps} type="select" 
              itemConfig={{ ...other, options: cityOptions, noDataText: '请先选择省', label: label+'市', nameCode: 'cityName'}} onChange-with={this.onChangeWith} value={this.city} onChange={this.onCityChange} />
          </el-col>,
          <el-col span={4} style={colStyle}>
            <SelectAndSearchItem key='c' style="width: 100%" v-loading={this.loading3} {...commonProps} type="select" 
              itemConfig={{ ...other, label: label+'区', noDataText: '请先选择市', nameCode: 'areaName', options: areaOptions}} onChange-with={this.onChangeWith} value={this.area} onChange={this.onAreaChange} />
          </el-col>,
          <el-col span={12} style={colStyle}>
            <SelectAndSearchItem key='d' style="width: 100%" {...commonProps} type="search" itemConfig={itemConfig} value={this.address} searchName={this.address} 
                onChange={this.onChange} onChange-with={this.onChangeWith} />
          </el-col>]}
        </el-row>
      // </el-form>
    )
  }



  onProvinceChange(value) {
    this.province = value
  }

  onCityChange(value) {
    // console.log(value)
    this.city = value
  }
  onAreaChange(value) {
    this.area = value
  }

  getCityOptions(surveyProvince) {
    if(!this.selectedProvince || (this.selectedProvince || {}).value !== surveyProvince) {
        const [ option = {} ] = Utils.getOptionsByValue(this.selectList.provinceList, surveyProvince)
        this.selectedProvince = option
        // console.log(option)
    }
    return _.filter(this.selectList.cityList, { dto: {parentCode: this.selectedProvince.value} })
  }

  getAreaOptions(surveyCity) {
    if(!this.selectedCity || (this.selectedCity || {}).value !== surveyCity) {
        const [ option = {} ] = Utils.getOptionsByValue(this.selectList.cityList, surveyCity)
        this.selectedCity = option
    }
    if (this.selectedProvince && this.selectedCity){
        const {value: provinceCode} = this.selectedProvince;
        const {value: cityCode} = this.selectedCity;
        const parentCode = /^110[1-2]00$/.test(cityCode) ? `${(parseInt(provinceCode) + parseInt(cityCode) - 110000)}` : cityCode
        return _.filter(this.selectList.countyCodeList, { dto: {parentCode } })
    }
    return []
  }

  @Watch("selectList.provinceList", { immediate: true })
  // @Utils.timebuffer(100)
  async updateListProvinceList(v){
    this.provinceOptions = this.selectList.provinceList
    await Utils.waitingPromise(10)
    if(v.length > 0) {
      // console.log("selectList.provinceList", this.itemConfig.label, v.length)
      this.loading1 = false
    }
  }

  @Watch("selectList.cityList", { immediate: true })
  @Watch("province", { immediate: true })
  // @Utils.timebuffer(100)
  async updateListCityList() {
    this.cityOptions = this.getCityOptions(this.province)
    await Utils.waitingPromise(10)
    if(this.provinceOptions.length>0) {
      this.onChangeWith(this.province, this.props.province)
      this.onChange(this.address)
    }
    if(this.selectList.cityList.length > 0){
      this.loading2 = false
    }
  }

  @Watch("selectList.countyCodeList", { immediate: true })
  @Watch("city", { immediate: true })
  // @Utils.timebuffer(100)
  async updateListCountyCodeList(){
    this.areaOptions = this.getAreaOptions(this.city)
    await Utils.waitingPromise(10)
    if(this.cityOptions.length > 0){
      this.onChangeWith(this.city, this.props.city)
      this.onChange(this.address)
    }
    if(this.selectList.countyCodeList.length > 0) {
      // console.log("selectList.countyCodeList", v.length)
      this.loading3 = false
    }
  }

  // translateCodeGroup = () => {
  //   const education = await request({url: '/support/codeTranslate', methods: 'GET', 
  //     params: { codeType: 'Education', codeCode: educationLevel }
  //   })
  //   this.address
  // }

  @Watch("area")
  async updateAreaOptions(value) {
    this.onChangeWith(value, this.props.area)
    this.onChange(this.address)
  }

  created(){
    this.province = this.province || null
    this.city = this.city || null
    this.area = this.area || null
    this.value["surveyCityCodes"] = this.value["surveyCityCodes"] || null
    this.value["surveyCityNames"] = this.value["surveyCityNames"] || null
  }

  onChange(value) {
    this.$emit('change', value)
    this.$set(this.value, this.props.address, value)

    // console.log('onchange', this.value, args)
  }

  onChangeWith(value, key){
    this.$emit('change-with', value, key)
    // console.log('onChangeWith', value, key)
    this.$set(this.value, key, value)
    // this.$refs.form.validate()
  }
}