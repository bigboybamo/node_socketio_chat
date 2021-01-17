const socket = io()

const messageContainer = document.getElementById("message-container")
const nameInput = document.getElementById("name-input")
const messageForm = document.getElementById("message-form")
const messageInput = document.getElementById("message=input")

messageForm.addEventListener("submit", (e) => {
	e.preventDefault()
	sendMessage()
})

socket.on("totalClients", (data) => {
	
	document.getElementById(
		"client-total"
	).innerHTML = `Person(s) in this group: ${data}`
})

function sendMessage() {
	if (messageInput.value === "") return
	
	const data = {
		name: nameInput.value,
		message: messageInput.value,
		dateTime: new Date(),
	}

	socket.emit("message", data)
	addMessage(true, data)
	messageInput.value = ""
}

socket.on("chat-message", (data) => {
	
	addMessage(false, data)
})

function addMessage(isOwn, data) {
	clearFeedback()
	const element = ` 
<li class="${isOwn ? "message-right" : "message-left"}">

<p class="message">
    ${data.message}
    <span>${data.name} - ${moment(data.dateTime).fromNow()}</span>
</p>
</li>`

	messageContainer.innerHTML += element
	ScrollToBottom()
}

function ScrollToBottom() {
	messageContainer.scroll(0, messageContainer.scrollHeight)
}

messageInput.addEventListener("focus", (e) => {
	socket.emit("feedback", {
		feedback: `${nameInput.value} is typing a message`,
	})
})
messageInput.addEventListener("keypress", (e) => {
	socket.emit("feedback", {
		feedback: `${nameInput.value} is typing a message`,
	})
})
messageInput.addEventListener("blur", (e) => {
	socket.emit("feedback", {
		feedback: ``,
	})
})

socket.on("feedback-message", (data) => {
	clearFeedback()
	const newElement = ` 
    <li class="message-feedback">
    <p class="feedback" id="feedback">
        ${data.feedback}
    </p>
</li>`
	messageContainer.innerHTML += newElement
})

function clearFeedback() {
	document.querySelectorAll("li.message-feedback").forEach((el) => {
		el.parentNode.removeChild(el)
	})
}
