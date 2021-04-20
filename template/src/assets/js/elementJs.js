/**
 * Created by RoryHe on 2020/12/2.
 */
import Vue from 'vue'
import {
  Input,
  Collapse,
  CollapseItem,
  Carousel,
  CarouselItem,
  Table,
  TableColumn,
  Select,
  Option,
  OptionGroup,
  MessageBox,
  Message,
  Alert,
  Notification,
  Button,
  Radio,
  RadioGroup,
  RadioButton,
  DatePicker,
  Row,
  Col,
  Tabs,
  TabPane,
  Drawer,
  Cascader,
  Tooltip,
} from 'element-ui'

Vue.use(Drawer)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Row)
Vue.use(Col)
Vue.use(DatePicker)
Vue.use(Input)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Button)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Select)
Vue.use(OptionGroup)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tooltip)


Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
