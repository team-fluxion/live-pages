/* global document module */

// Function to remove specified strings from a supplied string
const removeStrings = (phrase, strings) => {
    const reg = new RegExp(`( ${strings.join('| ')})`, 'g');

    return phrase.replace(reg, '');
};

// Function to add supplied CSS classes to body
const addClassesToBody = cssClasses => {
    let bodyClassName = document.body.className || '';

    // Remove all specificed CSS classes, if they already exist
    bodyClassName = removeStrings(bodyClassName, cssClasses);

    // Add all specified CSS classes
    document.body.className = `${bodyClassName} ${cssClasses.join(' ')}`;
};

// Function to remove supplied CSS classes from body
const removeClassesFromBody = cssClasses => {
    const bodyClassName = document.body.className || '';

    // Remove all specified CSS classes
    document.body.className = removeStrings(bodyClassName, cssClasses);
};

module.exports.addClassesToBody = addClassesToBody;
module.exports.removeClassesFromBody = removeClassesFromBody;
