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

