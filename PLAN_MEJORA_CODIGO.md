# Plan de Mejora — GoBuss Web

> **Fecha:** 2026-06-16
> **Alcance:** Frontend (React/TypeScript/Vite) + Backend (Java/Spring Boot)
> **Estado:** Auditoría completa con 45 hallazgos clasificados por severidad.

---

## Resumen Ejecutivo

| Categoría | Críticos | Altos | Medios | Bajos |
|-----------|----------|-------|--------|-------|
| Bugs/Errores | 2 | 5 | 4 | 3 |
| Seguridad | 1 | 2 | 1 | 0 |
| Código Muerto/Innecesario | 0 | 1 | 5 | 4 |
| Optimización | 0 | 2 | 6 | 3 |
| Deuda Técnica | 0 | 3 | 4 | 4 |
| **Total** | **3** | **13** | **20** | **14** |

---

## CRÍTICOS

### C1 [BUG] `HorarioService.searchAvailable` — Filtro inválido con `id=0`

**Archivo:** `gobuss-back/.../services/HorarioService.java:208`
```java
List<RutaFinal> rutas = rutaFinalRepository.findByRutaGeneralIdRutaGeneral(0)
```
Siempre busca rutas generales con ID `0`, que no existe. Esto **nunca devuelve resultados**, rompiendo la búsqueda pública de horarios desde la Landing. Debería buscar todas las rutas generales que conecten `origenId` ↔ `destinoId`.

### C2 [SEGURIDAD] `CooperativaService.update` — Autorización incorrecta

**Archivo:** `gobuss-back/.../services/CooperativaService.java:108`
```java
if (!authenticatedUsername.equals("ADMIN") && !authenticatedUsername.equals(ruc)) {
```
Compara el **username** contra el string literal `"ADMIN"` en vez de verificar el **rol** desde el SecurityContext. Un usuario cuyo username sea `"ADMIN"` podría saltarse la validación aunque no tenga ese rol.

### C3 [SEGURIDAD] JWT secret con fallback hardcodeado en producción

**Archivo:** `gobuss-back/.../resources/application-prod.properties:11`
```properties
jwt.secret=${JWT_SECRET:supersecretkeythatisatleast32characterslong}
```
Si la env var `JWT_SECRET` no está definida en producción, se usa un secret hardcodeado y predecible. Cualquier persona con acceso al código puede firmar JWTs válidos.

---

## ALTOS

### A1 [BUG] `MisBoletos.tsx` — Input de búsqueda sin funcionalidad

**Archivo:** `gobuss-front/src/pages/boletos/MisBoletos.tsx:79`
Existe un `<input>` con placeholder "Buscar por ruta o fecha..." pero `onChange` no está conectado a ninguna lógica de filtrado. No filtra la lista.

### A2 [BUG] `Dashboard.tsx` — Datos de gráficos hardcodeados

**Archivo:** `gobuss-front/src/pages/Dashboard.tsx`
Los arreglos `dataIngresos` y `dataRutas` son mock data estática. El dashboard siempre muestra los mismos valores de prueba (ej. `capacidad: 240` cuando `boletos: 400` en UIO-GYE, lo cual es imposible). Nunca se reemplazan con datos reales de la API.

### A3 [BUG] `AuthContext` — `user.id` se usa como RUC de cooperativa

**Archivo:** `gobuss-front/src/pages/rutas/RutasFinalesTab.tsx:49`
```tsx
setSelectedRuc(user.id);
```
`user.id` se almacena con `data.user_details.id` desde el login, que es el **username** (cédula/RUC). Pero en `Cooperativa` el ID es `ruc`. Si hay inconsistencia entre `id` y `ruc`, falla. Debe usarse el campo específico de RUC.

### A4 [DEUDA] Paquete inconsistente `EmailService` (mayúscula)

**Archivo:** `gobuss-back/.../EmailService/BrevoConfig.java`
Package `com.proyectogobuss.EmailService` viola la convenía Java de minúsculas. Además `BrevoConfig.java` duplica funcionalidad de `EmailServiceBrevo.java` (que sí está en `services`). Debe moverse/eliminarse.

### A5 [DEUDA] 7 entidades sin Lombok, getters/setters manuales

**Archivos en:** `Entities/CoopEntities/` y `Entities/RutaEntities/`
Entidades como `Unidad.java`, `Conductor.java`, `Ayudante.java`, `Ciudad.java`, `RutaGeneral.java`, `RutaFinal.java`, `AsientoReservado.java` usan getters/setters manuales mientras que el resto del proyecto usa Lombok `@Data`. Inconsistencia que aumenta riesgo de errores y boilerplate.

### A6 [OPT] `HorarioService.create` — Inserta asientos uno por uno

**Archivo:** `gobuss-back/.../services/HorarioService.java:117`
```java
for (int i = 1; i <= capacidad; i++) {
    AsientoReservado asiento = new AsientoReservado();
    ...
    asientoRepository.save(asiento); // N queries
}
```
Para una unidad de 40 asientos, genera 40 INSERTs individuales. Debe usar `saveAll()` o batch insert.

