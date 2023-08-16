document.addEventListener('DOMContentLoaded', () => {
    const filterEl = document.querySelector('#filter');
    const divContainers = Array.from(document.querySelectorAll('.select-item'));

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
    divContainers.forEach(container => {
        const checkbox = container.querySelector('input');
        updateSelectedClass(checkbox);
    });

    // Attach event listener to each checkbox to update the "selected" class
    divContainers.forEach(container => {
        const checkbox = container.querySelector('input');
        checkbox.addEventListener('change', () => {
            updateSelectedClass(checkbox);
            handler(filterEl.value); // Trigger the filter handler after the class update
        });
    });

    // Rest of your existing code
    const labels = divContainers.map(container => container.textContent);

    const handler = value => {
        const matching = labels.map((label, idx) => {
            if (divContainers[idx].querySelector('input').checked) {
                divContainers[idx].classList.add('selected'); // Add the "selected" class
                return true; // Always show checked elements
            } else {
                divContainers[idx].classList.remove('selected'); // Remove the "selected" class
                return label.toLowerCase().includes(value.toLowerCase()) ? idx : null;
            }
        }).filter(el => el !== null);

        divContainers.forEach((container, idx) => {
            if (matching.includes(idx) || container.querySelector('input').checked) {
                container.style.maxHeight = '100px';
            } else {
                container.style.maxHeight = '0px';
            }
        });
    };


    filterEl.addEventListener('keyup', () => handler(filterEl.value));


});


