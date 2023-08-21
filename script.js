document.addEventListener('DOMContentLoaded', () => {
    const filterEl = document.querySelector('#filter');
    const selectableItems = Array.from(document.querySelectorAll('.select-item'));
    const selectedContainer = document.querySelector('.selected-container');
    const selectedHeader = document.querySelector('.selected-header');
    const listHeader = document.querySelector('.list-header');

    // Function to move an item to the selected container during animation
    const moveToSelectedContainer = container => {
        selectedContainer.appendChild(container);
        container.classList.add('selected');
    };

    // Function to move an item back to the select container during animation
    const moveToSelectContainer = container => {
        container.classList.remove('selected');
        document.querySelector('.select-list').appendChild(container);
    };

    // Function to update the "selected" class for a specific checkbox
    const updateSelectedClass = checkbox => {
        const container = checkbox.closest('.select-item');
        if (checkbox.checked) {
            container.classList.add('selected');
        } else {
            container.classList.remove('selected');
        }
    };

    // Apply the "selected" class to pre-selected checkboxes on page load
    selectableItems.forEach(container => {
        const checkbox = container.querySelector('input');
        updateSelectedClass(checkbox);
        if (checkbox.checked) {
            moveToSelectedContainer(container);
        }
    });


    // Attach event listener to each checkbox to update the "selected" class and move items during animations
    selectableItems.forEach(container => {
        const checkbox = container.querySelector('input');
        checkbox.addEventListener('change', () => {
            updateSelectedClass(checkbox);
            if (checkbox.checked) {
                moveToSelectedContainer(container);
            } else {
                moveToSelectContainer(container);
            }
            handler(filterEl.value);
            updateHeaderVisibility();
        });
    });

    const labels = selectableItems.map(container => container.textContent);

    const handler = value => {
        const matching = labels.map((label, idx) => {
            if (selectableItems[idx].querySelector('input').checked) {
                selectableItems[idx].classList.add('selected'); // Add the "selected" class
                return true; // Always show checked elements
            } else {
                selectableItems[idx].classList.remove('selected'); // Remove the "selected" class
                return label.toLowerCase().includes(value.toLowerCase()) ? idx : null;
            }
        }).filter(el => el !== null);

        selectableItems.forEach((container, idx) => {
            if (matching.includes(idx) || container.querySelector('input').checked) {
                container.style.maxHeight = '1080px';
                container.style.transform = 'scale(1,1)';
            } else {
                container.style.maxHeight = '0px';
                container.style.transform = 'scale(1,0)';
            }
        });
    };

    const updateHeaderVisibility = () => {
        if (selectedContainer.children.length > 0) {
            selectedHeader.style.display = 'block';
            listHeader.style.display = 'block';
            selectedContainer.style.display = 'block';
        } else {
            selectedHeader.style.display = 'none';
            listHeader.style.display = 'none';
            selectedContainer.style.display = 'none';
        }
    };



    filterEl.addEventListener('keyup', () => {
        handler(filterEl.value);
        updateHeaderVisibility();
    });

});
