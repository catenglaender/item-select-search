class SearchableList {
    /**
     * List that can be filtered by entering text into a searchbar
     * @param {string} containerID - the ID of the container with the search input and the list
     */
    constructor(containerID) {
        // basic class names
        this.searchbarInput = ".c-searchable-list__searchbar input";
        this.componentBody = ".c-searchable-list__body";
        this.list = ".c-searchable-list__list";
        this.listItem = ".c-searchable-list__item";

        this.containerID = containerID;

        if (this.constructor === SearchableList) {
            this.init();
        }
    }

    init() {
        const ErrorHintMissingClass = 'Make sure HTML elements have the expected class names.';
        // Check if all necessary DOM elements exist
        try {
            this.searchContainer = document.getElementById(this.containerID);
            if (this.searchContainer == null) {
                throw new ReferenceError(`Container element not found or ID not unique. ${ErrorHintMissingClass}`);
            }

            const htmlElementsToFetch = [
                { name: "searchbarInput", selector: this.searchbarInput },
                { name: "componentBody", selector: this.componentBody },
                { name: "list", selector: this.list }
            ];

            this.fetchElements();

            // bind the input bar so any input filters the list
            this.filterItemsSearch = this.filterItemsSearch.bind(this);
            this.searchbarInput.addEventListener('input', this.filterItemsSearch);

            this.selectableItems = Array.from(this.searchContainer.querySelectorAll(this.listItem));
        } catch (e) {
            console.error(e);
        }
    }

    fetchElements() {
        const ErrorHintMissingClass = 'Make sure HTML elements have the expected class names.';

        const htmlElementsToFetch = [
            { name: "searchbarInput", selector: this.searchbarInput },
            { name: "componentBody", selector: this.componentBody },
            { name: "list", selector: this.list }
        ];

        htmlElementsToFetch.forEach(element => {
            this[element.name] = this.searchContainer.querySelector(element.selector);
            if (this[element.name] === null) {
                throw new ReferenceError(`${element.name} element not found. ${ErrorHintMissingClass}`);
            }
        });
    }

    filterItemsSearch(event) {
        const value = event.target.value.toLowerCase();
        this.selectableItems.forEach(container => {
            const itemText = container.textContent.toLowerCase();
            const isMatch = itemText.includes(value);
            if (isMatch) {
                container.style.display = 'block';
                container.style.maxHeight = '900px';
                container.style.transform = 'scale(1,1)';
            } else {
                container.style.transform = 'scale(1,0)';
                container.style.display = 'none'; // is applied on last frame of transition because of CSS transition-behavior: allow-discrete;
            }
        });
    }
}

class SearchableCheckableList extends SearchableList {
    /**
     * List of checkbox or radio items that can be filtered by entering text into a searchbar
     * @param {string} containerID - the ID of the container with the search input and the list
     * @param {boolean} resetAllOthers - remove "selected" class on all other items when a new item is selected (e.g. for radio buttons)
     */
    constructor(containerID, resetAllOthers = false) {
        super(containerID);
        this.listItemCheckbox = 'input';
        this.checkedItemClass = 'selected';
        if (this.constructor === SearchableCheckableList) {
            this.init();
            this.handleSelection(this.listItemCheckbox, resetAllOthers);
        }
    }

    handleSelection = (checkboxOrRadioInput, resetAllOthers) => {
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
    };

    applyCheckedToItems = (container, checkbox, resetAllOthers) => {
        if (resetAllOthers) {
            this.selectableItems.forEach(otherContainer => {
                if (otherContainer !== container) {
                    otherContainer.classList.remove(this.checkedItemClass);
                }
            });
        }
        if (checkbox.checked) {
            container.classList.add(this.checkedItemClass);
        } else {
            container.classList.remove(this.checkedItemClass);
        }
    };
}

class VisualSelect extends SearchableCheckableList {
    constructor(containerID, resetAllOthers = false) {
        super(containerID, resetAllOthers);
        this.searchbarInput = ".c-visual-select__searchbar input";
        this.componentBody = ".c-visual-select__body";
        this.list = ".c-visual-select__list";
        this.listItem = ".c-visual-select__item";

        this.init(); // Call init after setting subclass-specific properties
        this.handleSelection(this.listItemCheckbox, resetAllOthers);
    }

    fetchElements() {
        super.fetchElements();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SearchableCheckableList('searchableMultiList', false);
    new SearchableCheckableList('searchableSingleList', true);
    new VisualSelect('visualSelect', true);
});
