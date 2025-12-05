# app.py
from flask import Flask, render_template, request, jsonify
import hashlib
import os
from datetime import datetime

app = Flask(__name__)

def generar_hash(ruta_temporal, algoritmo='sha256'):
    hash_obj = hashlib.new(algoritmo)
    with open(ruta_temporal, 'rb') as f:
        for bloque in iter(lambda: f.read(4096), b""):
            hash_obj.update(bloque)
    return hash_obj.hexdigest()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/certificar', methods=['POST'])
def certificar():
    archivo = request.files['archivo']
    propietario = request.form.get('propietario', 'Usuario')
    
    # Guardar temporalmente
    ruta_temp = os.path.join('/tmp', archivo.filename)
    archivo.save(ruta_temp)
    
    # Generar hashes
    hashes = {
        'sha256': generar_hash(ruta_temp, 'sha256'),
        'sha1': generar_hash(ruta_temp, 'sha1'),
        'md5': generar_hash(ruta_temp, 'md5')
    }
    
    os.remove(ruta_temp)  # Limpiar
    
    return jsonify({
        'nombre_archivo': archivo.filename,
        'propietario': propietario,
        'fecha_certificacion': datetime.now().isoformat(),
        'hashes': hashes
    })

if __name__ == '__main__':
    app.run(debug=True)