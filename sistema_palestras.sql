-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 20/06/2026 às 20:22
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `palestras`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `inscricoes`
--

CREATE TABLE `inscricoes` (
  `id` int(11) NOT NULL,
  `idUsuario` int(11) DEFAULT NULL,
  `idPalestra` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `inscricoes`
--

INSERT INTO `inscricoes` (`id`, `idUsuario`, `idPalestra`) VALUES
(4, 1, 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `palestra`
--

CREATE TABLE `palestra` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `nomePalestrante` varchar(255) DEFAULT NULL,
  `localEvento` varchar(255) DEFAULT NULL,
  `dataEvento` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `palestra`
--

INSERT INTO `palestra` (`id`, `titulo`, `descricao`, `nomePalestrante`, `localEvento`, `dataEvento`) VALUES
(1, 'Como conversar em publico', 'Como se comportar', 'Betania Dorna', 'Belo Horizonte', '2026-07-31 22:31:00'),
(2, 'Como trocar fralda', 'Troca de fralda de idoso', 'Betania Dorna', 'Belo Horizonte', '2026-08-13 23:50:00');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `ID` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `senha` varchar(255) DEFAULT NULL,
  `admin` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`ID`, `email`, `nome`, `senha`, `admin`) VALUES
(1, 'waltinho1979@gmail.com', 'Walter Silva', '$2b$10$aIZIFpmOaolfQ/rWDtsIpu2iYIDU/yN898xkYDSTcPZ2JjxqqV3/6', 1),
(2, 'betaniadorna@gmail.com', 'Betania Dorna', '$2b$10$.Pvvuakoyb8fEMXlBcd75ep/ySNpfzKcCRYOtY.5ocS/JD4Y3amze', 0),
(3, 'ismarborgesoliveira@gmail.com', 'Imsar Borges', '$2b$10$lhouP7uXuAbhB45Ytwb0Hef54wjniF2XSMo0it74fi6YUXpamQTjS', 0);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `inscricoes`
--
ALTER TABLE `inscricoes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idUsuario` (`idUsuario`,`idPalestra`),
  ADD KEY `idPalestra` (`idPalestra`);

--
-- Índices de tabela `palestra`
--
ALTER TABLE `palestra`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `inscricoes`
--
ALTER TABLE `inscricoes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `palestra`
--
ALTER TABLE `palestra`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `inscricoes`
--
ALTER TABLE `inscricoes`
  ADD CONSTRAINT `inscricoes_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`ID`),
  ADD CONSTRAINT `inscricoes_ibfk_2` FOREIGN KEY (`idPalestra`) REFERENCES `palestra` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
