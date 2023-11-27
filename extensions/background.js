const googleApiKey = 'AIzaSyBnEK4Eqp2XkWjSzit1J_rlcKPp0xXDM6Y'; // 替换为你的 API 密钥
const googleTransApiUrl = 'https://translation.googleapis.com/language/translate/v2';
const googleDetectApiUrl = 'https://translation.googleapis.com/language/translate/v2/detect';

const BaiDuAppId = '43655438';

const BaiDuApiKey = 'YaPUGk79Q0HBfb5LQLK8qTYy';
// 密钥
const BaiDuKey = 'Gb1lQED1VR8WFsybduGXpd1XHaamIXcs';

const BaiduLangMap = {
  EN: 'en',
  ZH: 'zh',
  FR: 'fra',
  DE: 'de',
  RU: 'ru',
  JA: 'jp'
};

const BaiduDetectLangMap = {
  en: 'en',
  'zh-CN': 'zh',
  FR: 'fra',
  DE: 'de',
  ru: 'ru',
  JA: 'jp'
};

const detectLang = (text) => {
  return new Promise((resolve, reject) => {
    fetch(`${googleDetectApiUrl}?key=${googleApiKey}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        q: text
      })
    })
      .then((response) => response.json())
      .then((res) => {
        resolve(BaiduDetectLangMap[res.data.detections[0][0].language]);
      })
      .catch(reject);
  });
};

const getBaiduToken = () => {
  return new Promise((resolve, reject) => {
    fetch(
      `https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=${BaiDuApiKey}&client_secret=${BaiDuKey}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        method: 'POST'
      }
    )
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch(reject);
  });
};

const googleTrans = (text, targetLang) => {
  return new Promise((resolve, reject) => {
    fetch(`${googleTransApiUrl}?key=${googleApiKey}`, {
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

const baiduTans = (text, from, targetLang, token) => {
  return new Promise((resolve, reject) => {
    fetch(`https://aip.baidubce.com/rpc/2.0/mt/texttrans-with-dict/v1?access_token=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        q: text,
        from: from,
        to: targetLang
      })
    })
      .then((response) => response.json())
      .then((data) => {
        // 简单处理一下，同语言之间互译，可能会出现如下错误
        resolve(data);
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

// 获取音标
const getPhonetic = async (text, targetLang, port) => {
  const fromLang = await detectLang(text);
  if (fromLang === 'en') {
    getBaiduToken()
      .then((token) => {
        const accessToken = token.access_token;
        baiduTans(text, fromLang, targetLang, accessToken)
          .then((baiduRes) => {
            const dictStr = baiduRes.result.trans_result[0];
            port.postMessage({
              message: 'phonetic',
              result: dictStr
            });
          })
          .catch((error) => {
            console.log('baiduTran', error);
          });
      })
      .catch((error) => {
        console.log('token', error);
      });
  } else {
    port.postMessage({
      message: 'phonetic',
      result: {
        dict: ''
      }
    });
  }
};

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name !== 'hwh_hlw_content_script') return;
  // 接收来自 content script 的消息
  port.onMessage.addListener(function (data) {
    if (data.message === 'translate') {
      deeplxTrans(data.text, data.targetLang)
        .then((res) => {
          port.postMessage({
            message: 'translate_result',
            result: res
          });
        })
        .catch(() => {
          googleTrans(data.text, data.targetLang)
            .then((res) => {
              port.postMessage({
                message: 'translate_result',
                result: res
              });
            })
            .catch((error) => {
              port.postMessage({
                message: 'translate_result',
                error: error
              });
            });
        })
        .finally(() => {
          getPhonetic(data.text, BaiduLangMap[data.targetLang], port);
        });
    } else if (data.message === 'speak') {
      chrome.tts.speak(data.text, data.targetLang ? {lang: data.targetLang} : undefined);
    }
  });

  // 当连接断开时
  port.onDisconnect.addListener(function () {
    console.log('Connection to content script disconnected.');
  });
});
