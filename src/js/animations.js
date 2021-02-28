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

const leavePage = (callback) => {
	anime({
		targets: '.curtain',
		duration: 500,
		scaleY: [0,1],
		translateZ: 0,
		transformOrigin: ['0 100%', '0 100%'],
		easing: 'easeInOutQuad',
		complete: function() {
			callback();
		}
	});
}

const enterPage = () => {
	anime({
		targets: '.curtain',
		duration: 500,
		scaleY: [1,0],
		translateZ: 0,
		transformOrigin: ['0 0', '0 0'],
		easing: 'easeInOutQuad',
		delay: 200,
	});
}

// const pageTransition = (el) => {
// 	const tl = anime.timeline({duration: 500, easing: 'easeInOutQuad'});
// 	tl
// 	.add({
// 		targets: el,
// 		scaleY: [0, 1],
// 		translateZ: 0,
// 		transformOrigin: '0 0',
// 	})
// 	.add({
// 		targets: el,
// 		scaleY: [1, 0],
// 		translateZ: 0,
// 	});
// }

// const pageTransition = (el) => {
// 	const tl = anime.timeline({duration: 500, easing: 'easeInOutQuad'});
// 	tl
// 	.add({
// 		targets: el,
// 		scaleY: [0, 1],
// 		translateZ: 0,
// 	})
// 	.add({
// 		targets: el,
// 		scaleY: [1, 0],
// 		translateZ: 0,
// 	}, '+= 200');
// }


const pageTransition = (el, callback) => {
	const tl = anime.timeline({ duration: 600, easing: 'easeInOutQuad' });
  tl.add({
    targets: el,
    scaleY: [0, 1],
    translateZ: 0,
    transformOrigin: ['0 100%', '0 100%'],
    complete: function() {
      	if (typeof callback === 'function') callback();
      }
  }).add(
    {
      targets: el,
      scaleY: [1, 0],
      translateZ: 0,
      transformOrigin: ['0 0', '0 0'],
    },
    '+= 300'
  );
}

const imageToSection = (el) => {
	console.log("Animating image")
	const tl = anime.timeline({duration: 1500, easing: 'easeInOutQuad'});
	tl
	.add({
		targets: el,
		// width: '100vw',
		// height: '100vh',
		opacity: 0,
		transformZ: 0,
	})
}


export {revealMenu, closeMenu, revealImage, slideFromLeft, leavePage, slideFromRight, enterPage, pageTransition, imageToSection};