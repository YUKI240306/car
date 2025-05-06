document.addEventListener('DOMContentLoaded', () => {
    const modelsBlock = document.getElementById('models-block');
    const yearsBlock = document.getElementById('years-block');
    const photoContainer = document.getElementById('photo-container');
    let allCarData = {}; // Store all car data
    let currentBrand = null;

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const brandsSet = new Set();
            const modelsByBrand = {};
            const yearsByBrand = {};
            allCarData = data;

            for (const key in data) {
                const [brand, model, year] = key.split('/');
                brandsSet.add(brand);

                if (!modelsByBrand[brand]) {
                    modelsByBrand[brand] = new Set();
                }
                modelsByBrand[brand].add(model);

                if (!yearsByBrand[brand]) {
                    yearsByBrand[brand] = new Set();
                }
                yearsByBrand[brand].add(year);
            }

            populateButtons('brands-buttons', Array.from(brandsSet), (selectedBrand) => {
                currentBrand = selectedBrand;
                modelsBlock.style.display = 'block';
                yearsBlock.style.display = 'block';
                updateModelButtons(selectedBrand, Array.from(modelsByBrand[selectedBrand] || []));
                updateYearButtons(selectedBrand, Array.from(yearsByBrand[selectedBrand] || []));
                photoContainer.innerHTML = ''; // Clear photo when a new brand is selected
            });

            // Initially, models and years buttons are not populated

            function populateButtons(containerId, items, onClickCallback) {
                const container = document.getElementById(containerId);
                container.innerHTML = ''; // Clear previous buttons
                items.sort().forEach(item => {
                    const button = document.createElement('button');
                    button.textContent = item;
                    button.addEventListener('click', () => onClickCallback(item));
                    container.appendChild(button);
                });
            }

            function updateModelButtons(brand, models) {
                populateButtons('models-buttons', models, (model) => {
                    updatePhoto(brand, model);
                });
            }

            function updateYearButtons(brand, years) {
                populateButtons('years-buttons', years, (year) => {
                    updatePhoto(brand, null, year); // Call updatePhoto with year
                });
            }

            function updatePhoto(brand, model, year) {
                photoContainer.innerHTML = ''; // Clear previous photo
                let found = false;

                for (const key in allCarData) {
                    const [carBrand, carModel, carYear] = key.split('/');
                    if (carBrand === brand &&
                        (model === null || carModel === model) &&
                        (year === null || carYear === year)) {
                        const img = document.createElement('img');
                        img.src = allCarData[key];
                        img.alt = `${carBrand} ${carModel} ${carYear}`;
                        photoContainer.appendChild(img);
                        found = true;
                        // Optionally break here if you only want to show the first match
                    }
                }

                if (!found) {
                    photoContainer.textContent = 'No photo available for this selection.';
                }
            }
        })
        .catch(error => console.error('Error fetching data:', error));
});