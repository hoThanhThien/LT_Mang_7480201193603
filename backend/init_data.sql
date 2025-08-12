-- Insert default roles
INSERT INTO `role` (`RoleID`, `RoleName`) VALUES
(1, 'admin'),
(2, 'guide'), 
(3, 'user')
ON DUPLICATE KEY UPDATE RoleName = VALUES(RoleName);

-- Insert default categories
INSERT INTO `category` (`CategoryID`, `CategoryName`, `Description`) VALUES
(1, 'Adventure', 'Adventure and outdoor activities'),
(2, 'Cultural', 'Cultural and historical tours'),
(3, 'Beach', 'Beach and coastal tours'),
(4, 'City', 'City and urban tours'),
(5, 'Nature', 'Nature and wildlife tours')
ON DUPLICATE KEY UPDATE CategoryName = VALUES(CategoryName);

-- Insert default admin user (password: admin123)
INSERT INTO `user` (`UserID`, `FirstName`, `LastName`, `FullName`, `Password`, `Phone`, `Email`, `RoleID`) VALUES
(1, 'Admin', 'User', 'Admin User', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj7.bKSUBjAa', '0123456789', 'admin@example.com', 1)
ON DUPLICATE KEY UPDATE Email = VALUES(Email);
