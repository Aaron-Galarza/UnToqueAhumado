# Contexto del Proyecto: Un Toque Ahumado (Frontend)

## Identidad del Proyecto
- **Agencia:** AFdevelopers.
- **Cliente:** Un Toque Ahumado (Hamburguesería artesanal Burgers Premium).
- **Objetivo:** E-commerce veloz, optimizado para celulares, enfocado en conversiones rápidas.

## Stack Tecnológico
- **Framework:** Next.js (App Router).
- **Lenguaje:** TypeScript estricto.
- **Estilos:** Tailwind CSS v4.
- **Íconos:** Lucide React.

## Reglas de Arquitectura
- El código fuente vive enteramente dentro de la carpeta `src/`.
- **Backend Independiente:** La API, endpoints y base de datos son manejados externamente por Aarón (socio backend). El frontend solo se enfoca en la UI, el ruteo y consumir datos.
- **Modularidad:** Usamos una estructura limpia. Componentes visuales genéricos en `src/components/`, y lógica agrupada por negocio en `src/features/` (ej: `features/cart`, `features/menu`).

## Reglas de Componentes (Next.js / React)
- **Server First:** Por defecto, todos los componentes son Server Components para maximizar la velocidad de carga y el SEO.
- **Client Components:** Colocar la directiva `"use client";` estrictamente en la línea 1 solo si el componente requiere interactividad del usuario (ej: `useState`, `onClick`, modales, carritos).
- Evitar archivos monolíticos. Separar tipos, datos estáticos y lógica en archivos distintos.

## Reglas de Diseño (UI/UX)
- **Enfoque estricto Mobile-First.** La experiencia en celulares es la prioridad número uno.
- **Tema Visual:** "Light Premium". Diseño diurno, limpio y minimalista. (Ignorar clases `.dark`).
- **Paleta de Colores Base:**
  - Fondo general: Crema (`#FAF6F1` / `bg-background`).
  - Tarjetas/Cards: Blanco puro (`#FFFFFF` / `bg-card`).
  - Textos principales: Oscuro suave (`#1A1008` / `text-foreground`).
  - **Acento Primario:** Naranja Furioso (`#FF5500` / `bg-primary`, `text-primary`). Usar solo para precios, botones principales y badges que requieran atención.
- **Tipografías:** Montserrat (cuerpo general) y Bebas Neue (títulos destacados).