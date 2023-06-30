let emailData;
const getData = async () => {
  const data = await fetch(
    "https://script.google.com/macros/s/AKfycbxOFj99IjIv6-bavaXC6okB48VxKYBpDeYxeGxyxkh6NzsybyiyjOxOZNGH58JBroJSgg/exec"
  );
  debugger;
  emailData = await data.json();
  emailData = emailData.data;

  setGroupList();
};

const setGroupList = () => {
  const list = document.querySelector("select");
  const groups = Array.from(new Set(emailData.map((item) => item.group)));
  for (let i = 0, l = groups.length; i < l; i++) {
    let option = document.createElement("option");
    option.value = groups[i];
    option.text = groups[i];
    list.options.add(option);
  }
};

const downloadData = () => {
  const selection = document.querySelector("select");
  console.log(selection.value);
  if (selection.value != "All") {
    const emails = emailData
      .filter((item) => item.group == selection.value)
      .map((item) => item.email);
    let csv = "Group,Emails  \n";
    emails.forEach(function (row) {
      csv += selection.value + "," + row;
      csv += "\n";
    });
    let link = document.createElement("a");
    link.id = "exportLink";
    link.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURI(csv));
    link.setAttribute("download", `${selection.value}.csv`);
    link.click();
  } else {
    let csv = "Group,Emails \n";

    emailData.forEach(function (row) {
      csv += row.group + "," + row.email;
      csv += "\n";
    });

    let link = document.createElement("a");
    link.id = "exportLink";
    link.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURI(csv));
    link.setAttribute("download", `${selection.value}.csv`);
    link.click();
  }
};

document.querySelector("button").addEventListener("click", () => {
  downloadData();
});

getData();
