CREATE IF NOT EXISTS DATABASE Itl;
USE Itl;
GO

CREATE TABLE Usuario(
	Id_usuario INT PRIMARY KEY NOT NULL,
	Nombre VARCHAR(50) NOT NULL,
	Apellido VARCHAR(50) NOT NULL,
	Correo_Institucional VARCHAR(255),
	Tipo VARCHAR(10),
	Contrasenia VARCHAR(20)
);
GO

INSERT INTO Usuario(Id_usuario, Nombre, Apellido, Correo_Institucional, Tipo, Contrasenia) VALUES
	(20230303, 'Edgar Isaac', 'Pérez Tiscareño', '20230302@leon.tecnm.mx', 'Alumno', '20230303'),
	(20230302, 'Andres', 'Salazar Alcántaro', '20230302@leon.tecnm.mx', 'Alumno', '20230302'),
	(99924, 'Patricia María', 'Castillo Martínez', 'patriciamaria.castillo@leon.tecnm.mx', 'Profesor', '99924'),
	(99925, 'Ruth', 'Saez de Nanclares', 'ruth.saezdenanclares@leon.tecnm.mx', 'Profesor', '99925'),
	(22240272,'Aldo','Rangel Hernández','22240272@leon.tecnm.mx','Alumno','22240272'),
	(22240254,'Fabricio','Becerra Quezada','22240254@leon.tecnm.mx','Alumno','86572'),
	(22240235,'Laura Sofía','Ornelas Valenzuela','22240235@leon.tecnm.mx','Alumno','8567'),
	(22240211,'Aridne Lizette','Macias Campos','22240211@leon.tecnm.mx','Alumno','625731'),
	(99921, 'José Gerardo', 'Carpio Flores', 'josegerardo.carpio@leon.tecnm.mx', 'Profesor', '645423'),
	(99922, 'Carlos Alberto', 'Trujillo Castellanos', 'carlosalberto.trujillo@leon.tecnm.mx', 'Profesor', '652526'),
	(99923, 'Elizabeth', 'Castellanos Nolasco', 'ecastell@leon.tecnm.mx', 'Profesor', '76872')	
GO

CREATE TABLE Profesor(
	Id_profesor INT PRIMARY KEY NOT NULL,
	Especialidad VARCHAR(50) NULL,
	Curriculum VARCHAR(50) NULL,
	Correo VARCHAR (50) NOT NULL,
	FOREIGN KEY (Id_profesor) REFERENCES Usuario(Id_usuario)
);
GO

INSERT INTO Profesor(Id_profesor, Especialidad, Curriculum, Correo) VALUES
	(99924, 'Ingeniero', NULL, 'patriciamaria.castillo@leon.tecnm.mx'),
	(99925, 'Ingeniero', NULL, 'ruth.saezdenanclares@leon.tecnm.mx'),
	(99921, 'Ingeniero', NULL, 'josegerardo.carpio@leon.tecnm.mx'),
	(99922, 'Ingeniero', NULL, 'carlosalberto.trujillo@leon.tecnm.mx'),
	(99923, 'Ingeniero', NULL, 'ecastell@leon.tecnm.mx');
GO

CREATE TABLE Alumno(
	No_control INT PRIMARY KEY NOT NULL,
	Carrera NCHAR(3) NOT NULL,
	Semestre CHAR NOT NULL,
	Creditos SMALLINT,
	Correo VARCHAR(50),
	FOREIGN KEY (No_control) REFERENCES Usuario(Id_usuario)
);
GO
INSERT INTO Alumno VALUES
	(20230303,'ISC', 7, 180,'20230303@leon.tecnm.mx'),
	(20230302,'ISC', 8, 200,'20230302@leon.tecnm.mx'),
	(22240272,'ISC', 6, 130,'22240272@leon.tecnm.mx'),
	(22240254,'ISC', 6, 138,'22240254@leon.tecnm.mx'),
	(22240235,'ISC', 6, 138,'22240235@leon.tecnm.mx'),
	(22240211,'ISC', 6, 138,'22240211@leon.tecnm.mx')
GO

CREATE TABLE ResponsableResidencia(
	Id_responsable INT PRIMARY KEY NOT NULL,
	Nombre VARCHAR(50), 
	Apellido VARCHAR(50),
	Contacto VARCHAR(12) NULL,
	Correo VARCHAR(50)
);
INSERT INTO ResponsableResidencia VALUES
	(99921, 'José Gerardo', 'Carpio Flores', NULL, 'josegerardo.carpio@leon.tecnm.mx')
