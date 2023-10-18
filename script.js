const searchbarInput = ".c-searchable-list__searchbar input";
const componentBody = ".c-searchable-list__body";
const list = ".c-searchable-list__list";
const listItem = ".c-searchable-list__item";
const listItemCheckbox = 'input';
const checkedItemClass = 'selected';

const ErrorHintMissingClass = 'Make sure HTML elements have the expected class names.'

class SearchableList {
    /**
     * List that can be filtered by entering text into a searchbar
     * @param {string} containerID - the ID of the container with the search input and the list
     * @param {boolean} animateHideShow - list items should (dis)appear with an animation true/false
     */
    constructor(containerID, animateHideShow = true) {
        try {
            this.searchContainer = document.getElementById(containerID);
            if (this.searchContainer == null) {
                throw new ReferenceError(`Container element not found or ID not unique. ${ErrorHintMissingClass}`);
            }

            const htmlElementsToFetch = [
                { name: "searchbarInput", selector: searchbarInput },
                { name: "componentBody", selector: componentBody },
                { name: "list", selector: list }
            ];
            
            htmlElementsToFetch.forEach(element => {
                this[element.name] = this.searchContainer.querySelector(element.selector);
                if (this[element.name] === null) {
                    throw new ReferenceError(`${element.name} element not found. ${ErrorHintMissingClass}`);
                }
            });

            this.filterItemsSearch = this.filterItemsSearch.bind(this);
            this.searchbarInput.addEventListener('input', this.filterItemsSearch);
            this.selectableItems = Array.from(this.list.querySelectorAll(listItem));
        } catch (e) {
            console.error(e);
        }
        this.animateHideShow = animateHideShow;
    }

    // methods for main class and all subclasses
    filterItemsSearch(event) {
        const value = event.target.value.toLowerCase();
        this.selectableItems.forEach(container => {
            const itemText = container.textContent.toLowerCase();
            const isMatch = itemText.includes(value);

            // showing and hiding list items
            if (isMatch) {
                // unhide for screen readers
                // container.style.display = '';
                // unhide visually
                if (this.animateHideShow) {
                    container.style.maxHeight = '900px';
                    container.style.transform = 'scale(1,1)';
                }
            } else {
                if (this.animateHideShow) { 
                    // hide them for screen-readers after animation
                    // container.style.display = 'none';
                    container.style.maxHeight = '0px';
                    container.style.transform = 'scale(1,0)';
                } else {
                    container.style.display = 'none';
                }
            }
        });
    }

    applyCheckedToItems = (container, checkbox, resetAllOthers) => {
        if (resetAllOthers) {
            this.selectableItems.forEach(otherContainer => {
                if (otherContainer !== container) {
                    otherContainer.classList.remove(checkedItemClass);
                }
            });
        }
        if (checkbox.checked) {
            container.classList.add(checkedItemClass);
        } else {
            container.classList.remove(checkedItemClass);
        }
    };

    // methods for subclasses
    handleSelection = (checkboxOrRadioInput, resetAllOthers) => {
        try {
            this.selectableItems.forEach(container => {
                const checkbox = container.querySelector(checkboxOrRadioInput);
                this.applyCheckedToItems(container, checkbox, resetAllOthers);
                checkbox.addEventListener('change', () => {
                    this.applyCheckedToItems(container, checkbox, resetAllOthers);
                    if (resetAllOthers) {
                        this.componentBody.scroll({ top: 0, behavior: 'smooth' });
                    }
                });
            });
        } catch (error) {
            console.error(`Error in handleSelection method. ${ErrorHintMissingClass}`, error);
        }
    };
};

class SearchableCheckableList extends SearchableList {
    /**
     * List of checkbox or radio items that can be filtered by entering text into a searchbar
     * @param {string} containerID - the ID of the container with the search input and the list
     * @param {boolean} animateHideShow - list items should (dis)appear with an animation true/false
     * @param {boolean} resetAllOthers - remove "selected" class on all other items when a new item is selected (e.g. for radio buttons)
     */
    constructor(containerID, animateHideShow = true, resetAllOthers = false) {
        super(containerID, animateHideShow); // Call the super constructor to initialize this.list
        this.handleSelection(listItemCheckbox, resetAllOthers);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SearchableCheckableList('searchableMultiList', true, false);
    new SearchableCheckableList('searchableSingleList', true, true);
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