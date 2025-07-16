# Trackademic
**Trackademic** es una aplicación web diseñada para ayudar a estudiantes universitarios a gestionar sus notas semestrales de manera eficiente. La aplicación permite a los estudiantes registrar, calcular y planificar su rendimiento académico basado en planes de evaluación de cursos. 

## Integrantes
- Julio Prado
- Martín Gomez Caicedo
- Nicolas Cardona
- Alejandro Mejía
- Diego Polanco Lozano

**Deployment**: https://trackademic-three.vercel.app

## Descripción del Proyecto
Trackademic aborda el desafío de gestionar las notas y planes de evaluación de los estudiantes en múltiples sedes universitarias mediante una base de datos híbrida. Los datos académicos estructurados (usuarios, cursos, facultades, programas) se gestionan con PostgreSQL, mientras que los planes de evaluación y comentarios, debido a su naturaleza flexible, se manejan con MongoDB. La aplicación permite a los estudiantes registrarse, seleccionar o crear planes de evaluación, ingresar notas, calcular promedios actuales y requeridos para alcanzar metas académicas, y colaborar mediante comentarios en los planes de evaluación. Además, ofrece informes innovadores para mejorar la experiencia del usuario.

## Funcionalidades Principales

- **Registro y Autenticación (R.1–R.3)**: Los estudiantes pueden registrarse con nombres de usuario únicos, correos electrónicos y detalles académicos (facultad, programa, semestre) e iniciar/cerrar sesión de forma segura usando la autenticación de Supabase.
- **Gestión de Cursos y Planes (R.4–R.10)**: Los usuarios pueden ver cursos disponibles, agregar nuevos cursos, seleccionar o crear planes de evaluación con actividades ponderadas (sumando 100% en total), y modificar o eliminar copias personales de planes sin afectar a otros.
- **Seguimiento de Notas (R.11–R.13)**: Los estudiantes pueden ingresar y editar notas (escala 0–5) para sus planes de evaluación y visualizar su promedio actual del curso.
- **Funciones Colaborativas (R.14–R.16)**: Los usuarios pueden comentar en planes de evaluación, con opciones para editar o eliminar sus propios comentarios.
- **Informes Innovadores (R.17–R.18)**: La página principal muestra el promedio actual del estudiante según sus planes y calcula las notas necesarias en las actividades restantes para alcanzar un promedio objetivo.
- **Gestión de Perfil (R.18)**: Los usuarios pueden actualizar sus detalles académicos (facultad, área, programa, semestre), con una advertencia de que los cambios eliminarán los planes de evaluación personales.

## Implementación Técnica

### Selección de Bases de Datos
- **PostgreSQL (Supabase)**: Elegido para datos académicos estructurados (usuarios, cursos, facultades, programas) por su integridad relacional y soporte para relaciones jerárquicas. Supabase ofrece alojamiento en la nube, seguridad a nivel de fila y integración nativa con React mediante APIs REST, simplificando la autenticación y gestión de datos.
- **MongoDB (Atlas)**: Seleccionado por su flexibilidad para manejar planes de evaluación y comentarios como documentos JSON. Su naturaleza sin esquema soporta estructuras dinámicas de planes (actividades variables, pesos y notas) y optimiza consultas para recuperación de planes, cálculo de promedios y filtrado por curso/semestre.

### Arquitectura
- **Frontend**: Desarrollado con React para una interfaz responsiva y amigable.
- **Backend**: Supabase gestiona datos relacionales y autenticación, mientras que MongoDB Atlas maneja planes de evaluación y comentarios mediante APIs HTTP.
- **Despliegue**: Alojado en Vercel para escalabilidad y rendimiento óptimos.

### Estructura de las Bases de Datos
- **PostgreSQL (Supabase)**: Almacena perfiles de usuarios, cursos, facultades, áreas y programas con integridad relacional.
- **MongoDB**: Organiza los datos en tres colecciones:
  - **Planes Globales**: Almacena planes de evaluación de cursos (ID del curso, actividades, pesos).
  - **Planes Locales**: Gestiona copias específicas de planes por usuario con sus notas.
  - **Comentarios**: Almacena comentarios de usuarios asociados a los planes.

## Instrucciones de Configuración
1. **PostgreSQL**: Usa Supabase para una instancia en la nube o configura una local. Carga los datos de ejemplo proporcionados, asegurando la integridad referencial.
2. **MongoDB**: Utiliza MongoDB Atlas para alojamiento en la nube o instálalo localmente. Crea colecciones para planes globales, planes locales y comentarios.
3. **Frontend**: Clona el repositorio, instala dependencias (`npm install`) y ejecuta localmente (`npm start`).
4. **Entorno**: Configura las claves de API de Supabase y MongoDB Atlas en la aplicación.