GO

CREATE TABLE Residencia(
	Id_residencia INT PRIMARY KEY NOT NULL,
	Id_alumno INT NULL,
	Id_responsable INT,
	Empresa VARCHAR(50), 
	Descripcion VARCHAR(255),
	Vacantes SMALLINT,
	Fecha_inicio DATE,
	Fecha_fin DATE,
	Estado VARCHAR(20),
	FOREIGN KEY (Id_alumno) REFERENCES Alumno(No_control),
	FOREIGN KEY (Id_responsable) REFERENCES ResponsableResidencia(Id_responsable)
);
GO
INSERT INTO Residencia VALUES
	(11112, 20230303, 99921, 'Serviacero', 'Desarrollo e implementación de tablero electrónico para equipos serviacero de alto desempeño', 1,
	'2025-08-15', '2025-11-30', 'Aceptado'),
	(11113, NULL, 99921, 'Ropa y Novedades Martha', 'Desarrollo de una aplicación móvil para la gestión de procesos en una tienda de ropa personalizada', 2,
	'2025-01-25', '2025-05-30', 'Pendiente'),
	(11111, 20230302, 99921, 'Audi Motors', 'Desarrollo de un Sistema Web de reportes de accidentes/incidentes para  una empresa del secctor automotriz', 1, 
	'2025-01-25', '2025-05-30', 'Pendiente');
GO

CREATE TABLE Materia(
	Id_materia INT PRIMARY KEY NOT NULL,
	Nombre VARCHAR(100),
	Creditos SMALLINT,
	Tipo VARCHAR(50)
);
GO
INSERT INTO Materia (Id_materia, Nombre, Creditos, Tipo) VALUES
	(39358, 'Fundamentos de Programación', 5,'Obligatoria')
	(39357, 'Lenguajes y Autómatas I', 5, 'Obligatoria'),
	(39352, 'Sistemas Operativos', 4, 'Obligatoria'),
	(39353, 'Ingeniería de Software', 5, 'Obligatoria'),
	(39355, 'Tópicos Avanzados de Programación', 5, 'Obligatoria'),
	(39351, 'Ecuaciones Diferenciales', 5, 'Obligatoria'),
	(39354, 'Lenguajes de Interfaz', 4, 'Obligatoria'),
	(39356, 'Programación Orientada a Objetos', 5, 'Obligatoria');
GO

CREATE TABLE ProfesorMateria(
	Id_profesorMateria INT PRIMARY KEY NOT NULL,
	Id_profesor INT,
	Id_materia INT,
	FOREIGN KEY (Id_profesor) REFERENCES Profesor(Id_Profesor),
	FOREIGN KEY (Id_materia) REFERENCES Materia(Id_materia)
);
GO

INSERT INTO ProfesorMateria VALUES
	(22226, 99925, 39358),
	(22221, 99921, 39355),
	(22222, 99922, 39352),
	(22223, 99923, 39356),
	(22224, 99924, 39353),
	(22225, 99925, 39357);
GO

CREATE TABLE HorarioP(
	Id_horarioP INT PRIMARY KEY NOT NULL,
	Id_profesor INT,
	Dias_semana VARCHAR(255),
	Hora_inicio TIME,
	Hora_fin TIME,
	FOREIGN KEY (Id_profesor) REFERENCES Profesor(Id_Profesor)
);
GO
INSERT INTO HorarioP VALUES
	(307, 99925, 'Viernes', '7:00', '7:50'),
	(201, 99921, 'Martes, Jueves', '8:45', '10:30'),
	(301, 99921, 'Viernes', '9:35', '10:25'),
	(202, 99922, 'Lunes, Miercoles', '10:30', '12:15'),
	(203, 99922, 'Lunes, Miercoles', '12:10', '13:55'), 
	(205, 99924, 'Martes,Jueves', '08:45', '10:30'),
	(305, 99924, 'Virnes', '9:35', '10:25'),
	(206, 99924, 'Martes,Jueves', '12:15', '13:55'),
	(207, 99925, 'Lunes, Miercoles', '07:00', '8:40');
GO

