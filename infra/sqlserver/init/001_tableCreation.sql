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

CREATE TABLE Admin (
    adminID INT NOT NULL IDENTITY(1,1),
    nombre VARCHAR(120) NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    email VARCHAR(150) NOT NULL,
 
    CONSTRAINT PK_Admin PRIMARY KEY (adminID),
    CONSTRAINT UQ_Admin_Email UNIQUE (email)
);

CREATE TABLE Simposium (
    idSimposium INT NOT NULL IDENTITY(1,1),
    nombre VARCHAR(150) NOT NULL,
    fecha_comienzo DATE NOT NULL,
    fecha_acabado DATE NOT NULL,
    capacidad_asistentes INT NOT NULL,
    adminID INT NOT NULL,
 
    CONSTRAINT PK_Simposium PRIMARY KEY (idSimposium),
    CONSTRAINT FK_Simposium_Admin FOREIGN KEY (adminID)
        REFERENCES Admin(adminID)
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

CREATE TABLE AlumnoAsistioEvento (
    matricula VARCHAR(15) NOT NULL,
    idEvento INT NOT NULL,
    fecha_llegada DATETIME NOT NULL,
    fecha_salida DATETIME NULL,

    CONSTRAINT PK_AlumnoAsistioEvento PRIMARY KEY (matricula, idEvento),
    CONSTRAINT FK_AlumnoAsistio_Alumno FOREIGN KEY (matricula)
        REFERENCES Alumno(matricula)
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    CONSTRAINT FK_AlumnoAsistio_Evento FOREIGN KEY (idEvento)
        REFERENCES Evento(idEvento)
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
);
