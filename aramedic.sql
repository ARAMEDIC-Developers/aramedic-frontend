-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-09-2024 a las 02:59:05
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
-- Base de datos: `aramedic`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medico`
--

CREATE TABLE `medico` (
  `id_medico` int(10) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `apellido` varchar(30) NOT NULL,
  `correo` varchar(30) NOT NULL,
  `contrasena` varchar(30) NOT NULL,
  `genero` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medico`
--

INSERT INTO `medico` (`id_medico`, `nombre`, `apellido`, `correo`, `contrasena`, `genero`) VALUES
(111, '111', '111', '111@gmail.com', '111', ''),
(222, '111', '111', '111@gmail.com', '111', ''),
(223, '111', '111', '111@gmail.com', '111', ''),
(224, '111', '111', '111@gmail.com', '111', ''),
(225, '111', '111', '111@gmail.com', '111', ''),
(226, '111', '111', '111@gmail.com', '111', ''),
(227, '111', '111', '111@gmail.com', '', ''),
(228, '1111', '1111', '111@gmail.com', '111', ''),
(229, '111', '111', '111@gmail.com', '111', ''),
(230, '111', '111', '111@gmail.com', '111', ''),
(231, '1111', '111', '111@gmail.com', '111', ''),
(232, 'dean', 'd', '111@gmail.com', '111', ''),
(233, 'DERECK', 'muñoz', 'dereckmunoz07@gmail.com', '123', 'Masculino'),
(234, 'DERECK', 'muñoz', 'dereckmunoz07@gmail.com', '123', 'Masculino');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medico`
--
ALTER TABLE `medico`
  ADD PRIMARY KEY (`id_medico`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `medico`
--
ALTER TABLE `medico`
  MODIFY `id_medico` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=235;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
