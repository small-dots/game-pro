import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import PrimeVue from 'primevue/config';
import AutoComplete from 'primevue/autocomplete';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Avatar from 'primevue/avatar';
import AvatarGroup from 'primevue/avatargroup';
import Badge from 'primevue/badge';
import BadgeDirective from 'primevue/badgedirective';
import BlockUI from 'primevue/blockui';
import Button from 'primevue/button';
import Breadcrumb from 'primevue/breadcrumb';
import Calendar from 'primevue/calendar';
import Card from 'primevue/card';
import Chart from 'primevue/chart';
import CascadeSelect from 'primevue/cascadeselect';
import Carousel from 'primevue/carousel';
import Checkbox from 'primevue/checkbox';
import Chip from 'primevue/chip';
import Chips from 'primevue/chips';
import ColorPicker from 'primevue/colorpicker';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmPopup from 'primevue/confirmpopup';
import ConfirmationService from 'primevue/confirmationservice';
import ContextMenu from 'primevue/contextmenu';
import DataTable from 'primevue/datatable';
import DataView from 'primevue/dataview';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions';
import DeferredContent from 'primevue/deferredcontent';
import Dialog from 'primevue/dialog';
import DialogService from 'primevue/dialogservice';
import Divider from 'primevue/divider';
import Dock from 'primevue/dock';
import Dropdown from 'primevue/dropdown';
import DynamicDialog from 'primevue/dynamicdialog';
import Fieldset from 'primevue/fieldset';
import FileUpload from 'primevue/fileupload';
import Galleria from 'primevue/galleria';
import Image from 'primevue/image';
import InlineMessage from 'primevue/inlinemessage';
import Inplace from 'primevue/inplace';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import InputMask from 'primevue/inputmask';
import InputNumber from 'primevue/inputnumber';
import Knob from 'primevue/knob';
import Listbox from 'primevue/listbox';
import MegaMenu from 'primevue/megamenu';
import Menu from 'primevue/menu';
import Menubar from 'primevue/menubar';
import Message from 'primevue/message';
import MultiSelect from 'primevue/multiselect';
import OrderList from 'primevue/orderlist';
import OrganizationChart from 'primevue/organizationchart';
import OverlayPanel from 'primevue/overlaypanel';
import Paginator from 'primevue/paginator';
import Panel from 'primevue/panel';
import PanelMenu from 'primevue/panelmenu';
import Password from 'primevue/password';
import PickList from 'primevue/picklist';
import ProgressBar from 'primevue/progressbar';
import ProgressSpinner from 'primevue/progressspinner';
import Rating from 'primevue/rating';
import RadioButton from 'primevue/radiobutton';
import Ripple from 'primevue/ripple';
import Row from 'primevue/row';
import SelectButton from 'primevue/selectbutton';
import ScrollPanel from 'primevue/scrollpanel';
import ScrollTop from 'primevue/scrolltop';
import Skeleton from 'primevue/skeleton';
import Slider from 'primevue/slider';
import Sidebar from 'primevue/sidebar';
import SpeedDial from 'primevue/speeddial';
import SplitButton from 'primevue/splitbutton';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import Steps from 'primevue/steps';
import StyleClass from 'primevue/styleclass';
import TabMenu from 'primevue/tabmenu';
import TieredMenu from 'primevue/tieredmenu';
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import Toolbar from 'primevue/toolbar';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Tag from 'primevue/tag';
import Terminal from 'primevue/terminal';
import Timeline from 'primevue/timeline';
import ToggleButton from 'primevue/togglebutton';
import Tooltip from 'primevue/tooltip';
import Tree from 'primevue/tree';
import TreeSelect from 'primevue/treeselect';
import TreeTable from 'primevue/treetable';
import TriStateCheckbox from 'primevue/tristatecheckbox';
import VirtualScroller from 'primevue/virtualscroller';
import BlockViewer from '@/components/BlockViewer.vue';
import moment from "moment";
import '@/assets/styles.scss';

