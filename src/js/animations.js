import anime from 'animejs/lib/anime.es.js';

const revealMenu = (menuEl, oper) => {
	const tl = anime.timeline({
		easing: 'easeInOutExpo',
	});
	tl
	.add({
		targets: menuEl,
		translateY: ['-100%', 0],
		duration: 400
	})
	.add({
		targets: menuEl.querySelectorAll('li a'),
		scaleY: [0, 1],
		duration: 400,
		delay: anime.stagger(100),
	});
}

const closeMenu = (menuEl) => {
	anime({
		targets: menuEl,
		translateY: '-100%',
		duration: 600,
		easing: 'easeInOutExpo'
	});
}

const iconToX = () => {
	
}
export {revealMenu, closeMenu}