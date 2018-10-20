function checkboxifyAll() {
  forEachHomeworksItemDiv((homeworksItemDiv, index) => {
    checkboxify(homeworksItemDiv, index)
  })
}

function forEachHomeworksItemDiv(callback) {
  homeworksContents().forEach((homeworksContent) => {
    let index = 0
    homeworksContentDivs(homeworksContent).forEach((homeworksContentDiv) => {
      homeworksItemDivs(homeworksContentDiv).forEach((homeworksItemDiv) => {
        callback(homeworksItemDiv, index)
        index += 1
      })
    })
  })
}

function homeworksContents() {
  return document.querySelectorAll("#book .homeworksContent")
}

function homeworksContentDivs(homeworksContent) {
  return homeworksContent.querySelectorAll(".homeworksContent > div")
}

function homeworksItemDivs(homeworksContentDiv) {
  let subdivs = homeworksContentDiv.querySelectorAll("div")
  return (subdivs.length == 0) ? [homeworksContentDiv] : subdivs
}

function checkboxify(homeworksItemDiv, index) {
  if (checkboxified(homeworksItemDiv)) return
  let label = document.createElement("label")
  label.className = "onecheckbox"
  let input = document.createElement("input")
  input.type= "checkbox"
  input.dataset.index = index
  let span = document.createElement("span")
  label.appendChild(input)
  label.appendChild(span)
  homeworksItemDiv.insertBefore(label, homeworksItemDiv.firstChild)
}

function checkboxified(homeworksItemDiv) {
  return homeworksItemDiv.querySelector(".onecheckbox") != null
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
