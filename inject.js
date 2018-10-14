// Code that needs to be injected directly into the application in order
// to get access to its Javascript context for data extraction.

function injectCode(code) {
  var script = document.createElement("script")
  script.textContent = code
  ;(document.head||document.documentElement).appendChild(script)
  script.remove()
}

injectCode(
  `(` + function(extension_id) {
    function targetFromEvent(e) {
      e = e || window.event
      return e.target || e.srcElement
    }

    function getNotebook(scope) {
      return scope.notebook.current._id
    }

    function getDate(scope) {
      // The date of the checkbox's homework is available under:
      //   - `homeworks` on the week view,
      //   - `notebook.day` on the day view
      return (scope.homeworks || scope.notebook.day).date
    }

    function getHomework(scope) {
      return scope.$index
    }

    function extractData(checkbox) {
      let scope = angular.element(checkbox).scope()
      return {
        notebook: getNotebook(scope),
        date: getDate(scope),
        homework: getHomework(scope),
        index: parseInt(checkbox.dataset.index, 10),
        checked: checkbox.checked
      }
    }

    function oneCheckboxClicked(checkbox) {
      let data = extractData(checkbox)
      chrome.runtime.sendMessage(extension_id, {
        action: "persist",
        data: data
      })
    }

    function setInitialState(checkbox) {
      let data = extractData(checkbox)
      chrome.runtime.sendMessage(extension_id, {
        action: "retrieve",
        data: data
      }, function(response) {
        checkbox.checked = (response.data || {}).checked
      })
    }

    function isOneCheckbox(element) {
      return (
        element.type == "checkbox"
        && element.parentElement.className == "onecheckbox"
      )
    }

    function isOneCheckboxWrapper(element) {
      return element && element.className == "onecheckbox"
    }

    document.addEventListener("click", function(event){
      let target = targetFromEvent(event)
      if (isOneCheckbox(target)) {
        oneCheckboxClicked(target)
      }
    })

    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver
    let observer = new MutationObserver((mutations, observer) => {
      mutations.forEach( (mutation) => {
        mutation.addedNodes.forEach( (addedNode) => {
          if (isOneCheckboxWrapper(addedNode)) {
            let checkbox = addedNode.querySelector("input[type=checkbox]")
            setInitialState(checkbox)
          }
        })
      })
    })
    observer.observe(document, {childList: true, subtree: true})
  } + `)("` + chrome.runtime.id + `");`
)

;
