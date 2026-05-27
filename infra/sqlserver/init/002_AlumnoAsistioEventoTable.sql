USE Simposium;
GO

CREATE TABLE AlumnoAsistioEvento (
    matricula VARCHAR(15) NOT NULL,
    idEvento INT NOT NULL,
    fecha_llegada DATETIME NOT NULL,
    fecha_salida DATETIME NULL,
    staffID INT NULL,

    CONSTRAINT PK_AlumnoAsistioEvento PRIMARY KEY (matricula, idEvento),

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
