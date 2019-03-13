# PermeatorCore

用于封装 API 使得各平台使用方式一致.<br /><br /><br /><br />![image.png](https://cdn.nlark.com/yuque/0/2019/png/116811/1552478965931-0d8c485a-2687-4257-9ed1-0a6e0d51a9e0.png#align=left&display=inline&height=205&name=image.png&originHeight=410&originWidth=628&size=171194&status=done&width=314)<br /><br /><br />[查看快速入门文档](https://www.yuque.com/bolt/permeator-core/start) | [github](https://github.com/BoltDoggy/permeator-core) | [API 参考](https://boltdoggy.github.io/permeator-core/typedoc/)

<a name="e655a410"></a>
## 安装

```basic
npm i permeator-core -S
```

<a name="ecff77a8"></a>
## 使用

```javascript
import PermeatorCore from 'permeator-core'

const p = new PermeatorCore('aName')

p.$use({
  name: 'aPlatform',
  envTest: () => env === 'aPlatform',
  permeator: {
    doSomeThing: () => 'show A'
  }
});

p.$use({
  name: 'bPlatform',
  envTest: () => env === 'bPlatform',
  permeator: {
    doSomeThing: () => 'show B'
  }
});
```

然后你将得到

```javascript
// 如果 env === 'aPlatform'
p.ready(() => {
  p.doSomeThing() // show A
});

// 如果 env === 'bPlatform'
p.ready(() => {
  p.doSomeThing() // show B
});
```

以及下面更实用的方法

```javascript
p.inAPlatform(() => {
  // 如果 env === 'aPlatform' 这里将执行, 而另外一个则不执行
});

p.inBPlatform(() => {
  // 如果 env === 'bPlatform' 这里将执行, 而另外一个则不执行
});
```

[更多 API 参考](https://boltdoggy.github.io/permeator-core/typedoc/)
