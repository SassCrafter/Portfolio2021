const addClasses = (el, classes) => {
	classes.split(' ').forEach(className => {
		el.classList.add(className);
	});
}

const removeClasses = (el, classes) => {
	classes.split(' ').forEach(className => {
		el.classList.remove(className);
	});
}

const toggleClasses = (el, classes) => {
	classes.split(' ').forEach(className => {
		el.classList.toggle(className);
	});
}

const elementsAddClasses = (els, classes) => {
	els.forEach(el => {
		classes.split(' ').forEach(className => {
			el.classList.add(className);
		})
	})
}

export { addClasses, removeClasses, toggleClasses, elementsAddClasses };