const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
  ripple: true, locale: {
    "startsWith": "以...开始",
    "contains": "包含",
    "notContains": "不包含",
    "endsWith": "以...结尾",
    "equals": "等于",
    "notEquals": "不等于",
    "noFilter": "无筛选",
    "filter": "筛选",
    "lt": "小于",
    "lte": "小于等于",
    "gt": "大于",
    "gte": "大于等于",
    "dateIs": "日期为",
    "dateIsNot": "日期不为",
    "dateBefore": "日期早于",
    "dateAfter": "日期晚于",
    "custom": "自定义",
    "clear": "清除",
    "apply": "应用",
    "matchAll": "全部匹配",
    "matchAny": "任意匹配",
    "addRule": "添加规则",
    "removeRule": "移除规则",
    "accept": "是",
    "reject": "否",
    "choose": "选择",
    "upload": "上传",
    "cancel": "取消",
    "completed": "已完成",
    "pending": "待处理",
    "dayNames": [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
    ],
    "dayNamesShort": [
        "周日",
        "周一",
        "周二",
        "周三",
        "周四",
        "周五",
        "周六"
    ],
    "dayNamesMin": [
        "日",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六"
    ],
    "monthNames": [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月"
    ],
    "monthNamesShort": [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月"
    ],
    "chooseYear": "选择年份",
    "chooseMonth": "选择月份",
    "chooseDate": "选择日期",
    "prevDecade": "上一个十年",
    "nextDecade": "下一个十年",
    "prevYear": "上一年",
    "nextYear": "下一年",
    "prevMonth": "上个月",
    "nextMonth": "下个月",
    "prevHour": "上一小时",
    "nextHour": "下一小时",
    "prevMinute": "上一分钟",
    "nextMinute": "下一分钟",
    "prevSecond": "上一秒",
    "nextSecond": "下一秒",
    "am": "上午",
    "pm": "下午",
    "today": "今天",
    "weekHeader": "周",
    "firstDayOfWeek": 0,
    "showMonthAfterYear": true,
    "dateFormat": "yy/mm/dd",
    "weak": "弱",
    "medium": "中",
    "strong": "强",
    "passwordPrompt": "输入密码",
    "emptyFilterMessage": "未找到结果",
    "searchMessage": "有 {0} 条结果可用",
    "selectionMessage": "已选择 {0} 项",
    "emptySelectionMessage": "未选择任何项",
    "emptySearchMessage": "未找到结果",
    "emptyMessage": "无可用选项",
    "aria": {
        "trueLabel": "是",
        "falseLabel": "否",
        "nullLabel": "未选择",
        "star": "1颗星",
        "stars": "{star}颗星",
        "selectAll": "已选择所有项目",
        "unselectAll": "已取消选择所有项目",
        "close": "关闭",
        "previous": "上一个",
        "next": "下一个",
        "navigation": "导航",
        "scrollTop": "滚动到顶部",
        "moveTop": "移至顶部",
        "moveUp": "上移",
        "moveDown": "下移",
        "moveBottom": "移至底部",
        "moveToTarget": "移至目标",
        "moveToSource": "移至源",
        "moveAllToTarget": "全部移至目标",
        "moveAllToSource": "全部移至源",
        "pageLabel": "{page}",
        "firstPageLabel": "首页",
        "lastPageLabel": "尾页",
        "nextPageLabel": "下一页",
        "previousPageLabel": "上一页",
        "rowsPerPageLabel": "每页行数",
        "jumpToPageDropdownLabel": "跳至页面下拉框",
        "jumpToPageInputLabel": "跳至页面输入框",
        "selectRow": "选择行",
        "unselectRow": "取消选择行",
        "expandRow": "展开行",
        "collapseRow": "折叠行",
        "showFilterMenu": "显示筛选菜单",
        "hideFilterMenu": "隐藏筛选菜单",
        "filterOperator": "筛选运算符",
        "filterConstraint": "筛选条件",
        "editRow": "编辑行",
        "saveEdit": "保存编辑",
        "cancelEdit": "取消编辑",
        "listView": "列表视图",
        "gridView": "网格视图",
        "slide": "滑动",
        "slideNumber": "{slideNumber}",
        "zoomImage": "放大图片",
        "zoomIn": "放大",
        "zoomOut": "缩小",
        "rotateRight": "向右旋转",
        "rotateLeft": "向左旋转"
    }
}
});
app.config.globalProperties.$moment = moment;

