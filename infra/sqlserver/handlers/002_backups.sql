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
