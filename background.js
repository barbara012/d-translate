// 监听
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "translate") {
      // 获取文本框的内容
      const textToTranslate = request.text;

      // 发送POST请求到翻译接口
      fetch('https://api.deeplx.org/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textToTranslate, source_lang: 'auto', target_lang: request.targetLang }),
      })
        .then(response => response.json())
        .then(data => {
          // 处理翻译结果，可以将结果发送回内容脚本
          console.log('result', data);
          // chrome.runtime.sendMessage({message: "translate", result: data })
          sendResponse({message: "translate", result: data })
        })
        .catch(error => {
          console.error('Error:', error);
          // 处理错误，可以将错误发送回内容脚本
          sendResponse(error)
        });

      // 返回 true，以保持 sendResponse 的有效性
      return true;
    }
  }
);
