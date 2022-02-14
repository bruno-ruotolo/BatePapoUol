let responseDataLength = 0;
let responseData = [];
let oldResponseData = [];
let loginName = null;

function startSearch() {
    let promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promise.then(searchDatas);
}

function searchDatas(response) {
    document.querySelector("aside").classList.add("hidden");
    document.querySelector("main").classList.remove("hidden");
    document.querySelector("header").classList.remove("hidden");
    document.querySelector("footer").classList.remove("hidden");

    responseData = response.data;
    enterToSend();
    printOnScreen(responseData);
}

function printOnScreen(responseData) {
    const main = document.querySelector("main");

    for (let i = 0; i < responseData.length; i++) {
        if (responseData[i].type === "status") {
            main.innerHTML += ` <div class="status-room" data-identifier="message"><small>${responseData[i].time}</small><strong>${responseData[i].from}</strong> ${responseData[i].text}</div>\n`;
        }
        else if (responseData[i].type === "message") {
            main.innerHTML += `<div class="public-messages" data-identifier="message"><small>${responseData[i].time}</small><strong>${responseData[i].from}</strong> para <strong>${responseData[i].to}</strong>: ${responseData[i].text}</div>\n`;
        }
        else if ((loginName === responseData[i].from || loginName === responseData[i].to) && responseData[i].type === "private_message") {
            main.innerHTML += `<div class="private-messages" data-identifier="message"><small>${responseData[i].time}</small><strong>${responseData[i].from}</strong> reservadamente para <strong>${responseData[i].to}</strong>: ${responseData[i].text}<div>\n`;
        }
    }
    responseDataLength = responseData.length - 1;
    oldResponseData = responseData;
    setInterval(refreshingPage, 3000);
}

function refreshingPage() {
    promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promise.then(updateMessages);
}

let counterTrue = 0;
function updateMessages(response) {
    responseData = response.data
    const main = document.querySelector("main");

    for (let j = 50; j < 100; j++) {
        for (let i = (responseData.length - 1); i > 49; i--) {

            let compareTime = (responseData[j].time !== oldResponseData[i].time);
            let compareText = (responseData[j].text !== oldResponseData[i].text);
            let compareUser = (responseData[j].from !== oldResponseData[i].from);
            let compareReceiver = (responseData[j].to !== oldResponseData[i].to);

            if (compareText || compareTime || compareUser || compareReceiver) {
                counterTrue++;
            } else {
                counterTrue = 0;
                i = 49;
            }
        }
        if (counterTrue === 50) {
            if (responseData[j].type === "status") {
                main.innerHTML += `<div class="status-room" data-identifier="message"><small>${responseData[j].time}</small><strong>${responseData[j].from}</strong> ${responseData[j].text}</div>\n`;
            }
            else if (responseData[j].type === "message") {
                main.innerHTML += `<div class="public-messages" data-identifier="message"><small>${responseData[j].time}</small><strong>${responseData[j].from}</strong> para <strong>${responseData[j].to}</strong>: ${responseData[j].text}</div>\n`;
            }
            else if ((loginName === responseData[j].from || loginName === responseData[j].to) && responseData[j].type === "private_message") {
                main.innerHTML += `<div class="private-messages" data-identifier="message"><small>${responseData[j].time}</small><strong>${responseData[j].from}</strong> reservadamente para <strong>${responseData[j].to}</strong>: ${responseData[j].text}<div>\n`;
            }
        }
        counterTrue = 0;
    }
    oldResponseData = responseData;
    const lastStatusDiv = main.querySelectorAll(".status-room");
    lastStatusDiv[lastStatusDiv.length - 1].scrollIntoView();
}


function loginButton() {

    loginName = document.querySelector("aside input").value;
    document.querySelector(".aside-input").classList.add("hidden");
    document.querySelector(".aside-buttom").classList.add("hidden");
    document.querySelector(".loading").classList.remove("hidden");
    document.querySelector(".aside-text").classList.remove("hidden");
    postNameuser();
    setInterval(statusUser, 5000);
    setTimeout(startSearch, 200);



    const divMain = document.querySelector("main");
    const divHeader = document.querySelector("header");
    const divFooter = document.querySelector("footer");

    divMain.classList.add("hidden");
    divHeader.classList.add("hidden");
    divFooter.classList.add("hidden");
}

function postNameuser() {
    const inputeNameValue = document.querySelector(".aside-input").value;
    const objectName = {
        name: `${inputeNameValue}`
    }

    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", objectName);
    promise.then(addUsernameSucessfull);
    promise.catch(addUsernameError)
}
function addUsernameError() {
    document.querySelector("main").classList.add("hidden")
    alert("Este nome já está em uso, por favor, utilize outro!")
    window.location.reload();

}
function addUsernameSucessfull(response) {
    console.log(response);
}

function postMessages() {
    const footerInput = document.querySelector("footer input").value

    if (footerInput) {
        console.log("Enviando");
        const inputNameValue = document.querySelector(".aside-input").value;
        let inputMessages = document.querySelector("footer input");
        const objectMessages = {
            from: `${inputNameValue}`,
            to: `Todos`,
            text: `${inputMessages.value}`,
            type: "message"
        }

        const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", objectMessages);
        inputMessages.value = "";
        promise.then(addMessagesSucessfull);
        promise.catch(addMesaageError);
    }
}
function addMesaageError() {
    window.location.reload();
}
function addMessagesSucessfull(response) {
    refreshingPage();
}



function statusUser() {
    const inputNameValue = document.querySelector(".aside-input").value;
    const objectStatus = {
        name: `${inputNameValue}`
    }
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", objectStatus);
    promise.then(responseUserStatus);
    promise.catch(errorFunction);
}

function responseUserStatus(response) {
}

function errorFunction(erro) {
    console.log(erro.response)
}

function enterToSend() {
    document.querySelector("footer input").addEventListener("keypress", function (event) {

        if (event.key === "Enter") {
            postMessages();
        }
    })
}