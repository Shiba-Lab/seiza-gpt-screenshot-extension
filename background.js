chrome.runtime.onMessageExternal.addListener(function (
  request,
  sender,
  sendResponse
) {
  console.log("Received request:", request);
  chrome.tabs.captureVisibleTab(
    null,
    { format: "png", quality: 90 },
    function (dataUrl) {
      console.log("Captured screenshot:", dataUrl);
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { imageData: dataUrl },
          (response) => {
            console.log("Received response from content_script:", response);
          }
        );
      });
      sendResponse({ screenshot: true });
    }
  );
  return true;
});
