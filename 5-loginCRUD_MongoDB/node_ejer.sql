-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-02-2021 a las 17:27:38
-- Versión del servidor: 10.4.17-MariaDB
-- Versión de PHP: 8.0.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `node_ejer`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personarol`
--

CREATE TABLE `personarol` (
  `idRol` int(11) NOT NULL,
  `dniPersona` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `personarol`
--

INSERT INTO `personarol` (`idRol`, `dniPersona`) VALUES
(1, '1A'),
(1, '2B'),
(2, '3C'),
(1, '4D'),
(1, '5E'),
(1, '6F');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personas`
--

CREATE TABLE `personas` (
  `dni` varchar(10) NOT NULL,
  `correo` varchar(30) NOT NULL,
  `contra` varchar(100) NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `tfno` varchar(9) NOT NULL,
  `edad` varchar(3) NOT NULL,
  `activado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `personas`
--

INSERT INTO `personas` (`dni`, `correo`, `contra`, `nombre`, `tfno`, `edad`, `activado`) VALUES
('1A', 'luisilla@gmail.com', '$2b$10$nwVpGjQlb13VMaTPb7Xb9uLu5qxGaKHpzxQrDgA8bziDmaGtNhF2C', 'Luisailalaalal', '7979797', '20', 0),
('2B', 'luis@gmail.com', '$2b$10$7WgSFEqq/TqjS4NP7tpDa.FdFcyFV.dh0zWBxTOrkN0en7g7pTV9m', 'Luissssss', '969797979', '25', 0),
('3C', 'pepe@gmail.com', '$2b$10$fUgIU/ElGS2uvs/4NYy5JuZ4eN2uDBr9nWYL3/f5kJHT/Sc1v416q', 'Pepe', '969696969', '34', 1),
('4D', 'sara@gmail.com', '$2b$10$DHZJ5bTKFNxMeYVGzXf4B.SroVFr1laKShq4MXErOIijJT3p0szu.', 'Sara', '969696969', '45', 0),
('5E', 'pepa@gmail.com', '$2b$10$b13D0kGe6HzGP60C/ovNZ.RH0RitkXfwBhUNsW5a5y4UiRkAkFDga', 'Pepita', '969969696', '65', 1),
('6F', 'borrame@gmail.com', '$2b$10$V3Mb7l0IBymYJGpWl1UmyuWO9rJEKJk4iNlj4Pk4V/UG6cii9VJou', 'Borrame', '948595859', '99', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `descripcion` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `descripcion`) VALUES
(1, 'Admin'),
(2, 'Usuario');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `personarol`
--
ALTER TABLE `personarol`
  ADD KEY `fk_idRol` (`idRol`),
  ADD KEY `fk_pers` (`dniPersona`);

--
-- Indices de la tabla `personas`
--
ALTER TABLE `personas`
  ADD PRIMARY KEY (`dni`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `personarol`
--
ALTER TABLE `personarol`
  ADD CONSTRAINT `fk_idRol` FOREIGN KEY (`idRol`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_pers` FOREIGN KEY (`dniPersona`) REFERENCES `personas` (`dni`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
