// Importaciones y Configuraciones
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();  
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de CORS
app.use(cors({
    origin: ['http://127.0.0.1:81', 'http://localhost:81'],
    credentials: true
}));

// Configuración de la sesión
app.use(session({
    secret: 'secreto_super_seguro',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Configuración del transporte de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kuattrodistribuciones@gmail.com',
        pass: 'rgne rhso xlkk fltf' // ¡No compartas tu contraseña real en repositorios públicos!
    }
});

// Conexión a MySQL con Pool de Conexiones
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pgrrhh',
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
});

// Verificación de conexión
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error al conectar con la base de datos:', err);
    } else {
        console.log('✅ Conexión exitosa a la base de datos');
        connection.release(); // Libera la conexión después de verificarla
    }
});

// 🔹 Función para registrar eventos en la bitácora
function registrarEvento(id_usuario, id_objeto, accion, descripcion) {
    console.log(`📌 Registrando evento: ${accion} - ${descripcion}`);

    const query = `INSERT INTO tbl_bitacora (id_usuario, id_objeto, acciones, descripcion, fecha) VALUES (?, ?, ?, ?, NOW())`;

    db.query(query, [id_usuario, id_objeto, accion, descripcion], (error) => {
        if (error) {
            console.error('❌ Error al registrar evento en la bitácora:', error);
        } else {
            console.log(`✅ Evento registrado en la bitácora: ${accion} - ${descripcion}`);
        }
    });
}

// Ruta para verificar el código 2FA
app.post('/verificar-codigo', (req, res) => {
    const { codigo } = req.body;

    if (!codigo || codigo != req.session.verificationCode) {
        return res.status(400).json({ mensaje: 'Código incorrecto' });
    }

    req.session.verificationCode = null;
    return res.json({ mensaje: 'Verificación exitosa', redirigir: '/inicio.html' });
    
});



// Ruta para verificar el estado del usuario por su correo
app.post('/verificar-estado', (req, res) => {
    const { email } = req.body;

    // Consulta para obtener el id_estado_usuario del usuario por su correo
    const query = 'SELECT id_estado_usuario FROM tbl_usuario WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error en la base de datos.' });
        }

        if (results.length > 0) {
            const estadoUsuario = results[0].id_estado_usuario;
            return res.status(200).json({ id_estado_usuario: estadoUsuario });
        } else {
            return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
        }
    });
});

// Ruta para actualizar el estado del usuario
app.post('/actualizar-estado-usuario', (req, res) => {
    const { email, id_estado_usuario } = req.body;

    // Actualizar el estado del usuario en la base de datos
    const query = 'UPDATE tbl_usuario SET id_estado_usuario = ? WHERE email = ?';
    db.query(query, [id_estado_usuario, email], (err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error en la base de datos.' });
        }

        if (results.affectedRows > 0) {
            return res.status(200).json({ mensaje: 'Estado actualizado exitosamente.' });
        } else {
            return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
        }
    });
});

// Ruta para solicitar recuperación de contraseña
app.post('/recuperar-password', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ mensaje: 'El correo es obligatorio' });
    }

    db.query('SELECT * FROM tbl_usuario WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('❌ Error en la consulta SQL:', err);
            return res.status(500).json({ mensaje: 'Error en el servidor' });
        }

        if (results.length === 0) {
            console.log('❌ Correo no encontrado:', email);
            return res.status(400).json({ mensaje: 'Correo no registrado' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);

        db.query('INSERT INTO tbl_otp (otp) VALUES (?)', [otp], (err) => {
            if (err) {
                console.error('❌ Error guardando OTP:', err);
                return res.status(500).json({ mensaje: 'Error en el servidor' });
            }

           const mailOptions = {
                from: 'kuattrodistribuciones@gmail.com',
                to: email,
                subject: 'Código OTP para Recuperación de Contraseña',
                text: `Hola, 
Tu código OTP para recuperar tu contraseña es: ${otp}.
Si no solicitaste este código, ignora este correo.
[KuattrioDistribuciones]`,
                html: `<p>Hola,</p><p>Tu código OTP para recuperar la contraseña es: <strong>${otp}</strong>.</p><p>Si no solicitaste este código, ignora este correo.<p><br><p>[KuattroDistribuciones]<p>`

            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('❌ Error enviando correo:', error);
                    return res.status(500).json({ mensaje: 'Error enviando OTP' });
                }
                console.log('📧 OTP enviado a:', email);
                return res.json({ mensaje: 'OTP enviado exitosamente', redirigir: '/verificar-otp.html' });
            });
        });
    });
});


// Ruta para verificar el OTP
app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    db.query('SELECT * FROM tbl_otp WHERE otp = ?', [otp], (err, results) => {
        if (err) {
            console.error('❌ Error en la consulta SQL:', err);
            return res.status(500).json({ mensaje: 'Error en el servidor' });
        }

        if (results.length === 0) {
            console.log('❌ OTP incorrecto:', otp);
            return res.status(400).json({ mensaje: 'Código incorrecto' });
        }

        // Si el OTP es correcto, puedes eliminarlo de la base de datos (opcional)
        db.query('DELETE FROM tbl_otp WHERE otp = ?', [otp], (err) => {
            if (err) {
                console.error('❌ Error eliminando OTP:', err);
            }
        });

        return res.json({ mensaje: 'Código correcto', redirigir: '/cambiarcontraseñarecu.html' });
    });
});



