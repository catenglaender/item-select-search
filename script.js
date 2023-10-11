/**
 * Represents a custom object.
 * @param {string} listDiv - CSS class name of the div holding the filterable list.
 * @param {string} searchbarInputID - CSS class name of the search bar.
 * @param {string} selectMode - Choose if list contains checkboxes or radio buttons. Accepts 'radio' or 'checkbox'.
 */

class SearchableList {
    constructor(listDiv, searchbarInputID) {
        this.listDiv = listDiv;
        this.searchbarInputID = searchbarInputID;
    }
}

class SearchableCheckboxList extends SearchableList {
    constructor(listDiv, searchbarInputID) {
        super(listDiv, searchbarInputID);
    }
}

class SearchableRadioList extends SearchableList {
    constructor(listDiv, searchbarInputID) {
        super(listDiv, searchbarInputID);
    }
}



document.addEventListener('DOMContentLoaded', () => {

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

});
*/