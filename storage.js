/*

Space-efficient storage of the state of our checkboxes.

Data format:

    {
      notebook + year: {
        month + day: statesString
      }
    }

The statesString is a comma-separated string of values, the position is the
index of the homework item, and the value's bits represent the state of
the checkboxes associated with that item.

Example:

    {
      "5ae983681c5e48d885a1c972589d160f2018": {
        1001: "3,1,,f",
        1002: ",2,,7"
      }
    }

Testing with this format, 1 month of data took about 400 bytes. So 1 year
would take around 5 kb, below the quota of 8 kb (Chrome's sync storage
QUOTA_BYTES_PER_ITEM).

*/

let storage = (() =>  {
  let _storage = chrome.storage.sync

  class Persistor {
    constructor(data) {
      this.notebook = data.notebook
      this.date = data.date
      this.homework = data.homework
      this.index = data.index
      this.checked = data.checked
    }

    get topLevelKey() {
      // notebook ID + year
      // Example: c265653250b0422aa6bd979d50046c912018
      return (this.notebook + this.date.slice(0,4)).replace(/-/g, "")
    }

    get secondLevelKey() {
      // Month + Day as integer
      // Example: "2018-01-02" => 102
      let monthday = this.date.slice(5,10).replace(/-/g, "")
      return parseInt(monthday, 10)
    }

    get secondLevelData() {
      let data = this.topLevelData
      let key = this.topLevelKey
      data[key] = data[key] || {}
      return data[key]
    }

    get statesString() {
      let data = this.secondLevelData
      let key = this.secondLevelKey
      data[key] = data[key] || ""
      return data[key]
    }

    set statesString(value) {
      let data = this.secondLevelData
      let key = this.secondLevelKey
      data[key] = value
    }

    get data() {
      return {
        notebook: this.notebook,
        date: this.date,
        homework: this.homework,
        index: this.index,
        checked: this.checked
      }
    }

    updateState() {
      let statesArray = statesStringToArray(this.statesString)
      let value = hexatridecimalDecode(statesArray[this.homework])
      let newValue = updateBit(value, this.index, this.checked)
      statesArray[this.homework] = hexatridecimalEncode(newValue)
      this.statesString = statesArrayToString(statesArray)
    }

    retrieveState() {
      let statesArray = statesStringToArray(this.statesString)
      let value = hexatridecimalDecode(statesArray[this.homework])
      this.checked = getBit(value, this.index)
    }

    persist() {
      _storage.get(this.topLevelKey, (storedData) => {
        this.topLevelData = storedData
        this.updateState()
        _storage.set(this.topLevelData)
      })
    }

    retrieve(callback) {
      _storage.get(this.topLevelKey, (storedData) => {
        this.topLevelData = storedData
        this.retrieveState()
        callback(this.data)
      })
    }
  }

  function clear() {
    _storage.clear()
  }

  function statesStringToArray(statesString) {
    return statesString.split(",")
  }

  function statesArrayToString(statesArray) {
    // Elimitate zeros and trailing commas
    return statesArray.map(x => x == "0" ? "" : x).join(",").replace(/,+$/, "")
  }

  function hexatridecimalDecode(string) {
    return parseInt("0" + (string || ""), 36)
  }

  function hexatridecimalEncode(value) {
    return value.toString(36)
  }

  function updateBit(value, position, set) {
    let bitmask = 1 << position
    return set ? (value | bitmask) : (value & ~bitmask)
  }

  function getBit(value, position) {
    let bitmask = 1 << position
    return (value & bitmask) != 0
  }

  function persist(data) {
    let persistor = new Persistor(data)
    persistor.persist()
  }

  function retrieve(data, callback) {
    let persistor = new Persistor(data)
    persistor.retrieve(callback)
  }

  return {
    persist: persist,
    retrieve: retrieve,
    clear: clear
  }
})()
