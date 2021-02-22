import { toggleClasses } from './utils.js';
import { revealMenu, closeMenu } from './animations.js';

const mobileToggler = document.querySelector('.menu-icon');
const globalNav = document.querySelector('.global-nav');
let isOpen = false;

mobileToggler.addEventListener('click', () => {
	toggleClasses(mobileToggler, 'open');
	// toggleClasses(globalNav, 'open');
	isOpen ? closeMenu(globalNav) : revealMenu(globalNav);
	isOpen = !isOpen;
});