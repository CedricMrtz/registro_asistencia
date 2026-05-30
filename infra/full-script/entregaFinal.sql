-- 1
CREATE DATABASE Simposium;
GO
 
USE Simposium;
GO

CREATE TABLE Escuela (
    nombre_escuela VARCHAR(100) NOT NULL,
    ciudad VARCHAR(80) NOT NULL,
 
    CONSTRAINT PK_Escuela PRIMARY KEY (nombre_escuela)
);
 
CREATE TABLE Carrera (
    nombre_carrera VARCHAR(100) NOT NULL,
    siglas VARCHAR(15) NOT NULL,
    nombre_escuela VARCHAR(100) NOT NULL,
 
    CONSTRAINT PK_Carrera PRIMARY KEY (nombre_carrera),
    CONSTRAINT UQ_Carrera_Siglas UNIQUE (siglas),
    CONSTRAINT FK_Carrera_Escuela FOREIGN KEY (nombre_escuela)
        REFERENCES Escuela(nombre_escuela)
        ON UPDATE CASCADE
        ON DELETE NO ACTION
);

CREATE TABLE Alumno (
    matricula VARCHAR(15) NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    telefono VARCHAR(15) NULL,
    semestre TINYINT NOT NULL,
    email VARCHAR(150) NOT NULL,
    nombre_carrera VARCHAR(100) NOT NULL,
 
    CONSTRAINT PK_Alumno PRIMARY KEY (matricula),
    CONSTRAINT UQ_Alumno_Email UNIQUE (email),
    CONSTRAINT FK_Alumno_Carrera FOREIGN KEY (nombre_carrera)
        REFERENCES Carrera(nombre_carrera)
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    CONSTRAINT CK_Alumno_Semestre CHECK (semestre BETWEEN 1 AND 8)
);

CREATE TABLE AdminSimposium (
    adminSimposiumID INT NOT NULL IDENTITY(1,1),
    nombre VARCHAR(120) NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    email VARCHAR(150) NOT NULL,
 
    CONSTRAINT PK_AdminSimposium PRIMARY KEY (adminSimposiumID),
    CONSTRAINT UQ_AdminSimposium_Email UNIQUE (email)
);

CREATE TABLE Simposium (
    idSimposium INT NOT NULL IDENTITY(1,1),
    nombre VARCHAR(150) NOT NULL,
    fecha_comienzo DATE NOT NULL,
    fecha_acabado DATE NOT NULL,
    capacidad_asistentes INT NOT NULL,
    adminSimposiumID INT NOT NULL,
 
    CONSTRAINT PK_Simposium PRIMARY KEY (idSimposium),
    CONSTRAINT FK_Simposium_AdminSimposium FOREIGN KEY (adminSimposiumID)
        REFERENCES AdminSimposium(adminSimposiumID)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT CK_Simposium_Fechas CHECK (fecha_acabado >= fecha_comienzo),
    CONSTRAINT CK_Simposium_Capacidad CHECK (capacidad_asistentes > 0)
);


CREATE TABLE Staff (
    staffID INT NOT NULL IDENTITY(1,1),
    nombre VARCHAR(120) NOT NULL,
 
    CONSTRAINT PK_Staff PRIMARY KEY (staffID)
);


