/* 
	Garai Gergely
	Sári Gábor
	
	Project: Álláskereső adatbázis
	Szerda 12-14
*/


CREATE TABLE Seekers (
	id INT NOT NULL,
	username varchar2(100) NOT NULL,
	password varchar2(200) NOT NULL,
	name varchar2(250) NOT NULL,
	birth DATE NOT NULL,
	lastActive DATE,
	status NUMBER(1),
	CV blob,
	rate DECIMAL(5,2),
	constraint SEEKERS_PK PRIMARY KEY (id),
	CONSTRAINT seekers_username_unique UNIQUE (username)
);

CREATE sequence SEEKERS_SEQ START WITH 1;



CREATE TABLE Companies (
	id INT NOT NULL,
	username varchar2(100) NOT NULL,
	password varchar2(200) NOT NULL,
	name varchar2(250) NOT NULL,
	address varchar2(250) NOT NULL,
	webpage varchar2(250),
	details varchar2(1000),
	rate DECIMAL(5,2),
	constraint COMPANIES_PK PRIMARY KEY (id),
	CONSTRAINT companies_username_unique UNIQUE (username)
);

CREATE sequence COMPANIES_SEQ START WITH 1;



CREATE TABLE Jobs (
	id INT NOT NULL,
	name varchar2(500) NOT NULL,
	companyId INT NOT NULL,
	address varchar2(250),
	starts DATE,
	ends DATE,
	salary INT,
	maxApplication INT,
	hr INT,
	constraint JOBS_PK PRIMARY KEY (id)
);

CREATE sequence JOBS_SEQ START WITH 1;

CREATE TABLE Tags (
	id INT NOT NULL,
	name varchar2(250),
	constraint TAGS_PK PRIMARY KEY (id)
);
CREATE sequence TAGS_SEQ START WITH 1;


CREATE TABLE HRs (
	id INT NOT NULL,
	username varchar2(100) NOT NULL,
	password varchar2(200) NOT NULL,
	name varchar2(250),
	phone varchar2(50),
	constraint HRS_PK PRIMARY KEY (id),
	CONSTRAINT hrs_username_unique UNIQUE (username)
);

CREATE sequence HRS_SEQ START WITH 1;


CREATE TABLE Applications (
	id INT NOT NULL,
	jobId INT NOT NULL,
	seekerId INT NOT NULL,
	text varchar2(2500),
	accepted NUMBER(1),
	rate DECIMAL(5,2),
	constraint APPLICATIONS_PK PRIMARY KEY (id)
);

CREATE sequence APPLICATIONS_SEQ START WITH 1;

CREATE TABLE JobTags (
	jobId INT NOT NULL,
	tagId INT NOT NULL,
	constraint JOBTAGS_PK PRIMARY KEY (jobId,tagId)
);

CREATE TABLE SeekerTags (
	seekerId INT NOT NULL,
	tagId INT NOT NULL,
	constraint SEEKERTAGS_PK PRIMARY KEY (seekerId,tagId)
);



ALTER TABLE Jobs ADD CONSTRAINT Jobs_fk0 FOREIGN KEY (companyId) REFERENCES Companies(id);
ALTER TABLE Jobs ADD CONSTRAINT Jobs_fk1 FOREIGN KEY (hr) REFERENCES HRs(id);

ALTER TABLE Applications ADD CONSTRAINT Applications_fk0 FOREIGN KEY (jobId) REFERENCES Jobs(id);
ALTER TABLE Applications ADD CONSTRAINT Applications_fk1 FOREIGN KEY (seekerId) REFERENCES Seekers(id);

ALTER TABLE JobTags ADD CONSTRAINT JobTags_fk0 FOREIGN KEY (jobId) REFERENCES Jobs(id);
ALTER TABLE JobTags ADD CONSTRAINT JobTags_fk1 FOREIGN KEY (tagId) REFERENCES Tags(id);

