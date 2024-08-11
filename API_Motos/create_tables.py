import mysql.connector
from mysql.connector import Error

def create_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='bd_motos',
            user='root',
            password=''
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error: {e}")
        return None

def create_table():
    connection = create_connection()
    if connection is None:
        print('Error de conexión a la base de datos')
        return

    create_motos_table_query = """
    CREATE TABLE IF NOT EXISTS motos (
        id_moto INT PRIMARY KEY AUTO_INCREMENT,
        tipo_moto VARCHAR(30) NOT NULL,
        marca VARCHAR(30) NOT NULL,
        modelo VARCHAR(50) NOT NULL,
        n_serie VARCHAR(50) UNIQUE,
        cilindraje INT(10),
        potencia_hp VARCHAR(30),
        velocidad_maxima VARCHAR(30),
        ano INT(6),
        peso INT(5),
        precio INT(30),
        foto BLOB
    );
    """

    try:
        cursor = connection.cursor()
        cursor.execute(create_motos_table_query)
        connection.commit()
        print("Tabla 'motos' creada exitosamente")
    except Error as e:
        print(f"Error al crear la tabla: {e}")
    finally:
        cursor.close()
        connection.close()

if __name__ == '__main__':
    create_table()