CREATE TABLE StaffTrabajaEnSimposium (
    idSimposium INT NOT NULL,
    staffID INT NOT NULL,
 
    CONSTRAINT PK_StaffTrabajaEnSimposium PRIMARY KEY (idSimposium, staffID),
    CONSTRAINT FK_StaffTrabaja_Simposium FOREIGN KEY (idSimposium)
        REFERENCES Simposium(idSimposium)
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT FK_StaffTrabaja_Staff FOREIGN KEY (staffID)
        REFERENCES Staff(staffID)
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

CREATE TABLE TipoEvento (
    nombreTipo VARCHAR(60) NOT NULL,
 
    CONSTRAINT PK_TipoEvento PRIMARY KEY (nombreTipo)
);


CREATE TABLE Evento (
    idEvento INT NOT NULL IDENTITY(1,1),
    nombreEvento VARCHAR(150) NOT NULL,
    fecha_comienzo DATETIME NOT NULL,
    fecha_acabado DATETIME NOT NULL,
    idSimposium INT NOT NULL,
    nombreTipo VARCHAR(60)NOT NULL,
 
    CONSTRAINT PK_Evento PRIMARY KEY (idEvento),
    CONSTRAINT FK_Evento_Simposium FOREIGN KEY (idSimposium)
        REFERENCES Simposium(idSimposium)
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT FK_Evento_TipoEvento FOREIGN KEY (nombreTipo)
        REFERENCES TipoEvento(nombreTipo)
        ON UPDATE CASCADE
        ON DELETE NO ACTION
);


CREATE TABLE AlumnoInscritoSimposium (
    matricula VARCHAR(15) NOT NULL,
    idSimposium INT NOT NULL,
 
    CONSTRAINT PK_AlumnoInscritoSimposium PRIMARY KEY (matricula, idSimposium),
    CONSTRAINT FK_AlumnoInscrito_Alumno FOREIGN KEY (matricula)
        REFERENCES Alumno(matricula)
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    CONSTRAINT FK_AlumnoInscrito_Simposium FOREIGN KEY (idSimposium)
        REFERENCES Simposium(idSimposium)
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);


-- 2
USE Simposium;
GO

CREATE TABLE AlumnoAsistioEvento (
    idAsistencia INT IDENTITY(1,1) NOT NULL,
    matricula VARCHAR(15) NOT NULL,
    idEvento INT NOT NULL,
    fecha_llegada DATETIME NOT NULL,
    fecha_salida DATETIME NULL,
    staffID INT NULL,

    CONSTRAINT PK_AlumnoAsistioEvento PRIMARY KEY (idAsistencia),
    
    CONSTRAINT FK_AlumnoAsistio_Alumno 
        FOREIGN KEY (matricula)
        REFERENCES Alumno(matricula)
        ON UPDATE CASCADE
        ON DELETE NO ACTION,

    CONSTRAINT FK_AlumnoAsistio_Evento 
        FOREIGN KEY (idEvento)
        REFERENCES Evento(idEvento)
        ON UPDATE NO ACTION
        ON DELETE CASCADE,

    CONSTRAINT FK_AlumnoAsistio_Staff 
        FOREIGN KEY (staffID)
        REFERENCES Staff(staffID)
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);
GO

CREATE INDEX IX_AlumnoEvento ON AlumnoAsistioEvento(matricula, idEvento);
GO

-- 3
USE SIMPOSIUM;
GO

CREATE FUNCTION dbo.EventoActivo()
RETURNS INT
AS BEGIN
  DECLARE @idEvento INT;

  SELECT TOP 1 @idEvento = idEvento
  FROM Evento
  WHERE GETDATE() BETWEEN fecha_comienzo AND fecha_acabado
  ORDER BY fecha_comienzo ASC;

  RETURN @idEvento;
END;
GO

CREATE FUNCTION dbo.TiempoEnEvento(@MATRICULA VARCHAR(15), @idEvento INT)
RETURNS INT
AS BEGIN
  DECLARE @TIEMPO INT;

  SELECT @TIEMPO = DATEDIFF(MINUTE, FECHA_LLEGADA, ISNULL(FECHA_SALIDA, GETDATE()))
  FROM ALUMNOASISTIOEVENTO
  WHERE MATRICULA = @MATRICULA AND idEvento = @idEvento;

  RETURN @TIEMPO;
END;
GO

CREATE TRIGGER dbo.FechaLlegada ON ALUMNOASISTIOEVENTO AFTER INSERT
AS BEGIN
  UPDATE target
  SET FECHA_LLEGADA = ISNULL(target.FECHA_LLEGADA, GETDATE())
  FROM ALUMNOASISTIOEVENTO AS target
  INNER JOIN inserted AS src
    ON target.idAsistencia = src.idAsistencia;
END;
GO

-- 4
USE Simposium;
GO

INSERT INTO Escuela (nombre_escuela, ciudad) VALUES
('Instituto Tecnológico de Mexicali',    'Mexicali'),
('Universidad Autónoma de Baja California', 'Tijuana'),
('Centro de Enseñanza Técnica y Superior', 'Ensenada');

INSERT INTO Carrera (nombre_carrera, siglas, nombre_escuela) VALUES
('Ingeniería en Sistemas Computacionales', 'ISC', 'Instituto Tecnológico de Mexicali'),
('Ingeniería en Electrónica',              'IEC', 'Instituto Tecnológico de Mexicali'),
('Licenciatura en Administración',         'LAD', 'Universidad Autónoma de Baja California'),
('Ingeniería Industrial',                  'IIN', 'Universidad Autónoma de Baja California'),
('Ingeniería en Computación',              'ICP', 'Centro de Enseñanza Técnica y Superior');

INSERT INTO Alumno (matricula, nombre, telefono, semestre, email, nombre_carrera) VALUES
('21400001', 'Carlos Mendoza Ruiz',      '6861112233', 4, 'carlos.mendoza@itm.edu.mx',   'Ingeniería en Sistemas Computacionales'),
('21400002', 'Sofía Ramírez Torres',     '6862223344', 6, 'sofia.ramirez@itm.edu.mx',    'Ingeniería en Sistemas Computacionales'),
('21400003', 'Diego Herrera Vega',       '6863334455', 2, 'diego.herrera@itm.edu.mx',    'Ingeniería en Electrónica'),
('21400004', 'Valentina Castro Mora',    '6864445566', 8, 'valentina.castro@uabc.edu.mx','Licenciatura en Administración'),
('21400005', 'Andrés López Sánchez',     '6865556677', 3, 'andres.lopez@uabc.edu.mx',    'Ingeniería Industrial'),
('21400006', 'Mariana Flores Gutiérrez', '6866667788', 5, 'mariana.flores@cetys.edu.mx', 'Ingeniería en Computación'),
('21400007', 'Rodrigo Pérez Núñez',      NULL,         1, 'rodrigo.perez@cetys.edu.mx',  'Ingeniería en Computación'),
('21400008', 'Isabella Morales Díaz',    '6868889900', 7, 'isabella.morales@itm.edu.mx', 'Ingeniería en Sistemas Computacionales');

INSERT INTO AdminSimposium (nombre, telefono, email) VALUES
('Laura Gómez Ibarra',    '6861234567', 'laura.gomez@simposium.mx'),
('Fernando Ríos Salazar', '6867654321', 'fernando.rios@simposium.mx');

INSERT INTO Simposium (nombre, fecha_comienzo, fecha_acabado, capacidad_asistentes, adminSimposiumID) VALUES
('Simposium de Innovación Tecnológica 2025', '2025-09-10', '2025-09-12', 6, 1),
('Foro de Ingeniería y Negocios 2025',       '2025-10-20', '2025-10-21', 4, 2);

INSERT INTO Staff (nombre) VALUES
('Miguel Ángel Reyes'),
('Patricia Soto Luna'),
('Ernesto Valdez Cruz'),
('Carmen Ibáñez Romo');

INSERT INTO StaffTrabajaEnSimposium (idSimposium, staffID) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 3),
(2, 4);

