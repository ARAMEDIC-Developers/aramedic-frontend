-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-11-2024 a las 23:59:44
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `aramedic`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `citas`
--

CREATE TABLE `citas` (
  `id` int(11) NOT NULL,
  `paciente_id` int(11) NOT NULL,
  `medico_id` int(11) NOT NULL,
  `servicio_id` int(11) DEFAULT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `estado` enum('pendiente','confirmada','cancelada') DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `citas`
--

INSERT INTO `citas` (`id`, `paciente_id`, `medico_id`, `servicio_id`, `fecha`, `hora`, `estado`) VALUES
(1, 1, 1, 1, '2023-11-15', '10:00:00', 'confirmada'),
(2, 2, 2, 1, '2023-11-16', '11:00:00', 'pendiente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_factura`
--

CREATE TABLE `detalle_factura` (
  `id` int(11) NOT NULL,
  `factura_id` int(11) NOT NULL,
  `servicio_id` int(11) NOT NULL,
  `cantidad` int(11) DEFAULT 1,
  `costo_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) GENERATED ALWAYS AS (`cantidad` * `costo_unitario`) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_factura`
--

INSERT INTO `detalle_factura` (`id`, `factura_id`, `servicio_id`, `cantidad`, `costo_unitario`) VALUES
(1, 1, 1, 1, 50.00),
(2, 2, 1, 1, 50.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especialidades`
--

CREATE TABLE `especialidades` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `especialidades`
--

INSERT INTO `especialidades` (`id`, `nombre`) VALUES
(1, 'Cardiología'),
(2, 'Pediatría'),
(3, 'Dermatología');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `facturas`
--

CREATE TABLE `facturas` (
  `id` int(11) NOT NULL,
  `cita_id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `monto_total` decimal(10,2) NOT NULL,
  `estado_pago` enum('pendiente','pagado','cancelado') DEFAULT 'pendiente',
  `metodo_pago` enum('efectivo','tarjeta','transferencia') DEFAULT 'efectivo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `facturas`
--

INSERT INTO `facturas` (`id`, `cita_id`, `fecha`, `monto_total`, `estado_pago`, `metodo_pago`) VALUES
(1, 1, '2023-11-15', 50.00, 'pagado', 'tarjeta'),
(2, 2, '2023-11-16', 50.00, 'pendiente', 'efectivo'),
(3, 1, '2023-11-15', 50.00, 'pagado', 'tarjeta'),
(4, 2, '2023-11-16', 50.00, 'pendiente', 'efectivo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_medico`
--

CREATE TABLE `historial_medico` (
  `id` int(11) NOT NULL,
  `paciente_id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `descripcion` text NOT NULL,
  `diagnostico` text DEFAULT NULL,
  `tratamiento` text DEFAULT NULL,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historial_medico`
--

INSERT INTO `historial_medico` (`id`, `paciente_id`, `fecha`, `descripcion`, `diagnostico`, `tratamiento`, `observaciones`) VALUES
(1, 1, '2024-01-15', 'Consulta inicial debido a dolor abdominal.', 'Gastritis', 'Inhibidor de bomba de protones', 'Recomendar dieta baja en grasas'),
(2, 2, '2024-02-10', 'Chequeo de rutina con análisis de sangre y orina.', 'Sin anomalías', NULL, 'Resultados normales'),
(3, 1, '2024-03-05', 'Paciente presenta fiebre y tos persistente.', 'Infección respiratoria', 'Antibiótico oral durante 7 días', 'Se recomienda reposo y consumo de líquidos abundante'),
(4, 2, '2024-04-20', 'Consulta de control post-operatorio.', NULL, NULL, 'Cicatrización normal, sin signos de infección');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicos`
--

CREATE TABLE `medicos` (
  `id` int(11) NOT NULL,
  `nombres` varchar(100) DEFAULT NULL,
  `apellidos` varchar(100) DEFAULT NULL,
  `especialidad_id` int(11) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `contrasena` varchar(225) DEFAULT NULL,
  `idrol` varchar(100) DEFAULT NULL,
  `dni` varchar(225) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `genero` varchar(225) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medicos`
--

INSERT INTO `medicos` (`id`, `nombres`, `apellidos`, `especialidad_id`, `telefono`, `correo`, `contrasena`, `idrol`, `dni`, `fecha_nacimiento`, `genero`) VALUES
(1, 'Carlos', 'Lopez', 1, '555789012', 'carlos.lopez@example.com', 'Pecosin0412', '2', '76633598', '2002-05-30', 'Hombre'),
(2, 'Ana', 'Martinez', 2, '555345678', 'ana.martinez@example.com', 'Pecosin0412', '2', '76633568', '2002-06-21', 'Mujer');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medico_servicio`
--

CREATE TABLE `medico_servicio` (
  `id` int(11) NOT NULL,
  `medico_id` int(11) DEFAULT NULL,
  `servicio_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medico_servicio`
--

INSERT INTO `medico_servicio` (`id`, `medico_id`, `servicio_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `contrasena` varchar(100) DEFAULT NULL,
  `idrol` varchar(100) DEFAULT NULL,
  `dni` varchar(100) DEFAULT NULL,
  `genero` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`id`, `nombre`, `apellido`, `fecha_nacimiento`, `telefono`, `correo`, `direccion`, `contrasena`, `idrol`, `dni`, `genero`) VALUES
(1, 'Juan', 'Pérez', '1985-05-10', '555123456', 'juan.perez@example.com', 'Calle 123, Ciudad', 'Pecosin0412', '1', '76633598', 'Hombre'),
(2, 'Maria', 'Gomez', '1990-11-25', '555654321', 'maria.gomez@example.com', 'Avenida 456, Ciudad', 'Pecosin0412', '1', '76655896', 'Mujer');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `idservicio` int(11) NOT NULL,
  `nombre_servicio` varchar(100) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `costo` decimal(10,2) NOT NULL,
  `tipo_procedimiento` varchar(100) DEFAULT NULL,
  `tiempo_estimado` varchar(100) DEFAULT NULL,
  `tiempo_recuperacion` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicios`
--

INSERT INTO `servicios` (`idservicio`, `nombre_servicio`, `descripcion`, `costo`, `tipo_procedimiento`, `tiempo_estimado`, `tiempo_recuperacion`) VALUES
(1, 'Consulta General', 'Consulta general con el médico', 50.00, 'nada', '20 min', '0 min'),
(2, 'Examen de Sangre', 'Análisis de sangre completo', 30.00, 'escaneo', '10 min', '10 min'),
(3, 'Radiografía', 'Radiografía de diagnóstico', 75.00, 'escaneo', '10 min', '10 min');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre_usuario` varchar(50) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `rol` enum('paciente','medico','admin') DEFAULT 'paciente',
  `paciente_id` int(11) DEFAULT NULL,
  `medico_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre_usuario`, `contrasena`, `rol`, `paciente_id`, `medico_id`) VALUES
(1, 'juan_paciente', 'contrasena_segura123', 'paciente', 1, NULL),
(2, 'dr.juarez', 'contrasena_segura456', 'medico', NULL, 2),
(3, 'admin', 'contrasena_segura789', 'admin', NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `citas`
--
ALTER TABLE `citas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `paciente_id` (`paciente_id`),
  ADD KEY `medico_id` (`medico_id`),
  ADD KEY `servicio_id` (`servicio_id`);

--
-- Indices de la tabla `detalle_factura`
--
ALTER TABLE `detalle_factura`
  ADD PRIMARY KEY (`id`),
  ADD KEY `factura_id` (`factura_id`),
  ADD KEY `servicio_id` (`servicio_id`);

--
-- Indices de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `facturas`
--
ALTER TABLE `facturas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cita_id` (`cita_id`);

--
-- Indices de la tabla `historial_medico`
--
ALTER TABLE `historial_medico`
  ADD PRIMARY KEY (`id`),
  ADD KEY `paciente_id` (`paciente_id`);

--
-- Indices de la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `especialidad_id` (`especialidad_id`);

--
-- Indices de la tabla `medico_servicio`
--
ALTER TABLE `medico_servicio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `medico_id` (`medico_id`),
  ADD KEY `servicio_id` (`servicio_id`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`idservicio`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre_usuario` (`nombre_usuario`),
  ADD KEY `paciente_id` (`paciente_id`),
  ADD KEY `medico_id` (`medico_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `citas`
--
ALTER TABLE `citas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `detalle_factura`
--
ALTER TABLE `detalle_factura`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `facturas`
--
ALTER TABLE `facturas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `historial_medico`
--
ALTER TABLE `historial_medico`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `medicos`
--
ALTER TABLE `medicos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `medico_servicio`
--
ALTER TABLE `medico_servicio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `citas`
--
ALTER TABLE `citas`
  ADD CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`),
  ADD CONSTRAINT `citas_ibfk_2` FOREIGN KEY (`medico_id`) REFERENCES `medicos` (`id`),
  ADD CONSTRAINT `citas_ibfk_3` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`idservicio`);

--
-- Filtros para la tabla `detalle_factura`
--
ALTER TABLE `detalle_factura`
  ADD CONSTRAINT `detalle_factura_ibfk_1` FOREIGN KEY (`factura_id`) REFERENCES `facturas` (`id`),
  ADD CONSTRAINT `detalle_factura_ibfk_2` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`idservicio`);

--
-- Filtros para la tabla `facturas`
--
ALTER TABLE `facturas`
  ADD CONSTRAINT `facturas_ibfk_1` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id`);

--
-- Filtros para la tabla `historial_medico`
--
ALTER TABLE `historial_medico`
  ADD CONSTRAINT `historial_medico_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`);

--
-- Filtros para la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD CONSTRAINT `medicos_ibfk_1` FOREIGN KEY (`especialidad_id`) REFERENCES `especialidades` (`id`);

--
-- Filtros para la tabla `medico_servicio`
--
ALTER TABLE `medico_servicio`
  ADD CONSTRAINT `medico_servicio_ibfk_1` FOREIGN KEY (`medico_id`) REFERENCES `medicos` (`id`),
  ADD CONSTRAINT `medico_servicio_ibfk_2` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`idservicio`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`),
  ADD CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`medico_id`) REFERENCES `medicos` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