CREATE TABLE HorarioA(
	Id_horarioA INT PRIMARY KEY NOT NULL,
	Id_alumno INT,
	FechaInscripcion DATE,
	Estado VARCHAR(50),
	FOREIGN KEY (Id_alumno) REFERENCES Alumno(No_control)
);
GO
INSERT INTO HorarioA VALUES
	(44441, 22240254, '2025-01-18', 'Cursando'),
	(44442, 22240235, '2025-01-18', 'Cursando'),
	(44443, 22240211, '2025-01-18', 'Cursando'),
	(44445, 22240272, '2025-01-18', 'Cursando'),
	(44446, 22240272, '2025-01-18', 'Especial');
GO

CREATE TABLE HorarioP_A(
	Id_horarioPA INT PRIMARY KEY NOT NULL,
	Id_horarioP INT,
	Id_horarioA INT,
	FOREIGN KEY (Id_horarioP) REFERENCES HorarioP(Id_horarioP),
	FOREIGN KEY (Id_horarioA) REFERENCES HorarioA(Id_horarioA)
);
GO

INSERT INTO HorarioP_A VALUES
	(501, 201, 44445),
	(502, 301, 44445),
	(503, 202, 44441),
	(504, 202, 44442),
	(505, 205, 44441),
	(506, 205, 44442),
	(507, 205, 44443),
	(508, 305, 44441),
	(509, 305, 44442),
	(510, 305, 44443),
	(511, 207, 44441),
	(512, 207, 44443),
	(513, 307, 44441),
	(514, 307, 44443);
GO

CREATE TABLE Calendario(
	Id_evento INT PRIMARY KEY NOT NULL,
	Nombre_Evento VARCHAR(255),
	FechaInicio DATE,
	FechaFin DATE,
	Descripcion VARCHAR(255),
	Ubicacion VARCHAR(3),
	FOREIGN KEY (Ubicacion) REFERENCES Croquis(Id_lugar)
);
GO
INSERT INTO Calendario (Id_evento, Nombre_Evento, FechaInicio, FechaFin, Descripcion, Ubicacion) VALUES
	(55, 'Reunión informativa Servicio Social Campus 1', '2025-04-11', '2025-04-11', 'Reunión para informar sobre el Servicio Social para estudiantes del Campus 1', 'A8'),
	(56, 'PERÍODO VACACIONAL', '2025-04-14', '2025-04-25', 'Vacaciones escolares para estudiantes y personal académico', NULL),
	(57, 'Solicitud de apertura de materias de verano 2025', '2025-04-28', '2025-04-30', 'Periodo para solicitar la apertura de materias para el curso de verano', 'B1'),
	(58, 'Concurso de Ciencias Básicas', '2025-04-28', '2025-04-30', 'Concurso académico sobre temas de ciencias básicas', 'N1'),
	(59, 'Honores a la Bandera (División de Estudios Profesionales)', '2025-04-30', '2025-04-30', 'Ceremonia de honores a la bandera con lectura de efemérides', 'B1'),
	(60, 'DÍA INHÁBIL', '2025-05-01', '2025-05-01', 'Día festivo oficial', NULL),
	(61, 'DÍA INHÁBIL', '2025-05-02', '2025-05-02', 'Día festivo oficial', NULL),
	(62, 'Recepción de solicitudes de Servicio Social Comunitario', '2025-05-03', '2025-05-23', 'Periodo para presentar solicitudes de Servicio Social Comunitario', 'A9'),
	(63, 'Recepción de solicitudes de equivalencias de estudios', '2025-05-06', '2025-05-08', 'Periodo para solicitar equivalencias de estudios en servicios escolares', 'A8'),
	(64, 'Recepción de solicitudes de CONVALIDACIÓN y TRASLADOS', '2025-05-06', '2025-05-23', 'Periodo para solicitar convalidación o traslado de estudios', 'B1'),
	(65, 'Evento Prenacional Deportivo (deportes individuales)', '2025-05-11', '2025-05-15', 'Competencia deportiva regional para deportes individuales', 'W3'),
	(66, 'Evento Prenacional Deportivo (deportes de conjunto)', '2025-05-11', '2025-05-16', 'Competencia deportiva regional para deportes de conjunto', 'W3'),
	(67, 'Entrega de expedientes de equivalencias de estudios', '2025-05-12', '2025-05-12', 'Entrega de expedientes de equivalencias a las áreas académicas', 'B1'),
	(68, 'DÍA INHÁBIL', '2025-05-15', '2025-05-15', 'Día festivo oficial', NULL),
	(69, 'Publicación de materias y proceso de verano 2024', '2025-05-19', '2025-05-19', 'Publicación de la oferta de materias para el verano 2024', 'A8'),
	(70, 'Semana Cultural y Clausura de Actividades Extrasecolares', '2025-05-19', '2025-05-23', 'Eventos culturales y clausura de actividades extraescolares', 'W1'),
	(71, 'Examen departamental Ciencias Básicas', '2025-05-23', '2025-05-23', 'Examen departamental de Cálculo diferencial y cálculo integral', 'N1'),
	(72, 'Fin de actividades Extrasecolares', '2025-05-24', '2025-05-24', 'Conclusión de todas las actividades extraescolares', 'W2'),
	(73, 'Entrega de resoluciones de equivalencia de estudios', '2025-05-26', '2025-05-26', 'Entrega de resoluciones sobre equivalencias de estudios', 'B1'),
	(74, 'Entrega de Documentos de cierre de Residencias', '2025-05-26', '2025-05-29', 'Entrega de documentos para cierre de residencias profesionales', 'Z1'),
	(75, 'Entrega del Reporte Final de residencia profesional', '2025-05-26', '2025-05-30', 'Periodo para entregar el reporte final de residencias', 'Z1'),
	(76, 'Entrega de dictámenes de equivalencia de estudios', '2025-05-30', '2025-05-30', 'Entrega de dictámenes finales sobre equivalencias', 'A8'),
	(77, 'Terminación del periodo de prestación de Servicio Social', '2025-05-30', '2025-05-30', 'Fecha límite para completar el servicio social', 'A9'),
	(78, 'FIN DE CURSOS', '2025-05-30', '2025-05-30', 'Finalización oficial del periodo escolar', NULL);
