const SelectMenuClassName = 'hwh_hlw_select_menu';
const ResultPanelClassName = 'hwh_hlw_result_panel';
const TranslateBtnClassName = 'hwh_hlw_translate_btn';
const SelectLangClassName = 'hwh_hlw_select_lang';

let translateToolEle = null;
let hwh_currentMenuPosX = 0;
let hwh_currentMenuPosY = 0;

let hwh_currentSelectText = '';
let targetLang = 'ZH';


const buttonClickHandle = () => {
  if (hwh_currentSelectText) {
    generateResultPanel();
    chrome.runtime.sendMessage({ message: "translate", text: hwh_currentSelectText, targetLang }, (response) => {
      // 处理翻译结果或错误
      if (response && response.result) {
        generateResultPanel(response.result.data);
      } else if (response && response.error) {
        console.error('Error:', response.error);
      }
    });
  }
}

const langChange = (e) => {
  targetLang = e.target.value;
  buttonClickHandle();
}

const generateSelectMenus = () => {

  if (translateToolEle) return translateToolEle;

  const selectMenus = document.createElement('div');
  const btn = document.createElement('button');
  const select = document.createElement('select');
  select.innerHTML = `<option value="ZH">🇨🇳中文</option>
  <option value="EN">🇬🇧英语</option>
  <option value="RU">🇷🇺俄语</option>
  <option value="DE">🇩🇪德语</option>
  <option value="FR">🇫🇷法语</option>
  <option value="JA">🇯🇵日语</option>`
  selectMenus.classList.add(SelectMenuClassName);
  btn.classList.add(TranslateBtnClassName);
  select.classList.add(SelectLangClassName);
  btn.innerHTML = '<span>🐶</span>翻译';
  selectMenus.appendChild(btn);
  selectMenus.appendChild(select);
  select.addEventListener('change', langChange);
  document.body.appendChild(selectMenus);
  translateToolEle = selectMenus;
  return selectMenus
}

const generateResultPanel = (result) => {
  let resultPanel = document.querySelector(`.${ResultPanelClassName}`);
  if (!resultPanel) {
    resultPanel = document.createElement('div');
    resultPanel.classList.add(ResultPanelClassName);
  }
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (result) {
    resultPanel.innerHTML = `<div class="hwh_hlw_result_panel_title">翻译结果</div><div class="hwh_hlw_result_panel_content">${result}</div>`;
  } else {
    resultPanel.innerHTML = `<div class="hwh_hlw_loading"><span class="typing_loader"></span></div>`;
    resultPanel.style.display = 'block';
    let x = hwh_currentMenuPosX;
    let y = hwh_currentMenuPosY + 30;

    if (h - hwh_currentMenuPosY < 62) {
      y = hwh_currentMenuPosY - 10 - 34;
    }
    resultPanel.style.top = y + 'px';
    resultPanel.style.left = x + 'px';
  }
  document.body.appendChild(resultPanel);

  if (result) {
    setTimeout(() => {
      // 获取元素的宽高
      const ow = resultPanel.offsetWidth;
      const oh = resultPanel.offsetHeight;
      let x = hwh_currentMenuPosX;
      let y = hwh_currentMenuPosY + 30;
      // 如果元素定位超过视口则要校正一下
      if (y + oh > h) {
        y = h - oh - (h - hwh_currentMenuPosY + 10);
      }
      if (x + ow > w) {
        x = w - ow;
      }

      resultPanel.style.top = y + 'px';
      resultPanel.style.left = x + 'px';
    }, 10)
  }
  return resultPanel;
}


const hide = () => {
  if (document.querySelector(`.${SelectMenuClassName}`)) {
    document.querySelector(`.${SelectMenuClassName}`).style.display = 'none';
  }
  if (document.querySelector(`.${ResultPanelClassName}`)) {
    document.querySelector(`.${ResultPanelClassName}`).style.display = 'none';
  }
}

document.addEventListener('mouseup', function (event) {
  const target = event.target;
  const classList = target.classList;
  if (classList.contains(ResultPanelClassName) || classList.contains(SelectLangClassName)) {
    return;
  }

  if (classList.contains(TranslateBtnClassName)) {
    buttonClickHandle();
    return;
  }

  const selectedText = window.getSelection().toString().trim();

  if (selectedText !== '') {
    // 创建隔离的 DOM 元素
    const menus = generateSelectMenus();
    hwh_currentMenuPosY = event.clientY + 5;
    hwh_currentMenuPosX = event.clientX + 10;
    // 设置位置为鼠标选中的位置
    menus.style.display = 'flex';
    const w = window.innerWidth;
    if (w - hwh_currentMenuPosX < 100) {
      hwh_currentMenuPosX = w - 110
    }
    menus.style.top = hwh_currentMenuPosY + 'px';
    menus.style.left = hwh_currentMenuPosX + 'px';
    // 将元素添加到页面
    hwh_currentSelectText = selectedText;
  } else {
    hide()
  }
});