import debug from 'debug';

/**
 * 异步加载 js
 *
 * @param {*} url
 */
export const dynamicLoadJs = (url?:string): Promise<any> => {
    if (url) {
        return new Promise((resolve) => {
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            script.onload = script['onreadystatechange'] = function () {
                if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                    resolve();
                    script.onload = script['onreadystatechange'] = null;
                }
            };
            head.appendChild(script);
        })
    } else {
        return Promise.resolve();
    }
}

/**
 * 首字母大写
 * @param {*} str
 */
export const firstUpperCase = (str:string) =>
    str.replace(/\b(\w)(\w*)/g, function ($0, $1, $2) {
        return $1.toUpperCase() + $2;
    });

export const log = debug('PermeatorCore');