GO

CREATE TABLE Croquis(
	Id_lugar VARCHAR(3) PRIMARY KEY NOT NULL,
	Edificio VARCHAR(50) NULL,
	Descripcion VARCHAR(255) NULL,
	Departamento VARCHAR(255)
);
GO
INSERT INTO Croquis (Id_lugar, Edificio, Descripcion, Departamento) VALUES
	('A1', 'A', 'Dirección', 'Dirección'),
	('A2', 'A', 'Subdirección de Servicios Administrativos', 'Servicios Administrativos'),
	('A3', 'A', 'Subdirección Académica', 'Académica'),
	('A4', 'A', 'Subdirección de Planeación y Vinculación', 'Planeación y Vinculación'),
	('A5', 'A', 'Depto. de Recursos Financieros', 'Recursos Financieros'),
	('A6', 'A', 'Depto. de Planeación, Programación y Presupuestación', 'Planeación'),
	('A7', 'A', 'Depto. de Recursos Humanos', 'Recursos Humanos'),
	('A8', 'A', 'Depto. de Servicios Escolares', 'Servicios Escolares'),
	('A9', 'A', 'Titulación y Servicios Estudiantiles', 'Servicios Estudiantiles'),
	('A10', 'A', 'Depto. de Comunicación y Difusión', 'Comunicación y Difusión'),
	('B1', 'B', 'División de Estudios Profesionales', 'Estudios Profesionales'),
	('B2', 'B', 'Delegación SNTE D-V-39 Sección 61', 'SNTE'),
	('B3', 'B', 'Papelería', NULL),
	('C1', 'C', 'Centro de Cómputo', 'Centro de Cómputo'),
	('D1', 'D', 'Depto. Académico de Sistemas y Computación', 'Sistemas y Computación'),
	('D2', 'D', 'Sala de Videoconferencia', NULL),
	('D3', 'D', 'Depto. de Mantenimiento y Equipo', 'Mantenimiento y Equipo'),
	('E1', 'E', 'División de Estudios de Posgrado e Investigación', 'Posgrado e Investigación'),
	('F1', 'F', 'Aulas', NULL),
	('G1', 'G', 'Aulas', NULL),
	('H1', 'H', 'Depto. de Ingeniería Industrial', 'Ingeniería Industrial'),
	('H2', 'H', 'Aula', NULL),
	('I1', 'I', 'Centro de Información', NULL),
	('J1', 'J', 'Cafetería', NULL),
	('K1', 'K', 'Depto. de Recursos Materiales y Servicios', 'Recursos Materiales y Servicios'),
	('K2', 'K', 'Aulas', NULL),
	('L1', 'L', 'Depto. de Desarrollo Académico', 'Desarrollo Académico'),
	('L2', 'L', 'Sala Multimedios', NULL),
	('M1', 'M', 'Depto. de Metal Mecánica', 'Metal Mecánica'),
	('M2', 'M', 'Laboratorios de Manufactura', NULL),
	('M3', 'M', 'Lab. Energía Eléctrica, Térmica e Hidráulica', NULL),
	('M4', 'M', 'Lab. CNC', NULL),
	('M5', 'M', 'Sala Audiovisual', NULL),
	('N1', 'N', 'Depto. de Ciencias Básicas', 'Ciencias Básicas'),
	('Ñ1', 'Ñ', 'Servicio Médico', 'Servicio Médico'),
	('Ñ2', 'Ñ', 'Aulas', NULL),
	('O1', 'O', 'Aulas', NULL),
	('P1', 'P', 'Lab. de Química', NULL),
	('Q1', 'Q', 'Depto. de Ciencias Económico Administrativas', 'Ciencias Económico Administrativas'),
	('R1', 'R', 'Aulas', NULL),
	('S1', 'S', 'Planta Piloto', NULL),
	('T1', 'T', 'Lab. Electromecánica', NULL),
	('W1', 'W', 'Auditorio', NULL),
	('W2', 'W', 'Depto. Actividades Extraescolares', 'Actividades Extraescolares'),
	('W3', 'W', 'Gimnasio', NULL),
	('Y1', 'Y', 'Aula Magna', NULL),
	('Y2', 'Y', 'Coordinación de Lenguas Extranjeras', 'Lenguas Extranjeras'),
	('Y3', 'Y', 'Aulas', NULL),
	('Z1', 'Z', 'Depto. de Gestión Tecnológica y Vinculación', 'Gestión Tecnológica y Vinculación'),
	('Z2', 'Z', 'CIE', NULL),
	('Z3', 'Z', 'Sala de Capacitación', NULL),
	('Z4', 'Z', 'CESA', NULL);
