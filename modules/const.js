//错误码
export const ErrorCode = {
    LOCAL_TOKEN_EXPIRE: -1, //Token过期
    USER_CANCEL: -2, //用户操作取消
    NETWORK_ERROR: -10, //网络异常

    //接口响应状态码
    SUCC: 200, //成功
    SERVER_ERROR: 500, //内部错误
    INVALID_PARAM: 10001, //参数错误
    UNAUTHORIZED: 10002, //未授权
    INVALID_TOKEN: 10003, //Token过期
    INVALID_SIGN: 10004, //签名无效
    ACCOUNT_INVALID: 10005, //账户无效，非法调用
    USER_INVALID: 10006, //未查找到此用户
    OSS_CONIG_EXCEPTION: 10007, //获取oss配置失败
    APP_ID_INVALID: 10009, //app信息无效
    TOKEN_TEMP_HAVE_NO_AUTH: 10010, //临时Token没有该操作权限
    USER_NEED_SWITCHOVER: 10011, //当前用户不能访问指定小程序，请重新登录指定小程序
    RATE_LIMIT_TRIGGER: 10012, //您的操作过于频繁，请稍后再试
    USER_LOGIN_LOSE_OPENID: 10013, //用户缺少openId，请重新登录
    WECHAT_LOGIN_EVIDENCE_CHECK_ERROR: 11001, //微信登录凭证校验异常， 稍后再重试
    LOGIN_SEND_CODE_FAIL: 12001, //验证码发送失败
    LOGIN_CODE_CHECK_WRONG: 12002, //验证码错误或已失效
    LOGIN_FAIL: 12003, //登陆失败
    PROJECT_NOT_FOUND: 13001, //项目不存在
    COLLECTION_NOT_FOUND: 14001, //藏品不存在
    COLLECTION_NOT_START: 14002, //藏品售卖尚未开始
    COLLECTION_ALREADY_END: 14003, //藏品售卖已结束
    COLLECTION_PLAYING_METHOD_ERROR: 14004, //藏品玩法异常
    COLLECTION_SHOPING_NUM_LINIT: 14005, //藏品限购
    COLLECTION_DELETED: 14006, //藏品已删除
    COLLECTION_NOT_CASTED: 14007, //藏品尚未铸造完
    COLLECTION_NOT_SELL: 14008, //藏品尚未开始售卖
    ORDER_CREATE_OPERATION_KEY_FAIL: 15001, //生成操作key失败
    ORDER_OPERATION_KEY_ERROR: 15002, //操作key错误
    ORDER_REPERTORY_NOT_ENOUGH: 15003, //库存不足
    ORDER_REPEATED_ERROR: 15004, //重复下单
    ORDER_WECHAT_PREPAY_ERROR: 15005, //微信小程序预付失败
    ORDER_NOT_FOUND: 15006, //订单不存在
    ORDER_PAY_NEED_SELF: 15007, //支付非当前下单用户
    ORDER_PAID: 15008, //订单已支付
    ORDER_CANCELED: 15009, //订单已取消
    ORDER_TIMEOUT: 15010, //订单已超时
    ORDER_DO_NOT_NEED_PAY: 15011, //该订单不需要付款
    ORDER_ERROR: 15012, //订单异常
    NFT_NOT_FOUND: 16001, //铸造物不存在
    ACTIVITY_NOT_FOUND: 17001, //活动不存在
};

export const ErrMsg = "网络异常，请稍后重试";

//藏品作者类型  0:官方 1:非官方
export const ProductAuthorType = {
    OFFICIAL: "官方",
    NON_OFFICIAL: "个人",
};

//藏品等级, 0:R, 1:SR
export const ProductLevel = {
    R: 0,
    SR: 1,
    //   SSS: 2,
};

//藏品售卖(领取)状态 0:已开始 1:未开始
export const SellState = {
    ON: 0,
    OFF: 1,
};

//藏品购买类型 0:付款 1:免费
export const PurchaseType = {
    PAY: 0,
    FREE: 1,
};

//藏品铸造状态 0:新创建, 1:开始铸造, 2:铸造完成, 3:已删除
export const ProductNFTStatus = {
    NEW: 0,
    CASTING: 1,
    DONE: 2,
    DELETE: 3,
};

//玩法类型 0:限时抢购 1:多轮限时抢购 2:盲盒
export const ProductPlayType = {};

//藏品可购买状态
export const ProductShowStatus = {
    WAIT: 0, //敬请期待
    COUNTDOWN: 1, //即将开售
    OPEN: 2, //:热卖中
    SOLDOUT: 3, //已售罄
};

//藏品状态, 0:草稿 1:新创建, 2:已上架 3:已下架 4:已删除 5:已售罄
export const ProductActiveStatus = {
    DRAFT: 0,
    NEW: 1,
    ONSALE: 2,
    OFFSALE: 3,
    DELETE: 4,
    SOLDOUT: 5,
};

//首页推荐 跳转类型 0:不跳转 1:跳转藏品集 2:跳转藏品  3:跳转图片 4:跳转url
export const HomeJumpType = {
    NO: 0,
    PROJECT: 1,
    PRODUCT: 2,
    BANNER: 3,
    URL: 4,
};

//订单状态, 0:待支付, 1:支付完成, 2:已完成, 3:手动取消, 4:超时自动取消, 5:后台取消 -10:全部
export const OrderStatus = {
    ALL: -10,
    UNPAY: 0,
    PAID: 1,
    DONE: 2,
    MANUAL_CANCEL: 3,
    TIMEOUT_CANCEL: 4,
    ADMIN_CANCEL: 5,
};

//物流状态 0-未发货，1-已发货，2-已收货
export const OrderShipmentStatus = {
    UNSEND: 0,
    SEND: 1,
    RECEIVE: 2,
};

//投递状态
// 0快递收件(揽件)1在途中 2正在派件
// 3已签收 4派送失败 5.疑难件 6.退件签收
export const DeliveryStatus = {
    RECEIPT: 0,
    VEHICLE: 1,
    COURIER: 2,
    DONE: 3,
    FAIL: 4,
    DIFFICULT: 5,
    RETURN: 6,
};

//支付类型 0:苹果内购 1:支付宝App, 2:微信App,
// 3:微信小程序, 4:微信jsapi（公众号支付）5:微信H5（微信外）
export const PayType = {
    IOS: 0,
    ALIPAY_APP: 1,
    WX_APP: 2,
    WX_APPLEET: 3,
    WX_JSAPI: 4,
    WX_H5: 5,
};

//NFT激活状态，0:激活中 1:已激活
export const NFTActivationStatus = {
    ING: 1,
    DONE: 2,
};

//友盟记录的page参数 0首页、1展厅、2我的、3订单确认页、4banner、5藏品详情页
export const UmPageTypes = {
    Home: 0,
    ArHall: 1,
    UserCetner: 2,
    OrderConfirm: 3,
    BannerViewImg: 4,
    CollectionDetail: 5,
};