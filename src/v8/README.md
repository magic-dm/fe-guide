# v8

## 参考
  - https://mp.weixin.qq.com/s/pv_4YRo6KjLiVxLViZTr2Q

## 并发标记
  - 三色标记
    - 白色：收集器还未发现该对象
    - 灰色：收集器发现，并已推到标记工作表
    - 黑色：对象从标记工作表弹出，并已访问其全部字段
    - 当没有灰色对象时，标记结束。所有剩余的白色对象都可以安全地被回收。