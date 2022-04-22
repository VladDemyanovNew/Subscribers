USE Subscribers;
GO

-- Test creating users and roles
INSERT Subscribers.dbo.users(email, [password], nickname)
VALUES('user1@mail.ru', 'admin', 'user1'),
	  ('user2@mail.ru', 'admin', 'user2');

INSERT Subscribers.dbo.roles([name])
VALUES('ADMIN'),
	  ('USER');

INSERT Subscribers.dbo.user_roles(userId, roleId)
VALUES(24, 1);
GO

INSERT Subscribers.dbo.posts(content, title, imagePath, ownerId)
VALUES('First post', 'First post', 'https://image.png', 6),
('Second post', 'Second post', 'https://image.png', 6);
