


export const VERSION = '1.0.1';

export const globalItemData = [
    {
        name: 'icon1',
        radius: 56 >> 1,
        color: 'e37b0d',
    },
    {
        name: 'icon2',
        radius: 86 >> 1,
        color: 'efef11',
    },
    {
        name: 'icon3',
        radius: 107 >> 1,
        color: 'cea2eb',
    },
    {
        name: 'icon4',
        radius: 139 >> 1,
        color: '26d826',
    },
    {
        name: 'icon5',
        radius: 169 >> 1,
        color: 'c5a5a5',
    },
    {
        name: 'icon6',
        radius: 206 >> 1,
        color: 'e01717',
    },
    {
        name: 'icon7',
        radius: 244 >> 1,
        color: 'dc13dc',
    },
    {
        name: 'icon8',
        radius: 296 >> 1,
        color: '1ae01a',
    },
    {
        name: 'icon9',
        radius: 337 >> 1,
        color: 'e7971e',
    },
    {
        name: 'icon10',
        radius: 299 >> 1,
        color: 'e7971e',
    },
];
export const DeviceLevelEnum = {
    HIGH_END: 'high_end',
    MEDIUM: 'medium',
    LOW_END: 'low_end',
    UNAVAILABLE: 'unavailable',
};

export const StageWidth = 750; // 舞台设计尺寸宽
export const StageHeight = getStageHeight(); // 舞台设计高
export const StageMinHeight = 1334; // 舞台设计最小高度
export const StageMaxHeight = 1624; // 舞台设计最小高度
export let CurStageHeight = 1624; // 当前屏幕高度
export let StatusBarHeight = 0; // 屏幕
export let DeviceLevel = DeviceLevelEnum.UNAVAILABLE;
export let IsAcceptedWLJTask = false; // 五棱镜任务
export let IsCompleteWLJTask = false; // 五棱镜任务完成
export let IsAuthCore = false; // 是否授权
export let OldSkiping = '';
export let NextType = NaN; // 下一个

export let ViewInitOver = false; // 游戏初始化完成

export const SafeLineY = 230;
export const ShowSafeLineY = 1200; // 550//1000//500;
export const EndStatesTime = 2000; // 有一个body持续超过结束线两秒就gg
export const CreateBodyDisTime = 800; // 每次点击后 生成新body时间间隔
export const UnderGroundY = 1150; // 地板位置

export const DebugMatter = false; // 测试物理
export const Debug = false; // 调试模式  关闭授权 协议走本地
export const PreProp = false; // 预发测试

export const MaxItemLevel = 4; // 最大生成球等级

export const SendGameSnapshotDis = 10000; // 每10秒同步一次
export const HeartDistance = 15000; // 每15秒上报一次心跳

export const AssetsUrlCdn = 'https://g.alicdn.com/alisports-fe/basketball-assets/0.0.8/assets/';

/**
 *
 * 新手引导id   当前所处步骤
 * = 0      所有引导结束
 * = 1      首次进入合成蓝球界面
 * = 2      引导篮球合成成功
 * = 3      当局进入游戏合成10个球后给奖励
 * = 4      使用道具1
 * = 5      使用道具1成功
 * = 6      再次合成10个球后给奖励
 * = 7      使用道具2
 * = 8      使用道具2成功
 */
export const GuildStatesEnum = {
    Over: 0,
    FirstInGame: 1,
    FirstComp: 2,
    HideDesc: 3,
    FirstComp10: 4,
    UseItem1: 5,
    UseItem1Suc: 6,
    SecondComp10: 7,
    UseItem2: 8,
    UseItem2Suc: 9,
};

export const MtopAPI = {
    getUserPointsInfo: 'mtop.alisports.messi.club.game.getUserPointsInfo', // 获取积分
    getGameInfo: 'mtop.alisports.messi.club.game.getGameInfo', // 登录信息
    startNewGame: 'mtop.alisports.messi.club.game.startNewGame', // 开始新游戏
    getGameData: 'mtop.alisports.messi.club.game.getGameData', // 获取游戏记录
    getGameProps: 'mtop.alisports.messi.club.game.getGameProps', // 查询用户当前拥有的游戏道具Mtop
    endThisGame: 'mtop.alisports.messi.club.game.endThisGame', // 结束本局游戏Mtop
    useGameProps: 'mtop.alisports.messi.club.game.useGameProps', // 用户使用游戏道具Mtop
    grantNewUserGameProps: 'mtop.alisports.messi.club.game.grantNewUserGameProps', // 新用户玩法引导链接发放新人游戏道具
    logHeartbeat: 'mtop.alisports.messi.club.game.logHeartbeat', // 心跳
    // ----------------- post
    uploadGameData: 'mtop.alisports.messi.club.game.uploadGameData', // 上传本局游戏进度数据Mtop
};

export const EventType = {
    ticker: 'ticker',
    loadProgress: 'loadProgress',
    gameInfoChange: 'gameInfoChange',
    scoreChange: 'scoreChange', // 玩家积分变化
    itemChange: 'itemChange',
    useItemChange: 'useItemChange',
    reLive: 'reLive', // 复活
    wljEvent: 'wljEvent', // 五棱镜任务
    resultOfThisGame: 'resultOfThisGame', // 当局篮球数
    guideStepChange: 'guideStepChange',
    mTopCodeError: 'mTopCodeError',
    toastOpenUI: 'toastOpenUI',
    uploadError: 'uploadError',
    uploadSucceed: 'uploadSucceed',
    gamePlayingInOtherDevice: 'gamePlayingInOtherDevice', // 别的设备登录呢
    gamePlayingInOtherPlatform: 'gamePlayingInOtherPlatform', // 别的端登录呢
    resize: 'resize',

    debugTest: 'debugTest',
};