//Ruta para cambiar contraseña
app.post('/cambiar-password', (req, res) => {

    const bcryptjs = require('bcryptjs'); //Importando el módulo bcryptjs
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ mensaje: 'Faltan datos.' });
    }

    // Actualiza la contraseña en la base de datos
    let passwordHash = bcryptjs.hashSync(newPassword, 10);
    const query = 'UPDATE tbl_usuario SET `contraseña` = ? WHERE `email` = ?';
    db.query(query, [passwordHash, email], (error, results) => {
        if (error) {
            console.error('❌ Error al cambiar la contraseña:', error);
            registrarEvento(null, 'tbl_usuario', 'ERROR_CAMBIO_CONTRASEÑA', `Error al cambiar la contraseña del usuario con correo: ${email}`);
            return res.status(500).json({ mensaje: 'Error del servidor.' });
        }

        registrarEvento(null, 'tbl_usuario', 'CAMBIO_CONTRASEÑA', `Se cambió la contraseña del usuario con correo: ${email}`);
        res.json({ mensaje: 'Contraseña cambiada exitosamente.', redirigir: 'login.html' });
    });
});


app.post('/guardar_empleado', (req, res) => {
    const { 
        primer_nombre, 
        segundo_nombre, 
        primer_apellido, 
        segundo_apellido, 
        dni_empleado, 
        fecha_nacimiento, 
        fecha_contratacion, 
        cod_empleado,
        numero_telefono,
        id_tipo_telefono
    } = req.body;

    if (!primer_nombre || !primer_apellido || !dni_empleado || !fecha_nacimiento || !fecha_contratacion || !cod_empleado || !numero_telefono || !id_tipo_telefono) {
        return res.status(400).json({ message: 'Todos los campos obligatorios deben estar llenos.' });
    }

    // Primero, insertamos el empleado en la tabla tbl_empleado
    const empleadoSql = `INSERT INTO tbl_empleado (primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, dni_empleado, fecha_nacimiento, fecha_contratacion, cod_empleado)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(empleadoSql, [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, dni_empleado, fecha_nacimiento, fecha_contratacion, cod_empleado], (err, result) => {
        if (err) {
            console.error('❌ Error al guardar empleado:', err);
            registrarEvento(null, 'tbl_empleado', 'ERROR_CREACION_EMPLEADO', `Error al crear empleado con DNI: ${dni_empleado}`);
            return res.status(500).json({ message: 'Error al guardar el empleado' });
        }

        const idEmpleado = result.insertId;  // Obtener el ID del empleado recién insertado

        // Ahora insertamos el teléfono en la tabla tbl_telefono
        const telefonoSql = `INSERT INTO tbl_telefono (numero_telefono, id_tipo_telefono, cod_empleado)
                             VALUES (?, ?, ?)`;

        db.query(telefonoSql, [numero_telefono, id_tipo_telefono, cod_empleado], (err, result) => {
            if (err) {
                console.error('❌ Error al guardar teléfono:', err);
                registrarEvento(idEmpleado, 'tbl_telefono', 'ERROR_CREACION_TELEFONO', `Error al crear teléfono para el empleado con DNI: ${dni_empleado}`);
                return res.status(500).json({ message: 'Error al guardar el teléfono' });
            }

            // Si todo fue exitoso
            console.log('✅ Empleado y teléfono guardados:', result);
            registrarEvento(idEmpleado, 'tbl_empleado', 'CREACION_EMPLEADO', `Empleado creado exitosamente con DNI: ${dni_empleado}`);
            registrarEvento(idEmpleado, 'tbl_telefono', 'CREACION_TELEFONO', `Teléfono creado exitosamente para el empleado con DNI: ${dni_empleado}`);
            return res.json({ message: 'Empleado creado exitosamente' });
        });
    });
});


// AUTOREGISTRO
const bcryptjs = require('bcryptjs'); //Importando el módulo bcryptjs

// Verificar si existe el numero de identidad
app.get('/existencia_empl/:dni_empleado', (req, res) => {
    const dni_empleado = req.params.dni_empleado;
   
    db.execute('SELECT cod_empleado, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido FROM tbl_empleado WHERE dni_empleado = ?', [req.params.dni_empleado], (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results[0] || null);
            console.log(1);
        }
    });
});

// Verificar si ya existe un usuario relacionado con ese numero de identidad
app.get('/existencia_usua/:cod_empleado', (req, res) => {
    const cod_empleado = req.params.cod_empleado;
   
    db.execute('SELECT nomb_usuario FROM tbl_usuario WHERE cod_empleado = ?', [req.params.cod_empleado], (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results[0] || null);
            console.log(1);
        }
    });
});

// Verificar si ya existe el nombre de usuario
app.get('/existencia_nomb_usua', (req, res) => {
    db.query('SELECT nomb_usuario FROM tbl_usuario', (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});


// Obtener todos los usuarios con información de empleado para la tabla dinámica
app.get('/usuarios', (req, res) => {
    const query = `
        SELECT 
            u.id_usuario, 
            e.dni_empleado,
            e.primer_nombre, 
            e.primer_apellido, 
            u.nomb_usuario, 
            u.email
        FROM tbl_usuario u
        JOIN tbl_empleado e ON u.cod_empleado = e.cod_empleado
        ORDER BY e.primer_nombre;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Error al obtener usuarios:', err);
            return res.status(500).json({ mensaje: 'Error al obtener usuarios' });
        }
        res.json(results);
    });
});


// Crear un usuario
app.post('/crear_usua', (req, res) => {
    const { nomb_usuario, contraseña, cod_empleado, id_estado_usuario, tipo_registro, correo } = req.body;
    let passwordHash = bcryptjs.hashSync(contraseña, 10);

    db.query('INSERT INTO tbl_usuario (nomb_usuario, contraseña, cod_empleado, id_estado_usuario, tipo_registro, email) VALUES (?, ?, ?, ?, ?, ?)', 
    [nomb_usuario, passwordHash, cod_empleado, id_estado_usuario, tipo_registro, correo], 
    (err, result) => {
        if (err) {
            console.error('❌ Error al crear usuario:', err);
            registrarEvento(null, 'tbl_usuario', 'ERROR_CREACION_USUARIO', `Error al crear usuario: ${nomb_usuario}`);
            return res.status(500).send(err);
        } else {
            console.log('✅ Usuario creado:', nomb_usuario);
            registrarEvento(result.insertId, 'tbl_usuario', 'CREACION_USUARIO', `Usuario ${nomb_usuario} creado exitosamente.`);
            return res.json({ id: result.insertId });
        }
    });
});

