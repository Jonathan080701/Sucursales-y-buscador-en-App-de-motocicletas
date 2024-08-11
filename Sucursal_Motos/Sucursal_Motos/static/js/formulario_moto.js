document.addEventListener('DOMContentLoaded', function() {
    const sucursalSelect = document.getElementById('sucursal-select');
    const motoForm = document.getElementById('motoForm');
    const params = new URLSearchParams(window.location.search);
    const id_moto = params.get('id_moto');

    // Cargar datos si existe el id_moto
    if (id_moto) {
        // Obtener la sucursal seleccionada
        const sucursal = sucursalSelect.value;

        fetch(`http://localhost:${sucursal}/motos/${id_moto}`)
            .then(response => response.json())
            .then(data => {
                // Valores a los inputs correspondientes
                for (const key in data) {
                    const input = document.querySelector(`[name="${key}"]`);
                    if (input) {
                        if (key === 'foto' && data[key]) {
                            continue; // No llenar el campo de imagen directamente
                        }
                        input.value = data[key];
                    }
                }
                // Mostrar la imagen si está disponible
                if (data.foto) {
                    const img = document.getElementById('foto-preview');
                    img.src = 'data:image/jpeg;base64,' + data.foto;
                    img.style.display = 'block'; // Asegúrate de que la imagen sea visible
                }
            })
            .catch(error => console.error('Error:', error));
    }

    // Evento submit del formulario
    motoForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(motoForm);
        const formObject = Object.fromEntries(formData.entries());

        // Obtener la sucursal seleccionada
        const sucursal = sucursalSelect.value;

        // Obtener el archivo de imagen
        const fileInput = document.getElementById('foto');
        const file = fileInput.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = function() {
                formObject.foto = reader.result.split(',')[1]; // Extraer cadena base64
                sendFormData(formObject, id_moto, sucursal);
            };
            reader.readAsDataURL(file);
        } else {
            if (!id_moto) {
                alert('Por favor, selecciona una imagen para la moto.');
            } else {
                sendFormData(formObject, id_moto, sucursal);
            }
        }
    });

    // Función para enviar datos del formulario al servidor
    function sendFormData(formObject, id_moto, sucursal) {
        fetch(`http://localhost:${sucursal}/motos${id_moto ? '/' + id_moto : ''}`, {
            method: id_moto ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formObject)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.message === 'Moto agregada correctamente' || data.message === 'Moto actualizada correctamente') {
                window.location.href = 'inventario.html';
            }
        })
        .catch(error => console.error('Error:', error));
    }
});

