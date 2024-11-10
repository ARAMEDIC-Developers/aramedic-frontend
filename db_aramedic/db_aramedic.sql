-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-09-2024 a las 03:48:01
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `db_aramedic`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicos`
--

CREATE TABLE `medicos` (
  `IDmedico` int(11) NOT NULL,
  `DNI` int(8) NOT NULL,
  `Nombres` varchar(60) NOT NULL,
  `Apellidos` varchar(60) NOT NULL,
  `Funcion` varchar(100) DEFAULT NULL,
  `Inicio_servicio` date DEFAULT NULL,
  `Fecha_cumpleanos` date DEFAULT NULL,
  `Tipo_contrato` varchar(50) DEFAULT NULL,
  `Num_telefonico` varchar(12) DEFAULT NULL,
  `Correo_electronico` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `IDpacientes` int(11) NOT NULL,
  `Apellidos` varchar(60) NOT NULL,
  `Fecha_nacimiento` date DEFAULT NULL,
  `Edad` int(3) DEFAULT NULL,
  `Sexo` varchar(10) DEFAULT NULL,
  `Estado_Civil` varchar(10) DEFAULT NULL,
  `Ocupacion` varchar(20) DEFAULT NULL,
  `Num_telefonico` varchar(12) DEFAULT NULL,
  `Correo_electronico` varchar(25) DEFAULT NULL,
  `Direccion` varchar(25) DEFAULT NULL,
  `Motivo_Principal` varchar(20) DEFAULT NULL,
  `Enfermedades_previas` varchar(20) DEFAULT NULL,
  `Alergia` varchar(50) DEFAULT NULL,
  `Medicamentos_actuales` varchar(20) DEFAULT NULL,
  `Cirugias_previas` varchar(50) DEFAULT NULL,
  `Fuma` varchar(2) DEFAULT NULL,
  `Consume_alcohol` varchar(2) DEFAULT NULL,
  `Enfermedades_hereditarias` varchar(15) DEFAULT NULL,
  `Peso` varchar(2) DEFAULT NULL,
  `Altura` decimal(3,2) DEFAULT NULL,
  `Índice_de_masa_corporal_MIC` float(3,2) DEFAULT NULL,
  `Descripción_física` text DEFAULT NULL,
  `Cirugía` varchar(15) DEFAULT NULL,
  `Descripción_del_procedimiento` varchar(50) DEFAULT NULL,
  `Riesgos_y_complicaciones` varchar(80) DEFAULT NULL,
  `Cuidado_preoperatorio` varchar(50) DEFAULT NULL,
  `Cuidado_postoperatorio` varchar(50) DEFAULT NULL,
  `Nombres` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `IDservicio` int(11) NOT NULL,
  `Nombre_servicio` varchar(100) NOT NULL,
  `Tipo_procedimiento` varchar(50) DEFAULT NULL,
  `Costo` decimal(10,2) NOT NULL,
  `Tiempo_estimado_procedimiento` varchar(50) DEFAULT NULL,
  `Tiempo_estimado_recuperacion` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `IDusuario` int(11) NOT NULL,
  `DNI` int(8) DEFAULT NULL,
  `Nombres` varchar(60) DEFAULT NULL,
  `Apellidos` varchar(60) DEFAULT NULL,
  `Rol` varchar(25) NOT NULL,
  `Fecha_nacimiento` date DEFAULT NULL,
  `Num_telefonico` varchar(12) DEFAULT NULL,
  `Genero` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`IDusuario`, `DNI`, `Nombres`, `Apellidos`, `Rol`, `Fecha_nacimiento`, `Num_telefonico`, `Genero`) VALUES
(1, 74972730, 'Gabriel Antonio', 'Castaneda Luyo', 'Paciente', '2004-12-11', '953059465', 'Masculino'),
(2, 72095950, 'Amanda Mariana', 'Obregon Rodriguez', 'Paciente', '1994-11-30', '958644243', 'Femenino'),
(3, 47454844, 'Roberto Jesus', 'Rial Palacios', 'Paciente', '1989-02-16', '986276957', 'Masculino'),
(4, 62346304, 'Juan Daniel ', 'Pallares Cerdan', 'Paciente', '2001-02-26', '996473615', 'Masculino'),
(5, 19205415, 'Maria Elisa', 'Fidalgo Armas', 'Paciente', '1998-04-21', '968498097', 'Femenino');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD PRIMARY KEY (`IDmedico`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`IDpacientes`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`IDservicio`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`IDusuario`),
  ADD UNIQUE KEY `dni` (`DNI`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `medicos`
--
ALTER TABLE `medicos`
  MODIFY `IDmedico` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `IDpacientes` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `servicios`
--
ALTER TABLE `servicios`
  MODIFY `IDservicio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `IDusuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