app.get('/usuario/:id', (req, res) => {
    const { id } = req.params;

    const query = `
        SELECT nomb_usuario, email
        FROM tbl_usuario
        WHERE id_usuario = ?
    `;

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener el usuario:', err);
            res.status(500).json({ error: 'Error al obtener el usuario' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Usuario no encontrado' });
        } else {
            res.json(results[0]); // Devuelve el primer resultado
        }
    });
});


//ver usuario
app.get('/verusuario/:id', (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT 
            e.cod_empleado,
            Primer_nombre,
            segundo_nombre,
            primer_apellido,
            segundo_apellido,
            dni_empleado,
            fecha_nacimiento,
            fecha_contratacion,
            nombre_genero,
            nombre_area,
            nombre_sucursal
        FROM tbl_usuario
        JOIN tbl_empleado e ON tbl_usuario.cod_empleado = e.cod_empleado
JOIN tbl_genero ON e.id_genero = tbl_genero.id_genero
JOIN tbl_area_trabajo ON e.id_area = tbl_area_trabajo.id_area
JOIN tbl_sucursal ON e.id_sucursal = tbl_sucursal.id_sucursal
        WHERE id_usuario = ?
    `;

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener los detalles del usuario:', err);
            return res.status(500).json({ message: 'Error al obtener los detalles del usuario' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(results[0]); // Devuelve el primer resultado
    });
});


// Actualizar un usuario
app.put('/actualizar_usuario/:id', (req, res) => {
    const { id } = req.params;
    const { nomb_usuario, email } = req.body;

    if (!nomb_usuario || !email) {
        return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    const query = `
        UPDATE tbl_usuario
        SET nomb_usuario = ?, email = ?
        WHERE id_usuario = ?
    `;

    db.query(query, [nomb_usuario, email, id], (err, results) => {
        if (err) {
            
           return res.status(500).json({ message: 'Error al actualizar el usuario' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario actualizado correctamente' });
    });
});
// Eliminar un usuario
app.delete('/eliminar_usuario_completo/:id', (req, res) => {
    const id = req.params.id;

    // Eliminar primero registros de bitácora del usuario
    const eliminarBitacora = 'DELETE FROM tbl_bitacora WHERE id_usuario = ?';
    const eliminarUsuario = 'DELETE FROM tbl_usuario WHERE Id_Usuario = ?';

    db.query(eliminarBitacora, [id], (err) => {
        if (err) {
            console.error("❌ Error al eliminar bitácora:", err);
            return res.status(500).json({ mensaje: 'Error al eliminar bitácora del usuario' });
        }

        // Luego eliminamos al usuario
        db.query(eliminarUsuario, [id], (err2) => {
            if (err2) {
                console.error("❌ Error al eliminar usuario:", err2);
                return res.status(500).json({ mensaje: 'Error al eliminar usuario' });
            }

            res.status(200).json({ mensaje: 'Usuario y su historial eliminados correctamente' });
        });
    });
})





// Ruta para obtener todos los empleados
app.get('/obtener_empleados', async (req, res) => {
    try {
        const empleadosQuery = `
            SELECT 
                e.cod_empleado, e.dni_empleado, e.Primer_nombre, e.segundo_nombre, 
                e.primer_apellido, e.segundo_apellido, e.fecha_nacimiento, e.fecha_contratacion,
                a.nombre_area, g.nombre_genero, s.nombre_sucursal, c.nombre_cargo, t.numero_telefono
            FROM tbl_empleado e
            LEFT JOIN tbl_area_trabajo a ON e.Id_area = a.Id_area
            LEFT JOIN tbl_genero g ON e.Id_genero = g.Id_genero
            LEFT JOIN tbl_sucursal s ON e.Id_sucursal = s.Id_sucursal
            LEFT JOIN tbl_cargo c ON e.Id_cargo = c.Id_cargo
            LEFT JOIN tbl_telefono t ON e.cod_empleado = t.cod_empleado
        `;
        const [empleados] = await db.promise().query(empleadosQuery);
        res.json(empleados);
    } catch (error) {
        console.error('Error al obtener empleados:', error);
        res.status(500).json({ message: 'Error al obtener empleados' });
    }
});

// Ruta para obtener un empleado específico por su id
app.get('/empleado/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const empleadoQuery = `
            SELECT 
                e.cod_empleado, e.dni_empleado, e.Primer_nombre, e.segundo_nombre, 
                e.primer_apellido, e.segundo_apellido, e.fecha_nacimiento, e.fecha_contratacion,
                a.nombre_area, g.nombre_genero, s.nombre_sucursal, c.nombre_cargo, t.numero_telefono
            FROM tbl_empleado e
            LEFT JOIN tbl_area_trabajo a ON e.Id_area = a.Id_area
            LEFT JOIN tbl_genero g ON e.Id_genero = g.Id_genero
            LEFT JOIN tbl_sucursal s ON e.Id_sucursal = s.Id_sucursal
            LEFT JOIN tbl_cargo c ON e.Id_cargo = c.Id_cargo
            LEFT JOIN tbl_telefono t ON e.cod_empleado = t.cod_empleado
            WHERE e.cod_empleado = ?;
        `;
        const [empleado] = await db.promise().query(empleadoQuery, [id]);
        
        if (empleado.length === 0) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }

        res.json(empleado[0]);
    } catch (error) {
        console.error('Error al obtener el empleado:', error);
        res.status(500).json({ message: 'Error al obtener el empleado' });
    }
});

// Ruta para eliminar un empleado
app.delete('/empleado/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.promise().query('DELETE FROM tbl_empleado WHERE cod_empleado = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }

        res.status(200).json({ message: 'Empleado eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el empleado:', error);
        res.status(500).json({ message: 'Error al eliminar el empleado' });
    }
});

// Ruta para actualizar un empleado
app.put('/empleado/:id', async (req, res) => {
    const { id } = req.params;
    const { Primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, dni_empleado, fecha_nacimiento, fecha_contratacion, Id_area, Id_genero, Id_sucursal, Id_cargo, numero_telefono } = req.body;

    try {
        // Actualización de los datos del empleado en tbl_empleado
        const updateEmpleadoQuery = `
            UPDATE tbl_empleado
            SET 
                Primer_nombre = ?, segundo_nombre = ?, primer_apellido = ?, segundo_apellido = ?, 
                dni_empleado = ?, fecha_nacimiento = ?, fecha_contratacion = ?, 
                Id_area = ?, Id_genero = ?, Id_sucursal = ?, Id_cargo = ?
            WHERE cod_empleado = ?;
        `;
        const resultEmpleado = await db.promise().query(updateEmpleadoQuery, [Primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, dni_empleado, fecha_nacimiento, fecha_contratacion, Id_area, Id_genero, Id_sucursal, Id_cargo, id]);

        if (resultEmpleado.affectedRows === 0) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }

        // Actualización del teléfono en tbl_telefono
        const updateTelefonoQuery = `
            UPDATE tbl_telefono
            SET numero_telefono = ?
            WHERE cod_empleado = ?;
        `;
        const resultTelefono = await db.promise().query(updateTelefonoQuery, [numero_telefono, id]);

        if (resultTelefono.affectedRows === 0) {
            return res.status(404).json({ message: 'Teléfono no encontrado para el empleado' });
        }

        res.json({ message: 'Empleado y teléfono actualizados correctamente' });
    } catch (error) {
        console.error('Error al actualizar el empleado o teléfono:', error);
        res.status(500).json({ message: 'Error al actualizar el empleado o teléfono' });
    }
});

// Ruta para obtener los datos del formulario de editar empleado (en caso de que los necesites en el frontend)
app.get('/empleado/editar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const empleadoQuery = `
            SELECT 
                e.cod_empleado, e.dni_empleado, e.Primer_nombre, e.segundo_nombre, 
                e.primer_apellido, e.segundo_apellido, e.fecha_nacimiento, e.fecha_contratacion,
                e.Id_area, e.Id_genero, e.Id_sucursal, e.Id_cargo
            FROM tbl_empleado e
            WHERE e.cod_empleado = ?;
        `;
        const [empleado] = await db.promise().query(empleadoQuery, [id]);
        
        if (empleado.length === 0) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }

        res.json(empleado[0]);
    } catch (error) {
        console.error('Error al obtener datos del empleado para editar:', error);
        res.status(500).json({ message: 'Error al obtener datos del empleado' });
    }
});


// Ruta para obtener áreas
app.get('/areas', async (req, res) => {
    try {
        const areasQuery = 'SELECT Id_area, nombre_area FROM tbl_area_trabajo';
        const [areas] = await db.promise().query(areasQuery);
        res.json(areas);
    } catch (error) {
        console.error('Error al obtener áreas:', error);
        res.status(500).json({ message: 'Error al obtener áreas' });
    }
});

// Ruta para obtener géneros
app.get('/generos', async (req, res) => {
    try {
        const generosQuery = 'SELECT Id_genero, nombre_genero FROM tbl_genero';
        const [generos] = await db.promise().query(generosQuery);
        res.json(generos);
    } catch (error) {
        console.error('Error al obtener géneros:', error);
        res.status(500).json({ message: 'Error al obtener géneros' });
    }
});

// Ruta para obtener sucursales
app.get('/sucursales', async (req, res) => {
    try {
        const sucursalesQuery = 'SELECT Id_sucursal, nombre_sucursal FROM tbl_sucursal';
        const [sucursales] = await db.promise().query(sucursalesQuery);
        res.json(sucursales);
    } catch (error) {
        console.error('Error al obtener sucursales:', error);
        res.status(500).json({ message: 'Error al obtener sucursales' });
    }
});


// CAMBIAR CONTRASEÑA
// Verificar si la contraseña actual es igual a la contraseña almacenada
app.post('/verificar_contra', (req, res) => {
    const { contraActual } = req.body;
   
    db.execute('SELECT contraseña FROM tbl_usuario WHERE nomb_usuario = ?', [login_nomb_usuario], (err, results) => {
        if (err) {
            res.status(500).send(err);
        } 

        const contraAlmacenada = results[0].contraseña;

        bcryptjs.compare(contraActual, contraAlmacenada, (err, result) => {
            if (err) {
                res.status(500).send(err);
            }
    
            if (result) {
                // La contraseña es correcta
                res.json(true);
            } else {
                // La contraseña es incorrecta
                res.json(false);
            }
        });
    });
});

//  Actualizar el cambio de contraseña
app.put('/cambiar_contra', (req, res) => {
    const { contraseña } = req.body;
    let passwordHash = bcryptjs.hashSync(contraseña, 10);

    db.query('UPDATE tbl_usuario SET contraseña = ? WHERE nomb_usuario = ?', [passwordHash, login_nomb_usuario], (err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json('Actualizado');
        }
    });
});



// Rutas de autenticación
let login_nomb_usuario = 0;
app.post('/login', (req, res) => {
    const { nomb_usuario, contraseña } = req.body;
    if (!nomb_usuario || !contraseña) {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }
    login_nomb_usuario = nomb_usuario;

    db.query('SELECT valor_parametro FROM tbl_parametros WHERE nombre_parametro = "ADMIN_INTENTOS"', (err, results) => {
        if (err || results.length === 0) {
            console.error('❌ Error al obtener configuración:', err);
            return res.status(500).json({ mensaje: 'Error al obtener configuración' });
        }

        const inten = results[0].valor_parametro;

        db.query('SELECT * FROM tbl_usuario WHERE nomb_usuario = ?', [nomb_usuario], (err, results) => {
            if (err) {
                console.error('❌ Error en la consulta de usuario:', err);
                return res.status(500).json({ mensaje: 'Error en la consulta de usuario' });
            }
            if (results.length === 0) {
                return res.status(400).json({ mensaje: 'Usuario o contraseña incorrectos' });
            } else {
                const user = results[0];
                if (user.Tipo_registro === 0) {
                    return res.json({ mensaje: 'Se solicita cambio de contraseña', redirigir: '/cambiarcontraseña.html' });
                }

                bcrypt.compare(contraseña, user.contraseña, (err, result) => {
                    if (err) {
                        console.error('❌ Error en la verificación de contraseña:', err);
                        return res.status(500).json({ mensaje: 'Error en la verificación de la contraseña' });
                    }
                    if (!result) {
                        db.query('UPDATE tbl_usuario SET intentos_fallidos = intentos_fallidos + 1 WHERE nomb_usuario = ?', [nomb_usuario], (err) => {
                            if (err) {
                                console.error('❌ Error al actualizar intentos:', err);
                                return res.status(500).json({ mensaje: 'Error al actualizar intentos' });
                            }
                            db.query('SELECT intentos_fallidos FROM tbl_usuario WHERE nomb_usuario = ?', [nomb_usuario], (err, results) => {
                                if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
                                const intentos = results[0].intentos_fallidos;
                                console.log(`🔴 Intentos fallidos para ${nomb_usuario}: ${intentos}`);
                                if (intentos >= inten) {
                                    db.query('UPDATE tbl_usuario SET Tipo_registro = 0 WHERE nomb_usuario = ?', [nomb_usuario], (err) => {
                                        if (err) {
                                            console.error('❌ Error al bloquear el usuario:', err);
                                            return res.status(500).json({ mensaje: 'Error al bloquear el usuario' });
                                        }
                                        return res.status(400).json({ mensaje: 'Usuario bloqueado por múltiples intentos fallidos' });
                                    });
                                } else {
                                    return res.status(400).json({ mensaje: `Usuario o contraseña incorrectos. Intento ${intentos} de ${inten}.` });
                                }
                            });
                        });
                    } else {
                        const verificationCode = crypto.randomInt(100000, 999999);
                        req.session.verificationCode = verificationCode;
                        req.session.nomb_usuario = nomb_usuario;
                        req.session.email = user.email;
                        const mailOptions = {
                            from: 'kuattrodistribuciones@gmail.com',
                            to: user.email,
                            subject: 'Código de verificación',
                            text: `Tu código de verificación es: ${verificationCode}`
                        };
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.error('❌ Error enviando código de verificación:', error);
                                return res.status(500).json({ mensaje: 'Error enviando código de verificación' });
                            }
                            db.query('INSERT INTO tbl_otp (otp) VALUES (?)', [verificationCode], (err) => {
                                if (err) {
                                    console.error('❌ Error al guardar el código OTP:', err);
                                    return res.status(500).json({ mensaje: 'Error al guardar el código OTP' });
                                }
                                return res.json({ mensaje: 'Código de verificación enviado', redirigir: 'verificarcodigo.html' });
                            });
                        });
                    }
                });
            }
        });
    });
});

app.post('/verificar-codigo-db', (req, res) => {
    const { codigo } = req.body;
    db.query('SELECT * FROM tbl_otp WHERE otp = ?', [codigo], (err, results) => {
        if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
        if (results.length === 0) return res.status(400).json({ mensaje: 'Código incorrecto' });
        db.query('DELETE FROM tbl_otp WHERE otp = ?', [codigo], (err) => {
            if (err) return res.status(500).json({ mensaje: 'Error al eliminar el código OTP' });
            return res.json({ mensaje: 'Verificación exitosa', redirigir: '/inicio.html' });
        });
    });
});


app.get('/bitacora', (req, res) => {
    let { page, limit } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    let offset = (page - 1) * limit;

    const countQuery = "SELECT COUNT(*) AS total FROM tbl_bitacora";
    const dataQuery = `
        SELECT 
            b.id_bitacora,
            b.fecha,
            u.nomb_usuario AS usuario,
            o.descripcion_objeto AS objeto,
            b.acciones,
            b.descripcion
        FROM tbl_bitacora b
        LEFT JOIN tbl_usuario u ON b.id_usuario = u.id_usuario
        LEFT JOIN tbl_objeto o ON b.id_objeto = o.id_objeto
        ORDER BY b.fecha DESC
        LIMIT ? OFFSET ?;
    `;

    db.query(countQuery, (err, countResults) => {
        if (err) {
            console.error("❌ Error al obtener la cantidad total de registros:", err);
            return res.status(500).json({ mensaje: "Error en el servidor" });
        }

        const totalRecords = countResults[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

        db.query(dataQuery, [limit, offset], (err, results) => {
            if (err) {
                console.error("❌ Error al obtener la bitácora:", err);
                return res.status(500).json({ mensaje: "Error en el servidor" });
            }
            
            res.json({ 
                data: results, 
                page, 
                totalPages, 
                totalRecords 
            });
        });
    });
});


//ROLES Y PERMISOS//

// Obtener todos los roles
app.get('/roles', async (req, res) => {
    try {
        const [roles] = await db.promise().query('SELECT * FROM tbl_rol');
        res.json(roles);
    } catch (error) {
        console.error('Error al obtener roles:', error);
        res.status(500).json({ message: 'Error al obtener roles' });
    }
});

// Obtener un solo rol por ID
app.get('/roles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM tbl_rol WHERE Id_rol = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener el rol:', error);
        res.status(500).json({ error: 'Error al obtener el rol' });
    }
});

// Crear un nuevo rol con sus permisos
app.post('/roles', async (req, res) => {
    const { rol, descripcion, creado_por, permiso_creacion, permiso_eliminacion, permiso_actualizacion, permiso_consultar } = req.body;
    
    console.log("Datos recibidos en /roles:", req.body); // Verifica qué datos llegan

    try {
        const [result] = await db.promise().query(
            "INSERT INTO tbl_rol (rol, descripcion, fecha_creacion, creado_por) VALUES (?, ?, NOW(), ?)", 
            [rol, descripcion, creado_por]
        );

        const idRol = result.insertId;

        await db.promise().query(`
            INSERT INTO tbl_permisos (id_rol, permiso_creacion, permiso_eliminacion, permiso_actualizacion, permiso_consultar)
            VALUES (?, ?, ?, ?, ?)
        `, [idRol, permiso_creacion ? 1 : 0, permiso_eliminacion ? 1 : 0, permiso_actualizacion ? 1 : 0, permiso_consultar ? 1 : 0]);

        res.status(201).json({ message: "Rol y permisos creados correctamente" });
    } catch (error) {
        console.error("Error al crear rol y permisos:", error);
        res.status(500).json({ message: "Error al crear rol y permisos" });
    }
});

// Actualizar un rol
app.put('/roles/:id', async (req, res) => {
    const { id } = req.params;
    const { rol, descripcion, modificado_por } = req.body;

    try {
        const query = `
            UPDATE tbl_rol 
            SET rol = ?, descripcion = ?, fecha_modificacion = NOW(), modificado_por = ? 
            WHERE Id_rol = ?
        `;
        const [result] = await db.promise().query(query, [rol, descripcion, modificado_por, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }

        res.json({ message: 'Rol actualizado con éxito' });
    } catch (error) {
        console.error('Error al actualizar rol:', error);
        res.status(500).json({ message: 'Error al actualizar rol' });
    }
});

// Eliminar un rol y sus permisos
app.delete('/roles/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Primero eliminamos los permisos asociados al rol
        await db.promise().query('DELETE FROM tbl_permisos WHERE id_rol = ?', [id]);

        // Luego eliminamos el rol
        const [result] = await db.promise().query('DELETE FROM tbl_rol WHERE Id_rol = ?', [id]);

        // Verificamos si el rol existía
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }

        res.json({ message: 'Rol y permisos eliminados correctamente' });
    } catch (error) {
        console.error('Error al eliminar rol:', error);
        res.status(500).json({ message: 'Error al eliminar rol' });
    }
});




//Ruta para traer los permisos por rol
app.get("/permisos/rol/:idRol", async (req, res) => {
    const { idRol } = req.params; // Extraemos el idRol correctamente
    try {
        const [permisos] = await db.promise().query(
            `SELECT p.id_permiso,p.permiso_creacion, p.permiso_eliminacion, 
                    p.permiso_actualizacion, p.permiso_consultar 
             FROM tbl_permisos p 
             WHERE p.id_rol = ?`, 
            [idRol]
        );
        res.json(permisos);
    } catch (error) {
        console.error("Error al obtener permisos:", error);
        res.status(500).json({ message: "Error al obtener permisos" });
    }
});



app.put("/permisos/actualizar", async (req, res) => {
    const permisos = req.body;
    console.log("Permisos recibidos en el backend:", permisos); // 👀 Verifica esto en la terminal

    if (!Array.isArray(permisos) || permisos.length === 0) {
        return res.status(400).json({ message: "No se recibieron permisos válidos" });
    }

    try {
        for (let permiso of permisos) {
            await db.promise().query(
                `UPDATE tbl_permisos 
                 SET permiso_creacion = ?, permiso_eliminacion = ?, 
                     permiso_actualizacion = ?, permiso_consultar = ? 
                 WHERE id_permiso = ?`,
                [permiso.permiso_creacion, permiso.permiso_eliminacion, 
                 permiso.permiso_actualizacion, permiso.permiso_consultar, permiso.id_permiso]
            );
        }

        res.json({ message: "Permisos actualizados correctamente" });
    } catch (error) {
        console.error("Error al actualizar permisos:", error);
        res.status(500).json({ message: "Error al actualizar permisos" });
    }
});


// SOLICITUDES
// Mostrar los datos del empleado en la solicitud
app.get('/datos_empleado_solicitud', (req, res) => {

    const querySolicitud = `
        SELECT
            u.id_usuario,
            e.primer_nombre,
            e.segundo_nombre,
            e.primer_apellido,
            e.segundo_apellido,
            e.cod_empleado,
            c.nombre_cargo,
            su.nombre_sucursal
        FROM 
            tbl_usuario u
        INNER JOIN 
            tbl_empleado e ON u.cod_empleado = e.cod_empleado
        LEFT JOIN
            tbl_cargo c ON e.id_cargo = c.id_cargo
        LEFT JOIN
            tbl_sucursal su ON e.id_sucursal = su.id_sucursal
        WHERE
            u.nomb_usuario = ?
    `;

    db.execute(querySolicitud, [login_nomb_usuario], (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results[0]);
            console.log(1);
        }
    });
});

// Mostrar todas las solicitudes del empleado
app.get('/solicitudes', (req, res) => {

    const querySolicitud = `
        SELECT
            so.id_solicitud,
            so.fecha_solicitud,
            so.dias_solicitados,
            es.nombre_estado,
            ts.nombre_tipo_solicitud
        FROM 
            tbl_usuario u
        LEFT JOIN 
            tbl_solicitudes so ON u.id_usuario = so.id_usuario
        LEFT JOIN
            tbl_estado es ON so.id_estado = es.id_estado
        LEFT JOIN
            tbl_tipo_solicitud ts ON so.id_tipo_solicitud = ts.id_tipo_solicitud
        WHERE
            u.nomb_usuario = ?
    `;

    db.execute(querySolicitud, [login_nomb_usuario], (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
            console.log(1);
        }
    });
});

// Mostrar los datos de la solicitud
app.get('/datos_solicitud/:id_solicitud', (req, res) => {
    const { id_solicitud } = req.params;

    const querySolicitud = `
        SELECT
            u.id_usuario,
            e.primer_nombre,
            e.segundo_nombre,
            e.primer_apellido,
            e.segundo_apellido,
            e.cod_empleado,
            c.nombre_cargo,
            su.nombre_sucursal,
            so.id_solicitud,
            so.fecha_solicitud,
            so.fecha_inicio_solicitud,
            so.fecha_final_solicitud,
            so.fecha_regreso,
            so.dias_solicitados,
            so.dias_acumulados,
            so.dias_otorgados,
            so.dias_pendientes,
            so.observaciones_solicitud,
            so.validacion_img,
            es.nombre_estado,
            ts.nombre_tipo_solicitud
        FROM 
            tbl_usuario u
        INNER JOIN 
            tbl_empleado e ON u.cod_empleado = e.cod_empleado
        LEFT JOIN
            tbl_cargo c ON e.id_cargo = c.id_cargo
        LEFT JOIN
            tbl_sucursal su ON e.id_sucursal = su.id_sucursal
        LEFT JOIN 
            tbl_solicitudes so ON u.id_usuario = so.id_usuario
        LEFT JOIN
            tbl_estado es ON so.id_estado = es.id_estado
        LEFT JOIN
            tbl_tipo_solicitud ts ON so.id_tipo_solicitud = ts.id_tipo_solicitud
        WHERE
            u.nomb_usuario = ?
            AND so.id_solicitud = ?
    `;

    db.execute(querySolicitud, [login_nomb_usuario, id_solicitud], (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results[0]);
            console.log(1);
        }
    });
});

// Calcular las vacaciones
app.get('/calculo_dias_acumulados', (req, res) => {

    const queryVacaciones = `
        SELECT
            e.fecha_contratacion
        FROM
            tbl_usuario u
        INNER JOIN
            tbl_empleado e ON u.cod_empleado = e.cod_empleado
        LEFT JOIN
            tbl_solicitudes s ON u.id_usuario = s.id_usuario
        WHERE
            u.nomb_usuario = ?
    `;

    db.execute(queryVacaciones, [login_nomb_usuario], (err, results) => {
        if (err) {
            return res.status(500).send(err); // En caso de error de ejecución SQL
        }
        
        const fechaContratacion = results[0].fecha_contratacion ? new Date(results[0].fecha_contratacion) : new Date();  // Asignar la fecha actual si no hay fecha

        const fechaHoy = new Date(); // Obtenemos la fecha actual como objeto Date

        // Eliminar la hora para solo considerar la fecha
        fechaContratacion.setHours(0, 0, 0, 0);
        fechaHoy.setHours(0, 0, 0, 0);
        
        // Calcular la diferencia en días utilizando la base de 360 días por año
        const diasContratacion = fechaContratacion.getDate();
        const diasHoy = fechaHoy.getDate();
        const mesesContratacion = fechaContratacion.getMonth() + 1; // Los meses empiezan en 0
        const mesesHoy = fechaHoy.getMonth() + 1; // Los meses empiezan en 0
        const anioContratacion = fechaContratacion.getFullYear();
        const anioHoy = fechaHoy.getFullYear();

        // Calcular la diferencia en días según a base 360
        const dias = 1 + (anioHoy - anioContratacion) * 360 + (mesesHoy - mesesContratacion) * 30 + (diasHoy - diasContratacion);

        const anios = parseInt(dias / 360);

        // Calcular días acumulados
        let diasAcumulados = 0;

        if (anios < 1) {
            diasAcumulados = 0;
        } else if (anios >= 1 && anios < 2) {
            diasAcumulados = 10;
        } else if (anios >= 2 && anios < 3) {
            diasAcumulados = 22;
        } else if (anios >= 3 && anios < 4) {
            diasAcumulados = 37;
        }
        else {
            diasAcumulados = 37 + (anios - 3) * 20;
        }

        return res.json({ diasAcumulados });
    });
});

// Obtener suma de los dias acumulados
app.get('/calculo_dias_otorgados', (req, res) => {

    const querySuma = `
        SELECT
            COALESCE(SUM(s.dias_solicitados), 0) AS suma_dias_otorgados
        FROM
            tbl_usuario u
        INNER JOIN
            tbl_solicitudes s ON u.id_usuario = s.id_usuario
        WHERE
            u.nomb_usuario = ?
            AND s.id_estado = 1
    `;
   
    db.execute(querySuma, [login_nomb_usuario], (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results[0]);
            console.log(1);
        }
    });
});

const multer = require('multer');
const fs = require('fs');

// Definir la ubicación y el nombre del archivo a guardar temporalmente
const storage = multer.memoryStorage();  // Usamos memoryStorage para almacenar el archivo en memoria como un buffer

// Usar multer con un campo específico
const upload = multer({ storage: storage }).single('imagen');  // 'imagen' debe coincidir con el campo en el formulario HTML

//Crear la solicitud
app.post('/crear_solicitud', upload, (req, res) => {
    const { fecha_solicitud, fecha_inicio_solicitud, fecha_final_solicitud, fecha_regreso, dias_solicitados, dias_acumulados, dias_otorgados, dias_pendientes, observaciones_solicitud, id_usuario, id_estado, id_tipo_solicitud } = req.body;
    let validacion_img = null;

    // Si se ha subido una imagen, procesarla
    if (req.file) {
        validacion_img = req.file.buffer; // 'req.file.buffer' es el archivo en formato binario (BLOB)
    }

    // Realizar la inserción en la base de datos
    db.query(`INSERT INTO tbl_solicitudes (fecha_solicitud, fecha_inicio_solicitud, fecha_final_solicitud, fecha_regreso, dias_solicitados, dias_acumulados, dias_otorgados, dias_pendientes, observaciones_solicitud, validacion_img, id_usuario, id_estado, id_tipo_solicitud)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [fecha_solicitud, fecha_inicio_solicitud, fecha_final_solicitud, fecha_regreso, dias_solicitados, dias_acumulados, dias_otorgados, dias_pendientes, observaciones_solicitud, validacion_img, id_usuario, id_estado, id_tipo_solicitud],
        (err, result) => {
            if (err) {
                console.log(err); // Log de error
                res.status(500).send('Error al insertar datos');
            } else {
                res.json({ id: result.insertId }); // Respuesta con el id de la nueva solicitud
            }
        });
});

