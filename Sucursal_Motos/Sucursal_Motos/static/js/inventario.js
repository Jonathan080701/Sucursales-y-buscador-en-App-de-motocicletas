document.addEventListener('DOMContentLoaded', function() {
    const sucursalSelect = document.getElementById('sucursal-select');
    
    // Función para cargar el inventario según la sucursal seleccionada
    function cargarInventario(sucursal) {
        fetch(`http://localhost:${sucursal}/motos`)
            .then(response => response.json())
            .then(data => {
                const tableBody = document.querySelector('#inventory-table tbody');
                tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos
                data.forEach(moto => {
                    const row = document.createElement('tr');

                    const idCell = document.createElement('td');
                    idCell.textContent = moto.id_moto;
                    row.appendChild(idCell);

                    const tipoCell = document.createElement('td');
                    tipoCell.textContent = moto.tipo_moto;
                    row.appendChild(tipoCell);

                    const marcaCell = document.createElement('td');
                    marcaCell.textContent = moto.marca;
                    row.appendChild(marcaCell);

                    const modeloCell = document.createElement('td');
                    modeloCell.textContent = moto.modelo;
                    row.appendChild(modeloCell);

                    const nSerieCell = document.createElement('td');
                    nSerieCell.textContent = moto.n_serie;
                    row.appendChild(nSerieCell);

                    const cilindrajeCell = document.createElement('td');
                    cilindrajeCell.textContent = moto.cilindraje;
                    row.appendChild(cilindrajeCell);

                    const potenciaHpCell = document.createElement('td');
                    potenciaHpCell.textContent = moto.potencia_hp;
                    row.appendChild(potenciaHpCell);

                    const velocidadMaximaCell = document.createElement('td');
                    velocidadMaximaCell.textContent = moto.velocidad_maxima;
                    row.appendChild(velocidadMaximaCell);

                    const anoCell = document.createElement('td');
                    anoCell.textContent = moto.ano;
                    row.appendChild(anoCell);

                    const pesoCell = document.createElement('td');
                    pesoCell.textContent = moto.peso;
                    row.appendChild(pesoCell);

                    const precioCell = document.createElement('td');
                    precioCell.textContent = `$${moto.precio}`;
                    row.appendChild(precioCell);

                    const fotoCell = document.createElement('td');
                    if (moto.foto) {
                        const img = document.createElement('img');
                        img.src = 'data:image/jpeg;base64,' + moto.foto;
                        img.style.width = '50px';
                        fotoCell.appendChild(img);
                    }
                    row.appendChild(fotoCell);

                    const actionsCell = document.createElement('td');
                    const editButton = document.createElement('button');
                    editButton.textContent = 'Editar';
                    editButton.addEventListener('click', () => {
                        window.location.href = `editar_moto.html?id_moto=${moto.id_moto}`;
                    });
                    actionsCell.appendChild(editButton);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Eliminar';
                    deleteButton.addEventListener('click', () => {
                        fetch(`http://localhost:${sucursal}/motos/${moto.id_moto}`, {
                            method: 'DELETE'
                        })
                        .then(response => response.json())
                        .then(result => {
                            alert(result.message);
                            row.remove();
                        })
                        .catch(error => console.error('Error:', error));
                    });
                    actionsCell.appendChild(deleteButton);

                    row.appendChild(actionsCell);
                    tableBody.appendChild(row);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Escuchar cambios en la selección de la sucursal
    sucursalSelect.addEventListener('change', function() {
        const sucursal = sucursalSelect.value;
        cargarInventario(sucursal);
    });

    // Cargar inventario al inicio con la primera sucursal por defecto
    cargarInventario(sucursalSelect.value);
});