ALTER TABLE SeekerTags ADD CONSTRAINT SeekerTags_fk0 FOREIGN KEY (seekerId) REFERENCES Seekers(id);
ALTER TABLE SeekerTags ADD CONSTRAINT SeekerTags_fk1 FOREIGN KEY (tagId) REFERENCES Tags(id);



CREATE trigger BI_HRS
  before insert on HRs
  for each row
begin
  select HRS_SEQ.nextval into :NEW.id from dual;
end;

CREATE trigger BI_TAGS
  before insert on Tags
  for each row
begin
  select TAGS_SEQ.nextval into :NEW.id from dual;
end;

CREATE trigger BI_APPLICATIONS
  before insert on Applications
  for each row
begin
  select APPLICATIONS_SEQ.nextval into :NEW.id from dual;
end;

CREATE trigger BI_JOBS
  before insert on Jobs
  for each row
begin
  select JOBS_SEQ.nextval into :NEW.id from dual;
end;

CREATE OR REPLACE TRIGGER BI_COMPANIES
  before insert on Companies
  for each row
begin
  select COMPANIES_SEQ.nextval into :new.id from dual;
end;

CREATE OR REPLACE TRIGGER BI_SEEKERS
  before insert on Seekers
  for each row
begin
  select SEEKERS_SEQ.nextval into :new.id from dual;
end;







INSERT ALL
  INTO companies (name,username,password, address, webpage, details, rate) VALUES ('Apple','apple','apple', '1 Infinite Loop Cupertino, CA 95014', 'www.apple.com', 'We <3 iPhone', 10)
  INTO companies (name,username,password, address, webpage, details, rate) VALUES ('Google','google','google', '420 Bill Gates Av. San Fransicso, CA 43212', 'www.google.com', 'Google, u know it', 10)
  INTO companies (name,username,password, address, webpage, details, rate) VALUES ('IBM','ibm','ibm', '2 Big Machine St. Boston, MA 95014', 'www.ibm.com', 'Old tech company', 10)
  INTO companies (name,username,password, address, webpage, details, rate) VALUES ('DOMINO','domino','domino', 'USA', 'www.domino.com', 'hot pizza', 10)
  INTO companies (name,username,password, address, webpage, details, rate) VALUES ('EPAM','epam','epam', 'USA', 'www.epam.com', 'it', 10)
  INTO companies (name,username,password, address, webpage, details, rate) VALUES ('Tesla','tesla','tesla', 'USA', 'www.tesla.com', 'card & tech', 10)
  INTO companies (name,username,password, address, webpage, details, rate) VALUES ('Dell','dell','dell', 'USA', 'www.dell.com', 'tech', 10)
  INTO companies (name,username,password, address, webpage, details, rate) VALUES ('Aula','aula','aula', 'USA', 'www.aula.com', 'tech', 10)
  INTO companies (name,username,password, address, webpage, details, rate) VALUES ('Trust','trust','trust', 'USA', 'www.trust.com', 'tech', 10)
  INTO companies (name,username,password, address, webpage, details, rate) VALUES ('Samsung','samsung','samsung', 'USA', 'www.samsung.com', 'tech', 10)
SELECT * FROM dual;

INSERT ALL
  INTO hrs(name,username,password, phone) VALUES ('Suzan Brown','test1','test', '1234567')
  INTO hrs(name,username,password, phone) VALUES ('Kevin Doyle','test2','test', '12341231')
  INTO hrs(name,username,password, phone) VALUES ('Haley Williams','test3','test', '35525121')
SELECT * FROM dual;


INSERT ALL
  INTO tags(name) VALUES ('developer')
  INTO tags(name) VALUES ('clean')
  INTO tags(name) VALUES ('CFO')
  INTO tags(name) VALUES ('WORK')
SELECT * FROM dual;

