document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const motoId = urlParams.get('id');
    const sucursal = urlParams.get('sucursal') || '5000'; // Por defecto, usar sucursal 1

    fetch(`http://localhost:${sucursal}/motos/${motoId}`)
        .then(response => response.json())
        .then(moto => {
            document.getElementById('moto-image').src = `data:image/jpeg;base64,${moto.foto}`;
            document.getElementById('moto-model').textContent = moto.modelo;
            document.getElementById('moto-brand').textContent = moto.marca;
            document.getElementById('moto-type').textContent = moto.tipo_moto;
            document.getElementById('moto-price').textContent = `$${moto.precio}`;
            document.getElementById('moto-serie').textContent = moto.n_serie;
            document.getElementById('moto-cilindraje').textContent = moto.cilindraje;
            document.getElementById('moto-potencia').textContent = moto.potencia_hp;
            document.getElementById('moto-maxima').textContent = moto.velocidad_maxima;
            document.getElementById('moto-ano').textContent = moto.ano;
            document.getElementById('moto-peso').textContent = moto.peso;
        })
        .catch(error => {
            console.error('Error al obtener los detalles de la moto:', error);
        });
});
