function checkboxifyAll() {
  forEachHomeworksItemDiv((homeworksItemDiv, index) => {
    checkboxify(homeworksItemDiv, index)
  })
}

function forEachHomeworksItemDiv(callback) {
  homeworksContents().forEach((homeworksContent) => {
    let index = 0
    homeworksItemDivs(homeworksContent).forEach((homeworksItemDiv) => {
      callback(homeworksItemDiv, index)
      index += 1
    })
  })
}

function homeworksContents() {
  return document.querySelectorAll("#book .homeworksContent")
}

function homeworksItemDivs(homeworksContent) {
  let divs = homeworksContent.querySelectorAll("div")
  return Array.from(divs).filter(div => checkboxifiable(div))
}

function checkboxifiable(div) {
  return isLeaf(div) && hasText(div) && !checkboxified(div)
}

function isLeaf(div) {
  return div.querySelectorAll("div").length == 0
}

// alphanum: 0-9a-zA-Z
// hiragana: \u3041-\u3096
// katakana: \u30a1-\u30f6
// kanji: \u4E00-\u9FFF
const textRegex = /[0-9a-zA-Z\u3041-\u3096\u30a1-\u30f6\u4E00-\u9FFF]+/
function hasText(div) {
  return textRegex.test(div.textContent)
}

function checkboxified(div) {
  return div.querySelector(".onecheckbox") != null
}

function checkboxify(div, index) {
  let label = document.createElement("label")
  label.className = "onecheckbox"
  let input = document.createElement("input")
  input.type= "checkbox"
  input.dataset.index = index
  let span = document.createElement("span")
  label.appendChild(input)
  label.appendChild(span)
  div.insertBefore(label, div.firstChild)
}

function reset() {
  document.querySelectorAll(".onecheckbox input[type=checkbox]")
  .forEach(checkbox => checkbox.checked = false)
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action == "reset") {
    reset()
  }
});

let MutationObserver = window.MutationObserver || window.WebKitMutationObserver
let observer = new MutationObserver((mutations, observer) => {
  checkboxifyAll()
})
observer.observe(document, {childList: true, subtree: true})

;
