async function fetchData() {
    try {
      const response = await fetch('data.json');
      const data = await response.json();
      renderGallery(data);
    } catch (error) {
      document.getElementById('gallery').textContent = 'Помилка завантаження даних.';
      console.error('Fetch error:', error);
    }
  }
  
  function renderGallery(data) {
    const galleryDiv = document.getElementById('gallery');
    galleryDiv.textContent = '';
    const structured = {};
  
    for (const path in data) {
      const [brand, model, year, file] = path.split('/');
      if (!structured[brand]) structured[brand] = {};
      if (!structured[brand][model]) structured[brand][model] = {};
      if (!structured[brand][model][year]) structured[brand][model][year] = [];
      structured[brand][model][year].push(data[path]);
    }
  
    function createToggleButton(text) {
      const button = document.createElement('button');
      button.textContent = text;
      button.addEventListener('click', () => {
        const next = button.nextElementSibling;
        next.style.display = next.style.display === 'block' ? 'none' : 'block';
      });
      return button;
    }
  
    for (const brand in structured) {
      const brandDiv = document.createElement('div');
      brandDiv.className = 'brand';
      brandDiv.appendChild(createToggleButton(brand));
  
      const modelContainer = document.createElement('div');
      modelContainer.className = 'model';
  
      for (const model in structured[brand]) {
        const modelDiv = document.createElement('div');
        modelDiv.appendChild(createToggleButton(model));
  
        const yearContainer = document.createElement('div');
        yearContainer.className = 'year';
  
        for (const year in structured[brand][model]) {
          const yearDiv = document.createElement('div');
          yearDiv.appendChild(createToggleButton(year));
  
          const imagesDiv = document.createElement('div');
          imagesDiv.className = 'images';
  
          structured[brand][model][year].forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            imagesDiv.appendChild(img);
          });
  
          yearDiv.appendChild(imagesDiv);
          yearContainer.appendChild(yearDiv);
        }
  
        modelDiv.appendChild(yearContainer);
        modelContainer.appendChild(modelDiv);
      }
  
      brandDiv.appendChild(modelContainer);
      galleryDiv.appendChild(brandDiv);
    }
  }
  
  fetchData();