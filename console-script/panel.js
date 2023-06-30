chrome.devtools.panels.create("Data", null, "panel.html", (panel) => {
  panel.onShown.addListener(function (window) {
    console.log(window, "------------------> Panel is shown");
  });
});

const lookForData = setInterval(() => {
  chrome.devtools.inspectedWindow.eval(
    "INITIAL_STATE",
    function (result, exceptionInfo) {
      if (exceptionInfo) {
        console.error(exceptionInfo);
      } else {
        if (result.address) {
          console.log(result, "------------------> result");
          clearInterval(lookForData);
        }
      }
    }
  );
}, 1000);