//Eliminar la solicitud
app.delete('/eliminar_solicitud/:id_solicitud', (req, res) => {
    const { id_solicitud } = req.params;
    
    db.query('DELETE FROM tbl_solicitudes WHERE id_solicitud = ?', [id_solicitud], (err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ mensaje: `Solicitud con ID ${id_solicitud} eliminada` });
        }
    });
});

//Actualizar imagen
app.put('/subir_imagen/:id_solicitud', upload, (req, res) => {
    const { id_solicitud } = req.params;
    let validacion_img = null;

    // Si se ha subido una imagen, procesarla
    if (req.file) {
        validacion_img = req.file.buffer; // 'req.file.buffer' es el archivo en formato binario (BLOB)
    }

    // Realizar la inserción en la base de datos
    db.query(`UPDATE tbl_solicitudes SET validacion_img = ? WHERE id_solicitud = ?`, [validacion_img, id_solicitud],
        (err, result) => {
            if (err) {
                console.log(err); // Log de error
                res.status(500).send('Error al insertar datos');
            } else {
                res.json('Actualizada'); 
            }
        });
});

//Datos del dashboard del incio 

app.get('/total-empleados', (req, res) => {
    const query = 'SELECT COUNT(*) AS total FROM tbl_empleado';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ mensaje: 'Error' });
        res.json(results[0]);
    });
});

