let responseDataLength = 0;
let responseData = [];
let oldResponseData = [];

function startSearch() {
    let promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promise.then(searchDatas);
}

function searchDatas(response) {
    document.querySelector("aside").classList.add("hidden");
    responseData = response.data;
    console.log(responseData);
    console.log(responseData.length)
    printOnScreen(responseData);
}

function printOnScreen(responseData) {
    const main = document.querySelector("main");

    for (let i = 0; i < responseData.length; i++) {
        if (responseData[i].type === "status") {
            main.innerHTML += ` <div class="status-room"><small>${responseData[i].time}</small><strong>${responseData[i].from}</strong> ${responseData[i].text}</div>\n`;
        }
        else if (responseData[i].type === "message") {
            main.innerHTML += `<div class="public-messages"><small>${responseData[i].time}</small><strong>${responseData[i].from}</strong> para <strong>${responseData[i].to}</strong>: ${responseData[i].text}</div>\n`;
        }
        else if (responseData[i].type === "private_message") {
            main.innerHTML += `<div class="private-messages"><small>${responseData[i].time}</small><strong>${responseData[i].from}</strong> reservadamente para <strong>${responseData[i].to}</strong>: ${responseData[i].text}<div>\n`;
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

function updateMessages(response) {
    responseData = response.data
    console.log("Reiniciando");
    const compareTime = (responseData[responseDataLength].time !== oldResponseData[responseDataLength].time);
    const compareText = (responseData[responseDataLength].text !== oldResponseData[responseDataLength].text);
    const compareUser = (responseData[responseDataLength].from !== oldResponseData[responseDataLength].from);

    const main = document.querySelector("main");

    if (compareTime || compareText || compareUser) {
        if (responseData[responseDataLength].type === "status") {
            main.innerHTML += `<div class="status-room"><small>${responseData[responseDataLength].time}</small><strong>${responseData[responseDataLength].from}</strong> ${responseData[responseDataLength].text}</div>\n`;
        }
        else if (responseData[responseDataLength].type === "message") {
            main.innerHTML += `<div class="public-messages"><small>${responseData[responseDataLength].time}</small><strong>${responseData[responseDataLength].from}</strong> para <strong>${responseData[responseDataLength].to}</strong>: ${responseData[responseDataLength].text}</div>\n`;
        }
        else if (responseData[responseDataLength].type === "private_message") {
            main.innerHTML += `<div class="private-messages"><small>${responseData[responseDataLength].time}</small><strong>${responseData[responseDataLength].from}</strong> reservadamente para <strong>${responseData[responseDataLength].to}</strong>: ${responseData[responseDataLength].text}<div>\n`;
        }
        const lastStatusDiv = main.querySelectorAll(".status-room");
        lastStatusDiv[lastStatusDiv.length - 1].scrollIntoView();
        oldResponseData = responseData;
    }
}


function loginButton() {

    const loginName = document.querySelector("aside input").value;
    document.querySelector(".aside-input").classList.add("hidden");
    document.querySelector(".aside-buttom").classList.add("hidden");
    document.querySelector(".loading").classList.remove("hidden");
    document.querySelector(".aside-text").classList.remove("hidden");
    postNameuser();
    startSearch();


    const divMain = document.querySelector("main");
    const divHeader = document.querySelector("header");
    const divFooter = document.querySelector("footer");

    divMain.classList.remove("hidden");
    divHeader.classList.remove("hidden");
    divFooter.classList.remove("hidden");
}

function postNameuser() {
    const inputeNameValue = document.querySelector(".aside-input").value;
    const objectName = {
        name: `${inputeNameValue}`
    }

    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", objectName);
    promise.then(addUsernameSucessfull);
}

function addUsernameSucessfull(response) {
    console.log(response);
}