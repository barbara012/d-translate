const SelectMenuClassName = 'hwh_hlw_select_menu';
const ResultPanelClassName = 'hwh_hlw_result_panel';
const TranslateBtnClassName = 'hwh_hlw_translate_btn';
const SelectLangClassName = 'hwh_hlw_select_lang';
const EventBlockClassName = 'e_block_' + Date.now();

const TranslateToolStyle = `
.hwh_hlw_select_menu * {
  box-sizing: border-box;
}
.hwh_hlw_select_menu {
  background-color: #fff;
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 4px;
  overflow: hidden;
  z-index: 9998;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px;
}
.hwh_hlw_select_menu button {
  position: relative;
  padding: 0 8px;
  white-space: nowrap;
  height: 24px;
  outline: none;
  font-size: 12px;
  border: none;
  cursor: pointer;
  background-color: #fff;
}
.hwh_hlw_select_menu button::before {
  content: "";
  position: absolute;
  top: 8px;
  height: 8px;
  width: 1px;
  background-color: #cdcdcd;
}
.hwh_hlw_select_menu .hwh_hlw_translate_btn::before {
  right: 0;
}
.hwh_hlw_select_menu .hwh_hlw_speak_btn::before {
  left: 0;
}
.hwh_hlw_select_menu select {
  border: none;
  outline: none;
  white-space: nowrap;
  height: 24px;
  font-size: 12px;
  cursor: pointer;
  padding: 0;
}
.hwh_hlw_select_menu button:hover {
  background-color: #cdcdcd;
}
.hwh_hlw_select_menu span {
  margin-right: 4px;
  pointer-events: none;
}
.hwh_hlw_speak_btn  {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.hwh_hlw_speak_btn img {
  width: 16px;
}
@media (prefers-color-scheme: dark) {
  .hwh_hlw_select_menu {
    background-color: #343434;
  }
  .hwh_hlw_select_menu select,
  .hwh_hlw_select_menu button {
    color: #fff;
    background-color: #343434;
  }
  .hwh_hlw_select_menu button:hover {
    background-color: #555;
  }
}
`;
const ResultPanelStyle = `
.hwh_hlw_result_panel * {
  box-sizing: border-box;
}
.hwh_hlw_result_panel {
  font-size: 12px;
  padding: 12px;
  background-color: #fff;
  border-radius: 4px;
  min-width: 90px;
  max-width: 400px;
  max-height: 70vh;
  overflow: auto;
  z-index: 9999;
  line-height: 1.5;
  font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px;
}
.hwh_hlw_result_panel_title {
  pointer-events: none;
  font-weight: bold;
  margin-bottom: 4px;
}
.hwh_hlw_original_text {
  font-size: 14px;
  line-height: 1;
  margin-bottom: 8px;
  font-weight: bold;
}
.hwh_hlw_phonetic {
  min-width: 40px;
  height: 20px;
  font-size: 12px;
  background-color: #f4f4f4;
  margin-top: 4px;
  padding: 2px 6px;
  border-radius: 12px;
  font-weight: normal;
  display: inline-flex;
  align-items: center;
  justify-conten
}
.hwh_hlw_phonetic {
  t: center;
  gap: 4px;
}
.hwh_hlw_result_panel_content {
  color: #444;
  pointer-events: none;
}
.hwh_hlw_loading {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 10px;
}
.typing_loader {
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  -webkit-animation: typing 1s linear infinite alternate;
  animation: typing 1s linear infinite alternate;
  margin: auto;
  position: relative;
  left: -12px;
}
.hwh_hlw_speak_btn {
  height: 16px;
  display: inline-block;
  cursor: pointer;
}
.result_speak_btn {
  margin-top: 4px;
}
.hwh_hlw_speak_btn img {
  height: 100%;
}

@keyframes typing {
  0% {
    background-color: #465264;
    box-shadow: 12px 0px 0px 0px #999,
      24px 0px 0px 0px #fafafa;
  }

  25% {
    background-color: #fafafa;
    box-shadow: 12px 0px 0px 0px #465264,
      24px 0px 0px 0px #999;
  }

  75% {
    background-color: #999;
    box-shadow: 12px 0px 0px 0px #fafafa,
      24px 0px 0px 0px #465264;
  }
}
@media (prefers-color-scheme: dark) {
  .hwh_hlw_result_panel {
    background-color: #343434;
  }
  .hwh_hlw_result_panel_title {
    color: #fff;
  }
  .hwh_hlw_result_panel_content {
    color: #fff;
  }
}
`;

