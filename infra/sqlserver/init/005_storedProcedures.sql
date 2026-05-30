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
                    / DATEDIFF(MINUTE, ev.fecha_comienzo, ev.fecha_acabado) * 100,0)
                AS INT)
        END AS porcentaje_asistencia
    FROM Alumno a
    INNER JOIN AlumnoInscritoSimposium ais ON a.matricula = ais.matricula
    INNER JOIN Evento ev ON ev.idSimposium = @idSimposium
    WHERE ais.idSimposium = @idSimposium
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
