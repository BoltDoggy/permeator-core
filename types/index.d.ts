export declare interface Platform {
    _loading?:Promise<any>
    _Name?:string
    name:string
    globalVar?:string
    jsPath?:string
    loadCondition?:Function
    envTest?:Function
    extends?:Array<string>
    permeator?:any
}
