window.toggleSidebar = function toggleSidebar() {
	document.body.classList.toggle('sidebar-active');
};

window.toggleTheme = function toggleSidebar() {
	if (document.body.classList.contains('dark')) {
		window.location.href = '?theme=light';
	} else {
		window.location.href = '?theme=dark';
	}
};

window.copyTextToClipboard = async function (el, text) {
	try {
		await navigator.clipboard.writeText(text);
		const label = el.nextElementSibling;
		label.classList.toggle('show');

		setTimeout(function () {
			label.classList.toggle('show');
		}, 5000);
	} catch (err) {
		console.error('Failed to copy text: ', err);
	}
};
