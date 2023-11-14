const btn = document.getElementById('btn');
const langChange = document.getElementById('language');
const textEle = document.getElementById('text');
const loadingEle = document.getElementById('translating');
const resultEle = document.getElementById('result');
const alternativesEle = document.getElementById('alternatives');
let lang = 'ZH';
const summitHandle = () => {
  const text = textEle.value;
  // RU 俄罗斯
  // zh 中国
  // FR 法语
  // EN 英语
  // DE 德语
  // JA 日语
  if (!text) return;
  loadingEle.className = "translating";
  chrome.runtime.sendMessage({ message: "translate", text: text, targetLang: lang }, function (response) {
    // 处理翻译结果或错误
    if (response && response.result) {
      resultEle.innerText = response.result.data;
      if (response.result.alternatives && response.result.alternatives.length > 0) {
        alternativesEle.style.display = 'flex';
        alternativesEle.innerHTML = `<div class="alternativeTitle">其他方案：</div>` + response.result.alternatives.map(item => `<div class="alternativeItem">${item}</div>`).join('');
      } else {
        alternativesEle.style.display = 'none';
      }
    } else if (response && response.error) {
      console.error('Error:', response.error);
    }
    loadingEle.className = 'translating hide'
  });
}

btn.addEventListener('click', () => {
  summitHandle()
});
langChange.addEventListener('change', (e) => {
  lang = e.target.value;
  summitHandle();
});

// 监听 textEle 的cmd + 回车事件
textEle.addEventListener('keydown', (e) => {
  const isCmdOrCtrl = (event.metaKey || event.ctrlKey);

  // 检查是否按下了 Enter 键
  const isEnterKey = (event.key === 'Enter');

  // 检查是否同时按下了 Command (或 Ctrl) 和 Enter 键
  if (isCmdOrCtrl && isEnterKey) {
    // 在这里执行你的逻辑
    summitHandle()
  }
});
