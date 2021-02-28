import { toggleClasses, removeClasses } from './utils.js';
import { revealMenu, closeMenu } from './animations.js';

const mobileToggler = document.querySelector('.menu-icon');
const globalNav = document.querySelector('.global-nav');
const links = globalNav.querySelectorAll('a');
let isOpen = false;

export const checkIfMenuOpen = () => {
	const menuBtn = document.querySelector('.menu-icon');
    return menuBtn.classList.contains('open')
}

mobileToggler.addEventListener('click', () => {
	toggleClasses(mobileToggler, 'open');
	// toggleClasses(globalNav, 'open');
	isOpen ? closeMenu(globalNav) : revealMenu(globalNav);
	isOpen = !isOpen;
});

links.forEach(link => {
	link.addEventListener('click', (e) => {
		const direction = e.target.getAttribute('href');
		if (direction === '#contact') {
			removeClasses(mobileToggler, 'open');
			closeMenu(globalNav);
			isOpen = false;
		}
	})
})