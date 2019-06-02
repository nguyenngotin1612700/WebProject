-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 02, 2019 lúc 05:25 PM
-- Phiên bản máy phục vụ: 10.1.36-MariaDB
-- Phiên bản PHP: 7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `newspaper`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_520_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_520_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'highlights'),
(2, 'lastest'),
(3, 'domestic'),
(4, 'world'),
(5, 'most view'),
(6, 'businessman'),
(7, 'commercial');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `post`
--

CREATE TABLE `post` (
  `id` int(11) NOT NULL,
  `category` varchar(255) COLLATE utf8_unicode_520_ci NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_520_ci NOT NULL,
  `description` varchar(255) COLLATE utf8_unicode_520_ci NOT NULL,
  `url` varchar(255) COLLATE utf8_unicode_520_ci NOT NULL,
  `featureImg` varchar(255) COLLATE utf8_unicode_520_ci NOT NULL,
  `datePost` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_520_ci;

--
-- Đang đổ dữ liệu cho bảng `post`
--

INSERT INTO `post` (`id`, `category`, `title`, `description`, `url`, `featureImg`, `datePost`) VALUES
(1, 'highlights', 'Google Assistant nhận giọng nói tiếng Việt tốt nhưng chưa tự nhiên', 'Trợ lý giọng nói của Google nhận chính xác giọng nói tiếng Việt, song cách xử lý các tình huống còn cứng nhắc.', 'public/post/highlights/1.html', './img/feature/highlights/1.jpg', '2019-05-30'),
(2, 'highlights', 'Làm sao để du lịch Việt Nam đón thêm khách nhà giàu?', 'Miễn visa, nâng cao chất lượng dịch vụ là một số hiến kế được đưa ra để du lịch Việt Nam có thể thu hút khách nhà giàu.', 'public/post/highlights/2.html', './img/feature/highlights/2.jpg', '2019-06-01'),
(3, 'highlights', 'Bí quyết kiếm nhiều tiền của triệu phú 26 tuổi', 'Josh Altman luôn tìm cách gây ấn tượng tốt với người đối diện ngay từ giây đầu tiên gặp mặt.', 'public/post/highlights/3.html', './img/feature/highlights/3.jpg', '2019-05-09'),
(4, 'highlights', 'Kim Jong-un chăm chú theo dõi tên lửa khai hỏa trong Diễn tập', 'Chủ tịch Triều Tiên ngày 4/5 tới thị sát trực tiếp vụ phóng thử tên lửa tầm ngắn và pháo phản lực tại thao trường gần thành phố Wonsan.', 'public/post/highlights/4.html', './img/feature/highlights/4.jpg', '2019-06-03');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`,`name`);

--
-- Chỉ mục cho bảng `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `post`
--
ALTER TABLE `post`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
