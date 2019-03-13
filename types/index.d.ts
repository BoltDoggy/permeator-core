import Platform from './Platform';
declare class PermeatorCore {
    _interfaceList: any[];
    _platformsAllSupport: any[];
    _platformsLoaded: any;
    _platformInNow: any;
    _name: string;
    _config: any;
    _globalData: any;
    _rollBack: Function;
    rollBack: Function;
    constructor(name: string, config?: any);
    /**
     * 加载平台插件
     *
     * use 使用, 传入对象, 用于方便扩展平台
     * @param {Object} platform PermeatorCore 插件
     * @param {string} platform.name 名称, 字符串, 用于 isXx()/inXx() 等方法名
     * @param {string} platform.globalVar 全局变量, 字符串, window.xx 全局变量名
     * @param {string} platform.jsPath js 路径, 字符串, 用于加载远程依赖
     * @param {Function} platform.loadCondition 加载条件, 函数, 用于判断是否加载远程依赖
     * @param {Function} platform.envTest 环境判断, 函数, 回调环境判断结果
     * @param {string[]} platform.extends 扩展, 字符串数组, 字符串为方法名, 扩展该平台的该方法到 PermeatorCore
     * @param {Object} platform.permeator 连通器, https://baike.baidu.com/item/连通器/1534580
     *      通过连通器, 使得各平台小程序 api 表现效果一致
     */
    $use(platform: Platform): this;
    /**
     * 声明通用方法
     *
     * interface 接口, 传入字符串数组, 字符串为方法名, 表示 sm 将继承各平台的该方法
     *
     *  - 在 $use 各平台 extends / permeator 中声明的方法, 在其他平台中使用可能会因没有此方法导致报错
     *  - 在 $interface 中声明后, 如果该平台没有实现该方法, 仅在控制台中显示警告
     * @param {Array<string>} arr 显示声明的方法列表
     */
    $interface(arr: Array<string>): this;
    /**
     * 设置回滚平台
     * @param {*} platform PermeatorCore 插件
     */
    $setRollBack(platform: Platform): this;
    /**
     * 环境初始完成方法
     * @param {callback} callback
     * @callback callback
     */
    ready(callback: Function): Promise<any>;
    getEnv(_callback: Function): Promise<any>;
}
export default PermeatorCore;
