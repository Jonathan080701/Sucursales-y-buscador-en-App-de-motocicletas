document.addEventListener('DOMContentLoaded', function() {
    let motosData = [];

    const sucursalSelect = document.getElementById('sucursal-select');
    const searchInput = document.getElementById('search-input');
    const motosContainer = document.getElementById('motos-container');

    // Función para cargar las motos según la sucursal seleccionada
    function loadMotos(sucursal) {
        fetch(`http://localhost:${sucursal}/motos`)
            .then(response => response.json())
            .then(motos => {
                motosData = motos;
                displayMotos(motosData);
            })
            .catch(error => {
                console.error('Error al obtener los datos:', error);
                motosContainer.innerHTML = '<p>Error al cargar los datos.</p>';
            });
    }

    // Función para mostrar las motos en la página
    function displayMotos(motos) {
        motosContainer.innerHTML = '';

        if (motos.length === 0) {
            motosContainer.innerHTML = '<p>No se encontraron motos que coincidan con tu búsqueda.</p>';
            return;
        }

        motos.forEach(moto => {
            const motoCard = document.createElement('div');
            motoCard.classList.add('card');

            const img = document.createElement('img');
            img.src = `data:image/jpeg;base64,${moto.foto}`;
            motoCard.appendChild(img);

            const model = document.createElement('h3');
            model.textContent = moto.modelo;
            motoCard.appendChild(model);

            const brand = document.createElement('p');
            brand.textContent = `Marca: ${moto.marca}`;
            motoCard.appendChild(brand);

            const type = document.createElement('p');
            type.textContent = `Tipo: ${moto.tipo_moto}`;
            motoCard.appendChild(type);

            const price = document.createElement('p');
            price.classList.add('price');
            price.textContent = `Precio: $${moto.precio}`;
            motoCard.appendChild(price);

            const viewButton = document.createElement('button');
            viewButton.textContent = 'Ver';
            viewButton.addEventListener('click', () => {
                window.location.href = `ver_moto.html?id=${moto.id_moto}&sucursal=${sucursalSelect.value}`;
            });
            motoCard.appendChild(viewButton);

            motoCard.addEventListener('click', () => {
                window.location.href = `ver_moto.html?id=${moto.id_moto}&sucursal=${sucursalSelect.value}`;
            });

            motosContainer.appendChild(motoCard);
        });
    }

    // Manejo del evento de cambio en el select de sucursal
    sucursalSelect.addEventListener('change', function() {
        loadMotos(sucursalSelect.value);
    });

    // Manejo del evento de búsqueda
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredMotos = motosData.filter(moto => 
            moto.modelo.toLowerCase().includes(searchTerm) ||
            moto.tipo_moto.toLowerCase().includes(searchTerm) ||
            moto.marca.toLowerCase().includes(searchTerm)
        );
        displayMotos(filteredMotos);
    });

    // Cargar las motos de la sucursal seleccionada al cargar la página
    loadMotos(sucursalSelect.value);
});
