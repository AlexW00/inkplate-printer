// Define and export a function that takes (socket, event) as parameters
// The filename of this file is the name of the socket message,
// this function will handle
const on = (socket, event) => {
	console.log("example event", event);
	socket.emit("example", "example response from server");
};

module.exports = on;
