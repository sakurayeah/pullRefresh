## code

```css
.pull-refresh-container {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: lightblue;
  z-index: 100;
}
```

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title> </title>
  <meta content="yes" name="apple-mobile-web-app-capable"/>
  <meta content="yes" name="apple-touch-fullscreen"/>
  <meta content="telephone=no,email=no" name="format-detection"/>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover" />
</head>

<body>
  <div class="pull-refresh-container"></div>
</body>

</html>
```

```js
import PullRefresh from 'index';
new PullRefresh({
  container: '.pull-refresh-container',
  initSource: '<p>1111111</p><p>2222222</p><p>333333</p>',
  refreshCb: function(render, setIndicator, hideIndicator){
    setIndicator('加载中...');
    setTimeout(function(){
      setIndicator('加载成功');
      render('<p>55555</p><p>66666</p><p>77777</p>');
      hideIndicator();
    }, 2000)
  }
});

```