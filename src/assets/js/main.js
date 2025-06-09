window.onload = function () {
	setSelectedIndicator();
	initSidebarMenu();
};

function initSidebarMenu() {
	const menus = document.querySelectorAll('#sidebar-menu li a');

	for (let i = 0; i < menus.length; i++) {
		console.log(menus[i].href);
		if (menus[i].href.endsWith(window.location.pathname)) {
			menus[i].classList.add('selected');
		}
	}
}

function toggleSidebar() {
	document.body.classList.toggle('sidebar-active');
}

function setSelectedIndicator() {
	const preview = document.getElementById('preview');
	const indicators = document.querySelectorAll('#indicators button');

	if (indicators.length > 0) {
		indicators[0].classList.add('selected');

		for (let i = 0; i < indicators.length; i++) {
			if (preview.src.endsWith(indicators[i].getAttribute('data-url'))) {
				indicators[i].classList.add('selected');
			} else {
				indicators[i].classList.remove('selected');
			}
		}
	}
}

function selectIndicator(url, index) {
	const preview = document.getElementById('preview');
	const indicators = document.querySelectorAll('#indicators button');
	const selected = document.querySelector('#indicators button.selected');
	const selectedIndex = parseInt(selected.getAttribute('data-index'));

	if (selected) {
		if (url === 'next' && selectedIndex < indicators.length - 1) {
			selected.classList.remove('selected');
			indicators[selectedIndex + 1].classList.add('selected');
			preview.src = indicators[selectedIndex + 1].getAttribute('data-url');
		} else if (url === 'previous' && selectedIndex > 0) {
			selected.classList.remove('selected');
			indicators[selectedIndex - 1].classList.add('selected');
			preview.src = indicators[selectedIndex - 1].getAttribute('data-url');
		} else if (index >= 0 && index <= indicators.length - 1) {
			selected.classList.remove('selected');
			indicators[index].classList.add('selected');
			preview.src = url;
		}
	}
}
