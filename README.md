GoodJob Website
======================

分享你的工時薪資，面試與工作經驗，讓我們一起改善工作資訊不透明的現況

立刻前往 --> https://www.goodjob.life

關於我們 --> https://www.goodjob.life/about

這個 REPO 是舊站，新站：https://github.com/goodjoblife/GoodJobShare

### install package
```
yarn install
npm run build
```

### watch files
```
npm run start
```
then see your static site on `localhost:3010`

*if you haven't use gulp before, install it globally: `npm install --global gulp-cli`

### JS folder

`global`: 網頁共用的 js，最後會被 concat 成一支 global.js

`main`: 會被 build 成單隻的 js，在個別頁面載入 (`block scripts` at the bottom of pug file)

`libs`: 共用的 dependencies，最後會被 concat 成一支 dependencies
