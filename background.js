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

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name !== 'hwh_hlw_content_script-script')
    // 接收来自 content script 的消息
    port.onMessage.addListener(function (data) {
      console.log('Received message from content script:', data.message);
      deeplxTrans(data.text, data.targetLang)
        .then((data) => {
          port.postMessage({
            message: 'translate',
            result: data
          });
        })
        .catch(() => {
          googleTrans(textToTranslate, request.targetLang)
            .then((data) => {
              port.postMessage({
                message: 'translate',
                result: data
              });
            })
            .catch((error) => {
              port.postMessage({
                message: 'translate',
                error: error
              });
            });
        });
      // 在这里处理消息，可以进行一些逻辑操作

      // 回复消息
      // port.postMessage({response: 'Hello from background!'});
    });

  // 当连接断开时
  port.onDisconnect.addListener(function () {
    console.log('Connection to content script disconnected.');
  });
});

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.message === 'translate') {
//     // 获取文本框的内容
//     const textToTranslate = request.text;

//     return true;
//   }
// });
// Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist
// Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist.
