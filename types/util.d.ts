/// <reference types="debug" />
/**
 * 异步加载 js
 *
 * @param {*} url
 */
export declare const dynamicLoadJs: (url?: string) => Promise<any>;
/**
 * 首字母大写
 * @param {*} str
 */
export declare const firstUpperCase: (str: string) => string;
export declare const log: import("debug").Debugger;
