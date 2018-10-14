chrome.runtime.onMessageExternal.addListener((request, sender, respond) => {
  switch (request.action) {
    case "persist":
      storage.persist(request.data)
      break

    case "retrieve":
      storage.retrieve(request.data, data => respond({data: data}))
      return true
  }
});

chrome.runtime.onMessage.addListener((request, sender, respond) => {
  switch (request.action) {
    case "reset":
      storage.clear()
      chrome.tabs.query({}, function(tabs) {
        for (var i=0; i<tabs.length; ++i) {
          chrome.tabs.sendMessage(tabs[i].id, {action: "reset"});
        }
      });
      break
  }
});
