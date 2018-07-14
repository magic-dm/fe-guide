/**
 * 1. 把相应浏览器的driver下到执行目录
 *
 *
 */
const webdriver = require('selenium-webdriver');

class Webdriver {
  constructor(browser) {
    this.browser = browser;
    this.init();
  }

  init() {
    this.createInstance();
  }

  async createInstance() {
    try {
      // 新建一个 firefox 的 driver 实例
      this.driver = await new webdriver.Builder().forBrowser(this.browser).build();
      this.run();
    } catch (err) {
      console.error(err);
    }
    return this;
  }

  async run() {
    // 访问极验demo页
    await this.driver.get('http://www.geetest.com/type/');
    await this.driver.findElement(webdriver.By.css('.products-content li:nth-child(2)')).click();
    setTimeout(async () => {
      const btns = await this.driver.findElements(webdriver.By.css('.geetest_btn'));
      const swiperBtn = btns[btns.length > 1 ? 1 : 0];
      swiperBtn.click();
      setTimeout(async () => {
        // 获取拼图滑块按钮
        const button = await this.driver.findElement(webdriver.By.css('.geetest_slider_button'));
        // 获取按钮位置等信息
        const buttonRect = await button.getRect();
        console.log(buttonRect);
        // // 初始化 action
        // let actions = this.driver.actions({ async: true });
        // // 把鼠标移动到滑块上, 然后点击
        // actions = actions.move({
        //   x: buttonRect.x + 10,
        //   y: buttonRect.y + 10,
        //   duration: 100,
        // }).press();

        // // 花一秒钟把滑块拖动至拼图缺失区, 松开鼠标
        // await actions.move({
        //   x: buttonRect.x + 100,
        //   y: buttonRect.y + 100,
        //   duration: 1000,
        // }).release().perform();
      }, 3000);
    }, 3000);
  }
}

const driver = new Webdriver('firefox');