const BaiDuAppId = '20231122001888376';
// 密钥
const BaiDuKey = 'oikztxg1Afbn8vlgyT6B';

const BaiDuSalt = 'hwh_hlw';

const LangMap = {
  EN: 'en-US',
  ZH: 'zh-CN',
  FR: 'fr-FR',
  DE: 'de-DE',
  RU: 'ru-RU',
  JA: 'ja-JP'
};

let translateToolEle = null;
let resultPanelEle = null;
let phoneticEle = null;
let hwh_currentMenuPosX = 0;
let hwh_currentMenuPosY = 0;

let hwh_currentSelectText = '';
let targetLang = 'ZH';
let port = null;

// 获取翻译结果
const buttonClickHandle = () => {
  if (hwh_currentSelectText && port) {
    generateResultPanel();
    port.postMessage({
      message: 'translate',
      text: hwh_currentSelectText,
      targetLang
    });
  }
};

// 语言切换
const langChange = (e) => {
  targetLang = e.target.value;
  buttonClickHandle();
};

// 获取拼读语音
const speak = (text, lang, tts) => {
  if (port) {
    port.postMessage({
      message: 'speak',
      text: text,
      targetLang: lang
    });
  }
};

// 判断一个是不是单词 用空格分割或者_。如果是中文就不用判断了
const isWord = (text) => {
  if (text.match(/[\u4e00-\u9fa5]/)) {
    return false;
  }
  return text.split(/[\s_]/).length === 1;
};

const generateSelectMenus = () => {
  if (translateToolEle) return translateToolEle;
  const wrapper = document.createElement('div');
  const shadow = wrapper.attachShadow({ mode: 'open' });
  const toolStyle = document.createElement('style');
  toolStyle.textContent = TranslateToolStyle;
  const selectMenus = document.createElement('div');
  const btn = document.createElement('button');
  const speakBtn = document.createElement('button');
  const select = document.createElement('select');
  select.innerHTML = `<option value="ZH">🇨🇳中文</option>
  <option value="EN">🇬🇧英语</option>
  <option value="RU">🇷🇺俄语</option>
  <option value="DE">🇩🇪德语</option>
  <option value="FR">🇫🇷法语</option>
  <option value="JA">🇯🇵日语</option>`;
  wrapper.classList.add(EventBlockClassName);
  selectMenus.classList.add(SelectMenuClassName);
  btn.classList.add(TranslateBtnClassName);
  btn.classList.add(EventBlockClassName);
  select.classList.add(SelectLangClassName);
  select.classList.add(EventBlockClassName);
  btn.innerHTML = '<span>🐶</span>翻译';
  speakBtn.innerHTML = `<img src="${chrome.runtime.getURL('read.svg')}"/>`;
  speakBtn.classList.add('hwh_hlw_speak_btn');

  selectMenus.appendChild(btn);
  selectMenus.appendChild(select);
  selectMenus.appendChild(speakBtn);
  select.addEventListener('change', langChange);
  btn.addEventListener('click', buttonClickHandle);
  speakBtn.addEventListener('click', (e) => {
    speak(hwh_currentSelectText);
  });

  shadow.appendChild(toolStyle);
  shadow.appendChild(selectMenus);
  wrapper.style.zIndex = 9998;
  document.body.appendChild(wrapper);
  translateToolEle = wrapper;
  return wrapper;
};

