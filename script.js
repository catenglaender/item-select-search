
/**
 * When a radio or checkbox is checked, a class is applied to the container
 * @param {HTMLInputElement} inputEl - the radio or checkbox input element
 * @param {string} containerDiv - the CSS class of the expected container
 * @param {string} selectedClass - the name of the CSS class to be toggled on the container
 */
const toggleClassOnContainerOfCheckedInput = (inputEl, containerDiv, selectedClass) => {
    if (!(inputElement instanceof HTMLInputElement)) {
        throw new TypeError('inputElement must be an instance of HTMLInputElement');
    }
    containerDiv = inputEl.closest(containerDiv);
    if (inputEl.checked) {
        containerDiv.classList.add(selectedClass);
    } else {
        containerDiv.classList.remove(selectedClass);
    }
};

/**
 * When an input is made in the search bar, only list elements with the entered characters stay visible.
 * @param {string} listClass - CSS .class-name of the div holding the filterable list.
 * @param {string} searchbarInputID - CSS #ID of the search bar.
 * @param {string} listItemClass - CSS .class-name of the individual list items
 */
class SearchableList {
    constructor(containerID, searchbarInputClass, listClass, listItemsClass) {
        const searchContainer = document.getElementById(containerID);
        this.searchbarInput = searchContainer.querySelector(searchbarInputClass);
        this.list = searchContainer.querySelector(listClass);
        this.listItemsClass = listItemsClass;
        this.selectableItems = Array.from(this.list.querySelectorAll(listItemsClass));
        
        // Debounce the filterItemsWithSearchTerm function to avoid rapid firing of input events
        this.filterItemsWithSearchTerm = this.debounce(this.filterItemsWithSearchTerm.bind(this), 300);
        // Add event listener to the search bar input
        this.searchbarInput.addEventListener('keyup', this.filterItemsWithSearchTerm);
    }

    debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    filterItemsWithSearchTerm(event) {
        const itemText = event.target.value;
        const allItemTexts = this.selectableItems.map(container => container.textContent);
        const isMatch = allItemTexts.map((label, idx) => {
            return label.toLowerCase().includes(itemText) ? idx : null;
        }).filter(el => el !== null);

        this.selectableItems.forEach((container, idx) => {
            
            // SHOWING AND HIDING
            if (isMatch.includes(idx)) {
                // unhide for screen readers
                container.style.display = 'block';
                // unhide visually
                container.classList.remove('shrink');
                container.classList.add('grow');
            } else {
                // hide them for screen-readers after animation
                container.addEventListener('animationend', function onAnimationEnd() {
                    container.style.display = 'none';
                    container.removeEventListener('animationend', onAnimationEnd);
                });
                container.classList.remove('grow');
                container.classList.add('shrink');
            }
        });
    }
}


class SearchableCheckboxList extends SearchableList {
    constructor(containerID, searchbarInputClass, listClass, listItemsClass) {
        super(containerID, searchbarInputClass, listClass, listItemsClass);
    }
}

class SearchableRadioList extends SearchableList {
    constructor(containerID, searchbarInputClass, listClass, listItemsClass) {
        super(containerID, searchbarInputClass, listClass, listItemsClass);
    }
}



document.addEventListener('DOMContentLoaded', () => {
    new SearchableList('searchableMultiList', '.filter-multi', '.select-multiple-list', '.select-multiple-item');
});