INSERT ALL
  INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Kis Béla','test1','test', TO_DATE('1994/07/09', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 8)
  INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Bozó Laci','test2','test', TO_DATE('1992/05/11', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 10)
  INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Nagy Imre','test3','test', TO_DATE('1975/04/22', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 7)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Estella Barrera','test4','test', TO_DATE('1985/09/08', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 0)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Cohen Greene','test5','test', TO_DATE('1994/06/27', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 4)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Katrina Gates','test6','test', TO_DATE('1995/08/11', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 3)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Maxwell Singleton','test7','test', TO_DATE('2001/02/07', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 0)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Deirdre Fowler','test8','test', TO_DATE('1970/03/08', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 5)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Rutledge Rios','test9','test', TO_DATE('2004/04/03', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 0)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Calhoun Velez','test10','test', TO_DATE('2010/02/07', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 4)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Foley Turner','test11','test', TO_DATE('1971/12/18', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 8)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Mclean Mcpherson','test12','test', TO_DATE('1974/07/31', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 10)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Kelsey Tillman','test13','test', TO_DATE('2006/09/11', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 6)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Bruce Jefferson','test14','test', TO_DATE('2014/06/12', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 6)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Alisha Fulton','test15','test', TO_DATE('2004/01/21', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 1)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Lakeisha Melton','test16','test', TO_DATE('2017/09/20', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 9)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Sue Cote','test17','test', TO_DATE('1974/09/12', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 1)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Welch Rasmussen','test18','test', TO_DATE('1991/08/01', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 6)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Fay Wilkinson','test19','test', TO_DATE('2007/07/23', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 8)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Davis Pollard','test20','test', TO_DATE('2009/09/29', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 3)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Pennington Johnston','test21','test', TO_DATE('1983/04/10', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 7)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Mitchell Lynn','test22','test', TO_DATE('2012/04/09', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 8)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Janell Bartlett','test23','test', TO_DATE('2000/04/05', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 7)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Adkins Baxter','test24','test', TO_DATE('2013/05/20', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 10)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Branch Adams','test25','test', TO_DATE('2010/09/02', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 4)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Shannon Hoover','test26','test', TO_DATE('1992/09/21', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 8)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Stafford Barron','test27','test', TO_DATE('2012/09/17', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 5)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Alana Daniels','test28','test', TO_DATE('1975/04/14', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 9)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Fern Eaton','test29','test', TO_DATE('2007/07/04', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 10)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Roberts Schmidt','test30','test', TO_DATE('1998/10/13', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 4)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Spence Park','test31','test', TO_DATE('2005/04/01', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 2)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Baxter Schneider','test32','test', TO_DATE('1976/08/04', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 0)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Houston Clay','test33','test', TO_DATE('1973/05/15', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 10)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Kelly Santana','test34','test', TO_DATE('1995/01/05', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 6)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Graciela Massey','test35','test', TO_DATE('2002/09/26', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 9)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Lidia Cline','test36','test', TO_DATE('2015/04/17', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 5)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Maritza Castillo','test37','test', TO_DATE('2016/01/02', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 1)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Reva Lindsay','test38','test', TO_DATE('1972/04/02', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 2)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Krista Gomez','test39','test', TO_DATE('1988/02/13', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 10)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Gaines Cooke','test40','test', TO_DATE('1982/08/02', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 4)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Ballard Alexander','test41','test', TO_DATE('1984/05/13', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 8)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Higgins Gardner','test42','test', TO_DATE('1991/07/30', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 4)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Charlotte Booth','test43','test', TO_DATE('1983/02/02', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 1)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Lenora Brewer','test44','test', TO_DATE('2015/11/09', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 3)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Gay Goodman','test45','test', TO_DATE('1997/01/09', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 0)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Hunt Ballard','test46','test', TO_DATE('2007/04/28', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 9)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Irma Lancaster','test47','test', TO_DATE('2008/09/18', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 1)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Britt Cain','test48','test', TO_DATE('1971/12/18', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 3)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Carmen Booker','test49','test', TO_DATE('2008/09/14', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 2)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Cantu Clark','test50','test', TO_DATE('1986/03/19', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 8)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Short Dawson','test51','test', TO_DATE('2010/02/23', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 2)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Susanna Blackburn','test52','test', TO_DATE('1972/02/19', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 2)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Strickland Sandoval','test53','test', TO_DATE('1996/05/20', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 5)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Andrews Delacruz','test54','test', TO_DATE('1983/04/22', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 3)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Jones Kelly','test55','test', TO_DATE('2009/04/15', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 4)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Steele Bentley','test56','test', TO_DATE('2001/11/30', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 0)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Orr Miles','test57','test', TO_DATE('1984/11/30', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 4)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Lara Shields','test58','test', TO_DATE('2018/10/26', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 7)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Leann Holland','test59','test', TO_DATE('2010/05/05', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 0)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Hanson Wall','test60','test', TO_DATE('2009/02/20', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 4)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Reese Harmon','test61','test', TO_DATE('2003/08/17', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 4)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Hicks Whitney','test62','test', TO_DATE('1984/02/22', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 6)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Perez Jordan','test63','test', TO_DATE('1977/01/12', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 1)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Shaffer Dean','test64','test', TO_DATE('1984/04/22', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 7)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Levine Rosales','test65','test', TO_DATE('1977/10/07', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 4)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Bettie Graham','test66','test', TO_DATE('1987/07/02', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 2)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Carole Haley','test67','test', TO_DATE('2017/11/16', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 1)
