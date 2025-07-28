# node-mongo-big-file-exercise

Hola! Este es un ejercicio para poner a prueba tus conocimientos de NodeJS y MongoDB. El objetivo es realizar un endpoint que reciba un archivo de ~80mb separado por comas y guarde cada uno de los registros del archivo en la base de datos.

El archivo podés descargarlo de este link:
https://drive.google.com/file/d/1tg8dWr4RD2CeKjEdlZdTT8kLDzfITv_S/view?usp=sharing
(está zippeado para que lo descargues rápido, descomprimilo manualmente)

Se evaluará teniendo en cuenta la prolijidad del código (indentación, comentarios y legibilidad), la performance (tiempo de procesado y memoria utilizada) y escalabilidad (si soporta archivos aún más grandes).

Para simplificarlo, hemos creado este repo starter que se conecta a la base de datos, crea el modelo y expone el endpoint `[POST] /upload` donde tenés que subir el archivo (podés probarlo con Postman). En el archivo `src/controller.js` tenés que ingresar tu código.

## Consideraciones

- Hace un fork de este repo para comenzar, y cuando tengas la solución compartí tu repositorio con quien te solicitó este ejercicio.
- Recordá correr `npm install` o `yarn install` para instalar las dependencias
- Podés usar hasta 1 librería de tu preferencia además de las incluídas.
- En el endpoint `[GET] /records` podés ver los 10 últimos registros que se procesaron.
- El archivo subido se guarda en el directorio `_temp`, recordá eliminarlo luego de utilizarlo.
- Modificá el archivo `.env` para cambiar el puerto y la conexión a la base de datos.

## Postman
En el directorio `postman` del repo, vas a encontrar los dos requests para que puedas importarlos en Postman.

## Solución del Challenge

### Docker

Se creó un archivo `docker-compose.yml` para montar la DB **MongoDB** y un montor gráfico **MongoExpress** en un contenedor. Se agregaron las siguentes variables de entorno en el archivo `.env`.

```
#Docker Compose
# DATABASE MONGODB
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=root
MONGO_PORT=27017

# MONGO EXPRESS
ME_CONFIG_MONGODB_ADMINUSERNAME=root
ME_CONFIG_MONGODB_ADMINPASSWORD=root
ME_CONFIG_MONGODB_URL=mongodb://root:root@mongo:27017/
ME_CONFIG_MONGODB_HOST=8081
```

### Librería: csv-parser

Se instaló la librería `csv-parser` para convertir el archivo CSV en objetos en JavaScript.

### Middlewares

Se crearon 2 middlewares para validar el archivo que se envía en el endpoint `/upload`.

- **validateFile**: para validar que existe un archivo.
- **validateFileType**: para validar que el archivo es de tipo CSV.

### Services

Se crearon 2 servicios para separar las responsabilidades y disminuir dependencias del controller del endpoint `/upload`.

- **csvToArray**: transforma el archivo CSV en un array de objetos en JavaScript por cada registro. Se usa la lectura por `Stream` para leer por porciones el archivo y poder procesarlo de una mejor manera sin sobrecargar la memoria del proceso, gracias a la librería `csv-parser` esas porciones de lectura equivalen a un registro. La función devuelve una promesa para poder manejarla de manera asíncrona en el controller.
- **recordService**: contiene la función **insertMany** para poder insertar varios registros en la DB en la colección `Records`. El objetivo de este servicio sería contener todas las funciones relacionadas con la colección `Records`, aquí también se podría agregar la función de `find` del endpoint `/records`, pero para no salirme del challenge, no lo agregué.

### Controller

Finalmente se aplican los servicios en el controller del endpoint `/upload`. Mediante un bloque `try/catch` se controla cualquier error que pueda surgir. En el caso de ser existoso el proceso se responde con un mensaje de `'File processed successfully'`, en el caso de ocurrir un error se responde con el mensaje de error correspondiende o un génerico `'Internal Error'`. Al finalizar se borra el archivo CSV de la carpeta `_temp`.
