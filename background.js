const apiKey = 'AIzaSyBnEK4Eqp2XkWjSzit1J_rlcKPp0xXDM6Y'; // 替换为你的 API 密钥
const apiUrl = 'https://translation.googleapis.com/language/translate/v2';
const googleTrans = (text, targetLang) => {
  return new Promise((resolve, reject) => {
    fetch(`${apiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: text,
        target: targetLang
      })
    })
      .then((response) => response.json())
      .then((data) => {
        // 简单处理一下，同语言之间互译，可能会出现如下错误
        if (
          data.error &&
          data.error.message &&
          data.error.message.indexOf('Bad language pair') > -1
        ) {
          resolve({
            data: text,
            alternatives: []
          });
        } else {
          resolve({
            data: data.data.translations[0].translatedText,
            alternatives: []
          });
        }
      })
      .catch(reject);
  });
};

const deeplxTrans = (text, targetLang) => {
  return new Promise((resolve, reject) => {
    fetch('https://api.deeplx.org/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        source_lang: 'auto',
        target_lang: targetLang
      })
    })
      .then((response) => response.json())
      .then((data) => {
        // 处理翻译结果，可以将结果发送回内容脚本
        resolve(data);
      })
      .catch(reject);
  });
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'translate') {
    // 获取文本框的内容
    const textToTranslate = request.text;
    deeplxTrans(textToTranslate, request.targetLang)
      .then((data) => {
        sendResponse({
          message: 'translate',
          result: data
        });
      })
      .catch(() => {
        googleTrans(textToTranslate, request.targetLang)
          .then((data) => {
            sendResponse({
              message: 'translate',
              result: data
            });
          })
          .catch((error) => {
            sendResponse({
              message: 'translate',
              error: error
            });
          });
      });
    return true;
  }
});
// Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist
// Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist.
