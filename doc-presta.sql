-- doc_presta.ComercialMedicines definition

CREATE TABLE `ComercialMedicines` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `creationDate` datetime NOT NULL,
  `ModificationDate` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- doc_presta.ConcentratedMedicines definition

CREATE TABLE `ConcentratedMedicines` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quantity` varchar(255) NOT NULL,
  `magnitude` enum('MG','G','ML','CM3') NOT NULL,
  `creationDate` datetime NOT NULL,
  `modificationDate` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- doc_presta.FamilyMedicines definition

CREATE TABLE `FamilyMedicines` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `creationDate` datetime NOT NULL,
  `ModificationDate` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- doc_presta.Persons definition

CREATE TABLE `Persons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `birthDate` datetime NOT NULL,
  `numberDocument` varchar(255) NOT NULL,
  `typeDocument` enum('DNI','Pasaporte','Otro') NOT NULL,
  `sex` enum('Masculino','Femenino','Otro') NOT NULL,
  `state` tinyint(1) DEFAULT '1',
  `creationDate` datetime NOT NULL,
  `ModificationDate` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numberDocument` (`numberDocument`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- doc_presta.PharmaForms definition

CREATE TABLE `PharmaForms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `creationDate` datetime NOT NULL,
  `modificationDate` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- doc_presta.Profesions definition

CREATE TABLE `Profesions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `state` tinyint(1) DEFAULT '1',
  `creationDate` datetime NOT NULL,
  `modificationDate` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- doc_presta.QuantityMeds definition

CREATE TABLE `QuantityMeds` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quantity` varchar(255) NOT NULL COMMENT 'Unidad de Medida, o cantidad de medicamentos. Ejemplo: 14unidades',
  `creationDate` datetime NOT NULL,
  `modificationDate` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- doc_presta.Sections definition

CREATE TABLE `Sections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT '1',
  `code` varchar(255) NOT NULL,
  `state` tinyint(1) DEFAULT '1',
  `creationDate` datetime NOT NULL,
  `modificationDate` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- doc_presta.Sicknesses definition

CREATE TABLE `Sicknesses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT '1',
  `code` varchar(255) DEFAULT '1',
  `description` varchar(255) DEFAULT '1',
  `treatment` varchar(255) DEFAULT '1',
  `creationDate` datetime NOT NULL,
  `modificationDate` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- doc_presta.SocialWorks definition

CREATE TABLE `SocialWorks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT '1',
  `CUIT` varchar(255) DEFAULT '1',
  `code` varchar(255) DEFAULT '1',
  `status` tinyint(1) DEFAULT '1',
  `creationDate` datetime NOT NULL,
  `modificationDate` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `CUIT` (`CUIT`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- doc_presta.Specialities definition

CREATE TABLE `Specialities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `state` tinyint(1) DEFAULT '1',
  `creationDate` datetime NOT NULL,
  `modificationDate` datetime NOT NULL,
  `profesionId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- doc_presta.Benefits definition

CREATE TABLE `Benefits` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `justification` varchar(255) DEFAULT NULL,
  `state` tinyint(1) DEFAULT '1',
  `creationDate` datetime NOT NULL,
  `modificationDate` datetime NOT NULL,
  `sectionId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `sectionId` (`sectionId`),
  UNIQUE KEY `code_2` (`code`),
  CONSTRAINT `Benefits_ibfk_1` FOREIGN KEY (`sectionId`) REFERENCES `Sections` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- doc_presta.Medicines definition

CREATE TABLE `Medicines` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT '1',
  `code` varchar(255) DEFAULT '1',
  `state` tinyint(1) DEFAULT '1',
  `creationDate` datetime NOT NULL,
  `modificationDate` datetime NOT NULL,
  `ComercialMedicineId` int DEFAULT NULL,
  `FamilyMedicineId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `ComercialMedicineId` (`ComercialMedicineId`),
  KEY `FamilyMedicineId` (`FamilyMedicineId`),
  CONSTRAINT `Medicines_ibfk_1` FOREIGN KEY (`ComercialMedicineId`) REFERENCES `ComercialMedicines` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Medicines_ibfk_2` FOREIGN KEY (`FamilyMedicineId`) REFERENCES `FamilyMedicines` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- doc_presta.PharmaForm_Medicine definition