app.get('/solicitudes-pendientes', (req, res) => {
    const query = `
        SELECT COUNT(*) AS total 
        FROM tbl_solicitudes
        WHERE estado = 'Pendiente';`;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ mensaje: 'Error' });
        res.json(results[0]);
    });
});

app.get('/vacaciones-pendientes', (req, res) => {
    const query = `
        SELECT SUM(dias) AS total
        FROM tbl_solicitudes
        WHERE tipo_solicitud = 'Vacaciones' AND estado = 'Pendiente';`;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ mensaje: 'Error' });
        res.json(results[0]);
    });
});

app.get('/incapacidades-totales', (req, res) => {
    const query = `
        SELECT COUNT(*) AS total
        FROM tbl_solicitudes
        WHERE tipo_solicitud = 'Incapacidad' AND estado = 'Aprobado';`;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ mensaje: 'Error' });
        res.json(results[0]);
    });
});

app.get('/vacaciones-recientes', (req, res) => {
    const query = `
        SELECT s.id_solicitud, CONCAT(e.primer_nombre, ' ', e.primer_apellido) AS empleado, 
               s.fecha_inicio, s.fecha_fin, s.estado
        FROM tbl_solicitudes s
        JOIN tbl_empleado e ON e.cod_empleado = s.cod_empleado
        WHERE s.tipo_solicitud = 'Vacaciones'
        ORDER BY s.fecha_inicio DESC
        LIMIT 5;
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ mensaje: 'Error' });
        res.json(results);
    });
});

app.get('/incapacidades-recientes', (req, res) => {
    const query = `
        SELECT s.id_solicitud, CONCAT(e.primer_nombre, ' ', e.primer_apellido) AS empleado, 
               s.fecha_inicio, s.fecha_fin, s.estado
        FROM tbl_solicitudes s
        JOIN tbl_empleado e ON e.cod_empleado = s.cod_empleado
        WHERE s.tipo_solicitud = 'Incapacidad'
        ORDER BY s.fecha_inicio DESC
        LIMIT 5;
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ mensaje: 'Error' });
        res.json(results);
    });
});