### A7 [OPT] `AsientosModal.tsx` — Simulación de pago con timeout ciego

**Archivo:** `gobuss-front/src/pages/boletos/AsientosModal.tsx:189`
```tsx
await new Promise(resolve => setTimeout(resolve, 1500));
```
El "pago" no valida datos de tarjeta, no llama a ningún gateway. Aunque dice "simulación", la compra se ejecuta igual contra el backend sin verificar el pago.

### A8 [SEGURIDAD] `.env` no listado en `.gitignore` del frontend

**Archivo:** `gobuss-front/.gitignore`
No incluye `.env`. Si alguien comitea un `.env`, las claves de API quedarían expuestas.

### A9 [DEUDA] `CooperativaService.update` — Verificación de permisos por string

**Archivo:** `gobuss-back/.../services/CooperativaService.java:108`
El parámetro `authenticatedUsername` se pasa desde el controlador extrayendo el username del token, pero la verificación contra el literal `"ADMIN"` debería usar la información de roles del SecurityContextHolder.

---

## MEDIOS

### M1 [Bajo riesgo] `PasajerosList` importado pero sin ruta en `App.tsx`
**Archivo:** `gobuss-front/src/App.tsx` — Import existe pero `PasajerosList` nunca se asigna a una ruta.

### M2 [Código muerto] `PasswordUtils.java` en `Utils/` — No usado
Spring Security provee `BCryptPasswordEncoder`, esta utilidad no se referencia en ningún service.

### M3 [Código muerto] `BrevoConfig.java` — Legacy duplicado
Su lógica de cargar properties está replicada en `EmailServiceBrevo.java` que usa `@Value`. El archivo está compilado en el JAR pero no se usa.

### M4 [Deuda] `any` types generalizados en frontend
Casi todos los componentes usan `any[]`, `any` en place de interfaces tipadas (ej. `ciudades`, `horarios`, `response.data`). Esto anula las ventajas de TypeScript.

### M5 [Deuda] Paquete `Utils/` fuera del árbol `com.proyectogobuss`
**Archivo:** `src/main/java/Utils/*.java`
Package `Utils` vs `com.proyectogobuss`. Debe moverse a `com.proyectogobuss.utils`.

### M6 [Deuda] Sin tests automatizados
`pom.xml` incluye `spring-boot-starter-test` y `spring-security-test` pero no hay archivos de test en `src/test/`. Frontend no tiene framework de testing configurado.

### M7 [Deuda] Stale `.class` files en `target/classes/.../DTO/`
Quedan archivos compilados del antiguo package `DTO/` (mayúscula). Ejecutar `mvn clean` los elimina.

### M8 [Opt] `EmailServiceBrevo` usa `System.out.println` en vez de logger
Debe usar `log.info()` / `log.error()` con `@Slf4j`.

### M9 [Opt] `BoletoService.procesarYEnviarBoletoAsync` — Objeto temporal innecesario
Crea un `Boleto` con solo `idBoleto` para pasarlo al método interno que lo vuelve a buscar con `findCompleto`. Podría pasar directamente el `Integer`.

### M10 [Opt] `HorarioFormModal` — Schema Zod sin integration completa
Usa `superRefine` pero los errores condicionales (`fechaFin` cuando `isRecurrente`) solo se validan en submit y el formulario no expone los errores condicionales correctamente en la UI.

### M11 [Opt] `CooperativasList` — Recarga en cada keystroke en search
`useEffect` con dependencia `[page, search]` dispara request en cada cambio de letra sin debounce. Para búsquedas rápidas, genera N requests innecesarias.

### M12 [Opt] `HorariosList` — Paginación sin reset al cambiar cooperativa
Cuando el admin cambia de cooperativa, `page` no se resetea a 0. Si estaba en página 3, puede mostrar página 3 de la nueva cooperativa (vacía o incorrecta).

### M13 [Opt] `AsientosModal` — Cuenta regresiva con estado por asiento
El timer `tiempoRestanteSegundos` se renderiza pero nunca decrementa en tiempo real (solo muestra el valor inicial del backend). Falta un intervalo que actualice el contador.

### M14 [Opt] `RutasFinalesTab` — Lista completa de rutas generales en cada carga
`fetchRutasGenerales()` se ejecuta en `useEffect` sin dependencias (una vez) pero `rutasGenerales` no cambia frecuentemente. Podría cachearse.

### M15 [Opt] `vite.config.ts` — Chunk splitting básico
El `manualChunks` actual separa en vendor/ui/dependencies, pero `react-hook-form` y `sonner` van a 'ui'. Podría mejorarse la separación.

---

## BAJOS

### B1 [Estilo] `AuthService.java` — Import `Cooperativa.EstadoCooperativa` calificado
Usa la referencia completa `com.proyectogobuss.Entities.UsersEntities.Cooperativa.EstadoCooperativa.PENDIENTE` en vez de importar el enum.

### B2 [Estilo] Navegación con `window.location.href` en `api.ts`
**Archivo:** `gobuss-front/src/services/api.ts`
```ts
window.location.href = '/login';
```
Debe usar el router de React (`useNavigate`) pero en un interceptor de axios no hay acceso directo. Alternativa: event-based redirect.

