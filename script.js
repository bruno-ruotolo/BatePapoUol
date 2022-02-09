let promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
promise.then(searchDatas);

function searchDatas(response) {
    const respondeData = response.data;
    console.log(respondeData);
    console.log(respondeData.length)
    printOnScreen(respondeData);
}

function printOnScreen(respondeData) {
    const status = document.querySelector(".status-room");
    const publicMessages = document.querySelector(".public-messages");
    const privateMessages = document.querySelector(".private-messages");

    for (let i = 0; i < respondeData.length; i++) {
        if (respondeData[i].type === "status") {
            status.innerHTML += `<small>${respondeData[i].time}</small><strong>${respondeData[i].from}</strong> ${respondeData[i].text}`;
        }
        else if (respondeData[i].type === "message") {
            publicMessages.innerHTML += `<small>${respondeData[i].time}</small><strong>${respondeData[i].from}</strong> para <strong>${respondeData[i].to}</strong>: ${respondeData[i].text}`;
        }
        else if (respondeData[i].type === "private_message") {
            privateMessages.innerHTML += `<small>${respondeData[i].time}</small><strong>${respondeData[i].from}</strong> reservadamente para <strong>${respondeData[i].to}</strong>: ${respondeData[i].text}`;
        }
    }
}
function loginButton(element) {
    const loginName = document.querySelector("aside input").value;
    console.log(loginName)

    const divMain = document.querySelector("main");
    const divHeader = document.querySelector("header");
    const divFooter = document.querySelector("footer");

    divMain.classList.remove("hidden");
    divHeader.classList.remove("hidden");
    divFooter.classList.remove("hidden");

    element.parentNode.classList.add("hidden");
}

// function scrollMain() {
//     const mainScroll = document.querySelector("main div");
//     // mainScroll.scrollIntoView();
// }