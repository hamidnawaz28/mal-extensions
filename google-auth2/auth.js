
window.onload = function () {
    document.querySelector('button').addEventListener('click', function () {
        chrome.identity.getAuthToken({ 'interactive': true }, function (token) {
            console.log(token);
            let init = {
                method: 'GET',
                async: true,
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                'contentType': 'json'
            };
            fetch(
                'https://people.googleapis.com/v1/contactGroups/all?maxMembers=20&key=AIzaSyAzErjHOOwLQbyNrNtwl9ewfnRTUiXzpIE',
                init)
                .then((response) => response.json())
                .then(function (data) {
                    console.log(data)
                });
        });
    });
};

