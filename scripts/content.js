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
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px;
}
.hwh_hlw_select_menu button {
  padding: 0 4px;
  white-space: nowrap;
  height: 24px;
  outline: none;
  font-size: 12px;
  border: none;
  cursor: pointer;
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
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px;
}
.hwh_hlw_result_panel_title {
  pointer-events: none;
  font-weight: bold;
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

let translateToolEle = null;
let resultPanelEle = null;
let hwh_currentMenuPosX = 0;
let hwh_currentMenuPosY = 0;

let hwh_currentSelectText = '';
let targetLang = 'ZH';

const buttonClickHandle = () => {
  if (hwh_currentSelectText) {
    generateResultPanel();
    chrome.runtime.sendMessage(
      { message: 'translate', text: hwh_currentSelectText, targetLang },
      (response) => {
        // 处理翻译结果或错误
        if (response && response.result) {
          generateResultPanel(response.result.data);
        } else if (response && response.error) {
          console.error('Error:', response.error);
        }
      }
    );
  }
};

const langChange = (e) => {
  targetLang = e.target.value;
  buttonClickHandle();
};

const generateSelectMenus = () => {
  if (translateToolEle) return translateToolEle;
  const wrapper = document.createElement('div');
  const shadow = wrapper.attachShadow({ mode: 'open' });
  const toolStyle = document.createElement('style');
  toolStyle.textContent = TranslateToolStyle;
  const selectMenus = document.createElement('div');
  const btn = document.createElement('button');
  const select = document.createElement('select');
  select.innerHTML = `<option value="ZH">🇨🇳中文</option>
  <option value="EN">🇬🇧英语</option>
  <option value="RU">🇷🇺俄语</option>
  <option value="DE">🇩🇪德语</option>
  <option value="FR">🇫🇷法语</option>
  <option value="JA">🇯🇵日语</option>`;
  wrapper.classList.add(EventBlockClassName);
  selectMenus.classList.add(SelectMenuClassName);
  btn.classList.add([TranslateBtnClassName, EventBlockClassName]);
  select.classList.add([SelectLangClassName, EventBlockClassName]);
  btn.innerHTML = '<span>🐶</span>翻译';
  selectMenus.appendChild(btn);
  selectMenus.appendChild(select);
  select.addEventListener('change', langChange);
  btn.addEventListener('click', buttonClickHandle);
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
    panelEle.innerHTML = `<div class="hwh_hlw_result_panel_title">翻译结果</div><div class="hwh_hlw_result_panel_content">${result}</div>`;
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
    if (w - hwh_currentMenuPosX < 100) {
      hwh_currentMenuPosX = w - 110;
    }
    menus.style.top = hwh_currentMenuPosY + 'px';
    menus.style.left = hwh_currentMenuPosX + 'px';
    // 将元素添加到页面
    hwh_currentSelectText = selectedText;
  } else {
    hide();
  }
});