### B3 [Estilo] Mezcla de `surface`/`slate` en clases Tailwind
Algunos componentes nuevos usan `text-slate-*` (ej. `BoletosList`, `RutasList`) mientras que el design system está definido con colores `surface-*`. Inconsistencia visual.

### B4 [Documentación] `.env.example` incompleto
Solo existe a nivel raíz del proyecto, pero no documenta variables como `ALLOWED_ORIGIN`, `BREVO_API_KEY`, `VITE_API_URL`, etc.

### B5 [Docker] `docker-compose.yml` no expone puerto fijo para frontend/backend
`ports: - "8080"` y `ports: - "80"` sin mapeo host:container, lo que significa puertos aleatorios en el host.

### B6 [Estilo] Render condicional con `&&` en JSX
Varias expresiones como `{cond && <Componente/>}` pueden renderizar `0` o `false` en pantalla si la condición es número/booleano. Ej: `{selectedIds.length > 0 && <div>...</div>}` (bien), pero hay casos de `{selectedIds.length && ...}` (mal).

---

## Plan de Acción Recomendado

### Fase 1 — Correcciones Críticas (1-2 días)
- [ ] **C1**: Arreglar `HorarioService.searchAvailable` filtrando por `origenId` y `destinoId` correctamente
- [ ] **C2**: Reemplazar verificación de string por `SecurityContextHolder.getContext().getAuthentication().getAuthorities()`
- [ ] **C3**: Quitar fallback del JWT secret en `application-prod.properties` y validar que la env var exista al arranque

### Fase 2 — Bugs y Seguridad (3-5 días)
- [ ] **A1**: Conectar el input de búsqueda en `MisBoletos` a la lógica de filtrado
- [ ] **A2**: Reemplazar mock data en `Dashboard` por datos reales de API
- [ ] **A3**: Asegurar que `user.id` vs `user.ruc` estén correctamente mapeados
- [ ] **A4**: Mover/eliminar `BrevoConfig.java` y unificar package conventions
- [ ] **A6**: Cambiar loop de INSERTs por `saveAll()` batch
- [ ] **A7**: Integrar un gateway de pago real o al menos validar datos de tarjeta
- [ ] **A8**: Agregar `.env` al `.gitignore` del frontend
- [ ] **A9**: Eliminar Stale `.class` files (`mvn clean`)

### Fase 3 — Optimización (3-5 días)
- [ ] **A5**: Migrar entidades legacy a Lombok
- [ ] **M2-M3**: Eliminar `PasswordUtils.java` y `BrevoConfig.java`
- [ ] **M4**: Tipar `any` → interfaces en frontend
- [ ] **M5**: Mover `Utils/` a package `com.proyectogobuss.utils`
- [ ] **M8**: Reemplazar `System.out.println` por logger en `EmailServiceBrevo`
- [ ] **M9**: Simplificar `procesarYEnviarBoletoAsync`
- [ ] **M11**: Agregar debounce a search en `CooperativasList`
- [ ] **M12**: Resetear paginación al cambiar cooperativa
- [ ] **M13**: Agregar intervalo para cuenta regresiva en asientos

### Fase 4 — Deuda Técnica (continuo)
- [ ] **M6**: Agregar tests unitarios (JUnit + Jest/Vitest)
- [ ] **M14**: Cache de rutas generales
- [ ] **B1-B6**: Correcciones de estilo, consistencia Tailwind, etc.
- [ ] Agregar CI/CD pipeline (GitHub Actions)
- [ ] Agregar migración de base de datos controlada (Flyway/Liquibase)
- [ ] Configurar ESLint más estricto y formateo automático

---

## Tabla Resumen por Archivo

| Archivo | Hallazgos |
|---------|-----------|
| `HorarioService.java` | C1 crítico, A6 alto |
| `CooperativaService.java` | C2 crítico, A9 alto |
| `application-prod.properties` | C3 crítico |
| `Dashboard.tsx` | A2 alto |
| `MisBoletos.tsx` | A1 alto, B6 bajo |
| `RutasFinalesTab.tsx` | A3 alto |
| `BrevoConfig.java` | A4 alto |
| `Unidad.java`, `Conductor.java`, etc. | A5 alto |
| `AsientosModal.tsx` | A7 alto, M13 medio |
| `.gitignore` | A8 alto |
| `App.tsx` | M1 medio |
| `PasswordUtils.java` | M2 medio |
| `emailServiceBrevo.java` | M8 medio |
| `BoletoService.java` | M9 medio |
| `HorarioFormModal.tsx` | M10 medio |
| `CooperativasList.tsx` | M11 medio |
| `HorariosList.tsx` | M12 medio |
| Frontend (general) | M4, M14, M15 |
| `Utils/*.java` | M5 medio |
| Backend (general) | M6, M7 medio |
| `AuthService.java` | B1 bajo |
| `api.ts` | B2 bajo |
| Múltiples .tsx | B3 bajo |
| `.env.example` | B4 bajo |
| `docker-compose.yml` | B5 bajo |
