# Documentación General del Proyecto GoBuss

**GoBuss** es una plataforma integral para la gestión, administración y venta de boletos de terminales terrestres y cooperativas de transporte interprovincial.

---

## 1. Arquitectura del Sistema

El proyecto está dividido en dos aplicaciones principales interconectadas mediante una API RESTful.

- **Frontend (`gobuss-front`)**: Desarrollado en **React** (utilizando Vite), con un fuerte enfoque en el diseño UX/UI utilizando **Tailwind CSS**.
- **Backend (`gobuss-back`)**: Desarrollado en **Java** con el framework **Spring Boot**. Utiliza **JPA/Hibernate** para el mapeo objeto-relacional y una base de datos relacional (MySQL/PostgreSQL) para la persistencia de datos.

---

## 2. Backend: Lógica y Entidades

El código del servidor está estructurado en `com.proyectogobuss` y aplica una arquitectura por capas (Controladores, Servicios, Repositorios, Entidades).

### 2.1 Entidades Principales
Las entidades representan el modelo de negocio y están agrupadas por dominio:

*   **Gestión de Usuarios (`UsersEntities`)**:
    *   `User`: Entidad base para la autenticación y autorización.
    *   `Role`: Roles del sistema (`ADMIN`, `COOPERATIVA`, `USUARIO`).
    *   `Cooperativa`: Entidad que representa a las empresas de transporte. Hereda o se asocia con un usuario para poder acceder al sistema.
    *   `Usuario`: Clientes finales que compran boletos.

*   **Gestión Operativa (`CoopEntities`)**:
    *   `Unidad`: Los autobuses pertenecientes a una cooperativa. Tienen una capacidad máxima y características físicas.
    *   `Conductor` y `Ayudante`: Personal asignado a las unidades de transporte.
    *   `Horario`: Define la hora de salida, fecha y unidad asignada a una ruta específica.

*   **Gestión de Rutas (`RutaEntities`)**:
    *   `Ciudad`: Nodos de origen y destino.
    *   `RutaGeneral`: Plantilla base de una ruta (Ej: Quito - Guayaquil).
    *   `RutaFinal`: Instancia específica de una ruta gestionada por una cooperativa, incluyendo precio estimado y duración.

*   **Ventas (`Entities`)**:
    *   `Boleto`: Registro de la transacción de compra. Asocia a un usuario, un horario y un precio total.
    *   `AsientoReservado`: Detalle de qué asiento físico (`numeroAsiento`) está ocupado en qué `Horario` y a qué `Boleto` pertenece.

### 2.2 Seguridad (Spring Security & JWT)
- El sistema utiliza **JSON Web Tokens (JWT)** para autenticar solicitudes.
- Incluye lógica para `RefreshToken` para mantener las sesiones activas de manera segura sin comprometer el token principal.
- **Seguridad Mejorada (CORS)**: Se corrigió una vulnerabilidad crítica donde `allowedOriginPatterns("*")` estaba activo con `allowCredentials(true)`. Actualmente, CORS está restringido a orígenes específicos (ej. `localhost:5173`) inyectados mediante variables de entorno para prevenir ataques CSRF.

---

## 3. Frontend: Sistema y Lógica de Vistas

El cliente de React maneja los estados de la aplicación, rutas protegidas y una interfaz de usuario premium.

### 3.1 Stack Tecnológico
- **React 19** + **React Router DOM** (Navegación y Rutas protegidas).
- **Tailwind CSS** (Estilización).
- **Lucide React** (Iconografía consistente).
- **Recharts** (Gráficos estadísticos dinámicos).
- **Sonner** (Notificaciones / Toasts).
- **Canvas-Confetti** (Micro-interacciones y gamificación).

### 3.2 Sistema de Diseño
Se ha creado un robusto sistema de diseño propio (Design System) para garantizar consistencia visual y evitar el uso de etiquetas HTML crudas.
*   **Componentes Reutilizables** (`src/components/ui/`):
    *   `<Button>`: Soporta variantes (`primary`, `secondary`, `danger`), estados de carga (`isLoading` con un spinner) y soporte nativo de íconos.
    *   `<Input>`: Cajas de texto estandarizadas con íconos incrustados.
    *   `<Card>`: Contenedores con sombra 2xl y efecto Glassmorphism (`backdrop-blur`).
    *   `<EmptyState>` y `<Loading>`: Componentes para manejar vistas sin datos o estados de espera (con una animación nativa tipo "autobús saltando").

### 3.3 Roles y Rutas Privadas (`App.tsx`)
El frontend controla la accesibilidad mediante el componente `<RoleRoute>`.
- `/dashboard`: Punto de entrada unificado.
- `/cooperativas`: Exclusivo para `ADMIN`.
- Rutas de gestión (`/conductores`, `/ayudantes`, `/rutas`, `/horarios`, `/reportes`): Compartido entre `ADMIN` y `COOPERATIVA`.

---

## 4. Mejoras Implementadas (Plan de Refactorización)

El proyecto experimentó una refactorización masiva de la interfaz de usuario estructurada en 4 fases:

1.  **Fundamentos y Sidebar**: Rediseño del `tailwind.config.js` para usar colores semánticos (`brand`, `accent`, `surface`). Creación de la librería de componentes base.
2.  **Experiencia de Cliente (Boletos)**:
    *   **Landing Page (`Landing.tsx`)**: Se incluyó un fondo fotográfico premium y un buscador de rutas flotante.
    *   **Checkout y Modal de Asientos**: El proceso de compra se modernizó a un flujo por pasos (Selección -> Pago). Se incluyó micro-animaciones al seleccionar un asiento (escala y sombras) y un efecto de "confeti" de celebración al realizar la compra exitosamente.
3.  **Dashboards y CRUDs**:
    *   Se reemplazaron los textos planos del Dashboard por tarjetas de **KPIs** y gráficos interactivos usando **Recharts**.
    *   Se modernizaron las listas (Ej. `CooperativasList.tsx`) para incluir componentes `<EmptyState>`, botones unificados y un sistema de "Hover" que revela las acciones (editar, eliminar) dinámicamente.
4.  **Mobile-First y Auth**:
    *   El **Sidebar** (menú lateral) del sistema de administración es ahora responsivo, contrayéndose en pantallas pequeñas e incluyendo una capa oscura (overlay).
    *   Los formularios de **Login** y **Registro** fueron alineados con la estética "SaaS", incluyendo fondos con formas decorativas y tarjetas de cristal (Glassmorphism).

---

## 5. Resumen del Flujo Lógico de Compra (Core del Sistema)

1.  **Búsqueda**: El cliente (`Usuario`) ingresa origen, destino y fecha en la Landing Page.
2.  **Selección de Horario**: El frontend filtra los `Horarios` disponibles para las `RutasFinales` que concuerdan.
3.  **Reserva de Asientos**: Al hacer click en comprar, se despliega el `AsientosModal`. El sistema cruza la `Capacidad` de la `Unidad` con los `AsientoReservado` existentes en ese `Horario`.
4.  **Pago y Confirmación**: El usuario ingresa sus datos (Cédula, Nombres) y paga. El backend registra el `Boleto` e inserta los `AsientoReservado`. Se arroja confeti al usuario confirmando el proceso.
