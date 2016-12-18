# 工時透明化運動 
這裡是工時透明化運動網站的前端程式碼，我們歡迎各路好手一起參與我們的專案。

## 關於我們

我們是一群社會新鮮人，在過去求職的經驗中，發現台灣的求職資訊相當不透明。薪資、工時的資訊經常不得而知，而實際工作內容與當初求職網站也有所出入。因此，我們希望採取行動，以解決求職市場資訊不透明的問題，讓我們在找工作時，能夠做出更好的選擇。

## 解決方案

我們希望建立一個工作資訊交流的平台，向有工作經驗的人蒐集資訊，再將這些資訊呈現給求職者，讓求職者在求職時能夠做出更好的選擇。此外，台灣高工時的工作環境，早已是你我口耳相傳的議題。然而，至今尚未有平台專注於揭露工時資訊。因此，我們決定第一步將從工時資訊的透明化開始，推行「工時透明化運動」。

## Develope

### install package
```
npm install
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
