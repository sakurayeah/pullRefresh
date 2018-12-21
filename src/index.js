import $ from 'zepto';
import tpl from './index.atpl';

function loop() {};

class PullRefresh {
  constructor(opts = {}) {
    // 容器
    this.container = opts.container ? $(opts.container) : $('body');
    // 刷新的回调
    this.refreshCb = opts.refreshCb || loop;
    // 初始化的数据
    this.initSource = opts.initSource || '';
    // 允许刷新的下拉距离
    this.pullDistance = opts.pullDistance || 40;
    // 下拉参数
    this._pull = {
      startY: 0, // touchstart时的clientY
      isPulling: false, // 是否pulling
      translateY: 0,
      highReach: false // false：没达到下拉刷新高度，收起;true：达到下拉刷新高度，加载数据
    }
    this.init();
  }

  init() {
    this.container.append(tpl());
    this.wrap = this.container.find('.J-pull-refresh-wrap');
    this.inner = this.container.find('.J-pull-refresh-inner');
    this.content = this.container.find('.J-pull-refresh-content');
    this.indicator = this.container.find('.J-pull-refresh-indicator');
    
    this.bindEvent();

    this.render(this.initSource);
  }

  bindEvent() {
    let _pull = this._pull;
    let isMove = false;
    // 拖动开始
    this.wrap.on('touchstart', (e) => {
      this.setIndicator('下拉加载');
      // 更新startY, 如果在pulling, 则则停止pullBar
      _pull.startY = e.touches[0].clientY;
      _pull.highReach = false;
      if (_pull.isPulling) {
        this.stopPull();
      }
    })
    // 拖动
    this.wrap.on('touchmove',(e) => {
      // 当到最顶部的时候,才可以下拉刷新
      isMove = true;
      if (this.wrap.scrollTop() === 0) {
        this.updatePullView(e);
      }
    })
    // 拖动结束
    this.wrap.on("touchcancel touchend", (e) => {
      // 只有发生touchmove的时候，才可以下面的操作
      if (isMove) {
        if (_pull.highReach) {
          this.inner.addClass("pull-refresh-transition").css("-webkit-transform", "translateY(" + this.pullDistance + "px)");
          // 拉动松开后加载
          this.refresh();
        } else {
          // 只有进行下拉刷新才会隐藏,没有达到下拉高度,隐藏Indicator
          if (this.wrap.scrollTop() === 0) {
            this.hideIndicator();
          }
        }
        isMove = false;
      }
    });

    // 下拉结束, 还原数据
    this.inner.on("webkitTransitionEnd", () => {
      if (!_pull.highReach) {
        _pull.isPulling = false;
        _pull.translateY = 0;
      }
      this.inner.removeClass("pull-refresh-transition");
    });
  }

  // 下拉动效
  updatePullView = (e) => {
    let _pull = this._pull,
      moveY = e.changedTouches[0].clientY - _pull.startY,
      // 增加下拉阻力：translate 数值为 touchmove 的一半
      translateY = moveY / 2 + _pull.translateY;
    // 拉动过程中，禁止默认事件
    if (translateY > 0) {
      e.preventDefault();
      _pull.isPulling = true;
      this.inner.css("-webkit-transform", "translate3d(0px," + translateY + "px,0px)");
    } else {
      this.inner.css("-webkit-transform", "translate3d(0px,0px,0px)");
    }

    this.judgeDistance(translateY);
  }

  // 判断拉动距离是否能加载
  judgeDistance = (translateY) => {
    let highReach = false;
    if (translateY > 0 && translateY < this.pullDistance) {
      highReach = false;
    } else if (translateY >= this.pullDistance) {
      highReach = true;
    }

    if (this._pull.highReach != highReach) {
      this._pull.highReach = highReach;
    }
  }

  // 隐藏下拉提示文案
  hideIndicator = () => {
    this.inner.addClass("pull-refresh-transition").css("-webkit-transform", "translateY(0px)");
  }

  // 停止下拉
  stopPull = () => {
    let translateY = (getComputedStyle(this.inner[0])['-webkit-transform']).match(/((\d*\.)?\d*)\)/)[1];
    translateY = Number(translateY);
    this.inner.css("-webkit-transform", "translateY(0px)").removeClass("scroll-transition");
    // 更新 _pull.translateY
    this._pull.translateY = translateY;
  }

  // 刷新
  refresh = () => {
    this.refreshCb(this.render, this.setIndicator, this.hideIndicator)
  }

  // 设置下拉提示文案
  setIndicator = (msg) => {
    this.indicator.text(msg);
  }

  // 渲染
  render = (msg) => {
    msg && this.content.prepend(msg);
  }

}

export default PullRefresh;