app.use(ToastService);
app.use(DialogService);
app.use(ConfirmationService);

app.directive('tooltip', Tooltip);
app.directive('badge', BadgeDirective);
app.directive('ripple', Ripple);
app.directive('styleclass', StyleClass);

app.component('BlockViewer', BlockViewer);

app.component('Accordion', Accordion);
app.component('AccordionTab', AccordionTab);
app.component('AutoComplete', AutoComplete);
app.component('Avatar', Avatar);
app.component('AvatarGroup', AvatarGroup);
app.component('Badge', Badge);
app.component('BlockUI', BlockUI);
app.component('Breadcrumb', Breadcrumb);
app.component('Button', Button);
app.component('Calendar', Calendar);
app.component('Card', Card);
app.component('Chart', Chart);
app.component('Carousel', Carousel);
app.component('CascadeSelect', CascadeSelect);
app.component('Checkbox', Checkbox);
app.component('Chip', Chip);
app.component('Chips', Chips);
app.component('ColorPicker', ColorPicker);
app.component('Column', Column);
app.component('ColumnGroup', ColumnGroup);
app.component('ConfirmDialog', ConfirmDialog);
app.component('ConfirmPopup', ConfirmPopup);
app.component('ContextMenu', ContextMenu);
app.component('DataTable', DataTable);
app.component('DataView', DataView);
app.component('DataViewLayoutOptions', DataViewLayoutOptions);
app.component('DeferredContent', DeferredContent);
app.component('Dialog', Dialog);
app.component('Divider', Divider);
app.component('Dock', Dock);
app.component('Dropdown', Dropdown);
app.component('DynamicDialog', DynamicDialog);
app.component('Fieldset', Fieldset);
app.component('FileUpload', FileUpload);
app.component('Galleria', Galleria);
app.component('Image', Image);
app.component('InlineMessage', InlineMessage);
app.component('Inplace', Inplace);
app.component('InputMask', InputMask);
app.component('InputNumber', InputNumber);
app.component('InputSwitch', InputSwitch);
app.component('InputText', InputText);
app.component('Knob', Knob);
app.component('Listbox', Listbox);
app.component('MegaMenu', MegaMenu);
app.component('Menu', Menu);
app.component('Menubar', Menubar);
app.component('Message', Message);
app.component('MultiSelect', MultiSelect);
app.component('OrderList', OrderList);
app.component('OrganizationChart', OrganizationChart);
app.component('OverlayPanel', OverlayPanel);
app.component('Paginator', Paginator);
app.component('Panel', Panel);
app.component('PanelMenu', PanelMenu);
app.component('Password', Password);
app.component('PickList', PickList);
app.component('ProgressBar', ProgressBar);
app.component('ProgressSpinner', ProgressSpinner);
app.component('RadioButton', RadioButton);
app.component('Rating', Rating);
app.component('Row', Row);
app.component('SelectButton', SelectButton);
app.component('ScrollPanel', ScrollPanel);
app.component('ScrollTop', ScrollTop);
app.component('Slider', Slider);
app.component('Sidebar', Sidebar);
app.component('Skeleton', Skeleton);
app.component('SpeedDial', SpeedDial);
app.component('SplitButton', SplitButton);
app.component('Splitter', Splitter);
app.component('SplitterPanel', SplitterPanel);
app.component('Steps', Steps);
app.component('TabMenu', TabMenu);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);
app.component('Tag', Tag);
app.component('Textarea', Textarea);
app.component('Terminal', Terminal);
app.component('TieredMenu', TieredMenu);
app.component('Timeline', Timeline);
app.component('Toast', Toast);
app.component('Toolbar', Toolbar);
app.component('ToggleButton', ToggleButton);
app.component('Tree', Tree);
app.component('TreeSelect', TreeSelect);
app.component('TreeTable', TreeTable);
app.component('TriStateCheckbox', TriStateCheckbox);
app.component('VirtualScroller', VirtualScroller);

app.mount('#app');
