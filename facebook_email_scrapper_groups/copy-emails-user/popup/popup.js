document.querySelector('button[id="testing"]').addEventListener("click", () => {
  chrome.tabs.getSelected(null, (tab) => {
    chrome.runtime.sendMessage({
      messageType: "GET_DATA",
      url: tab.url,
    });
  });
});

document.querySelector('button[id="copy"]').addEventListener("click", () => {
  copyEmails();
});

document.querySelector('button[id="clear"]').addEventListener("click", () => {
  chrome.storage.local.set({ Emails: [] });
  setListUI();
});

chrome.storage.local.get(["Emails"], (data) => {
  if (typeof data.unique == "undefined") {
    // That's kind of bad
  } else {
    console.log(data.count);
  }
});

const setListUI = async () => {
  const listData = document.querySelector('[name="selectedList"]');
  chrome.storage.local.get(["Emails"], (data) => {
    if (data.Emails?.length) {
      data.Emails.forEach((data) => {
        let option = document.createElement("option");
        option.value = data;
        option.text = data;
        listData.add(option);
      });
    } else listData.innerHTML = "";
    const totalEmails = document.getElementById("totalEmails");
    totalEmails.innerText = "Total Emails Found: " + (data.Emails?.length || 0);
  });
};

const copyEmails = () => {
  const list = document.getElementById("emails");
  let temp = "";
  let newEmails = [];
  for (let i = 0; i < list.options.length; i++) {
    newEmails.push(list.options[i].text);
    temp += list.options[i].text + "\n";
  }

  navigator.clipboard.writeText(temp);
  chrome.storage.local.get(["Emails", "group"], async (data) => {
    if (data.Emails?.length) {
      await fetch("https://copy-emails.herokuapp.com/api/add", {
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          group: data.group,
          emails: data.Emails,
        }),
        method: "POST",
      });
    } else listData.innerHTML = "";
  });
};

setListUI();
