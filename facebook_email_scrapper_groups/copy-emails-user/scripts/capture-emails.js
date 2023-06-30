const extractEmails = (text) => {
  return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
};

const EMAILS = [];
async function coverArticles() {
  const posts = document.querySelectorAll(
    `div[role="article"][aria-labelledby]:not([articleCovered]), [data-pagelet="MainFeed"] > * > * > div:not([articleCovered]`
  );
  if ([...posts].length) {
    [...posts]?.forEach((uncoveredArticle) => {
      [...uncoveredArticle.querySelectorAll("span")]
        ?.filter((item) => item.innerText.includes("View"))[0]
        ?.click();
      [...uncoveredArticle.querySelectorAll("div")]
        ?.filter((item) => item.innerText == "See more")[0]
        ?.click();
      uncoveredArticle.setAttribute("articleCovered", true);
    });
  } else {
    window.scrollBy(
      0,
      document.body.scrollHeight - (window.scrollY + window.innerHeight)
    );
  }
}

chrome.storage.local.set({ Emails: [] });
chrome.storage.local.set({ uploadedEmails: ["djskjd", "3244"] });
chrome.storage.local.set({ group: document.title });

const emailExtractor = async () => {
  const emails = extractEmails(document.documentElement.innerText);

  if (emails) {
    if (emails.length >= 1) EMAILS.push(...emails);
    else EMAILS.push(emails);

    const unique = EMAILS.filter((v, i, a) => a.indexOf(v) === i);

    if (unique.length > 0) {
      chrome.storage.local.get(["uploadedEmails"], (data) => {
        const toAddEmails = unique.filter(
          (mail) => !data.uploadedEmails.includes(mail)
        );
        if (toAddEmails.length > 0) {
          const allEmails = [...data.uploadedEmails, ...toAddEmails];
          chrome.storage.local.set({ uploadedEmails: allEmails });
          postEmails(toAddEmails.join(";"), document.title);
        }
        chrome.storage.local.set({ Emails: unique });
      });
    }
  }
};

const postEmails = (emails, group) => {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
    }
  });

  xhr.open(
    "POST",
    "https://script.google.com/macros/s/AKfycbxOFj99IjIv6-bavaXC6okB48VxKYBpDeYxeGxyxkh6NzsybyiyjOxOZNGH58JBroJSgg/exec"
  );
  xhr.setRequestHeader("Content-Type", "text/plain");
  let output = JSON.stringify({
    emails: emails,
    group: group,
  });
  xhr.send(output);
};
setInterval(coverArticles, 1000);
setInterval(emailExtractor, 1000);
