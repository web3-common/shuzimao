import * as Api from "modules/api";
// import { ErrMsg } from "const";
// import Message from "plugins/message";
import {
    createLog
} from "plugins/log";
const log = new createLog("activity:");
// 获取活动信息
export async function getActivityInfo(id) {
    try {
        return await Api.get("/activity/getActivityInfo", {
            activityId: id,
        });
    } catch (err) {
        log.error(err);
    }
}
// 获取当前用户信息
export async function getActivityUserInfo(activityId) {
    try {
        return Api.get("/activity/status", {
            activityId
        });
    } catch (err) {
        log.error(err);
        return err;
    }
}

// 根据用户id获取昵称
export async function getUserNickName(userId) {
    try {
        return await Api.get("activity/getUserNickName", {
            userId,
        });
    } catch (err) {
        log.error("userNickName", err);
        return err;
    }
}
// 助力(验证手机号后助力)
export async function helpCharge({
    inviter,
    activityId
} = {}) {
    try {
        await Api.post("/activity/charge", {
            inviter,
            activityId,
        });
        return true;
    } catch (err) {
        log.error("helpCharge", err);
        return err;
    }
}
// 邀请记录列表
export async function chargeList(activityId) {
    try {
        return await Api.get("activity/chargeList", {
            activityId,
        });
    } catch (err) {
        log.error("invitelist", err);
        return err;
    }
}