INTO seekers(name,username,password, birth, status, cv, rate) VALUES ('Jan Rich','test68','test', TO_DATE('1978/07/01', 'yyyy/mm/dd'), 1, hextoraw('453d7a34') , 9)


SELECT * FROM dual;


INSERT ALL
  INTO jobs (name, companyid, address, starts, ends, salary, maxapplication, hr ) VALUES ('Angular developer',1, '1 Infinite Loop Cupertino, CA 95014',TO_DATE('2019/07/09', 'yyyy/mm/dd'),TO_DATE('2019/10/09', 'yyyy/mm/dd'), 90000, 5, 1)
  INTO jobs (name, companyid, address, starts, ends, salary, maxapplication, hr ) VALUES ('Cleaning lady',2, '420 Bill Gates Av. San Fransicso, CA 43212',TO_DATE('2019/05/09', 'yyyy/mm/dd'),TO_DATE('2019/08/09', 'yyyy/mm/dd'), 45000, 3, 2)
  INTO jobs (name, companyid, address, starts, ends, salary, maxapplication, hr ) VALUES ('Chief Financial Officer',3, '2 Big Machine St. Boston, MA 95014',TO_DATE('2019/03/09', 'yyyy/mm/dd'),TO_DATE('2019/05/09', 'yyyy/mm/dd'), 140000, 1, 3)
  INTO jobs (name, companyid, address, starts, ends, salary, maxapplication, hr ) VALUES ('Portás',28, 'USA',TO_DATE('2019/03/09', 'yyyy/mm/dd'),TO_DATE('2019/05/09', 'yyyy/mm/dd'), 14000, 1, 1)
  INTO jobs (name, companyid, address, starts, ends, salary, maxapplication, hr ) VALUES ('Kutyasétáltató',29, 'USA',TO_DATE('2019/03/10', 'yyyy/mm/dd'),TO_DATE('2019/10/09', 'yyyy/mm/dd'), 12300, 1, 2)
  INTO jobs (name, companyid, address, starts, ends, salary, maxapplication, hr ) VALUES ('Szakács',30, 'USA',TO_DATE('2019/02/26', 'yyyy/mm/dd'),TO_DATE('2019/08/09', 'yyyy/mm/dd'), 65300, 1, 3)
  INTO jobs (name, companyid, address, starts, ends, salary, maxapplication, hr ) VALUES ('Tesi tanár',31, 'USA',TO_DATE('2019/05/16', 'yyyy/mm/dd'),TO_DATE('2019/07/24', 'yyyy/mm/dd'), 123567, 1, 1)
  INTO jobs (name, companyid, address, starts, ends, salary, maxapplication, hr ) VALUES ('Sörkóstoló',32, 'USA',TO_DATE('2019/03/19', 'yyyy/mm/dd'),TO_DATE('2019/05/09', 'yyyy/mm/dd'), 9864, 1, 2)
  INTO jobs (name, companyid, address, starts, ends, salary, maxapplication, hr ) VALUES ('Pultos',33, 'USA',TO_DATE('2019/05/09', 'yyyy/mm/dd'),TO_DATE('2019/06/09', 'yyyy/mm/dd'), 23421, 1, 3)
  INTO jobs (name, companyid, address, starts, ends, salary, maxapplication, hr ) VALUES ('Operatőr',34, 'USA',TO_DATE('2019/10/09', 'yyyy/mm/dd'),TO_DATE('2019/12/09', 'yyyy/mm/dd'), 51241, 1, 1)
  INTO jobs (name, companyid, address, starts, ends, salary, maxapplication, hr ) VALUES ('Betanított munka',1, 'USA',TO_DATE('2019/08/09', 'yyyy/mm/dd'),TO_DATE('2019/10/09', 'yyyy/mm/dd'), 51231, 1, 2)
  INTO jobs (name, companyid, address, starts, ends, salary, maxapplication, hr ) VALUES ('Kőműves',2, 'USA',TO_DATE('2019/02/09', 'yyyy/mm/dd'),TO_DATE('2019/04/09', 'yyyy/mm/dd'), 85473, 1, 3)
  INTO jobs (name, companyid, address, starts, ends, salary, maxapplication, hr ) VALUES ('Cukrász',3, 'USA',TO_DATE('2019/01/09', 'yyyy/mm/dd'),TO_DATE('2019/08/09', 'yyyy/mm/dd'), 82341, 1, 1)
  INTO jobs (name, companyid, address, starts, ends, salary, maxapplication, hr ) VALUES ('Börtönőr',28, 'USA',TO_DATE('2019/05/09', 'yyyy/mm/dd'),TO_DATE('2019/12/09', 'yyyy/mm/dd'), 12312, 1, 2)