/*


    const filterElMulti = document.querySelector('#filter-multi');
    const selectableItemsMulti = Array.from(document.querySelectorAll('.select-multiple-item'));
    const selectedContainer = document.querySelector('.select-multiple-selected-container');
    const selectList = document.querySelector('.select-multiple-list');
    const selectedHeader = document.querySelector('.selected-header');
    const listHeader = document.querySelector('.list-header');
    const alertNoResults = document.querySelector('.alert-no-results');

    // Function to move an item to the selected container during animation
    const moveToSelectedContainer = container => {
        selectedContainer.appendChild(container);
    };

    // Function to move an item back to the select container during animation
    const moveToSelectContainer = container => {
        document.querySelector('.select-multiple-list').appendChild(container);
    };

    const updateHeaderVisibility = () => {
        if (selectedContainer.children.length > 0) {
            selectedHeader.style.display = 'block';
            listHeader.style.display = 'block';
            selectedContainer.style.display = 'block';
            console.log('Header visibility on');
        } else {
            selectedHeader.style.display = 'none';
            listHeader.style.display = 'none';
            selectedContainer.style.display = 'none';
            console.log('Header visibility off');
        }
    };

    // Function to update the "selected" class for a specific checkbox
    const updateSelectedClass = checkbox => {
        const container = checkbox.closest('.select-multiple-item');
        if (checkbox.checked) {
            container.classList.add('selected');
        } else {
            container.classList.remove('selected');
        }
    };

    // Apply the "selected" class to pre-selected checkboxes on page load
    selectableItemsMulti.forEach(container => {
        const checkbox = container.querySelector('input');
        updateSelectedClass(checkbox);
        if (checkbox.checked) {
            moveToSelectedContainer(container);
        }
    });


    // Attach event listener to each checkbox to update the "selected" class and move items during animations
    selectableItemsMulti.forEach(container => {
        const checkbox = container.querySelector('input');
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                // Add the animation class before moving the item
                container.classList.add('fade-out-up');
                // Wait for the animation to complete before moving the item
                container.addEventListener('animationend', () => {
                    container.classList.remove('fade-out-up');
                    moveToSelectedContainer(container);
                    updateHeaderVisibility();
                    addSelectedClass(container);
                }, { once: true }); // { once: true } ensures the event listener is removed after execution
            } else {
                moveToSelectContainer(container);
                removeSelectedClass(container);
            }
            handlerMulti(filterElMulti.value);
            updateHeaderVisibility();
        });
    });
    
    function addSelectedClass(container) {
        container.classList.add('selected');
    }
    
    function removeSelectedClass(container) {
        container.classList.remove('selected');
    }

    const labelsMulti = selectableItemsMulti.map(container => container.textContent);

    const handlerMulti = value => {
        const matching = labelsMulti.map((label, idx) => {
            return label.toLowerCase().includes(value.toLowerCase()) ? idx : null;
        }).filter(el => el !== null);
    
        selectableItemsMulti.forEach((container, idx) => {
            const checkbox = container.querySelector('input');
            const isChecked = checkbox.checked;
    
            if (matching.includes(idx) || isChecked) {updateHeaderVisibility();
                container.style.transform = 'scale(1,1)';
            } else {
                container.style.maxHeight = '0px';
                container.style.transform = 'scale(1,0)';
            }
        });
    };

    

    const toggleNoResults = () => {
        console.log('Toggling No Results');
        let allAreHidden = true;
        Array.from(selectList.children).forEach(item => {
            if (item.style.maxHeight !== '0px') {
                allAreHidden = false;
            }
        });
    
        if (allAreHidden) {
            alertNoResults.style.display = 'block';
        } else {
            alertNoResults.style.display = 'none';
        }
    };

    // SINGLE SELECT RADIO BUTTONS
    const filterElSingle = document.querySelector('#filter-single');
    const selectSingleList = document.querySelector('.select-single-container');
    const selectableItemsSingle = Array.from(document.querySelectorAll('.select-single-item'));

    const labelsSingle = selectableItemsSingle.map(container => container.textContent);

    const handlerSingle = value => {
        const matching = labelsSingle.map((label, idx) => {
            return label.toLowerCase().includes(value.toLowerCase()) ? idx : null;
        }).filter(el => el !== null);
    
        selectableItemsSingle.forEach((container, idx) => {
            const radioInput = container.querySelector('input');
            const isChecked = radioInput.checked;
    
            if (matching.includes(idx) || isChecked) {
                container.style.maxHeight = '1080px';
                container.style.transform = 'scale(1,1)';
            } else {
                container.style.maxHeight = '0px';
                container.style.transform = 'scale(1,0)';
            }
        });
    };

    selectableItemsSingle.forEach(container => {
        const radio = container.querySelector('input');
        radio.addEventListener('change', () => {
            if(radio.checked) {
                selectableItemsSingle.forEach(container2 => {container2.classList.remove('selected')});
                container.classList.add('selected');
                selectSingleList.scrollTop = 0;
            } else {
                container.classList.remove('selected');
            }
        })
    });

    updateHeaderVisibility();

    filterElMulti.addEventListener('keyup', () => {
        handlerMulti(filterElMulti.value);
        updateHeaderVisibility();
        toggleNoResults();
    });

    filterElSingle.addEventListener('keyup', () => {
        handlerSingle(filterElSingle.value);
    });
*/