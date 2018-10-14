function constructOptions() {
  let buttonDiv = document.getElementById("resetButtonDiv")
  let link = document.createElement("a")
  link.href = "javascript:void(0)"
  link.addEventListener("click", function() {
    link.remove()
    let removeButton = document.createElement("button")
    removeButton.className = "remove"
    removeButton.addEventListener("click", function() {
      removeButton.remove()
      chrome.runtime.sendMessage(chrome.runtime.id, {
        action: "reset"
      }, function(response) {
        console.log(response)
      })
      console.log("Sent message")
      buttonDiv.innerHTML = "Done!"
    })
    removeButton.innerHTML = "Remove All Data"
    buttonDiv.appendChild(removeButton)
  })
  link.innerHTML = "Click here to reveal the remove button"
  buttonDiv.appendChild(link)

  let closeButton = document.createElement("button")
  closeButton.className = "close"
  closeButton.addEventListener("click", function() {
    window.close()
  })
  closeButton.innerHTML = "Close"
  document.getElementById("closeButtonDiv").appendChild(closeButton)
}
constructOptions()
;
