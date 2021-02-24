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

export { addClasses, removeClasses, toggleClasses };