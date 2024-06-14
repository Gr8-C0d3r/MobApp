import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const appSetting = {
	databaseURL: "https://testjava-53896-default-rtdb.firebaseio.com"
}

window.onload = () => {
	setInterval(UpdateChat, 1000);
	console.log("started");
}

const app = initializeApp(appSetting);
const db = getDatabase(app);
const tbl = ref(db, "messages");

//assign all page element to variables
const chatbox = document.getElementById("ChatBox");
const user = document.getElementById("User");
const msg = document.getElementById("Msg");
const addBtn = document.getElementById("add");
const updateBtn = document.getElementById("update");

//button to update chat once auto update failed
updateBtn.onclick = () => {
	UpdateChat();
}

//button to combine time user and chat msg
addBtn.onclick = () => {
	if (msg.value.charAt(0) == "/") {
		let cmd = msg.value.slice(0, 4);
		commandline(cmd);
	} else {
		let enteredValue = getDate() + "-" + user.value + ": " + msg.value;
		insertMsg(enteredValue);
	}

}

//Get the data array from database and return it as string

function getMsgs() {
	var chatString = "";
	
	onValue(tbl, function(snapshot) {
		if (snapshot.exists()){
		let chatArr = Object.values(snapshot.val());
		chatString = chatArr.join("\n")
		} else {
			chatString="DATA WAS REMOVED BY ADMIN";
			
		}
	});
	return chatString;

}


function insertMsg(txtmsg) {
	chatbox.innerHTML = chatbox.innerHTML + "\n" + txtmsg;
	//this makes the msgbox empty
	msg.value = "";
	//give it focus
	msg.focus();
	push(tbl, txtmsg);
	UpdateChat();
	chatbox.focus();
	chatbox.setSelectionRange(chatbox.value.length, chatbox.value.length);
	msg.focus();
	
}


//function to retrieve data from server

function UpdateChat() {
	chatbox.innerHTML = getMsgs();
}
;
function clearDB(){
	remove(tbl)
		.then(() => {
			console.log("All items have been removed from the database.");
		})
		.catch((error) => {
			console.error("Error removing items: ", error);
		});
}


function commandline(cmd) {
	switch (cmd) {
		case '/clr':
			console.log("clr");
			clearDB();
			break;

		default:
			console.log("not known")
	}
}



// function to get time and put in format

function getDate() {
	const now = new Date();
	const year = String(now.getFullYear()).slice(2);
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const seconds = String(now.getSeconds()).padStart(2, '0');
	const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
	return formattedDateTime;
}