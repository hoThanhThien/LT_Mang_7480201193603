-- Thêm bảng comment cho đánh giá tour
CREATE TABLE `comment` (
  `CommentID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) DEFAULT NULL,
  `TourID` int(11) DEFAULT NULL,
  `Content` text DEFAULT NULL,
  `Rating` int(11) DEFAULT NULL CHECK (Rating >= 1 AND Rating <= 5),
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`CommentID`),
  KEY `UserID` (`UserID`),
  KEY `TourID` (`TourID`),
  CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`),
  CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`TourID`) REFERENCES `tour` (`TourID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