SELECT * FROM dual;

INSERT ALL
  INTO applications(jobid, seekerid, text) VALUES (1,1,'lorem..')
  INTO applications(jobid, seekerid, text) VALUES (2,2,'lorem..')
  INTO applications(jobid, seekerid, text) VALUES (3,3,'lorem..')
SELECT * FROM dual;

INSERT ALL
  INTO seekertags(seekerid, tagid) VALUES (1,1)
  INTO seekertags(seekerid, tagid) VALUES (2,2)
  INTO seekertags(seekerid, tagid) VALUES (3,3)
SELECT * FROM dual;

INSERT ALL
  INTO jobtags(jobid, tagid) VALUES (1,1)
  INTO jobtags(jobid, tagid) VALUES (2,2)
  INTO jobtags(jobid, tagid) VALUES (3,3)
  INTO jobtags(jobid, tagid) VALUES (4,4)
  INTO jobtags(jobid, tagid) VALUES (5,4)
  INTO jobtags(jobid, tagid) VALUES (6,4)
  INTO jobtags(jobid, tagid) VALUES (7,4)
  INTO jobtags(jobid, tagid) VALUES (8,4)
  INTO jobtags(jobid, tagid) VALUES (9,4)
  INTO jobtags(jobid, tagid) VALUES (10,4)
  INTO jobtags(jobid, tagid) VALUES (11,4)
  INTO jobtags(jobid, tagid) VALUES (12,4)
  INTO jobtags(jobid, tagid) VALUES (13,4)
  INTO jobtags(jobid, tagid) VALUES (14,4)
SELECT * FROM dual;



CREATE PROCEDURE CLEAR_SEEKERS
IS
BEGIN
   UPDATE seekers SET status = 0 where lastActive <  SYSDATE  - 14;
END;

