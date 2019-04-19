# vue

## 参考
- [一份超级详细的Vue-cli3.0使用教程](http://obkoro1.com/web_accumulate/accumulate/tool/%E4%B8%80%E4%BB%BD%E8%B6%85%E7%BA%A7%E8%AF%A6%E7%BB%86%E7%9A%84Vue-cli3.0%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B.html#node%E7%89%88%E6%9C%AC%E8%A6%81%E6%B1%82%EF%BC%9A)

## 极简安装&启动

### 安装vue-cli
```js
npm install -g @vue/cli // 安装cli3.x
vue --version // 查询版本是否为3.x
```

### 新建
```js
vue create hello-cli3 
```

### 零配置启动/打包
```js
npm install -g @vue/cli-service-global

vue serve App.vue // 启动服务

vue build App.vue // 打包出生产环境的包并用来部署
```

### 启动图形化界面
```js
vue ui 
```