// Verifica si un usuario tiene registros en la bitácora
app.get('/verificar-usuario-bitacora/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT COUNT(*) AS referencias FROM tbl_bitacora WHERE id_usuario = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("❌ Error al verificar referencias:", err);
            return res.status(500).json({ error: "Error al verificar referencias" });
        }
        res.json(result[0]); // Devuelve { referencias: número }
    });
});


//Parametros
app.get('/parametros', (req, res) => {
    db.query('SELECT id_parametro, nombre_parametro, valor_parametro FROM tbl_parametros', (err, resultados) => {
        if (err) {
            console.error('❌ Error en la consulta:', err);
            return res.status(500).json({ error: 'Error al obtener los parámetros' });
        }
        console.log('📡 Enviando datos a la web:', resultados);
        res.json(resultados);
    });
});

// Añadir un nuevo parámetro
app.post('/parametros', (req, res) => {
    const { nombre, valor } = req.body;

    if (!nombre || !valor) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const sql = 'INSERT INTO tbl_parametros (nombre_parametro, valor_parametro) VALUES (?, ?)';
    db.query(sql, [nombre.toUpperCase(), valor.toUpperCase()], (err) => {
        if (err) {
            console.error('❌ Error al agregar el parámetro:', err);
            return res.status(500).json({ error: 'Error al agregar el parámetro' });
        }
        res.status(201).send('Parámetro agregado');
    });
});

// Actualizar un parámetro
app.put('/parametros/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, valor } = req.body;

    db.query('UPDATE tbl_parametros SET nombre_parametro = ?, valor_parametro = ? WHERE id_parametro = ?', 
    [nombre.toUpperCase(), valor.toUpperCase(), id], 
    (err) => {
        if (err) {
            console.error('Error al actualizar el parámetro:', err);
            return res.status(500).send({ error: 'Error al actualizar el parámetro' });
        }
        res.send('Parámetro actualizado');
    });
});

// Eliminar un parámetro
app.delete('/parametros/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM tbl_parametros WHERE id_parametro = ?', [id], (err) => {
        if (err) {
            console.error('Error al eliminar el parámetro:', err);
            return res.status(500).send({ error: 'Error al eliminar el parámetro' });
        }
        res.send('Parámetro eliminado');
    });
});



// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
