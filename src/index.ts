import { dynamicLoadJs, firstUpperCase, log } from './util';
import { Platform } from '../types/index.d';

class PermeatorCore {
    _interfaceList = [];
    _platformsAllSupport = [];
    _platformsLoaded = null;
    _platformInNow = null;

    _name = 'unnamed PermeatorCore';
    _config: any = {};

    _rollBack: Function;
    rollBack: Function;

    constructor(name:string, config?:any) {
        this._name = name || 'unnamed PermeatorCore';
        this._config = config || {};
        this._config.logger = this._config.logger || log;
    }

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
    $use(platform:Platform) {
        platform._Name = firstUpperCase(platform.name);
        this._platformsAllSupport.push(platform);

        this[`is${platform._Name}`] = () => false;
        this[`in${platform._Name}`] = () => { };
        return this;
    }

    /**
     * 声明通用方法
     *
     * interface 接口, 传入字符串数组, 字符串为方法名, 表示 sm 将继承各平台的该方法
     *
     *  - 在 $use 各平台 extends / permeator 中声明的方法, 在其他平台中使用可能会因没有此方法导致报错
     *  - 在 $interface 中声明后, 如果该平台没有实现该方法, 仅在控制台中显示警告
     * @param {Array<string>} arr 显示声明的方法列表
     */
    $interface(arr:Array<string>) {
        this._interfaceList = this._interfaceList.concat(arr);
        return this;
    }

    /**
     * 设置回滚平台
     * @param {*} platform PermeatorCore 插件
     */
    $setRollBack(platform:Platform) {
        /**
         * 修复在 this.ready 前执行 this.rollBack 可能会直接触发回调
         * 识别为某平台时, this._rollBack 会被重置为空方法, 可以防止回调执行
         */
        this._rollBack = (callback:Function) => {
            callback();
        };
        this.rollBack = (callback:Function) => {
            this.ready(() => {
                this._rollBack(callback);
            });
        };

        const Extends = (key:string) => {
            if (!this[key]) {
                this[key] = (...args:Array<any>) => {
                    console.warn(`${this._name}: 未知类型平台, 执行 RollBack, ${key} 方法`);
                    if (platform.permeator[key]) {
                        return platform.permeator[key](...args);
                    } else {
                        console.warn(`${this._name}: RollBack 暂不支持 ${key} 方法`);
                    }
                }
            }
        };

        // 显式声明的方法
        this._interfaceList.forEach(Extends);
        // 连通器更新定义的方法
        Object.keys(platform.permeator).forEach(Extends);
        return this;
    }

    /**
     * 环境初始完成方法
     * @param {callback} callback
     * @callback callback
     */
    async ready(callback:Function) {
        // 首次执行请求依赖
        // 再次执行不会多次发送请求
        if (!this._platformsLoaded) {
            // 筛选出需要加载依赖的平台
            this._platformsLoaded = this._platformsAllSupport.filter((platform) => !platform.loadCondition || platform.loadCondition());

            this._platformsLoaded.forEach((platform:Platform) => {
                platform.globalVar = platform.globalVar || `$_${new Date().getTime()}`;

                // 请求当前平台依赖
                platform._loading = dynamicLoadJs(platform.jsPath).then(() => {
                    // 请求完成后获取当前全局变量
                    this[platform.globalVar] = window[platform.globalVar] || {};

                    // 异步判断是否属于当前平台
                    return platform.envTest(window[platform.globalVar]);
                }).catch((err) => {
                    this._config.logger(err);
                    return false;
                }).then((res) => {
                    if (res) {
                        // 当前平台情况下, 注册 PermeatorCore 方法
                        if (this._platformInNow) {
                            this._config.logger(`${this._name}: 所在平台值 ${this._platformInNow} 被重置为 ${platform.name}`);
                        } else {
                            this._config.logger(`${this._name}: 检测到所在平台值为 ${platform.name}`);
                        }
                        this._platformInNow = platform.name;

                        this[`is${platform._Name}`] = () => true;

                        const Extends = key => {
                            this[key] = (...args) => {
                                if (platform.permeator[key]) {
                                    return platform.permeator[key](...args);
                                } else if (this[platform.globalVar][key]) {
                                    return this[platform.globalVar][key](...args);
                                } else {
                                    console.warn(`${this._name}: ${platform.name} 暂不支持 ${key} 方法`);
                                }
                            }
                        };

                        // 显式声明的方法
                        this._interfaceList.forEach(Extends);
                        // 当前平台继承的方法
                        platform.extends && platform.extends.forEach(Extends);
                        // 连通器更新定义的方法
                        Object.keys(platform.permeator).forEach(Extends);

                        // 识别为某平台时, this._rollBack 会被重置为空方法, 可以防止 rollBack 回调执行
                        this._rollBack = () => { };
                        this.rollBack = () => { };
                    }
                });

                // 设置当前平台回调
                this[`in${platform._Name}`] = (_callback:Function) => {
                    return platform._loading.then(() => {
                        return _callback(this[platform.globalVar]);
                    })
                };
            });
        }

        // ready 完成后回调
        const loadings = this._platformsLoaded.map((platform:Platform) => platform._loading);
        await Promise.all(loadings);

        if (this._config.beforeReady) {
            this._config.beforeReady();
            this._config.beforeReady = null;
        }

        return callback();
    }

    // 注册 getEnv 方法
    getEnv(_callback: Function) {
        return this.ready(() => {
            return _callback({
                platform: this._platformInNow,
            });
        });
    }
};

export default PermeatorCore;