const generateResultPanel = (result) => {
  let shadow = null;
  let panelEle = null;
  if (!resultPanelEle) {
    resultPanelEle = document.createElement('div');
    resultPanelEle.classList.add(EventBlockClassName);
    shadow = resultPanelEle.attachShadow({ mode: 'open' });
    const resultPanelStyle = document.createElement('style');
    resultPanelStyle.textContent = ResultPanelStyle;
    panelEle = document.createElement('div');
    panelEle.classList.add(ResultPanelClassName);
    shadow.appendChild(resultPanelStyle);
    shadow.appendChild(panelEle);
    resultPanelEle.style.zIndex = 9999;
    document.body.appendChild(resultPanelEle);
  } else {
    shadow = resultPanelEle.shadowRoot;
    panelEle = shadow.querySelector(`.${ResultPanelClassName}`);
  }
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (result) {
    const fragm = document.createDocumentFragment();

    if (isWord(hwh_currentSelectText)) {
      // original text
      const original = document.createElement('div');
      original.classList.add('hwh_hlw_original_text');
      original.innerHTML = `<div>${hwh_currentSelectText}</div>`;

      // 音标
      const phonetic = document.createElement('div');
      phonetic.classList.add('hwh_hlw_phonetic');
      phonetic.innerText = '';
      original.appendChild(phonetic);
      fragm.appendChild(original);
      phoneticEle = phonetic;
    }

    // title
    const title = document.createElement('div');
    title.classList.add('hwh_hlw_result_panel_title');
    title.innerText = '译文：';
    fragm.appendChild(title);

    // content
    const content = document.createElement('div');
    content.classList.add('hwh_hlw_result_panel_content');
    content.innerText = result;
    fragm.appendChild(content);

    // speak btn
    const btn = document.createElement('span');
    btn.classList.add('hwh_hlw_speak_btn');
    btn.classList.add('result_speak_btn');
    btn.innerHTML = `<img src="${chrome.runtime.getURL('read.svg')}"/>`;
    fragm.appendChild(btn);
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      speak(result, LangMap[targetLang]);
    });
    panelEle.innerHTML = '';
    panelEle.appendChild(fragm);

    setTimeout(() => {
      // 获取元素的宽高
      const ow = panelEle.offsetWidth;
      const oh = panelEle.offsetHeight;
      let x = hwh_currentMenuPosX;
      let y = hwh_currentMenuPosY + 30;
      // 如果元素定位超过视口则要校正一下
      if (y + oh > h) {
        y = h - oh - (h - hwh_currentMenuPosY + 10);
      }
      if (x + ow > w) {
        x = w - ow;
      }

      resultPanelEle.style.top = y + 'px';
      resultPanelEle.style.left = x + 'px';
    }, 10);
  } else {
    panelEle.innerHTML = `<div class="hwh_hlw_loading"><span class="typing_loader"></span></div>`;
    resultPanelEle.style.display = 'block';
    resultPanelEle.style.position = 'fixed';
    let x = hwh_currentMenuPosX;
    let y = hwh_currentMenuPosY + 30;

    if (h - hwh_currentMenuPosY < 62) {
      y = hwh_currentMenuPosY - 10 - 34;
    }
    resultPanelEle.style.top = y + 'px';
    resultPanelEle.style.left = x + 'px';
  }
};

const hide = () => {
  if (translateToolEle) {
    translateToolEle.style.display = 'none';
  }
  if (resultPanelEle) {
    resultPanelEle.style.display = 'none';
  }
};
document.addEventListener('mouseup', function (event) {
  const target = event.target;
  const classList = target.classList;
  if (classList.contains(EventBlockClassName)) {
    return;
  }

  const selectedText = window.getSelection().toString().trim();

  if (selectedText !== '') {
    // 创建隔离的 DOM 元素
    const menus = generateSelectMenus();
    hwh_currentMenuPosY = event.clientY + 5;
    hwh_currentMenuPosX = event.clientX + 10;
    // 设置位置为鼠标选中的位置
    menus.style.position = 'fixed';
    menus.style.display = 'block';
    const w = window.innerWidth;
    if (w - hwh_currentMenuPosX < 120) {
      hwh_currentMenuPosX = w - 130;
    }
    menus.style.top = hwh_currentMenuPosY + 'px';
    menus.style.left = hwh_currentMenuPosX + 'px';
    // 将元素添加到页面
    hwh_currentSelectText = selectedText;
  } else {
    hide();
  }
});

function connectToBackground() {
  port = chrome.runtime.connect({ name: 'hwh_hlw_content_script' });

  port.onDisconnect.addListener(function () {
    console.log('Connection to background invalidated. Reconnecting...');
    connectToBackground();
  });

  port.onMessage.addListener(function (data) {
    if (data && data.message === 'translate_result') {
      if (data.result) {
        generateResultPanel(data.result.data);
      }
    } else if (data.message === 'phonetic') {
      if (phoneticEle) {
        const dictStr = data.result.dict;
        if (dictStr) {
          const dict = JSON.parse(dictStr);
          const phonetic = dict.word_result.simple_means.symbols[0].ph_am;
          phoneticEle.innerHTML = `<span>/${phonetic}/</span>`;
          const speakBtn = document.createElement('span');
          speakBtn.innerHTML = `<img src="${chrome.runtime.getURL('read.svg')}"/>`;
          speakBtn.classList.add('hwh_hlw_speak_btn');
          speakBtn.addEventListener('click', (e) => {
            speak(hwh_currentSelectText);
          });
          phoneticEle.appendChild(speakBtn);
        } else {
          phoneticEle.style.display = 'none';
        }
      }
    } else if (response && response.error) {
      console.error('Error:', response.error);
    }
  });
}

connectToBackground();
