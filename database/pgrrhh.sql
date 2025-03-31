-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-03-2025 a las 23:15:32
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `pgrrhh`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_ampliacion_solicitud`
--

CREATE TABLE `tbl_ampliacion_solicitud` (
  `id_ampliacion` int(11) NOT NULL,
  `nombre_ampliacion` varchar(255) NOT NULL,
  `prorroga` int(11) DEFAULT NULL,
  `id_solicitud` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tbl_ampliacion_solicitud`:
--   `id_solicitud`
--       `tbl_solicitudes` -> `id_solicitud`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_area_trabajo`
--

CREATE TABLE `tbl_area_trabajo` (
  `id_area` int(11) NOT NULL,
  `nombre_area` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tbl_area_trabajo`:
--

--
-- Volcado de datos para la tabla `tbl_area_trabajo`
--

INSERT INTO `tbl_area_trabajo` (`id_area`, `nombre_area`) VALUES
(1, 'Administracion'),
(2, 'Ventas'),
(4, 'Operaciones'),
(5, 'Ruteo'),
(6, 'Mercadeo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_bitacora`
--

CREATE TABLE `tbl_bitacora` (
  `id_bitacora` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `id_objeto` int(11) DEFAULT NULL,
  `acciones` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tbl_bitacora`:
--   `id_usuario`
--       `tbl_usuario` -> `Id_Usuario`
--

--
-- Volcado de datos para la tabla `tbl_bitacora`
--

INSERT INTO `tbl_bitacora` (`id_bitacora`, `fecha`, `id_usuario`, `descripcion`, `id_objeto`, `acciones`) VALUES
(1, '2025-02-26', NULL, 'Contraseña incorrecta para usuario: JUAN', 0, 'LOGIN_FALLIDO'),
(2, '2025-02-26', NULL, 'Contraseña incorrecta para usuario: JUAN', 0, 'LOGIN_FALLIDO'),
(3, '2025-03-05', NULL, 'Acceso a /login', 0, 'POST /login'),
(4, '2025-03-05', NULL, 'Intento fallido con usuario: GAGDDG', 0, 'LOGIN_FALLIDO'),
(5, '2025-03-05', NULL, 'Intento fallido con usuario: PEDRO', 0, 'LOGIN_FALLIDO'),
(6, '2025-03-05', NULL, 'Se cambió la contraseña del usuario con correo: carloslopez150744@gmail.com', 0, 'CAMBIO_CONTRASEÑA'),
(7, '2025-03-05', NULL, 'El usuario ADMIN debe cambiar su contraseña.', 0, 'SOLICITUD_CAMBIO_CONTRASEÑA'),
(8, '2025-03-05', 10, 'Usuario CLOPEZ creado exitosamente.', 0, 'CREACION_USUARIO'),
(9, '2025-03-05', NULL, 'Usuario ADMIN inició sesión exitosamente.', 0, 'LOGIN_EXITOSO'),
(10, '2025-03-05', NULL, 'Usuario ADMIN inició sesión exitosamente.', 0, 'LOGIN_EXITOSO'),
(11, '2025-03-05', NULL, 'Usuario ADMIN inició sesión exitosamente.', 0, 'LOGIN_EXITOSO'),
(12, '2025-03-05', NULL, 'Intento fallido con usuario: DDDD', 0, 'LOGIN_FALLIDO'),
(13, '2025-03-05', NULL, 'Intento fallido con usuario: DDDD', 0, 'LOGIN_FALLIDO'),
(14, '2025-03-05', NULL, 'Intento fallido con usuario: DDD', 0, 'LOGIN_FALLIDO'),
(15, '2025-03-05', NULL, 'Usuario ADMIN inició sesión exitosamente.', 0, 'LOGIN_EXITOSO'),
(16, '2025-03-05', NULL, 'Contraseña incorrecta para usuario: ADMIN', 0, 'LOGIN_FALLIDO'),
(17, '2025-03-05', NULL, 'Contraseña incorrecta para usuario: ADMIN', 0, 'LOGIN_FALLIDO'),
(18, '2025-03-05', NULL, 'Contraseña incorrecta para usuario: ADMIN', 0, 'LOGIN_FALLIDO'),
(19, '2025-03-05', NULL, 'Contraseña incorrecta para usuario: ADMIN', 0, 'LOGIN_FALLIDO'),
(20, '2025-03-05', NULL, 'Contraseña incorrecta para usuario: ADMIN', 0, 'LOGIN_FALLIDO'),
(21, '2025-03-05', NULL, 'Usuario ADMIN inició sesión exitosamente.', 0, 'LOGIN_EXITOSO'),
(22, '2025-03-05', NULL, 'Contraseña incorrecta para usuario: ADMIN', 0, 'LOGIN_FALLIDO'),
(23, '2025-03-05', NULL, 'Usuario ADMIN inició sesión exitosamente.', 0, 'LOGIN_EXITOSO'),
(24, '2025-03-05', NULL, 'Empleado creado exitosamente con DNI: 0801-1998-10855', 0, 'CREACION_EMPLEADO'),
(25, '2025-03-05', 11, 'Usuario KMORALES creado exitosamente.', 0, 'CREACION_USUARIO'),
(27, '2025-03-08', NULL, 'Error al crear empleado con DNI: 0801-2000-14766', 0, 'ERROR_CREACION_EMPLEADO'),
(35, '2025-03-19', 12, 'Usuario MHERNANDEZ creado exitosamente.', 0, 'CREACION_USUARIO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_cargo`
--

CREATE TABLE `tbl_cargo` (
  `id_cargo` int(11) NOT NULL,
  `nombre_cargo` varchar(255) NOT NULL,
  `id_cargo_jefe` int(11) DEFAULT NULL,
  `nombre_cargo_jefe` varchar(255) NOT NULL,
  `id_area` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tbl_cargo`:
--

--
-- Volcado de datos para la tabla `tbl_cargo`
--

INSERT INTO `tbl_cargo` (`id_cargo`, `nombre_cargo`, `id_cargo_jefe`, `nombre_cargo_jefe`, `id_area`) VALUES
(1, 'Administrador', NULL, '', 0),
(2, 'Gerente de Recursos Humanos', NULL, '', 0),
(3, 'Gerente de Logistica y Almacen', NULL, '', 0),
(4, 'Jefe de Creditos', NULL, '', 0),
(5, 'Asistente de Recursos Humanos', 2, '', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_ciudad`
--

CREATE TABLE `tbl_ciudad` (
  `id_ciudad` int(11) NOT NULL,
  `nombre_ciudad` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tbl_ciudad`:
--

--
-- Volcado de datos para la tabla `tbl_ciudad`
--

INSERT INTO `tbl_ciudad` (`id_ciudad`, `nombre_ciudad`) VALUES
(1, 'La Ceiba'),
(2, 'Trujillo'),
(3, 'Comayagua'),
(4, 'Santa Rosa de Copán'),
(5, 'San Pedro Sula'),
(6, 'Choluteca'),
(7, 'Danlí'),
(8, 'Tegucigalpa'),
(9, 'Puerto Lempira'),
(10, 'La Esperanza'),
(11, 'Coxen Hole'),
(12, 'La Paz'),
(13, 'Gracias'),
(14, 'Nueva Ocotepeque'),
(15, 'Juticalpa'),
(16, 'Santa Bárbara'),
(17, 'Nacaome'),
(18, 'El Progreso');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_departamento`
--

CREATE TABLE `tbl_departamento` (
  `id_departamento` int(11) NOT NULL,
  `nombre_departamento` varchar(255) NOT NULL,
  `id_municipio` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tbl_departamento`:
--

--
-- Volcado de datos para la tabla `tbl_departamento`
--

INSERT INTO `tbl_departamento` (`id_departamento`, `nombre_departamento`, `id_municipio`) VALUES
(1, 'Atlántida', 1),
(2, 'Colón', 2),
(3, 'Comayagua', 3),
(4, 'Copán', 4),
(5, 'Cortés', 5),
(6, 'Choluteca', 6),
(7, 'El Paraíso', 7),
(8, 'Francisco Morazán', 8),
(9, 'Gracias a Dios', 9),
(10, 'Intibucá', 10),
(11, 'Islas de la Bahía', 11),
(12, 'La Paz', 12),
(13, 'Lempira', 13),
(14, 'Ocotepeque', 14),
(15, 'Olancho', 15),
(16, 'Santa Bárbara', 16),
(17, 'Valle', 17),
(18, 'Yoro', 18);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_empleado`
--

CREATE TABLE `tbl_empleado` (
  `cod_empleado` int(11) NOT NULL,
  `id_cargo` int(11) DEFAULT NULL,
  `dni_empleado` varchar(100) NOT NULL,
  `Primer_nombre` varchar(255) NOT NULL,
  `segundo_nombre` varchar(255) DEFAULT NULL,
  `primer_apellido` varchar(255) NOT NULL,
  `segundo_apellido` varchar(255) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `fecha_contratacion` date DEFAULT NULL,
  `empleado_delegado` varchar(255) DEFAULT NULL,
  `Id_genero` int(11) DEFAULT NULL,
  `Id_area` int(11) DEFAULT NULL,
  `Id_sucursal` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tbl_empleado`:
--   `id_cargo`
--       `tbl_cargo` -> `id_cargo`
--   `Id_area`
--       `tbl_area_trabajo` -> `id_area`
--   `Id_genero`
--       `tbl_genero` -> `id_genero`
--   `Id_sucursal`
--       `tbl_sucursal` -> `Id_sucursal`
--

--
-- Volcado de datos para la tabla `tbl_empleado`
--

INSERT INTO `tbl_empleado` (`cod_empleado`, `id_cargo`, `dni_empleado`, `Primer_nombre`, `segundo_nombre`, `primer_apellido`, `segundo_apellido`, `fecha_nacimiento`, `fecha_contratacion`, `empleado_delegado`, `Id_genero`, `Id_area`, `Id_sucursal`) VALUES
(14, 1, '0801-2000-14763', 'pedro', 'rodrigo', 'Pascal', 'gonzales', '2005-07-15', '2022-12-15', NULL, 1, 1, 1),
(23, 2, '0801-1998-10855', 'Kevin', 'Javier', 'Morales', 'Bustamante', '1998-06-01', '2025-03-04', NULL, NULL, NULL, NULL),
(122, 3, '0801-2000-14765', 'Cesar', 'Alberto', 'Lopez', 'Ramirez', '0000-00-00', '0000-00-00', NULL, 1, 1, 1),
(555, 4, '0801-1996-00001', 'MELISA', 'ABIGAIL', 'HERNANDEZ', 'RAMIREZ', '0000-00-00', '2020-03-19', NULL, 1, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_estado`
--

CREATE TABLE `tbl_estado` (
  `id_estado` int(11) NOT NULL,
  `nombre_estado` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tbl_estado`:
--

--
-- Volcado de datos para la tabla `tbl_estado`
--

INSERT INTO `tbl_estado` (`id_estado`, `nombre_estado`) VALUES
(1, 'Aprobada'),
(2, 'Rechazada'),
(3, 'Pendiente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_estado_usuario`
--

CREATE TABLE `tbl_estado_usuario` (
  `id_estado_usuario` int(11) NOT NULL,
  `nombre_estado_usuario` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tbl_estado_usuario`:
--

--
-- Volcado de datos para la tabla `tbl_estado_usuario`
--

INSERT INTO `tbl_estado_usuario` (`id_estado_usuario`, `nombre_estado_usuario`) VALUES
(1, 'Activo'),
(2, 'Inactivo'),
(3, 'Bloqueado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_genero`
--

CREATE TABLE `tbl_genero` (
  `id_genero` int(11) NOT NULL,
  `nombre_genero` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tbl_genero`:
--

--
-- Volcado de datos para la tabla `tbl_genero`
--

INSERT INTO `tbl_genero` (`id_genero`, `nombre_genero`) VALUES
(1, 'Masculino'),
(2, 'Femenino');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_historial_contraseña`
--

CREATE TABLE `tbl_historial_contraseña` (
  `id_contraseña` int(11) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `contraseña_antigua` varchar(255) DEFAULT NULL,
  `Recordar_datos` tinyint(1) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tbl_historial_contraseña`:
--   `id_usuario`
--       `tbl_usuario` -> `Id_Usuario`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_municipio`
--

CREATE TABLE `tbl_municipio` (
  `id_municipio` int(11) NOT NULL,
  `nombre_municipio` varchar(255) NOT NULL,
  `id_ciudad` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tbl_municipio`:
--

--
-- Volcado de datos para la tabla `tbl_municipio`
--

INSERT INTO `tbl_municipio` (`id_municipio`, `nombre_municipio`, `id_ciudad`) VALUES
(1, 'La Ceiba', 1),
(2, 'Trujillo', 2),
(3, 'Comayagua', 3),
(4, 'Santa Rosa de Copán', 4),
(5, 'San Pedro Sula', 5),
(6, 'Choluteca', 6),
(7, 'Danlí', 7),
(8, 'Distrito Central', 8),
(9, 'Puerto Lempira', 9),
(10, 'La Esperanza', 10),
(11, 'Coxen Hole', 11),
(12, 'La Paz', 12),
(13, 'Gracias', 13),
(14, 'Nueva Ocotepeque', 14),
(15, 'Juticalpa', 15),
(16, 'Santa Bárbara', 16),
(17, 'Nacaome', 17),
(18, 'El Progreso', 18);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_objeto`
--

CREATE TABLE `tbl_objeto` (
  `id_objeto` int(11) NOT NULL,
  `objeto` varchar(255) NOT NULL,
  `descripcion_objeto` varchar(255) DEFAULT NULL,
  `tipo_objeto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tbl_objeto`:
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_otp`
--

CREATE TABLE `tbl_otp` (
  `Id_otp` int(11) NOT NULL,
  `otp` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tbl_otp`:
--

--
-- Volcado de datos para la tabla `tbl_otp`
--

INSERT INTO `tbl_otp` (`Id_otp`, `otp`) VALUES
(13, '246668'),
(25, '724146'),
(26, '345387'),
(28, '754385');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_parametros`
--

CREATE TABLE `tbl_parametros` (
  `id_parametro` int(11) NOT NULL,
  `nombre_parametro` varchar(255) NOT NULL,
  `valor_parametro` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tbl_parametros`:
--   `id_usuario`
--       `tbl_usuario` -> `Id_Usuario`
--

--
-- Volcado de datos para la tabla `tbl_parametros`
--

INSERT INTO `tbl_parametros` (`id_parametro`, `nombre_parametro`, `valor_parametro`, `id_usuario`) VALUES
(2, 'ADMIN_INTENTOS', 3, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_permisos`
--

CREATE TABLE `tbl_permisos` (
  `id_permiso` int(11) NOT NULL,
  `id_objeto` int(11) DEFAULT NULL,
  `id_rol` int(11) DEFAULT NULL,
  `permiso_creacion` tinyint(1) DEFAULT 0,
  `permiso_eliminacion` tinyint(1) DEFAULT 0,
  `permiso_actualizacion` tinyint(1) DEFAULT 0,
  `permiso_consultar` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tbl_permisos`:
--   `id_rol`
--       `tbl_rol` -> `Id_rol`
--   `id_objeto`
--       `tbl_objeto` -> `id_objeto`
--

--
-- Volcado de datos para la tabla `tbl_permisos`
--

INSERT INTO `tbl_permisos` (`id_permiso`, `id_objeto`, `id_rol`, `permiso_creacion`, `permiso_eliminacion`, `permiso_actualizacion`, `permiso_consultar`) VALUES
(1, NULL, 1, 1, 1, 1, 1),
(2, NULL, 2, 1, 0, 1, 1),
(3, NULL, 3, 0, 0, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_rol`
--

CREATE TABLE `tbl_rol` (
  `Id_rol` int(11) NOT NULL,
  `rol` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_creacion` date DEFAULT NULL,
  `creado_por` int(11) DEFAULT NULL,
  `fecha_modificacion` date DEFAULT NULL,
  `modificado_por` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tbl_rol`:
--

--
-- Volcado de datos para la tabla `tbl_rol`
--

INSERT INTO `tbl_rol` (`Id_rol`, `rol`, `descripcion`, `fecha_creacion`, `creado_por`, `fecha_modificacion`, `modificado_por`) VALUES
(1, 'Administrador', 'Rol con acceso total al sistema', '2025-02-03', NULL, '2025-03-18', 0),
(2, 'Recursos humanos', 'Rol con acceso limitado al sistema', '2025-03-18', 0, NULL, NULL),
(3, 'Empleado', 'Rol con acceso basico al sistema', '2025-03-19', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_solicitudes`
--

CREATE TABLE `tbl_solicitudes` (
  `id_solicitud` int(11) NOT NULL,
  `fecha_solicitud` date NOT NULL,
  `fecha_final_solicitud` date DEFAULT NULL,
  `fecha_inicio_solicitud` date DEFAULT NULL,
  `fecha_aprobacion` date DEFAULT NULL,
  `Usuario_aprobacion` varchar(255) DEFAULT NULL,
  `observaciones_solicitud` text DEFAULT NULL,
  `Id_usuario` int(11) DEFAULT NULL,
  `Id_estado` int(11) DEFAULT NULL,
  `validacion_img` blob DEFAULT NULL,
  `Id_tipo_solicitud` int(11) DEFAULT NULL,
  `dias_solicitados` decimal(11,0) DEFAULT NULL,
  `dias_acumulados` decimal(10,0) DEFAULT NULL,
  `dias_otorgados` decimal(10,0) DEFAULT NULL,
  `dias_pendientes` decimal(10,0) DEFAULT NULL,
  `fecha_regreso` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tbl_solicitudes`:
--   `Id_usuario`
--       `tbl_usuario` -> `Id_Usuario`
--   `Id_estado`
--       `tbl_estado` -> `id_estado`
--   `id_tipo_solicitud`
--       `tbl_tipo_solicitud` -> `Id_tipo_solicitud`
--

--
-- Volcado de datos para la tabla `tbl_solicitudes`
--

INSERT INTO `tbl_solicitudes` (`id_solicitud`, `fecha_solicitud`, `fecha_final_solicitud`, `fecha_inicio_solicitud`, `fecha_aprobacion`, `Usuario_aprobacion`, `observaciones_solicitud`, `Id_usuario`, `Id_estado`, `validacion_img`, `Id_tipo_solicitud`, `dias_solicitados`, `dias_acumulados`, `dias_otorgados`, `dias_pendientes`, `fecha_regreso`) VALUES
(1, '2025-03-19', '2025-03-30', '2025-03-20', NULL, NULL, 'jsdknkjadnka', 12, 3, NULL, 1, 10, 77, 10, 67, '2025-03-31'),
(2, '2025-03-19', '2025-03-26', '2025-03-26', NULL, NULL, 'ok', 12, 3, NULL, 2, 10, NULL, NULL, NULL, '2025-03-31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_sucursal`
--

CREATE TABLE `tbl_sucursal` (
  `Id_sucursal` int(11) NOT NULL,
  `nombre_sucursal` varchar(255) NOT NULL,
  `id_departamento` int(11) DEFAULT NULL,
  `id_ciudad` int(11) DEFAULT NULL,
  `id_municipio` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tbl_sucursal`:
--   `id_ciudad`
--       `tbl_ciudad` -> `id_ciudad`
--   `id_departamento`
--       `tbl_departamento` -> `id_departamento`
--   `id_municipio`
--       `tbl_municipio` -> `id_municipio`
--

--
-- Volcado de datos para la tabla `tbl_sucursal`
--

INSERT INTO `tbl_sucursal` (`Id_sucursal`, `nombre_sucursal`, `id_departamento`, `id_ciudad`, `id_municipio`) VALUES
(1, 'Tegucigalpa', 8, 8, 8),
(2, 'San Pedro Sula', 5, 5, 5),
(4, 'Comayagua', 3, 3, 3),
(5, 'Choluteca', 6, 6, 6),
(6, 'Danlí', 7, 7, 7),
(7, 'Olancho', 15, 15, 15);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_telefono`
--

CREATE TABLE `tbl_telefono` (
  `id_telefono` int(11) NOT NULL,
  `cod_empleado` int(11) DEFAULT NULL,
  `numero_telefono` varchar(15) NOT NULL,
  `id_tipo_telefono` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tbl_telefono`:
--   `cod_empleado`
--       `tbl_empleado` -> `cod_empleado`
--   `id_tipo_telefono`
--       `tbl_tipo_telefono` -> `id_tipo_telefono`
--

--
-- Volcado de datos para la tabla `tbl_telefono`
--

INSERT INTO `tbl_telefono` (`id_telefono`, `cod_empleado`, `numero_telefono`, `id_tipo_telefono`) VALUES
(4, 555, '', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_tipo_solicitud`
--

CREATE TABLE `tbl_tipo_solicitud` (
  `Id_tipo_solicitud` int(11) NOT NULL,
  `Nombre_tipo_solicitud` varchar(255) NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tbl_tipo_solicitud`:
--

--
-- Volcado de datos para la tabla `tbl_tipo_solicitud`
--

INSERT INTO `tbl_tipo_solicitud` (`Id_tipo_solicitud`, `Nombre_tipo_solicitud`, `Descripcion`) VALUES
(1, 'Vacaciones', 'Solicitude de vacaciones del empleado.'),
(2, 'Incapacidad', 'Solicitud de incapacidad del empleado.'),
(3, 'Permiso', 'Solicitud de permiso menor de 4 horas.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_tipo_telefono`
--

CREATE TABLE `tbl_tipo_telefono` (
  `id_tipo_telefono` int(11) NOT NULL,
  `nombre_tipo_telefono` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tbl_tipo_telefono`:
--

--
-- Volcado de datos para la tabla `tbl_tipo_telefono`
--

INSERT INTO `tbl_tipo_telefono` (`id_tipo_telefono`, `nombre_tipo_telefono`) VALUES
(1, 'Ejecutivo'),
(2, 'Personal');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_usuario`
--

CREATE TABLE `tbl_usuario` (
  `Id_Usuario` int(11) NOT NULL,
  `id_rol` int(11) DEFAULT NULL,
  `contraseña` varchar(255) NOT NULL,
  `cod_empleado` int(11) DEFAULT NULL,
  `id_hist_contraseña` int(11) NOT NULL,
  `nomb_usuario` varchar(255) NOT NULL,
  `id_estado_usuario` int(11) DEFAULT NULL,
  `Id_otp` int(11) DEFAULT NULL,
  `Tipo_registro` tinyint(1) NOT NULL,
  `email` varchar(255) NOT NULL,
  `intentos_fallidos` int(11) NOT NULL,
  `dias_trabajados` int(11) NOT NULL,
  `dias_acumulados` int(11) NOT NULL,
  `dias_disponibles` int(11) NOT NULL,
  `dias_proporcionales` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tbl_usuario`:
--

--
-- Volcado de datos para la tabla `tbl_usuario`
--

INSERT INTO `tbl_usuario` (`Id_Usuario`, `id_rol`, `contraseña`, `cod_empleado`, `id_hist_contraseña`, `nomb_usuario`, `id_estado_usuario`, `Id_otp`, `Tipo_registro`, `email`, `intentos_fallidos`, `dias_trabajados`, `dias_acumulados`, `dias_disponibles`, `dias_proporcionales`) VALUES
(6, NULL, '$2b$10$K5K1HviwG11u0/cSoAHulOBdlB9gCPqrrBfHY/4I9lhQzuq.vh21e', 123, 0, 'ELOPEZ131', 2, NULL, 1, 'calo@gmail.com', 0, 0, 0, 0, 0),
(8, NULL, '$2b$10$nPtcqpdEiA.e/WwwMwWZ8.oFzUk4T9ZU8zckVT5uYTbeoIyzHzMta', 35, 0, 'IINFO766', 1, NULL, 1, 'maygonza.cs@gmail.com', 0, 0, 0, 0, 0),
(9, NULL, '$2b$10$A42.jlvPNnzC2NB8uNgAMeLCV/vyyL6Tra5UrHW84pFfciqzDVFO.', 14, 0, 'ADMIN', 1, NULL, 1, 'carloslopez150744@gmail.com', 0, 0, 0, 0, 0),
(10, NULL, '$2b$10$DweDhQRnWfoUjDx2IaYv8.8axl6KIMYc2AMC0hb.vw6yUYMUqsZ8e', 122, 0, 'CLOPEZ', 1, NULL, 0, 'cre@gmail.com', 0, 0, 0, 0, 0),
(11, NULL, '$2b$10$6MJGFS7/LtahSfcRIjk6BuvVsd9RT7VUdWovJCm4LJ7vfbkjWr2yK', 23, 0, 'KMORALES', 1, NULL, 0, 'moraleskevin716@gmail.com', 0, 0, 0, 0, 0),
(12, NULL, '$2b$10$2GPidFlBIiZozCvIMkESauxCFLI1Rn7uSyy7b9u0nh9MOIwaoGK7q', 555, 0, 'MHERNANDEZ', 1, NULL, 1, 'carloslopez150744@gmail.com', 0, 0, 0, 0, 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `tbl_ampliacion_solicitud`
--
ALTER TABLE `tbl_ampliacion_solicitud`
  ADD PRIMARY KEY (`id_ampliacion`),
  ADD KEY `id_solicitud` (`id_solicitud`);

--
-- Indices de la tabla `tbl_area_trabajo`
--
ALTER TABLE `tbl_area_trabajo`
  ADD PRIMARY KEY (`id_area`);

--
-- Indices de la tabla `tbl_bitacora`
--
ALTER TABLE `tbl_bitacora`
  ADD PRIMARY KEY (`id_bitacora`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_objeto` (`id_objeto`);

--
-- Indices de la tabla `tbl_cargo`
--
ALTER TABLE `tbl_cargo`
  ADD PRIMARY KEY (`id_cargo`),
  ADD KEY `id_cargo_jefe` (`id_cargo_jefe`),
  ADD KEY `id_area` (`id_area`);

--
-- Indices de la tabla `tbl_ciudad`
--
ALTER TABLE `tbl_ciudad`
  ADD PRIMARY KEY (`id_ciudad`);

--
-- Indices de la tabla `tbl_departamento`
--
ALTER TABLE `tbl_departamento`
  ADD PRIMARY KEY (`id_departamento`),
  ADD KEY `id_municipio` (`id_municipio`);

--
-- Indices de la tabla `tbl_empleado`
--
ALTER TABLE `tbl_empleado`
  ADD PRIMARY KEY (`cod_empleado`),
  ADD UNIQUE KEY `dni_empleado` (`dni_empleado`),
  ADD KEY `id_cargo` (`id_cargo`),
  ADD KEY `Id_genero` (`Id_genero`),
  ADD KEY `id_area` (`Id_area`),
  ADD KEY `id_sucursal` (`Id_sucursal`);

--
-- Indices de la tabla `tbl_estado`
--
ALTER TABLE `tbl_estado`
  ADD PRIMARY KEY (`id_estado`);

--
-- Indices de la tabla `tbl_estado_usuario`
--
ALTER TABLE `tbl_estado_usuario`
  ADD PRIMARY KEY (`id_estado_usuario`);

--
-- Indices de la tabla `tbl_genero`
--
ALTER TABLE `tbl_genero`
  ADD PRIMARY KEY (`id_genero`);

--
-- Indices de la tabla `tbl_historial_contraseña`
--
ALTER TABLE `tbl_historial_contraseña`
  ADD PRIMARY KEY (`id_contraseña`),
  ADD KEY `IdUsuario` (`id_usuario`);

--
-- Indices de la tabla `tbl_municipio`
--
ALTER TABLE `tbl_municipio`
  ADD PRIMARY KEY (`id_municipio`),
  ADD KEY `id_ciudad` (`id_ciudad`);

--
-- Indices de la tabla `tbl_objeto`
--
ALTER TABLE `tbl_objeto`
  ADD PRIMARY KEY (`id_objeto`);

--
-- Indices de la tabla `tbl_otp`
--
ALTER TABLE `tbl_otp`
  ADD PRIMARY KEY (`Id_otp`);

--
-- Indices de la tabla `tbl_parametros`
--
ALTER TABLE `tbl_parametros`
  ADD PRIMARY KEY (`id_parametro`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `tbl_permisos`
--
ALTER TABLE `tbl_permisos`
  ADD PRIMARY KEY (`id_permiso`),
  ADD KEY `id_rol` (`id_rol`),
  ADD KEY `id_objeto` (`id_objeto`);

--
-- Indices de la tabla `tbl_rol`
--
ALTER TABLE `tbl_rol`
  ADD PRIMARY KEY (`Id_rol`);

--
-- Indices de la tabla `tbl_solicitudes`
--
ALTER TABLE `tbl_solicitudes`
  ADD PRIMARY KEY (`id_solicitud`),
  ADD KEY `Id_usuario` (`Id_usuario`),
  ADD KEY `Id_estado` (`Id_estado`),
  ADD KEY `Id_tipo_solicitud` (`Id_tipo_solicitud`) USING BTREE;

--
-- Indices de la tabla `tbl_sucursal`
--
ALTER TABLE `tbl_sucursal`
  ADD PRIMARY KEY (`Id_sucursal`),
  ADD KEY `id_ciudad` (`id_ciudad`),
  ADD KEY `id_departamento` (`id_departamento`),
  ADD KEY `id_municipio` (`id_municipio`);

--
-- Indices de la tabla `tbl_telefono`
--
ALTER TABLE `tbl_telefono`
  ADD PRIMARY KEY (`id_telefono`),
  ADD KEY `id_empleado` (`cod_empleado`),
  ADD KEY `id_tipo_telefono` (`id_tipo_telefono`);

--
-- Indices de la tabla `tbl_tipo_solicitud`
--
ALTER TABLE `tbl_tipo_solicitud`
  ADD PRIMARY KEY (`Id_tipo_solicitud`);

--
-- Indices de la tabla `tbl_tipo_telefono`
--
ALTER TABLE `tbl_tipo_telefono`
  ADD PRIMARY KEY (`id_tipo_telefono`);

--
-- Indices de la tabla `tbl_usuario`
--
ALTER TABLE `tbl_usuario`
  ADD PRIMARY KEY (`Id_Usuario`),
  ADD KEY `id_rol` (`id_rol`),
  ADD KEY `Id_empleado` (`cod_empleado`),
  ADD KEY `id_contraseña` (`id_hist_contraseña`),
  ADD KEY `id_estado_usuario` (`id_estado_usuario`),
  ADD KEY `Id_otp` (`Id_otp`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `tbl_bitacora`
--
ALTER TABLE `tbl_bitacora`
  MODIFY `id_bitacora` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT de la tabla `tbl_historial_contraseña`
--
ALTER TABLE `tbl_historial_contraseña`
  MODIFY `id_contraseña` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `tbl_otp`
--
ALTER TABLE `tbl_otp`
  MODIFY `Id_otp` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de la tabla `tbl_rol`
--
ALTER TABLE `tbl_rol`
  MODIFY `Id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `tbl_solicitudes`
--
ALTER TABLE `tbl_solicitudes`
  MODIFY `id_solicitud` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tbl_telefono`
--
ALTER TABLE `tbl_telefono`
  MODIFY `id_telefono` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `tbl_tipo_solicitud`
--
ALTER TABLE `tbl_tipo_solicitud`
  MODIFY `Id_tipo_solicitud` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `tbl_tipo_telefono`
--
ALTER TABLE `tbl_tipo_telefono`
  MODIFY `id_tipo_telefono` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `tbl_usuario`
--
ALTER TABLE `tbl_usuario`
  MODIFY `Id_Usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `tbl_ampliacion_solicitud`
--
ALTER TABLE `tbl_ampliacion_solicitud`
  ADD CONSTRAINT `tbl_ampliacion_solicitud_ibfk_1` FOREIGN KEY (`id_solicitud`) REFERENCES `tbl_solicitudes` (`id_solicitud`);

--
-- Filtros para la tabla `tbl_bitacora`
--
ALTER TABLE `tbl_bitacora`
  ADD CONSTRAINT `tbl_bitacora_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `tbl_usuario` (`Id_Usuario`);

--
-- Filtros para la tabla `tbl_empleado`
--
ALTER TABLE `tbl_empleado`
  ADD CONSTRAINT `tbl_empleado_ibfk_1` FOREIGN KEY (`id_cargo`) REFERENCES `tbl_cargo` (`id_cargo`),
  ADD CONSTRAINT `tbl_empleado_tbl_area` FOREIGN KEY (`Id_area`) REFERENCES `tbl_area_trabajo` (`id_area`),
  ADD CONSTRAINT `tbl_empleado_tbl_genero` FOREIGN KEY (`Id_genero`) REFERENCES `tbl_genero` (`id_genero`),
  ADD CONSTRAINT `tbl_empleado_tbl_sucursal` FOREIGN KEY (`Id_sucursal`) REFERENCES `tbl_sucursal` (`Id_sucursal`);

--
-- Filtros para la tabla `tbl_historial_contraseña`
--
ALTER TABLE `tbl_historial_contraseña`
  ADD CONSTRAINT `IdUsuario` FOREIGN KEY (`id_usuario`) REFERENCES `tbl_usuario` (`Id_Usuario`);

--
-- Filtros para la tabla `tbl_parametros`
--
ALTER TABLE `tbl_parametros`
  ADD CONSTRAINT `tbl_parametros_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `tbl_usuario` (`Id_Usuario`);

--
-- Filtros para la tabla `tbl_permisos`
--
ALTER TABLE `tbl_permisos`
  ADD CONSTRAINT `tbl_permisos_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `tbl_rol` (`Id_rol`),
  ADD CONSTRAINT `tbl_permisos_ibfk_2` FOREIGN KEY (`id_objeto`) REFERENCES `tbl_objeto` (`id_objeto`);

--
-- Filtros para la tabla `tbl_solicitudes`
--
ALTER TABLE `tbl_solicitudes`
  ADD CONSTRAINT `tbl_solicitudes_ibfk_1` FOREIGN KEY (`Id_usuario`) REFERENCES `tbl_usuario` (`Id_Usuario`),
  ADD CONSTRAINT `tbl_solicitudes_ibfk_2` FOREIGN KEY (`Id_estado`) REFERENCES `tbl_estado` (`id_estado`),
  ADD CONSTRAINT `tbl_solicitudes_ibfk_3` FOREIGN KEY (`id_tipo_solicitud`) REFERENCES `tbl_tipo_solicitud` (`Id_tipo_solicitud`);

--
-- Filtros para la tabla `tbl_sucursal`
--
ALTER TABLE `tbl_sucursal`
  ADD CONSTRAINT `tbl_sucursal_ibfk_1` FOREIGN KEY (`id_ciudad`) REFERENCES `tbl_ciudad` (`id_ciudad`),
  ADD CONSTRAINT `tbl_sucursal_ibfk_2` FOREIGN KEY (`id_departamento`) REFERENCES `tbl_departamento` (`id_departamento`),
  ADD CONSTRAINT `tbl_sucursal_ibfk_3` FOREIGN KEY (`id_municipio`) REFERENCES `tbl_municipio` (`id_municipio`);

--
-- Filtros para la tabla `tbl_telefono`
--
ALTER TABLE `tbl_telefono`
  ADD CONSTRAINT `tbl_telefono_ibfk_1` FOREIGN KEY (`cod_empleado`) REFERENCES `tbl_empleado` (`cod_empleado`),
  ADD CONSTRAINT `tbl_telefono_ibfk_2` FOREIGN KEY (`id_tipo_telefono`) REFERENCES `tbl_tipo_telefono` (`id_tipo_telefono`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