export const ItemType = {
    mofabang: '1', // 魔法棒
    zhenping: '2', // 震屏
};

export const SkipType = {
    // 跳转类型
    alertSkip: 'alertSkip',
    urlSkip: 'urlSkip',
};

export const AlertType = {
    gameCounts: 'gameCounts', // 获取游戏次数
    gameItem1: 'gameItem1', // 获取道具1
    gameItem2: 'gameItem2', // 获取道具2
    gameLife: 'gameLife', // 获取复活次数
};

export const ToastMessage = {
    '1': ' 任务完成，获得复活次数',
    '2': ' 任务完成，获得游戏次数',
    '3': ' 任务完成，获得魔法棒',
    '4': ' 任务完成，获得震屏次数',
    CompleteWLJ: '任务完成，奖励已发放',
};

export const ErrorMessage = {
    NoBall: '没有可以使用魔法棒的球',
    ABORT: '网络开小差啦',
    UNEXCEPT_REQUEST: '网络开小差啦',
    GAME_PLAYING_IN_OTHER_DEVICE: '游戏已在另一个设备中进行',
    GAME_PLAYING_IN_OTHER_PLATFORM: '游戏已在其他APP登录',
    FAIL_SYS_HSF_THROWN_EXCEPTION: '网络开小差啦',
    FAIL_SYS_HSF_INVOKE_ERROR: '网络开小差啦',
    PLAYING_GAME_CANT_START_NEW_GAME: '游戏进行中，不能开始新游戏',
    GAME_NOT_EXIST: '网络异常',
    OPERATE_FREQUENTLY: '操作太频繁，请稍后再试',
    LAST_GAME_ALREADY_OVER: '上局游戏已结束，请重新开始游戏',
    CURRENT_GAME_STATUS_CANT_USE_GAME_PROP: '当前游戏状态不能使用道具',
    GRANT_GAME_PROP_THAN_LIMIT: '发放游戏道具超过限制',
    SERVER_ERROR: '网络开小差啦.',
    NOT_LOGIN: '网络开小差啦..',
    FAIL_ACCS: '网络开小差啦',

    default: '网络开小差啦...',
};

export const HrefUrl = {
    reback: 'https://www.cnblogs.com/zhujiabin/p/4915011.html', // 返回按钮
    exchange: 'https://www.cnblogs.com/zhujiabin/p/4915011.html', // 兑换界面
    myReward: 'https://www.cnblogs.com/zhujiabin/p/4915011.html', // 我的奖励
    help: 'https://www.cnblogs.com/zhujiabin/p/4915011.html', // 帮助界面
};

export function toGlobal(x, y, obj) {
    return obj.toGlobal({ x, y }, undefined);
}

export function toLocal(x, y, obj) {
    return obj.toLocal({ x, y }, undefined);
}


export function getStageSizeHeight() {
    return (StageMaxHeight - CurStageHeight) * 0.5;
}

export function setCurStageHeight(value) {
    CurStageHeight = value;
}

export function setDeviceLevel(value) {
    console.warn('设备 DeviceLevel', value);
    DeviceLevel = value;
}

export function setMuHeight(value) {
    StatusBarHeight = value;
}

export function getTopMuHeight(startY, offsetY, halfHeight) {
    // 1624尺寸Y   当前偏移Y  容器区域*0.5
    if (startY + offsetY - getStageSizeHeight() - halfHeight < StatusBarHeight) {
        // 被盖住了
        return getStageSizeHeight() + StatusBarHeight + halfHeight;
    } else {
        return startY + offsetY;
    }
}

export function getTopMuY(startY) {
    // 1624尺寸Y  返回当前y  top位置适配
    return startY + getStageSizeHeight() + StatusBarHeight;
}


export function setAcceptedWLJTask(params) {
    IsAcceptedWLJTask = params;
}

export function setIsCompleteWLJTask(params) {
    IsCompleteWLJTask = params;
}

export function getIsLow() {
    return DeviceLevel === DeviceLevelEnum.LOW_END || DeviceLevel === DeviceLevelEnum.MEDIUM;
}

export function getOldSkiping() {
    return OldSkiping || '';
}

export function setOldSkiping(value) {
    OldSkiping = value;
}

export function setNextType(params) {
    NextType = params;
}

export function setIsAuthCore(params) {
    IsAuthCore = params;
}

export function getIsPhone() {
    const pattern_phone = new RegExp('iphone', 'i');
    const userAgent = navigator.userAgent.toLowerCase();
    return pattern_phone.test(userAgent);
}

export function getInnerHeight() {
    return getIsPhone() ? window.screen.height : window.innerHeight;
}

export function getInnerWidth() {
    return getIsPhone() ? window.screen.width : window.innerWidth;
}

export function setViewInitOver(value) {
    ViewInitOver = value;
}

export function getStageHeight() {
    return (StageWidth * getInnerHeight()) / getInnerWidth();
}

export function getBallTexture(resources, type) {
    if (type === globalItemData.length - 1) {
        return resources.basketBallPng.texture;
    } else {
        const itemData = globalItemData[type];
        return resources.common.textures[`${itemData.name}.png`];
    }
}