INSERT INTO TipoEvento (nombreTipo) VALUES
('Conferencia'),
('Taller'),
('Panel de Expertos'),
('Demostración');

INSERT INTO Evento (nombreEvento, fecha_comienzo, fecha_acabado, idSimposium, nombreTipo) VALUES
('Inteligencia Artificial en la Industria',  '2025-09-10 09:00:00', '2025-09-10 11:00:00', 1, 'Conferencia'),
('Taller de Ciberseguridad Práctica',        '2025-09-10 12:00:00', '2025-09-10 14:00:00', 1, 'Taller'),
('Panel: Futuro del Software en México',     '2025-09-11 09:00:00', '2025-09-11 11:30:00', 1, 'Panel de Expertos'),
('Demo: Robótica y Automatización',          '2025-09-11 13:00:00', '2025-09-11 15:00:00', 1, 'Demostración'),
('Conferencia de Clausura: Tech 2030',       '2025-09-12 10:00:00', '2025-09-12 12:00:00', 1, 'Conferencia'),

('Transformación Digital en PyMEs',          '2025-10-20 09:00:00', '2025-10-20 11:00:00', 2, 'Conferencia'),
('Taller de Gestión de Proyectos Ágiles',    '2025-10-20 12:00:00', '2025-10-20 14:00:00', 2, 'Taller'),
('Panel: Ingeniería e Innovación Empresarial','2025-10-21 09:00:00', '2025-10-21 11:00:00', 2, 'Panel de Expertos');

