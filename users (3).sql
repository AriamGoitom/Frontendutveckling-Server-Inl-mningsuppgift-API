-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Värd: localhost
-- Tid vid skapande: 07 dec 2023 kl 11:54
-- Serverversion: 10.4.28-MariaDB
-- PHP-version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databas: `Jensen2023`
--

-- --------------------------------------------------------

--
-- Tabellstruktur `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(75) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumpning av Data i tabell `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `name`, `email`) VALUES
(1, 'kalleanka', 'mypassword', 'kalleanka', 'kalle@anka.se'),
(2, 'knaank', 'Kvack!', 'Knatte Anka', 'knatte@anka.se'),
(3, 'ariam_goitom@hotmail.com', 'Kvack!', 'ariam', 'ariam@gmail.com'),
(4, 'muspig', 'Squeek!', 'Musse Pigg', 'musse@pigg.se'),
(7, 'mustpig', 'Piiip!', 'Musse Anka', 'musse@anka.se'),
(9, 'Liba', 'hej', 'Lina Piggt', 'lina@pigg.se'),
(10, 'tjaank', 'etthemligtlösenord', 'Tjatte Anka', 'tjatte@anka.se'),
(11, 'al', 'fb611f8a32f9ce16a65f979f6eb1ec466afd951fb8dfc89e30405983390e6283', 'Aladdin', 'aladdin@disney.se'),
(12, 'unikt namn', 'hej', 'Ariam', 'ariam@gmail.com'),
(14, 'unikt namn2', '9c478bf63e9500cb5db1e85ece82f18c8eb9e52e2f9135acd7f10972c8d563ba', 'Ariam', 'ariam@gmail.com'),
(15, 'unikt nam23', 'd3751d33f9cd5049c4af2b462735457e4d3baf130bcbb87f389e349fbaeb20b9', 'undefined', 'undefined'),
(18, 'ariam', 'cbb3577b3e18a65f847f4318f01d9e4581cb7b8ce50f21fef2306ba660dd3b1f', 'Ariam', 'ariam@gmail.com');

--
-- Index för dumpade tabeller
--

--
-- Index för tabell `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT för dumpade tabeller
--

--
-- AUTO_INCREMENT för tabell `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