CREATE TABLE `PharmaForm_Medicine` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `MedicineId` int NOT NULL,
  `PharmaFormId` int NOT NULL,
  PRIMARY KEY (`MedicineId`,`PharmaFormId`),
  KEY `PharmaFormId` (`PharmaFormId`),
  CONSTRAINT `PharmaForm_Medicine_ibfk_1` FOREIGN KEY (`MedicineId`) REFERENCES `Medicines` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `PharmaForm_Medicine_ibfk_2` FOREIGN KEY (`PharmaFormId`) REFERENCES `PharmaForms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- doc_presta.PlanesOS definition

CREATE TABLE `PlanesOS` (
  `id` int NOT NULL AUTO_INCREMENT,
  `state` tinyint(1) DEFAULT '1',
  `creationDate` datetime NOT NULL,
  `modificationDate` datetime NOT NULL,
  `socialWorkId` int NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `socialWorkId` (`socialWorkId`),
  CONSTRAINT `PlanesOS_ibfk_1` FOREIGN KEY (`socialWorkId`) REFERENCES `SocialWorks` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- doc_presta.QuantityMed_Medicine definition

CREATE TABLE `QuantityMed_Medicine` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `MedicineId` int NOT NULL,
  `QuantityMedId` int NOT NULL,
  PRIMARY KEY (`MedicineId`,`QuantityMedId`),
  KEY `QuantityMedId` (`QuantityMedId`),
  CONSTRAINT `QuantityMed_Medicine_ibfk_1` FOREIGN KEY (`MedicineId`) REFERENCES `Medicines` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `QuantityMed_Medicine_ibfk_2` FOREIGN KEY (`QuantityMedId`) REFERENCES `QuantityMeds` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- doc_presta.Users definition

CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `hashPassword` varchar(255) NOT NULL,
  `rol` enum('ADMIN','PROFESIONAL','PACIENTE') NOT NULL,
  `email` varchar(255) NOT NULL,
  `state` tinyint(1) DEFAULT '1',
  `creationDate` datetime NOT NULL,
  `modificationDate` datetime NOT NULL,
  `personId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `personId` (`personId`),
  CONSTRAINT `Users_ibfk_1` FOREIGN KEY (`personId`) REFERENCES `Persons` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- doc_presta.ComercialMedicine_Medicine definition

CREATE TABLE `ComercialMedicine_Medicine` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `ComercialMedicineId` int NOT NULL,
  `MedicineId` int NOT NULL,
  PRIMARY KEY (`ComercialMedicineId`,`MedicineId`),
  KEY `MedicineId` (`MedicineId`),
  CONSTRAINT `ComercialMedicine_Medicine_ibfk_1` FOREIGN KEY (`ComercialMedicineId`) REFERENCES `ComercialMedicines` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ComercialMedicine_Medicine_ibfk_2` FOREIGN KEY (`MedicineId`) REFERENCES `Medicines` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- doc_presta.ConcentratedMedicine_Medicine definition

CREATE TABLE `ConcentratedMedicine_Medicine` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `MedicineId` int NOT NULL,
  `ConcentratedMedicineId` int NOT NULL,
  PRIMARY KEY (`MedicineId`,`ConcentratedMedicineId`),
  KEY `ConcentratedMedicineId` (`ConcentratedMedicineId`),
  CONSTRAINT `ConcentratedMedicine_Medicine_ibfk_1` FOREIGN KEY (`MedicineId`) REFERENCES `Medicines` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ConcentratedMedicine_Medicine_ibfk_2` FOREIGN KEY (`ConcentratedMedicineId`) REFERENCES `ConcentratedMedicines` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- doc_presta.FamilyMedicine_Medicine definition

CREATE TABLE `FamilyMedicine_Medicine` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `FamilyMedicineId` int NOT NULL,
  `MedicineId` int NOT NULL,
  PRIMARY KEY (`FamilyMedicineId`,`MedicineId`),
  KEY `MedicineId` (`MedicineId`),
  CONSTRAINT `FamilyMedicine_Medicine_ibfk_1` FOREIGN KEY (`FamilyMedicineId`) REFERENCES `FamilyMedicines` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FamilyMedicine_Medicine_ibfk_2` FOREIGN KEY (`MedicineId`) REFERENCES `Medicines` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- doc_presta.Patients definition

CREATE TABLE `Patients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `state` tinyint(1) DEFAULT '1',
  `dateCreation` datetime NOT NULL,
  `dateModification` datetime NOT NULL,
  `userId` int NOT NULL,
  `planOSId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId` (`userId`),
  CONSTRAINT `Patients_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- doc_presta.Profesionals definition

CREATE TABLE `Profesionals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `legalAddress` varchar(255) NOT NULL,
  `registrationNumber` varchar(255) NOT NULL,
  `idREFEPS` varchar(255) NOT NULL,
  `creationDate` datetime NOT NULL,
  `modificationDate` datetime NOT NULL,
  `userId` int NOT NULL,
  `specialityId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `registrationNumber` (`registrationNumber`),
  UNIQUE KEY `idREFEPS` (`idREFEPS`),
  UNIQUE KEY `userId` (`userId`),
  CONSTRAINT `Profesionals_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- doc_presta.Prescriptions definition