INSERT INTO AlumnoInscritoSimposium (matricula, idSimposium) VALUES
('21400001', 1),
('21400002', 1),
('21400003', 1),
('21400006', 1),
('21400007', 1),
('21400008', 1);

INSERT INTO AlumnoInscritoSimposium (matricula, idSimposium) VALUES
('21400004', 2),
('21400005', 2),
('21400006', 2),
('21400001', 2);

INSERT INTO AlumnoAsistioEvento (matricula, idEvento, fecha_llegada, fecha_salida) VALUES
('21400001', 1, '2025-09-10 09:05:00', '2025-09-10 11:00:00'),
('21400002', 1, '2025-09-10 09:10:00', '2025-09-10 11:00:00'),
('21400003', 1, '2025-09-10 09:00:00', '2025-09-10 10:45:00'),

('21400001', 2, '2025-09-10 12:00:00', '2025-09-10 14:00:00'),
('21400006', 2, '2025-09-10 12:05:00', '2025-09-10 14:00:00'),

('21400002', 3, '2025-09-11 09:00:00', '2025-09-11 11:30:00'),
('21400007', 3, '2025-09-11 09:15:00', '2025-09-11 11:00:00'),
('21400008', 3, '2025-09-11 09:05:00', '2025-09-11 11:30:00'),

('21400003', 4, '2025-09-11 13:00:00', '2025-09-11 15:00:00'),
('21400006', 4, '2025-09-11 13:10:00', '2025-09-11 15:00:00'),

('21400001', 5, '2025-09-12 10:00:00', '2025-09-12 12:00:00'),
('21400008', 5, '2025-09-12 10:05:00', '2025-09-12 12:00:00'),

('21400004', 6, '2025-10-20 09:00:00', '2025-10-20 11:00:00'),
('21400005', 6, '2025-10-20 09:10:00', '2025-10-20 11:00:00'),

('21400001', 7, '2025-10-20 12:00:00', '2025-10-20 14:00:00'),
('21400006', 7, '2025-10-20 12:05:00', NULL), 

('21400004', 8, '2025-10-21 09:00:00', '2025-10-21 11:00:00'),
('21400005', 8, '2025-10-21 09:05:00', '2025-10-21 11:00:00');


-- 5
USE Simposium;
GO

CREATE PROCEDURE sp_GetDatosAsistencia @idSimposium INT AS BEGIN
    SET NOCOUNT ON;

    SELECT
        a.matricula,
        a.nombre,
        a.telefono,
        a.semestre,
        a.email,
        a.nombre_carrera,
        c.siglas,
        e.nombre_escuela,
        e.ciudad
    FROM Alumno a
    INNER JOIN AlumnoInscritoSimposium ais ON a.matricula = ais.matricula
    INNER JOIN Carrera c ON a.nombre_carrera = c.nombre_carrera
    INNER JOIN Escuela e ON c.nombre_escuela = e.nombre_escuela
    WHERE ais.idSimposium = @idSimposium
    ORDER BY a.nombre ASC;

    SELECT
        aae.idAsistencia,
        aae.matricula,
        aae.idEvento,
        ev.nombreEvento,
        aae.fecha_llegada,
        aae.fecha_salida,
        aae.staffID,
        dbo.TiempoEnEvento(aae.matricula, aae.idEvento) AS minutos_asistido
    FROM AlumnoAsistioEvento aae
    INNER JOIN Evento ev ON aae.idEvento = ev.idEvento
    WHERE ev.idSimposium = @idSimposium
    ORDER BY aae.matricula, aae.idEvento;

    SELECT
        ev.idEvento,
        ev.nombreEvento,
        ev.fecha_comienzo,
        ev.fecha_acabado,
        ev.idSimposium,
        ev.nombreTipo
    FROM Evento ev
    WHERE ev.idSimposium = @idSimposium
    ORDER BY ev.fecha_comienzo ASC;

END;
GO

