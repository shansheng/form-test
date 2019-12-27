import input from './control/Input';
import radio from './control/Radio';
import checkBox from './control/CheckBox';

const form_item = {
  input,
  radio,
  checkBox
};

export default {
  name: 'renders',
  render(h) {
    return h('el-form-item', {
      props: {
        label: this.obj.label + "："
      }
    }, form_item[this.ele](this, h));
  },
  props: {
    ele: {
      type: String,
      default: "input"
    },
    obj: {
      type: Object,
      default: {}
    }
  }
}
