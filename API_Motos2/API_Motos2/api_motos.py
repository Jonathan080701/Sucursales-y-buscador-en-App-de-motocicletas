from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import base64

app = Flask(__name__)
CORS(app)

def create_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='bd_motos2',
            user='root',
            password=''
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error: {e}")
        return None

@app.route('/motos', methods=['GET'])
def get_motos():
    connection = create_connection()
    if connection is None:
        return jsonify({'message': 'Error de conexión a la base de datos'}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM motos")
        motos = cursor.fetchall()
        for moto in motos:
            for key, value in moto.items():
                if isinstance(value, bytes):
                    moto[key] = base64.b64encode(value).decode('utf-8')
    except Error as e:
        return jsonify({'message': f'Error: {e}'}), 500
    finally:
        cursor.close()
        connection.close()

    return jsonify(motos), 200

@app.route('/motos/<int:id_moto>', methods=['GET'])
def get_moto_by_id(id_moto):
    connection = create_connection()
    if connection is None:
        return jsonify({'message': 'Error de conexión a la base de datos'}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM motos WHERE id_moto = %s", (id_moto,))
        moto = cursor.fetchone()
        if moto:
            for key, value in moto.items():
                if isinstance(value, bytes):
                    moto[key] = base64.b64encode(value).decode('utf-8')
    except Error as e:
        return jsonify({'message': f'Error: {e}'}), 500
    finally:
        cursor.close()
        connection.close()

    if moto:
        return jsonify(moto), 200
    else:
        return jsonify({'message': 'Moto no encontrada'}), 404

@app.route('/motos', methods=['POST'])
def create_moto():
    data = request.get_json()
    connection = create_connection()
    if connection is None:
        return jsonify({'message': 'Error de conexión a la base de datos'}), 500

    # Debugging: Print the received data
    print(data)

    try:
        cursor = connection.cursor()
        sql = """INSERT INTO motos (tipo_moto, modelo, marca, n_serie, cilindraje, 
                potencia_hp, velocidad_maxima, ano, peso, precio, foto) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
        values = (
            data['tipo_moto'], data['modelo'], data['marca'], data['n_serie'], 
            data['cilindraje'], data['potencia_hp'], data['velocidad_maxima'], 
            data['ano'], data['peso'], data['precio'], 
            base64.b64decode(data['foto']) if data['foto'] else None
        )
        cursor.execute(sql, values)
        connection.commit()
        moto_id = cursor.lastrowid  # Obtener el ID del último insert
    except Error as e:
        if e.errno == 1062:
            return jsonify({'message': 'El número de serie ya está ocupado, ocupa otro N_Serie para esta moto'}), 400
        return jsonify({'message': f'Error: {e}'}), 500
    finally:
        cursor.close()
        connection.close()

    return jsonify({'message': 'Moto agregada correctamente', 'id_moto': moto_id}), 201


@app.route('/motos/<int:id_moto>', methods=['PUT'])
def update_moto(id_moto):
    data = request.get_json()
    connection = create_connection()
    if connection is None:
        return jsonify({'message': 'Error de conexión a la base de datos'}), 500

    # Debugging: Print the received data
    print(data)

    try:
        cursor = connection.cursor()

        # Check if the foto field is present and not None
        foto_data = base64.b64decode(data['foto']) if 'foto' in data and data['foto'] else None

        sql = """UPDATE motos SET tipo_moto = %s, modelo = %s, marca = %s, n_serie = %s, cilindraje = %s, 
                potencia_hp = %s, velocidad_maxima = %s, ano = %s, peso = %s, precio = %s, foto = %s 
                WHERE id_moto = %s"""
        values = (
            data['tipo_moto'], data['modelo'], data['marca'], data['n_serie'], data['cilindraje'], 
            data['potencia_hp'], data['velocidad_maxima'], data['ano'], 
            data['peso'], data['precio'], foto_data, id_moto
        )
        cursor.execute(sql, values)
        connection.commit()
    except Error as e:
        return jsonify({'message': f'Error: {e}'}), 500
    finally:
        cursor.close()
        connection.close()

    return jsonify({'message': 'Moto actualizada correctamente'}), 200


@app.route('/motos/<int:id_moto>', methods=['DELETE'])
def delete_moto(id_moto):
    connection = create_connection()
    if connection is None:
        return jsonify({'message': 'Error de conexión a la base de datos'}), 500

    try:
        cursor = connection.cursor()
        cursor.execute("DELETE FROM motos WHERE id_moto = %s", (id_moto,))
        connection.commit()
    except Error as e:
        return jsonify({'message': f'Error: {e}'}), 500
    finally:
        cursor.close()
        connection.close()

    return jsonify({'message': 'Moto eliminada correctamente'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
