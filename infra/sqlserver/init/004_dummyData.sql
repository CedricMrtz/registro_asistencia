USE Simposium;
GO

INSERT INTO Escuela (nombre_escuela, ciudad) VALUES
('Instituto Tecnológico de Mexicali',    'Mexicali'),
('Universidad Autónoma de Baja California', 'Mexicali'),
('Centro de Enseñanza Técnica y Superior Ensenada', 'Ensenada'),
('Centro de Enseñanza Técnica y Superior Mexicali', 'Mexicali'),
('Centro de Enseñanza Técnica y Superior Tijuana', 'Tijuana');

INSERT INTO Carrera (nombre_carrera, siglas, nombre_escuela) VALUES
('Ingeniería en Sistemas Computacionales', 'ISC', 'Instituto Tecnológico de Mexicali'),
('Ingeniería en Electrónica', 'IEC', 'Instituto Tecnológico de Mexicali'),
('Licenciatura en Administración', 'LAD', 'Universidad Autónoma de Baja California'),
('Ingeniería Industrial', 'IIN', 'Universidad Autónoma de Baja California'),
('Ingeniería en Computación', 'ICP', 'Centro de Enseñanza Técnica y Superior Ensenada'),
('Ingeniería en Ciencias Computacionales', 'ICC', 'Centro de Enseñanza Técnica y Superior Ensenada'),
('Ingeniería Mecánica', 'IMC', 'Centro de Enseñanza Técnica y Superior Ensenada');


INSERT INTO Alumno (matricula, nombre, telefono, semestre, email, nombre_carrera) VALUES
('21400001', 'Carlos Mendoza Ruiz', '6861112233', 4, 'carlos.mendoza@itm.edu.mx', 'Ingeniería en Sistemas Computacionales'),
('21400002', 'Sofía Ramírez Torres', '6862223344', 6, 'sofia.ramirez@itm.edu.mx', 'Ingeniería en Sistemas Computacionales'),
('21400003', 'Diego Herrera Vega', '6863334455', 2, 'diego.herrera@itm.edu.mx', 'Ingeniería en Electrónica'),
('21400004', 'Valentina Castro Mora', '6864445566', 8, 'valentina.castro@uabc.edu.mx','Licenciatura en Administración'),
('21400005', 'Andrés López Sánchez', '6865556677', 3, 'andres.lopez@uabc.edu.mx', 'Ingeniería Industrial'),
('21400006', 'Mariana Flores Gutiérrez', '6866667788', 5, 'mariana.flores@cetys.edu.mx', 'Ingeniería en Computación'),
('21400007', 'Rodrigo Pérez Núñez', NULL, 1, 'rodrigo.perez@cetys.edu.mx', 'Ingeniería en Computación'),
('21400008', 'Isabella Morales Díaz', '6868889900', 7, 'isabella.morales@itm.edu.mx','Ingeniería en Sistemas Computacionales');

INSERT INTO AdminSimposium (nombre, telefono, email) VALUES
('Laura Gómez Ibarra', '6861234567', 'laura.gomez@simposium.mx'),
('Fernando Ríos Salazar', '6867654321', 'fernando.rios@simposium.mx'),
('Ana Martínez López', '6869876543', 'ana.martinez@simposium.mx'),
('Jorge Sánchez Torres', '6865432198', 'jorge.sanchez@simposium.mx'),
('Sofía Fernández García', '6866789012', 'sofia.fernandez@simposium.mx');

INSERT INTO Simposium (nombre, fecha_comienzo, fecha_acabado, capacidad_asistentes, adminSimposiumID) VALUES
('Trascendencias 2026', '2026-05-05', '2026-05-07', 30, 1),
('Celulas 2026', '2026-05-13', '2026-05-15', 30, 2),
('Innovación Empresarial 2026', '2026-05-21', '2026-05-23', 30, 3),
('Simposium de Robótica 2026', '2026-05-28', '2026-05-30', 30, 4),
('Simposium de Energías Renovables 2026', '2026-06-04', '2026-06-06', 30, 5);

INSERT INTO Staff (nombre) VALUES
('Miguel Ángel Reyes'),
('Patricia Soto Luna'),
('Ernesto Valdez Cruz'),
('Carmen Ibáñez Romo'),
('Luis Fernando García');

INSERT INTO StaffTrabajaEnSimposium (idSimposium, staffID) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 3),
(2, 4),
(3, 5);

INSERT INTO TipoEvento (nombreTipo) VALUES
('Conferencia'),
('Taller'),
('Panel de Expertos'),
('Demostración'),
('Mesa Redonda');

INSERT INTO Evento (nombreEvento, fecha_comienzo, fecha_acabado, idSimposium, nombreTipo) VALUES
('Inteligencia Artificial en la Industria', '2026-05-05 09:00:00', '2026-05-05 11:00:00', 1, 'Conferencia'),
('Taller de Ciberseguridad Práctica', '2026-05-05 12:00:00', '2026-05-05 14:00:00', 1, 'Taller'),
('Panel: Futuro del Software en México', '2026-05-06 09:00:00', '2026-05-06 11:30:00', 1, 'Panel de Expertos'),
('Demo: Robótica y Automatización', '2026-05-06 13:00:00', '2026-05-06 15:00:00', 1, 'Demostración'),
('Conferencia de Clausura: Tech 2030', '2026-05-07 10:00:00', '2026-05-07 12:00:00', 1, 'Conferencia'),

('Transformación Digital en PyMEs', '2026-05-13 09:00:00', '2026-05-13 11:00:00', 2, 'Conferencia'),
('Taller de Gestión de Proyectos Ágiles', '2026-05-13 12:00:00', '2026-05-13 14:00:00', 2, 'Taller'),
('Ingeniería e Innovación Empresarial','2026-05-15 09:00:00', '2026-05-15 18:00:00', 2, 'Panel de Expertos'),
('Entrega de proyecto final', '2026-05-30 00:01:00', '2026-05-30 23:00:00', 2, 'Taller');

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
('21400001', 1, '2026-05-05 09:05:00', '2026-05-05 11:00:00'),
('21400002', 1, '2026-05-05 09:10:00', '2026-05-05 11:00:00'),
('21400003', 1, '2026-05-05 09:00:00', '2026-05-05 10:45:00'),
('21400001', 2, '2026-05-05 12:00:00', '2026-05-05 14:00:00'),
('21400006', 2, '2026-05-05 12:05:00', '2026-05-05 14:00:00'),
('21400002', 3, '2026-05-06 09:00:00', '2026-05-06 11:30:00'),
('21400007', 3, '2026-05-06 09:15:00', '2026-05-06 11:00:00'),
('21400008', 3, '2026-05-06 09:05:00', '2026-05-06 11:30:00'),
('21400003', 4, '2026-05-06 13:00:00', '2026-05-06 15:00:00'),
('21400006', 4, '2026-05-06 13:10:00', '2026-05-06 15:00:00'),
('21400001', 5, '2026-05-07 10:00:00', '2026-05-07 12:00:00'),
('21400008', 5, '2026-05-07 10:05:00', '2026-05-07 12:00:00'),
('21400004', 6, '2026-05-13 09:00:00', '2026-05-13 11:00:00'),
('21400005', 6, '2026-05-13 09:10:00', '2026-05-13 11:00:00'),
('21400001', 7, '2026-05-13 12:00:00', '2026-05-13 14:00:00'),
('21400006', 7, '2026-05-13 12:05:00', NULL),
('21400004', 8, '2026-05-15 09:00:00', '2026-05-15 11:00:00'),
('21400005', 8, '2026-05-15 09:05:00', '2026-05-15 11:00:00');
