chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.imageData) {
    // Base64エンコードされたデータをBlobに変換
    const blob = b64toBlob(message.imageData.split(",")[1], "image/png");
    const url = URL.createObjectURL(blob);

    // ダウンロードリンクを生成し、自動的にクリックする
    const a = document.createElement("a");
    a.href = url;
    a.download = makeName();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    sendResponse({ status: "Download started" });
  }
  return true; // 非同期応答を維持する
});

// Base64データをBlobに変換する関数
function b64toBlob(b64Data, contentType = "", sliceSize = 512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

function makeName() {
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `seiza-gpt-${month}-${day}_${hours}-${minutes}-${seconds}.png`;
}
