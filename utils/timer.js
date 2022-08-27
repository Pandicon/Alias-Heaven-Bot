const sub_timer = (ms) => new Promise((res) => setTimeout(res, ms));

module.exports = async (time) => {
	var maxDelay = Math.pow(2, 31) - 1;
	var maxWorkingDelay = maxDelay > time ? time : maxDelay;
	do {
		await sub_timer(maxWorkingDelay);
		time -= maxWorkingDelay;
		maxWorkingDelay = maxDelay > time ? time : maxDelay;
	} while (time > 0);
};