CREATE PROCEDURE sp_GetDatosCumplimiento @idSimposium INT AS BEGIN
    SET NOCOUNT ON;

    SELECT
        a.matricula,
        a.nombre,
        a.telefono,
        a.semestre,
        a.email,
        a.nombre_carrera,
        c.siglas,
        e.nombre_escuela,
        e.ciudad
    FROM Alumno a
    INNER JOIN AlumnoInscritoSimposium ais ON a.matricula = ais.matricula
    INNER JOIN Carrera c ON a.nombre_carrera = c.nombre_carrera
    INNER JOIN Escuela e ON c.nombre_escuela = e.nombre_escuela
    WHERE ais.idSimposium = @idSimposium
    ORDER BY a.nombre ASC;

    SELECT
        a.matricula,
        ev.idEvento,
        ev.nombreEvento,
        ev.fecha_comienzo,
        ev.fecha_acabado,
        DATEDIFF(MINUTE, ev.fecha_comienzo, ev.fecha_acabado) AS duracion_evento_min,
        dbo.TiempoEnEvento(a.matricula, ev.idEvento) AS minutos_asistido,
        CASE
            WHEN DATEDIFF(MINUTE, ev.fecha_comienzo, ev.fecha_acabado) = 0 THEN 0
            ELSE CAST(
                ROUND(
                    CAST(dbo.TiempoEnEvento(a.matricula, ev.idEvento) AS FLOAT)
                    / DATEDIFF(MINUTE, ev.fecha_comienzo, ev.fecha_acabado)
                    * 100,
                0) AS INT)
        END AS porcentaje_asistencia
    FROM Alumno a
    INNER JOIN AlumnoInscritoSimposium ais ON a.matricula = ais.matricula
    CROSS JOIN Evento ev
    WHERE ais.idSimposium = @idSimposium
      AND ev.idSimposium = @idSimposium
    ORDER BY a.nombre ASC, ev.fecha_comienzo ASC;

    SELECT
        ev.idEvento,
        ev.nombreEvento,
        ev.fecha_comienzo,
        ev.fecha_acabado,
        ev.nombreTipo
    FROM Evento ev
    WHERE ev.idSimposium = @idSimposium
    ORDER BY ev.fecha_comienzo ASC;

END;
GO

-- 6
USE master;
GO

CREATE LOGIN AdminEventos
WITH PASSWORD = 'Admin123!';
GO

CREATE LOGIN StaffEventos
WITH PASSWORD = 'Staff123!';
GO

USE Simposium;
GO

CREATE USER AdminEventos FOR LOGIN AdminEventos;
CREATE USER StaffEventos FOR LOGIN StaffEventos;
GO

CREATE ROLE RolAdministrador;
CREATE ROLE RolStaff;
GO

ALTER ROLE RolAdministrador ADD MEMBER AdminEventos;
ALTER ROLE RolStaff ADD MEMBER StaffEventos;
GO

GRANT SELECT, INSERT, UPDATE, DELETE ON Alumno TO RolAdministrador;
GRANT SELECT, INSERT, UPDATE, DELETE ON Evento TO RolAdministrador;
GRANT SELECT, INSERT, UPDATE, DELETE ON Simposium TO RolAdministrador;
GRANT SELECT, INSERT, UPDATE, DELETE ON AlumnoAsistioEvento TO RolAdministrador;

GRANT SELECT ON Alumno TO RolStaff;
GRANT SELECT ON Evento TO RolStaff;
GRANT INSERT, UPDATE ON AlumnoAsistioEvento TO RolStaff;
GO


-- 7
USE master;
GO

EXEC sp_addumpdevice
    'disk',
    'SimposiumFullBackup',
    'C:\Backups\SimposiumFull.bak';
GO

EXEC sp_addumpdevice
    'disk',
    'SimposiumDiffBackup',
    'C:\Backups\SimposiumDiff.bak';
GO

-- 8
BACKUP DATABASE Simposium
TO SimposiumFullBackup
WITH
    FORMAT,
    INIT,
    NAME = 'Respaldo Completo Simposium';
GO

BACKUP DATABASE Simposium
TO SimposiumDiffBackup
WITH DIFFERENTIAL,
     INIT,
     NAME = 'Respaldo Diferencial Simposium';
GO

-- 9
-- RESTORE DATABASE Simposium
-- FROM SimposiumFullBackup
-- WITH REPLACE;
-- GO

