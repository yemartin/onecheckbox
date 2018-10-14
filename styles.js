// Hack to make styles inspectable/editable in Chrome dev tools
// (styles injected using the manifest "content_scripts" are not editable:
function injectStyles(url) {
  let elem = document.createElement('link');
  elem.rel = 'stylesheet';
  elem.setAttribute('href', url);
  document.body.appendChild(elem);
}
injectStyles(chrome.extension.getURL('content.css'));
