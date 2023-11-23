const btn = document.getElementById('btn');
const langChange = document.getElementById('language');
const textEle = document.getElementById('text');
const loadingEle = document.getElementById('translating');
const resultEle = document.getElementById('result');
const alternativesEle = document.getElementById('alternatives');
const speakBtn = document.getElementById('speak');

const BaiDuAppId = '20231122001888376';
// 密钥
const BaiDuKey = 'oikztxg1Afbn8vlgyT6B';

const BaiDuSalt = 'hwh_hlw';

let lang = 'ZH';
let port = null;
const summitHandle = () => {
  const text = textEle.value;
  if (!text || !port) return;
  loadingEle.className = 'translating';
  port.postMessage({message: 'translate', text: text, targetLang: lang});
};

btn.addEventListener('click', () => {
  summitHandle();
});
langChange.addEventListener('change', (e) => {
  lang = e.target.value;
  summitHandle();
});

// 监听 textEle 的cmd + 回车事件
textEle.addEventListener('keydown', (e) => {
  const isCmdOrCtrl = event.metaKey || event.ctrlKey;

  // 检查是否按下了 Enter 键
  const isEnterKey = event.key === 'Enter';

  // 检查是否同时按下了 Command (或 Ctrl) 和 Enter 键
  if (isCmdOrCtrl && isEnterKey) {
    // 在这里执行你的逻辑
    summitHandle();
  }
});

speakBtn.addEventListener('click', (e) => {
  var text = resultEle.innerText;

  // 创建 SpeechSynthesisUtterance 对象
  var utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US'; // 设置语言为英语（美国）

  // 获取发音音标
  utterance.addEventListener('boundary', function (event) {
    console.log('Phoneme boundary:', event, event.charIndex, event.elapsedTime);
  });

  // 朗读文本
  window.speechSynthesis.speak(utterance);
});

function connectToBackground() {
  port = chrome.runtime.connect({name: 'hwh_hlw_content_script'});

  port.onDisconnect.addListener(function () {
    console.log('Connection to background invalidated. Reconnecting...');
    connectToBackground();
  });

  port.onMessage.addListener(function (response) {
    if (response && response.result) {
      resultEle.innerText = response.result.data;
      if (response.result.alternatives && response.result.alternatives.length > 0) {
        alternativesEle.style.display = 'flex';
        alternativesEle.innerHTML =
          `<div class="alternativeTitle">其他方案：</div>` +
          response.result.alternatives
            .map((item) => `<div class="alternativeItem">${item}</div>`)
            .join('');
      } else {
        alternativesEle.style.display = 'none';
      }
    } else if (response && response.error) {
      console.error('Error:', response.error);
    }
    loadingEle.className = 'translating hide';
  });
}

connectToBackground();