CREATE TABLE `Prescriptions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `prescriptionDate` datetime NOT NULL,
  `validate` int NOT NULL,
  `creationDate` datetime NOT NULL,
  `modificationDate` datetime NOT NULL,
  `benefitId` int DEFAULT NULL,
  `patientId` int DEFAULT NULL,
  `sicknessId` int DEFAULT NULL,
  `profesionalId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `validate` (`validate`),
  KEY `benefitId` (`benefitId`),
  KEY `patientId` (`patientId`),
  KEY `sicknessId` (`sicknessId`),
  KEY `profesionalId` (`profesionalId`),
  CONSTRAINT `Prescriptions_ibfk_1` FOREIGN KEY (`benefitId`) REFERENCES `Benefits` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Prescriptions_ibfk_2` FOREIGN KEY (`patientId`) REFERENCES `Patients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Prescriptions_ibfk_3` FOREIGN KEY (`sicknessId`) REFERENCES `Sicknesses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Prescriptions_ibfk_4` FOREIGN KEY (`profesionalId`) REFERENCES `Profesionals` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;







INSERT INTO doc_presta.Benefits (id,name,code,description,justification,state,creationDate,modificationDate,sectionId) VALUES
	 (1,'Radiografia','RAD','Radiografia','justification',1,'2024-06-13 00:00:00','2024-06-13 00:00:00',13);
INSERT INTO doc_presta.ComercialMedicine_Medicine (createdAt,updatedAt,ComercialMedicineId,MedicineId) VALUES
	 ('2024-06-13 07:01:09','2024-06-13 07:01:09',4,15),
	 ('2024-06-13 07:01:07','2024-06-13 07:01:07',11,15),
	 ('2024-06-13 07:04:02','2024-06-13 07:04:02',12,16),
	 ('2024-06-13 07:04:02','2024-06-13 07:04:02',15,16);
INSERT INTO doc_presta.ComercialMedicines (id,name,creationDate,ModificationDate) VALUES
	 (4,'COCOMEX','2024-06-12 17:41:37','2024-06-12 17:41:37'),
	 (5,'COCOMEX-PLUS','2024-06-12 17:41:37','2024-06-12 17:41:37'),
	 (6,'CARANCHO PUX','2024-06-12 20:17:40','2024-06-12 20:17:40'),
	 (11,'IBUVANOL','2024-06-13 06:17:18','2024-06-13 06:17:18'),
	 (12,'AMOXE','2024-06-13 06:19:57','2024-06-13 06:19:57'),
	 (15,'ACTRON','2024-06-13 07:04:02','2024-06-13 07:04:02');
INSERT INTO doc_presta.ConcentratedMedicine_Medicine (createdAt,updatedAt,MedicineId,ConcentratedMedicineId) VALUES
	 ('2024-06-13 07:01:07','2024-06-13 07:01:07',15,1),
	 ('2024-06-13 07:01:09','2024-06-13 07:01:09',15,15),
	 ('2024-06-13 07:04:02','2024-06-13 07:04:02',16,2),
	 ('2024-06-13 07:04:03','2024-06-13 07:04:03',16,13);
INSERT INTO doc_presta.ConcentratedMedicines (id,quantity,magnitude,creationDate,modificationDate) VALUES
	 (1,'100','MG','2024-06-12 13:41:44','2024-06-12 13:41:44'),
	 (2,'1','G','2024-06-12 13:41:44','2024-06-12 13:41:44'),
	 (3,'500','ML','2024-06-12 13:41:44','2024-06-12 13:41:44'),
	 (4,'2','CM3','2024-06-12 13:41:44','2024-06-12 13:41:44'),
	 (6,'2','G','2024-06-12 17:41:37','2024-06-12 17:41:37'),
	 (7,'1','MG','2024-06-12 17:41:37','2024-06-12 17:41:37'),
	 (10,'3','MG','2024-06-12 20:10:20','2024-06-12 20:10:20'),
	 (13,'500','MG','2024-06-13 06:17:18','2024-06-13 06:17:18'),
	 (15,'100','G','2024-06-13 07:01:08','2024-06-13 07:01:08'),
	 (17,'100','ML','2024-06-13 07:08:29','2024-06-13 07:08:29');
INSERT INTO doc_presta.FamilyMedicine_Medicine (createdAt,updatedAt,FamilyMedicineId,MedicineId) VALUES
	 ('2024-06-13 07:01:08','2024-06-13 07:01:08',1,15),
	 ('2024-06-13 07:04:02','2024-06-13 07:04:02',1,16),
	 ('2024-06-13 07:01:09','2024-06-13 07:01:09',2,15),
	 ('2024-06-13 07:04:04','2024-06-13 07:04:04',11,16);
INSERT INTO doc_presta.FamilyMedicines (id,name,creationDate,ModificationDate) VALUES
	 (1,'ANTIBIOTICO','2024-06-11 00:00:00','2024-06-11 00:00:00'),
	 (2,'ANTICONCEPTIVO','2024-06-11 00:00:00','2024-06-11 00:00:00'),
	 (4,'COCO-FAMILY','2024-06-12 17:41:37','2024-06-12 17:41:37'),
	 (6,'ANTIHISTAMÍNICOS','2024-06-12 20:17:40','2024-06-12 20:17:40'),
	 (11,'ANALGÉSICOS','2024-06-13 06:17:18','2024-06-13 06:17:18');
INSERT INTO doc_presta.Medicines (id,name,code,state,creationDate,modificationDate,ComercialMedicineId,FamilyMedicineId) VALUES
	 (15,'IBUPROFENO','IBU',1,'2024-06-13 06:17:18','2024-06-13 07:01:07',NULL,NULL),
	 (16,'AMOXICILINA','AMX',1,'2024-06-13 06:19:54','2024-06-13 07:04:00',NULL,NULL);
INSERT INTO doc_presta.Patients (id,state,dateCreation,dateModification,userId,planOSId) VALUES
	 (1,1,'2025-05-29 00:00:00','2025-05-29 00:00:00',2,11),
	 (3,1,'2024-06-10 04:25:14','2024-06-10 04:25:14',22,11);
INSERT INTO doc_presta.Persons (id,firstName,lastName,birthDate,numberDocument,typeDocument,sex,state,creationDate,ModificationDate) VALUES
	 (1,'Paulo Nicolas','Cabrera','1990-01-31 00:00:00','35104957','DNI','Masculino',1,'2024-05-29 00:23:30','2024-05-29 00:23:30'),
	 (2,'María','López','1995-11-20 00:00:00','35204958','DNI','Femenino',1,'2024-05-29 05:33:46','2024-05-29 05:33:46'),
	 (3,'Carlos Albreto','Gómezz','1999-02-28 00:00:00','35304959','DNI','Masculino',1,'2024-05-29 05:33:46','2024-05-29 05:33:46'),
	 (4,'Lucía','Martínez','1998-07-14 00:00:00','35404960','DNI','Femenino',1,'2024-05-29 05:33:46','2024-05-29 05:33:46'),
	 (5,'Javier','Fernández','2001-03-23 00:00:00','35504961','DNI','Masculino',1,'2024-05-29 05:33:46','2024-05-29 05:33:46'),
	 (6,'Ana','Sánchez','1997-08-30 00:00:00','35604962','DNI','Femenino',1,'2024-05-29 05:33:46','2024-05-29 05:33:46'),
	 (7,'Miguel','Pérez','2000-12-11 00:00:00','35704963','DNI','Masculino',1,'2024-05-29 05:33:46','2024-05-29 05:33:46'),
	 (8,'Laura','García','1996-04-05 00:00:00','35804964','DNI','Femenino',1,'2024-05-29 05:33:46','2024-05-29 05:33:46'),
	 (9,'Fernando','Hernández','1999-10-22 00:00:00','35904965','DNI','Masculino',1,'2024-05-29 05:33:46','2024-05-29 05:33:46'),
	 (10,'Isabel','Ramírez','1998-09-17 00:00:00','36004966','DNI','Femenino',1,'2024-05-29 05:33:46','2024-05-29 05:33:46');
INSERT INTO doc_presta.Persons (id,firstName,lastName,birthDate,numberDocument,typeDocument,sex,state,creationDate,ModificationDate) VALUES
	 (17,'John Preuba','Doe Prueba','1990-01-01 00:00:00','12345678','DNI','Masculino',1,'2024-06-03 13:46:12','2024-06-03 13:46:12'),
	 (18,'John Prueba 2','Doe Prueba 3','1990-01-01 00:00:00','87654 321','DNI','Masculino',1,'2024-06-04 04:46:10','2024-06-04 04:46:10'),
	 (26,'Misha','Cabrera','2024-06-20 00:00:00','35104958','DNI','Femenino',1,'2024-06-06 04:09:42','2024-06-06 04:09:42'),
	 (41,'Fernanda','Ochoa','2024-06-06 00:00:00','34699512','DNI','Femenino',1,'2024-06-09 17:54:15','2024-06-09 17:54:15'),
	 (47,'Liliana Alba','Villegas','1988-12-12 00:00:00','13721090','DNI','Femenino',1,'2024-06-10 04:25:13','2024-06-10 04:25:13');
INSERT INTO doc_presta.PharmaForm_Medicine (createdAt,updatedAt,MedicineId,PharmaFormId) VALUES
	 ('2024-06-13 07:01:07','2024-06-13 07:01:07',15,1),
	 ('2024-06-13 07:04:03','2024-06-13 07:04:03',16,3),
	 ('2024-06-13 07:04:02','2024-06-13 07:04:02',16,5);
INSERT INTO doc_presta.PharmaForms (id,name,creationDate,modificationDate) VALUES
	 (1,'CAPSULA','2024-06-12 13:34:33','2024-06-12 13:34:33'),
	 (2,'GOTA','2024-06-12 13:34:33','2024-06-12 13:34:33'),
	 (3,'AMPOLLA','2024-06-12 13:34:33','2024-06-12 13:34:33'),
	 (4,'JARABE','2024-06-12 13:34:33','2024-06-12 13:34:33'),
	 (5,'COMPRIMIDO','2024-06-12 13:34:33','2024-06-12 13:34:33'),
	 (6,'OTROS','2024-06-12 13:34:33','2024-06-12 13:34:33');
INSERT INTO doc_presta.PlanesOS (id,state,creationDate,modificationDate,socialWorkId,name) VALUES
	 (11,1,'2024-05-29 05:49:54','2024-05-29 05:49:54',1,'310'),
	 (12,1,'2024-05-29 05:49:54','2024-05-29 05:49:54',3,'410'),
	 (13,1,'2024-05-29 05:49:54','2024-05-29 05:49:54',2,'SM300');
INSERT INTO doc_presta.Prescriptions (id,prescriptionDate,validate,creationDate,modificationDate,benefitId,patientId,sicknessId,profesionalId) VALUES
	 (1,'2024-06-13 00:00:00',30,'2024-06-13 00:00:00','2024-06-13 00:00:00',1,3,4,7),
	 (2,'2024-06-13 00:00:00',15,'2024-06-13 00:00:00','2024-06-13 00:00:00',1,3,4,1);
INSERT INTO doc_presta.Profesionals (id,legalAddress,registrationNumber,idREFEPS,creationDate,modificationDate,userId,specialityId) VALUES
	 (1,'Pringles 354','12312312','12312312','2024-05-29 00:00:00','2024-05-29 00:00:00',1,11),
	 (7,'Terrazas del Portesuelo','65431238','65431238','2024-06-09 17:54:15','2024-06-09 17:54:15',17,1);
INSERT INTO doc_presta.Profesions (id,name,code,description,state,creationDate,modificationDate) VALUES
	 (2,'Pediatra','PED','Pediatra / Especialista en niños',1,'2024-05-30 00:00:00','2024-05-30 00:00:00'),
	 (3,'Dermatólogo','DERM','Dermatólogo / Especialista en piel',1,'2024-05-30 00:00:00','2024-05-30 00:00:00'),
	 (4,'Ginecólogo','GINE','Ginecólogo / Especialista en salud femenina',1,'2024-05-31 00:00:00','2024-05-31 00:00:00'),
	 (5,'Neurólogo','NEUR','Neurólogo / Especialista en sistema nervioso',1,'2024-05-31 00:00:00','2024-05-31 00:00:00'),
	 (6,'Oftalmólogo','OFTAL','Oftalmólogo / Especialista en ojos',1,'2024-06-01 00:00:00','2024-06-01 00:00:00'),
	 (7,'Otorrinolaringólogo','OTOR','Otorrinolaringólogo / Especialista en oídos, nariz y garganta',1,'2024-06-01 00:00:00','2024-06-01 00:00:00'),
	 (8,'Psiquiatra','PSIQ','Psiquiatra / Especialista en salud mental',1,'2024-06-02 00:00:00','2024-06-02 00:00:00'),
	 (9,'Traumatólogo','TRAUM','Traumatólogo / Especialista en lesiones y fracturas',1,'2024-06-02 00:00:00','2024-06-02 00:00:00'),
	 (10,'Oncólogo','ONCO','Oncólogo / Especialista en cáncer',1,'2024-06-03 00:00:00','2024-06-03 00:00:00'),
	 (11,'Endocrinólogo','ENDO','Endocrinólogo / Especialista en hormonas',1,'2024-06-03 00:00:00','2024-06-03 00:00:00');
INSERT INTO doc_presta.Profesions (id,name,code,description,state,creationDate,modificationDate) VALUES
	 (12,'Reumatólogo','REUMA','Reumatólogo / Especialista en enfermedades reumáticas',1,'2024-06-04 00:00:00','2024-06-04 00:00:00'),
	 (13,'Gastroenterólogo','GASTRO','Gastroenterólogo / Especialista en sistema digestivo',1,'2024-06-04 00:00:00','2024-06-04 00:00:00'),
	 (14,'Neumólogo','NEUMO','Neumólogo / Especialista en sistema respiratorio',1,'2024-06-05 00:00:00','2024-06-05 00:00:00'),
	 (15,'Nefrólogo','NEFRO','Nefrólogo / Especialista en riñones',1,'2024-06-05 00:00:00','2024-06-05 00:00:00'),
	 (16,'Hematólogo','HEMA','Hematólogo / Especialista en sangre',1,'2024-06-06 00:00:00','2024-06-06 00:00:00'),
	 (17,'Urólogo','URO','Urólogo / Especialista en sistema urinario',1,'2024-06-06 00:00:00','2024-06-06 00:00:00'),
	 (18,'Cirujano General','CIRUG','Cirujano General / Especialista en cirugía general',1,'2024-06-07 00:00:00','2024-06-07 00:00:00'),
	 (19,'Médico General','MEDGEN','Médico General / Especialista en medicina general',1,'2024-06-07 00:00:00','2024-06-07 00:00:00'),
	 (20,'Internista','INTER','Internista / Especialista en medicina interna',1,'2024-06-08 00:00:00','2024-06-08 00:00:00');
INSERT INTO doc_presta.QuantityMed_Medicine (createdAt,updatedAt,MedicineId,QuantityMedId) VALUES
	 ('2024-06-13 07:01:07','2024-06-13 07:01:07',15,4),
	 ('2024-06-13 07:04:02','2024-06-13 07:04:02',16,2),
	 ('2024-06-13 07:04:02','2024-06-13 07:04:02',16,4);
INSERT INTO doc_presta.QuantityMeds (id,quantity,creationDate,modificationDate) VALUES
	 (1,'1','2024-06-11 00:00:00','2024-06-11 00:00:00'),
	 (2,'5','2024-06-11 00:00:00','2024-06-11 00:00:00'),
	 (3,'10','2024-06-11 00:00:00','2024-06-11 00:00:00'),
	 (4,'15','2024-06-11 00:00:00','2024-06-11 00:00:00'),
	 (5,'20','2024-06-11 00:00:00','2024-06-11 00:00:00'),
	 (6,'25','2024-06-11 00:00:00','2024-06-11 00:00:00'),
	 (7,'30','2024-06-11 00:00:00','2024-06-11 00:00:00'),
	 (8,'35','2024-06-11 00:00:00','2024-06-11 00:00:00'),
	 (9,'40','2024-06-11 00:00:00','2024-06-11 00:00:00'),
	 (10,'60','2024-06-11 00:00:00','2024-06-11 00:00:00');
INSERT INTO doc_presta.Sections (id,name,code,state,creationDate,modificationDate) VALUES
	 (11,'Cabeza','CAB',1,'2024-06-13 14:02:41','2024-06-13 14:02:41'),
	 (12,'Torso','TOR',1,'2024-06-13 14:02:41','2024-06-13 14:02:41'),
	 (13,'Brazo Izquierdo','BRA-I',1,'2024-06-13 14:02:41','2024-06-13 14:02:41'),
	 (14,'Brazo Derecho','BRA-D',1,'2024-06-13 14:02:41','2024-06-13 14:02:41'),
	 (15,'Pierna Izquierda','PIER-I',1,'2024-06-13 14:02:41','2024-06-13 14:02:41'),
	 (16,'Pierna Derecha','PIER-D',1,'2024-06-13 14:02:41','2024-06-13 14:02:41'),
	 (17,'Mano Izquierda','MAN-I',1,'2024-06-13 14:02:41','2024-06-13 14:02:41'),
	 (18,'Mano Derecha','MAN-D',1,'2024-06-13 14:02:41','2024-06-13 14:02:41'),
	 (19,'Pie Izquierdo','PIE-I',1,'2024-06-13 14:02:41','2024-06-13 14:02:41'),
	 (20,'Pie Derecho','PIE-D',1,'2024-06-13 14:02:41','2024-06-13 14:02:41');
INSERT INTO doc_presta.Sicknesses (id,name,code,description,treatment,creationDate,modificationDate) VALUES
	 (1,'catarro','cata','malestar, fiebre, dolor de cabeza, cansancio','descansar, y tomar cada 8h refrianex','2024-06-13 00:00:00','2024-06-13 00:00:00'),
	 (2,'Gripe','grip','Fiebre alta, dolores musculares, tos seca','Reposo, hidratación y medicación para la fiebre','2024-06-13 00:00:00','2024-06-13 00:00:00'),
	 (3,'Alergia','aler','Estornudos, picazón nasal, ojos llorosos','Evitar alérgenos y tomar antihistamínicos','2024-06-13 00:00:00','2024-06-13 00:00:00'),
	 (4,'Bronquitis','bron','Tos persistente, mucosidad, falta de aire','Reposo, mucha agua y en algunos casos antibióticos','2024-06-13 00:00:00','2024-06-13 00:00:00');
INSERT INTO doc_presta.SocialWorks (id,name,CUIT,code,status,creationDate,modificationDate) VALUES
	 (1,'Osde','30-12345678-1','001',1,'2024-05-29 05:35:49','2024-05-29 05:35:49'),
	 (2,'SwissMedical','30-87654321-2','002',1,'2024-05-29 05:35:49','2024-05-29 05:35:49'),
	 (3,'Dosep','30-23456789-3','003',1,'2024-05-29 05:35:49','2024-05-29 05:35:49'),
	 (4,'Osecat','30-98765432-4','004',1,'2024-05-29 05:35:49','2024-05-29 05:35:49'),
	 (5,'ONSU','30-34567890-5','005',1,'2024-05-29 05:35:49','2024-05-29 05:35:49');
INSERT INTO doc_presta.Specialities (id,name,code,description,state,creationDate,modificationDate,profesionId) VALUES
	 (1,'Cardiologia','CAR-IA','Cardiologia',1,'2024-05-29 00:00:00','2024-05-29 00:00:00',19),
	 (2,'Pediatría General','PED-GEN','Pediatría General',1,'2024-05-30 00:00:00','2024-05-30 00:00:00',2),
	 (3,'Dermatología Clínica','DERM-CL','Dermatología Clínica',1,'2024-05-30 00:00:00','2024-05-30 00:00:00',3),
	 (4,'Ginecología Obstétrica','GINE-OB','Ginecología y Obstetricia',1,'2024-05-31 00:00:00','2024-05-31 00:00:00',4),
	 (5,'Neurología General','NEUR-GEN','Neurología General',1,'2024-05-31 00:00:00','2024-05-31 00:00:00',5),
	 (6,'Oftalmología Pediátrica','OFTAL-PED','Oftalmología Pediátrica',1,'2024-06-01 00:00:00','2024-06-01 00:00:00',6),
	 (7,'Otorrinolaringología','OTOR-CL','Otorrinolaringología Clínica',1,'2024-06-01 00:00:00','2024-06-01 00:00:00',7),
	 (8,'Psiquiatría Infantil','PSIQ-INF','Psiquiatría Infantil',1,'2024-06-02 00:00:00','2024-06-02 00:00:00',8),
	 (9,'Traumatología Deportiva','TRAUM-DEP','Traumatología Deportiva',1,'2024-06-02 00:00:00','2024-06-02 00:00:00',9),
	 (10,'Oncología Médica','ONCO-MED','Oncología Médica',1,'2024-06-03 00:00:00','2024-06-03 00:00:00',10);
INSERT INTO doc_presta.Specialities (id,name,code,description,state,creationDate,modificationDate,profesionId) VALUES
	 (11,'Endocrinología Reproductiva','ENDO-REP','Endocrinología Reproductiva',1,'2024-06-03 00:00:00','2024-06-03 00:00:00',11),
	 (12,'Reumatología Infantil','REUMA-INF','Reumatología Infantil',1,'2024-06-04 00:00:00','2024-06-04 00:00:00',12),
	 (13,'Gastroenterología Pediátrica','GASTRO-PED','Gastroenterología Pediátrica',1,'2024-06-04 00:00:00','2024-06-04 00:00:00',13),
	 (14,'Neumología General','NEUMO-GEN','Neumología General',1,'2024-06-05 00:00:00','2024-06-05 00:00:00',14),
	 (15,'Nefrología Pediátrica','NEFRO-PED','Nefrología Pediátrica',1,'2024-06-05 00:00:00','2024-06-05 00:00:00',15),
	 (16,'Hematología Clínica','HEMA-CL','Hematología Clínica',1,'2024-06-06 00:00:00','2024-06-06 00:00:00',16),
	 (17,'Urología Pediátrica','URO-PED','Urología Pediátrica',1,'2024-06-06 00:00:00','2024-06-06 00:00:00',17),
	 (18,'Cirugía General','CIRUG-GEN','Cirugía General',1,'2024-06-07 00:00:00','2024-06-07 00:00:00',18),
	 (19,'Medicina General','MEDGEN-CL','Medicina General',1,'2024-06-07 00:00:00','2024-06-07 00:00:00',19),
	 (20,'Medicina Interna','INTER-CL','Medicina Interna',1,'2024-06-08 00:00:00','2024-06-08 00:00:00',2);
INSERT INTO doc_presta.Users (id,username,hashPassword,rol,email,state,creationDate,modificationDate,personId) VALUES
	 (1,'pauloc','$2a$10$Ap9SF4uShR.YiHsVqHVIHOx1AaPXxGiAHeyJ1R4.hFEptoOBcLSVu','ADMIN','pauloc@gmail.com',1,'2024-05-29 00:31:08','2024-05-29 00:31:08',1),
	 (2,'marial','$2a$10$Ap9SF4uShR.YiHsVqHVIHOx1AaPXxGiAHeyJ1R4.hFEptoOBcLSVu','PACIENTE','prueba@hotmail.com',1,'2024-05-29 00:31:08','2024-05-29 00:31:08',2),
	 (3,'carlosg','$2a$10$Ap9SF4uShR.YiHsVqHVIHOx1AaPXxGiAHeyJ1R4.hFEptoOBcLSVu','PROFESIONAL','carlosg@gmail.com',1,'2024-05-29 00:31:08','2024-05-29 00:31:08',3),
	 (8,'johndoe','$2a$10$2dkPPe6le1VtNeiKu8KamewWXpY3vXP0t/dUeHP6pP4AB3MAihhG.','PROFESIONAL','johndoe@example.com',1,'2024-06-03 13:46:12','2024-06-03 13:46:12',17),
	 (9,'johndoe2','$2a$10$CoT6FrdcBiEbUaAeLphCMuMjAcGtGQQ2YILIkenIVZ974MYbEr5t6','PROFESIONAL','johndoe2@gmail.com',1,'2024-06-04 04:46:11','2024-06-04 04:46:11',18),
	 (16,'mishac','$2a$10$7r0nr5sQU7MiEIf8VmWUv.e47uvi7C3NWSKB1DruXcGMUWoFUHv9a','PROFESIONAL','mishac@gmail.com',1,'2024-06-06 04:09:43','2024-06-06 04:09:43',26),
	 (17,'fernandao','$2a$10$Ap9SF4uShR.YiHsVqHVIHOx1AaPXxGiAHeyJ1R4.hFEptoOBcLSVu','PROFESIONAL','fernandao@gmail.com',1,'2024-06-09 17:54:15','2024-06-09 17:54:15',41),
	 (22,'lilianav','$2a$10$VQEgU5a0JXSjYkG3c9c4C.VhBz34H8eWna9TY4pcRkIslfrX5w4vS','PACIENTE','lilianav@gmail.com',1,'2024-06-10 04:25:13','2024-06-10 06:17:39',47);
