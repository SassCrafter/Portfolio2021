import anime from 'animejs/lib/anime.es.js';

const DURATION = 400;

const revealMenu = (menuEl, oper) => {
	const tl = anime.timeline({
		easing: 'easeInOutExpo',
	});
	tl
	.add({
		targets: menuEl,
		translateY: ['-100%', 0],
		translateZ: 0,
		duration: DURATION,
	})
	.add({
		targets: menuEl.querySelectorAll('li a'),
		scaleY: [0, 1],
		translateZ: 0,
		duration: DURATION,
		delay: anime.stagger(100),
	});
}

const closeMenu = (menuEl) => {
	anime({
		targets: menuEl,
		translateY: '-100%',
		translateZ: 0,
		duration: 600,
		easing: 'easeInOutExpo'
	});
}


const revealImage = (image, imageCoverSelector, elsToSlide) => {
	const imageCovers = image.querySelectorAll(imageCoverSelector);
	const tl = anime.timeline({
		duration: DURATION,
	 	easing: 'easeInOutQuad',
	});
	tl
	.add({
		targets: imageCovers[0],
		scaleX: [0, 1],
		translateZ: 0,
	})
	.add({
		targets: imageCovers,
		translateX: '100%',
		translateZ: 0,
	})
	.add({
		targets: [image.querySelector('img'), image.querySelector('.page-num')],
		opacity: 1,
		duration: 50,
	}, `-=${DURATION}`)
	.add({
		targets: elsToSlide,
		translateX: ['-100%', 0],
		translateZ: 0,
	});
	return tl;
}

const slideFromLeft = (elements) => {
	const a = anime({
		targets: elements,
		duration: 400,
		translateX: ['-100%', 0],
		opacity: [0,1],
		easing: 'linear',
		delay: anime.stagger(100),
	});
	return a;
}
const slideFromRight = (elements) => {
	const a = anime({
		targets: elements,
		duration: 400,
		translateX: ['100%', 0],
		opacity: [0, 1],
		easing: 'linear',
		delay: anime.stagger(100),
	});
	return a;
}

const leavePage = (element) => {
	return anime({
		targets: element,
		duration: DURATION * 2,
		translateY: ['100%', 0],
		translateZ: 0,
		easing: 'easeInOutQuad',
	});
}

const enterPage = (element) => {
	return anime({
		targets: element,
		duration: DURATION * 2,
		translateY: '-100%',
		translateZ: 0,
		easing: 'easeInOutQuad',
	});
}


export {revealMenu, closeMenu, revealImage, slideFromLeft, leavePage, slideFromRight, enterPage};