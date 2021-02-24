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
		duration: DURATION,
	})
	.add({
		targets: menuEl.querySelectorAll('li a'),
		scaleY: [0, 1],
		duration: DURATION,
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


const revealImage = (image, imageCoverSelector, elsToSlide) => {
	const imageCovers = image.querySelectorAll(imageCoverSelector);
	// anime({
	// 	targets: imageCovers,
	// 	translateX: window.innerWidth,
	// 	duration: 800,
	// 	easing: 'easeInOutExpo'
	// });
	const tl = anime.timeline({
		duration: DURATION,
	 	easing: 'easeInOutQuad',
	});
	tl
	.add({
		targets: imageCovers[0],
		scaleX: [0,1],
		translateX: {
			value: window.innerWidth,
			delay: 400,
		}
	})
	.add({
		targets: elsToSlide,
		translateX: 0
	});
}

const slideFromLeft = (elements) => {
	anime({
		targets: elements,
		duration: 400,
		translateX: 0,
		easing: 'linear',
		delay: anime.stagger(100),
	})
}

 


export {revealMenu, closeMenu, revealImage, slideFromLeft};