GO

CREATE TABLE Notificacion(
	Id_notificacion INT PRIMARY KEY NOT NULL,
	Id_usuario INT,
	Mensaje VARCHAR(255),
	FechaEnvio DATE,
	FOREIGN KEY (Id_usuario) REFERENCES Usuario(Id_usuario)
);
GO
INSERT INTO Notificacion (Id_notificacion, Id_usuario, Mensaje, FechaEnvio) VALUES 
	(25251, 22240211, 'Tu contraseña está por expirar en 5 días.', '2025-04-10'),
	(25252, 22240235, 'Nuevo mensaje recibido en tu bandeja de entrada.', '2025-04-09'),
	(25253, 22240211, 'Tu perfil fue actualizado exitosamente.', '2025-04-08');
GO

CREATE TABLE RetroalimentacionDocente(
	Id_feedback INT IDENTITY(25251,1) PRIMARY KEY,
	Id_alumno INT,
	Id_profesor INT,
	calificacion SMALLINT,
	FOREIGN KEY (Id_alumno) REFERENCES Alumno(No_control),
	FOREIGN KEY (Id_profesor) REFERENCES Profesor(Id_profesor)
);
GO
INSERT INTO RetroalimentacionDocente (id_alumno, id_profesor, calificacion) VALUES
	(22240254, 99921, 90),
	(22240235, 99922, 90),
	(22240211, 99923, 100);
GO

CREATE TABLE AsistenteVirtual(
	Id_consulta INT PRIMARY KEY NOT NULL,
	Id_usuario INT,
	Pregunta VARCHAR(255),
	Respuesta VARCHAR(255),
	FechaConsulta DATETIME DEFAULT GETDATE(),
	FOREIGN KEY (Id_usuario) REFERENCES Usuario(Id_usuario)
);
GO
INSERT INTO AsistenteVirtual (id_consulta, id_usuario, pregunta, respuesta) VALUES 
	(121254, 22240254, '¿Cómo puedo cambiar de carrera?', 'Dicho servicio lo puedes encontrar en el edificio B, oficina 102'),
	(121211, 22240211, '¿Cómo puedo dar de baja alguna materia?', 'Dicho servicio lo puedes encontrar en el edificio E, planta alta');
GO

