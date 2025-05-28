# Sistema de Evaluación Docente

Sistema web para la evaluación de docentes por parte de los estudiantes, desarrollado con React y Vite. Permite la gestión de encuestas de evaluación, visualización de resultados y administración del proceso de evaluación.

## Características Principales

- Sistema de roles (Estudiante, Docente, Administrador)
- Encuestas de evaluación personalizadas
- Gestión de resultados y cálculos automáticos
- Interfaz intuitiva y responsive
- Persistencia de datos local

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm (incluido con Node.js)
- Git

## Instalación y Despliegue Local

1. Clonar el repositorio:
```bash
git clone https://github.com/MarycieloBerrio/evaluacion-docente.git
cd evaluacion-docente
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

4. Abrir el navegador en `http://localhost:5173`

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run lint`: Ejecuta el linter
- `npm run preview`: Previsualiza la versión de producción

## Estructura del Proyecto

```
evaluacion-docente/
├── src/
│   ├── assets/        # Recursos estáticos
│   ├── components/    # Componentes reutilizables
│   ├── context/       # Estado global
│   ├── pages/         # Páginas principales
│   └── styles/        # Archivos CSS
```

## Tecnologías Utilizadas

- React 19
- Vite
- React Router DOM
- XLSX para manejo de archivos Excel
- ESLint para calidad de código
