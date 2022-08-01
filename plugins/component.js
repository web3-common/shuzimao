//注入公共组件
import NavBar from "components/public/nav-bar.vue";
import Image from "components/public/image.vue";
import ErrorPage from "components/public/error-page.vue";
import OrderItem from "components/order/item.vue";
import PullDownRefresh from "components/public/pull-refresh.vue";
export default {
    install(app) {
        app
            .component(NavBar.name, NavBar)
            .component(Image.name, Image)
            .component(ErrorPage.name, ErrorPage)
            .component(OrderItem.name, OrderItem)
            .component(PullDownRefresh.name, PullDownRefresh);
    },
};