CREATE TABLE Reporte(
	Id_Repotrte INT IDENTITY(1000,1) NOT NULL,
	Id_Alumno INT,
	Situacion VARCHAR(255),
	ArchivoPDF VARCHAR(255),
	FOREIGN KEY (Id_Alumno) REFERENCES Alumno(No_control)
);
GO
--DELETE FROM AsistenteVirtual WHERE Id_consulta = 121254
/*
SELECT * FROM Usuario;
SELECT * FROM Alumno;
SELECT * FROM Profesor;
SELECT * FROM Materia;
SELECT * FROM ProfesorMateria;
SELECT * FROM HorarioP;
SELECT * FROM HorarioA;
SELECT * FROM HorarioP_A;
SELECT * FROM RetroalimentacionDocente;
SELECT * FROM Residencia;
SELECT * FROM ResponsableResidencia;
SELECT * FROM Notificacion;
SELECT * FROM Croquis;
SELECT * FROM Calendario;
SELECT * FROM AsistenteVirtual;
SELECT * FROM Reporte;
*/

--Triggers y funciones
CREATE TRIGGER RedirigirUsuarios
ON Usuario
AFTER INSERT
AS
BEGIN
	IF EXISTS (SELECT * FROM inserted WHERE Tipo = 'Alumno')
	BEGIN
		INSERT INTO Alumno(No_control, Carrera, Semestre, Correo)
		SELECT Id_usuario, 'ISC', 1, Correo_Institucional FROM inserted WHERE Tipo = 'Alumno'
	END
	IF EXISTS (SELECT * FROM inserted WHERE Tipo = 'Profesor')
	BEGIN
		INSERT INTO Profesor(Id_profesor, Correo)
		SELECT Id_usuario, Correo_Institucional FROM inserted WHERE Tipo = 'Profesor'
	END
END;
GO
----------------------------------------------------------------------------------------------------
CREATE PROCEDURE actualizarSemestre
AS
BEGIN
	UPDATE Alumno
	SET Semestre = Semestre + 1
	WHERE Semestre < 12
END;
GO

CREATE PROCEDURE elimAlumno 
	@Id_alumno INT
AS
BEGIN
	DELETE FROM Alumno WHERE No_control = @Id_alumno;
	DELETE FROM Usuario WHERE Id_usuario = @Id_alumno;
END;
GO

--EXEC elimGraduado @Id_alumno = 22240302
----------------------------------------------------------------------------------------------------
CREATE TRIGGER trg_AutomensajeNotificacion
ON notificacion
AFTER INSERT
AS
BEGIN
UPDATE a 
SET mensaje =
Case i.id_notificacion
	WHEN 4678 THEN 'El reporte ha sido tomado por un asesor y tendras respuesta en 2 a 3 dias'
	WHEN 4677 THEN 'Su constancia ya esta lista, puede pasar al edificio A para recibirla'
	WHEN 4679 THEN 'Tiene una respuesta del reporte realizado'
END
FROM notificacion a
	INNER JOIN inserted i ON i.id_notificacion = i.id_notificacion;
END;
GO
----------------------------------------------------------------------------------------------------
CREATE TRIGGER EliminarAlumnoYProfesor
ON Usuario
AFTER DELETE 
AS
BEGIN
	IF EXISTS (SELECT * FROM deleted WHERE Tipo = 'Alumno')
	BEGIN 
		 DELETE FROM Alumno 
		 WHERE No_control IN (SELECT Id_usuario FROM deleted WHERE Tipo = 'Alumno')
	END
	IF EXISTS (SELECT * FROM deleted WHERE Tipo = 'Profesor')
	BEGIN
		DELETE FROM Profesor 
		WHERE Id_profesor IN (SELECT Id_usuario FROM deleted WHERE Tipo = 'Profesor')
	END
END
GO
-----------------------------------------------------------
CREATE PROCEDURE verMateriasAlumno
	@IdAlum INT
AS
BEGIN
	SELECT
	m.Id_materia,
	m.Nombre AS Materia,
	m.creditos,
	u.Nombre +' '+u.Apellido AS Profesor,
	m.creditos,
	hp.Dias_semana,
	CONVERT(VARCHAR(5), hp.Hora_inicio) + ' a ' + CONVERT(VARCHAR(5), hp.Hora_fin) AS Hora_Clase
	FROM HorarioA ha
	JOIN HorarioP_A hpa
	ON ha.Id_horarioA = hpa.Id_horarioA 
	JOIN HorarioP hp 
	ON hpa.Id_horarioP = hp.Id_horarioP
	JOIN ProfesorMateria pm
	ON hp.Id_profesor = pm.Id_profesor
	JOIN Materia m
	ON pm.Id_materia = m.Id_materia
	JOIN Usuario u
	ON hp.Id_profesor = u.Id_usuario
	WHERE ha.Id_alumno=@IdAlum
END
