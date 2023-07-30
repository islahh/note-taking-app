CREATE TABLE user_notes (
  id int NOT NULL AUTO_INCREMENT,
  title varchar(250) NOT NULL,
  content text NULL,
  type varchar(50) NOT NULL,
  user_id int NOT NULL,
  createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),           
  updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);