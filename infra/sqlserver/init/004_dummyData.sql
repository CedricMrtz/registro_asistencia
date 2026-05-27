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
