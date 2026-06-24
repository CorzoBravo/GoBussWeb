# Plan de mejora: roles, permisos y aislamiento de datos — GoBuss

## 0. Objetivo

Eliminar el poder centralizado indebido del rol `ADMIN` sobre la operación interna de las cooperativas, y garantizar que cada cooperativa solo pueda ver y modificar sus propios datos. El `ADMIN` pasa de "superusuario que puede todo" a **regulador de la plataforma**.

## 1. Modelo de responsabilidades objetivo

| Rol | Responsabilidad | NO debe poder |
|---|---|---|
| `ADMIN` | Registrar/aprobar/rechazar cooperativas. Gestionar catálogo global (ciudades, rutas generales). Ver métricas agregadas de la plataforma (conteos, no operación). | Crear/editar/eliminar conductores, ayudantes, unidades, horarios o rutas finales de una cooperativa. Ver el detalle operativo interno de una cooperativa específica salvo soporte explícito auditado. |
| `COOPERATIVA` | CRUD completo de sus propias unidades, conductores, ayudantes, horarios, rutas finales. Ver sus propios reportes y dashboard. | Ver o modificar datos de otra cooperativa. Crear ciudades o rutas generales del catálogo. Ver métricas globales de la plataforma. |
| `CONDUCTOR` | Ver sus horarios asignados y pasajeros de esos horarios. | Cualquier operación de escritura. Ver datos fuera de sus horarios asignados. |
| `USUARIO` | Comprar boletos, ver/cancelar sus propios boletos. Consultar horarios disponibles (solo datos públicos). | Ver boletos de otros usuarios. Ver datos operativos internos (PII de conductores, asientos reservados). |

> **Nota:** Los endpoints `PATCH /api/cooperativas/{ruc}/aprobar` y `PATCH /api/cooperativas/{ruc}/rechazar` del `CooperativaController` se **preservan sin cambios** — ya están restringidos a `hasRole('ADMIN')`. El ADMIN conserva también `POST /api/cooperativas` para crear cooperativas.

---

## 2. Backend — correcciones por archivo

### 2.1 `AyudanteController.java` / `AyudanteService.java` — **fuga crítica de datos**

**Problema:** no recibe `ruc` en ningún endpoint. `getAll()` devuelve ayudantes de **todas** las cooperativas a cualquier `COOPERATIVA` autenticada. `getById(cedula)` no verifica pertenencia.

**Corrección — requiere dos cambios:**

**a) Entidad `Ayudante.java` — agregar relación directa con `Cooperativa`**

Hoy `Ayudante` solo tiene `@ManyToOne → Conductor` (nullable). No tiene `cooperativa_ruc`. Como la BD se construye desde las entidades JPA (`ddl-auto`), basta con agregar el campo:

```java
// Ayudante.java — nuevo campo
@ManyToOne
@JoinColumn(name = "cooperativa_ruc", referencedColumnName = "ruc", nullable = false)
private Cooperativa cooperativa;
```

Hibernate generará la columna y FK automáticamente. No se necesita SQL manual. Si existen datos, evaluar migración única o truncar la tabla (datos no productivos).

**b) Controlador y Service — anidar bajo cooperativa, igual que `ConductorController`:**

```java
// AyudanteController.java
@RestController
@RequestMapping("/api/cooperativas/{ruc}/ayudantes")
@RequiredArgsConstructor
public class AyudanteController {

    private final AyudanteService ayudanteService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA') and @coopGuard.canRead(authentication, #ruc)")
    public ResponseEntity<List<AyudanteDTO>> getByCooperativa(@PathVariable String ruc) {
        return ResponseEntity.ok(ayudanteService.getByCooperativa(ruc));
    }

    @GetMapping("/{cedula}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA') and @coopGuard.canRead(authentication, #ruc)")
    public ResponseEntity<AyudanteDTO> getById(@PathVariable String ruc, @PathVariable String cedula) {
        return ResponseEntity.ok(ayudanteService.getById(ruc, cedula));
    }

    @PostMapping
    @PreAuthorize("hasRole('COOPERATIVA') and @coopGuard.canWrite(authentication, #ruc)")
    public ResponseEntity<AyudanteDTO> create(@PathVariable String ruc,
                                               @Valid @RequestBody AyudanteCreateRequest request) {
        return new ResponseEntity<>(ayudanteService.create(ruc, request), HttpStatus.CREATED);
    }

    @PutMapping("/{cedula}")
    @PreAuthorize("hasRole('COOPERATIVA') and @coopGuard.canWrite(authentication, #ruc)")
    public ResponseEntity<AyudanteDTO> update(@PathVariable String ruc, @PathVariable String cedula,
                                               @Valid @RequestBody AyudanteUpdateRequest request) {
        return ResponseEntity.ok(ayudanteService.update(ruc, cedula, request));
    }

    @DeleteMapping("/{cedula}")
    @PreAuthorize("hasRole('COOPERATIVA') and @coopGuard.canWrite(authentication, #ruc)")
    public ResponseEntity<Void> delete(@PathVariable String ruc, @PathVariable String cedula) {
        ayudanteService.delete(ruc, cedula);
        return ResponseEntity.noContent().build();
    }
}
```

`AyudanteService` debe ganar `ruc` como parámetro en cada método: `getByCooperativa(ruc)`, `getById(ruc, cedula)`, `create(ruc, request)`, `update(ruc, cedula, request)`, `delete(ruc, cedula)`. La validación de pertenencia se hace contra el nuevo campo `cooperativa.ruc`.

> Nota: el `ADMIN` mantiene lectura (`getByCooperativa`, `getById`) para soporte, pero pierde escritura (`create`/`update`/`delete` quedan exclusivos a `hasRole('COOPERATIVA')`).

---

### 2.2 `@coopGuard` — bean reutilizable para validar pertenencia

En vez de repetir lógica de "si no es admin, que el RUC del path coincida con el RUC autenticado" en cada controlador, centralizarla en un único bean:

```java
// security/CooperativaAccessGuard.java
package com.proyectogobuss.security;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("coopGuard")
public class CooperativaAccessGuard {

    /**
     * El principal del JWT es un String = username. Para COOPERATIVA,
     * username = RUC (se setea en CooperativaService.create()). 
     * Ver JwtAuthenticationFilter y AuthService para trazabilidad.
     */
    private String extractRuc(Authentication authentication) {
        return authentication.getName();
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    // Solo escritura para COOPERATIVA dueña del RUC; ADMIN nunca pasa
    public boolean canWrite(Authentication authentication, String ruc) {
        if (isAdmin(authentication)) {
            return false;
        }
        return extractRuc(authentication).equals(ruc);
    }

    // Lectura para ADMIN (soporte) o COOPERATIVA dueña del RUC
    public boolean canRead(Authentication authentication, String ruc) {
        return isAdmin(authentication) || extractRuc(authentication).equals(ruc);
    }
}
```

> **Sobre `authentication.getName()`:** en el JWT actual, el `subject` = `username`. Para COOPERATIVA, el username **es el RUC** (se asigna en `CooperativaService.create()`). Esto se verifica en `JwtAuthenticationFilter` (línea 39-40) y `AuthService.login()`. Si en el futuro el principal cambiara (ej. a un objeto UserDetails), solo habría que modificar `extractRuc()`.

Usar `@coopGuard.canRead(...)` en los `@GetMapping` y `@coopGuard.canWrite(...)` (que excluye a ADMIN) en los `@PostMapping/@PutMapping/@DeleteMapping`. Esto hace explícito en una sola línea, por endpoint, si el ADMIN puede o no escribir — sin tener que auditar lógica repetida dispersa en cada servicio.

**Códigos de error:** cuando un endpoint rechaza por `@coopGuard`, Spring Security devuelve `403 Forbidden`. Para no revelar existencia de otros recursos, los servicios deben lanzar `ResourceNotFoundException` (→ `404`) cuando un recurso simplemente no existe, independientemente del RUC que hizo la consulta.

---

### 2.3 `ConductorController.java` — quitar escritura del ADMIN + guard de pertenencia

**Problema:** `hasAnyRole('ADMIN', 'COOPERATIVA')` en `create`, `update`, `delete` permite al admin modificar personal de cualquier cooperativa sin restricción de RUC. Además, `@GetMapping` y `@GetMapping/{cedula}` permiten a cualquier `COOPERATIVA` leer conductores de otra si adivina el `ruc`.

**Corrección:** Agregar `@coopGuard` a todos los endpoints. Hoy el controlador ya usa `/api/cooperativas/{ruc}/conductores`, solo falta el guard.

```java
@PostMapping
@PreAuthorize("hasRole('COOPERATIVA') and @coopGuard.canWrite(authentication, #ruc)")
public ResponseEntity<ConductorDTO> create(...) { ... }

@PutMapping("/{cedula}")
@PreAuthorize("hasRole('COOPERATIVA') and @coopGuard.canWrite(authentication, #ruc)")
public ResponseEntity<ConductorDTO> update(...) { ... }

@DeleteMapping("/{cedula}")
@PreAuthorize("hasRole('COOPERATIVA') and @coopGuard.canWrite(authentication, #ruc)")
public ResponseEntity<Void> delete(...) { ... }

// Lectura: admin conserva acceso de soporte
@GetMapping
@PreAuthorize("hasAnyRole('ADMIN','COOPERATIVA') and @coopGuard.canRead(authentication, #ruc)")
public ResponseEntity<List<ConductorDTO>> getByCooperativa(...) { ... }

@GetMapping("/{cedula}")
@PreAuthorize("hasAnyRole('ADMIN','COOPERATIVA') and @coopGuard.canRead(authentication, #ruc)")
public ResponseEntity<ConductorDTO> getById(...) { ... }
```

---

### 2.4 `UnidadController.java` — ya está bien en escritura, falta el guard de lectura

**Problema menor:** `getByCooperativa`/`getById` permiten `ADMIN` y `COOPERATIVA` sin chequear que la `COOPERATIVA` solicitante sea dueña de esas unidades (hoy cualquier cooperativa autenticada podría adivinar el `ruc` de otra y ver sus unidades, porque no hay `@coopGuard`). La escritura (`create`, `update`, `delete`) ya está correctamente restringida a `hasRole('COOPERATIVA')`.

```java
@GetMapping
@PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA') and @coopGuard.canRead(authentication, #ruc)")
public ResponseEntity<List<UnidadDTO>> getByCooperativa(@PathVariable String ruc) { ... }

@GetMapping("/{id}")
@PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA') and @coopGuard.canRead(authentication, #ruc)")
public ResponseEntity<UnidadDTO> getById(@PathVariable String ruc, @PathVariable Integer id) { ... }

@PostMapping
@PreAuthorize("hasRole('COOPERATIVA') and @coopGuard.canWrite(authentication, #ruc)")
public ResponseEntity<UnidadDTO> create(...) { ... }

@PutMapping("/{id}")
@PreAuthorize("hasRole('COOPERATIVA') and @coopGuard.canWrite(authentication, #ruc)")
public ResponseEntity<UnidadDTO> update(...) { ... }

@DeleteMapping("/{id}")
@PreAuthorize("hasRole('COOPERATIVA') and @coopGuard.canWrite(authentication, #ruc)")
public ResponseEntity<Void> delete(...) { ... }
```

> **⚠️ Atención:** el método `getById` actual tiene firma `getById(@PathVariable Integer id)` — **no recibe `ruc` como parámetro**. Aunque `ruc` esté en el `@RequestMapping` de clase, no está bindeado en la firma del método, por lo que `@coopGuard.canRead(authentication, #ruc)` fallaría porque la variable `#ruc` no existe en el contexto SpEL.  
> **Corrección adicional — agregar `@PathVariable String ruc` a la firma y pasarlo al service:**
> ```java
> @GetMapping("/{id}")
> @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA') and @coopGuard.canRead(authentication, #ruc)")
> public ResponseEntity<UnidadDTO> getById(@PathVariable String ruc, @PathVariable Integer id) {
>     UnidadDTO unidad = unidadService.getById(ruc, id);
>     return ResponseEntity.ok(unidad);
> }
> ```

---

### 2.5 `HorarioController.java` — admin no debe crear horarios ajenos + proteger PII en endpoints públicos

**Problema 1 — escritura:** `POST /api/horarios/cooperativa/{ruc}` y `toggle-status` permiten `ADMIN` sin guard de pertenencia.

**Problema 2 — PII y datos internos expuestos:** El endpoint público `GET /api/horarios/search` (sin autenticación) devuelve `HorarioDTO` completo, que incluye `conductorCedula`, `conductorNombre` (PII de conductores), `asientosReservados` (dato interno de negocio), y detalles de unidad (placa, modelo, etc.). Además, `getById`, `getByRuta`, `getAsientos` muestran los mismos datos a cualquier `USUARIO` autenticado.

#### Corrección — escritura:

```java
@PostMapping("/cooperativa/{ruc}")
@PreAuthorize("hasRole('COOPERATIVA') and @coopGuard.canWrite(authentication, #ruc)")
public ResponseEntity<List<HorarioDTO>> create(@PathVariable String ruc, @Valid @RequestBody HorarioCreateRequest request) { ... }

@PatchMapping("/cooperativa/{ruc}/{id}/toggle-status")
@PreAuthorize("hasRole('COOPERATIVA') and @coopGuard.canWrite(authentication, #ruc)")
public ResponseEntity<HorarioDTO> toggleStatus(@PathVariable String ruc, @PathVariable Integer id) { ... }

// Lectura administrativa: admin conserva acceso de soporte
@GetMapping("/cooperativa/{ruc}")
@PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA') and @coopGuard.canRead(authentication, #ruc)")
public ResponseEntity<Page<HorarioDTO>> getByCooperativa(...) { ... }
```

#### Corrección — PII y datos sensibles:

```java
// DTO público para búsqueda — sin PII ni datos internos
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class HorarioPublicDTO {
    private Integer idHorario;
    private LocalDate fecha;
    private LocalTime horaSalida;
    private String origen;
    private String destino;
    private String cooperativaNombre;
    private double precio;
    private int capacidad;
    private int asientosDisponibles;
}

// Endpoint público de búsqueda — usa HorarioPublicDTO
@GetMapping("/search")
public ResponseEntity<List<HorarioPublicDTO>> searchAvailable(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
        @RequestParam Integer origenId,
        @RequestParam Integer destinoId) {
    return ResponseEntity.ok(horarioService.searchAvailablePublic(fecha, origenId, destinoId));
}

// Endpoints para USUARIO autenticado también usan HorarioPublicDTO
@GetMapping("/{id}")
@PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA', 'USUARIO')")
public ResponseEntity<?> getById(@PathVariable Integer id, Authentication authentication) {
    if (isUsuario(authentication)) {
        return ResponseEntity.ok(horarioService.getByIdPublic(id));
    }
    return ResponseEntity.ok(horarioService.getById(id)); // HorarioDTO completo para ADMIN/COOPERATIVA
}
```

La lógica de "qué DTO devolver según el rol" puede implementarse en el service con un método unificado que acepte el rol como parámetro, o con métodos separados (`getById` vs `getByIdPublic`). Se recomienda la primera para evitar duplicación de queries.

> **Nota:** `getByRuta`, `getById`, `getAsientos` deben retornar `HorarioPublicDTO` para roles `USUARIO` y `HorarioDTO` solo para `ADMIN`/`COOPERATIVA`. El endpoint público `/search` siempre retorna `HorarioPublicDTO`.

---

### 2.6 `RutaController.java` — separar catálogo global de operación de cooperativa

**Problema:** `POST /api/rutas/generales` y `POST /api/rutas/ciudades` / `DELETE /api/rutas/ciudades` permiten `COOPERATIVA` (tienen `hasAnyRole('ADMIN', 'COOPERATIVA')`), cuando deberían ser exclusivos del catálogo gestionado por `ADMIN`. Las rutas finales (`/cooperativas/{ruc}`) ya están bien restringidas a `COOPERATIVA` en escritura, solo falta el guard de pertenencia.

```java
// CIUDADES — catálogo de plataforma, escritura exclusiva ADMIN
@PostMapping("/ciudades")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<CiudadDTO> createCiudad(...) { ... }

@DeleteMapping("/ciudades/{id}")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<Void> deleteCiudad(...) { ... }

// RUTAS GENERALES — catálogo de plataforma, escritura exclusiva ADMIN
@PostMapping("/generales")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<RutaGeneralDTO> createRutaGeneral(...) { ... }

// Lectura del catálogo: abierta a ambos roles (ya está bien)
@GetMapping("/ciudades")
@PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA')")
public ResponseEntity<List<CiudadDTO>> getAllCiudades() { ... }

@GetMapping("/generales")
@PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA')")
public ResponseEntity<List<RutaGeneralDTO>> getAllRutasGenerales() { ... }

// RUTAS FINALES por cooperativa: guard de pertenencia en escritura y lectura
@PostMapping("/cooperativas/{ruc}")
@PreAuthorize("hasRole('COOPERATIVA') and @coopGuard.canWrite(authentication, #ruc)")
public ResponseEntity<RutaFinalDTO> addRutaToCooperativa(@PathVariable String ruc, ...) { ... }

@PutMapping("/cooperativas/{ruc}/{rutaId}")
@PreAuthorize("hasRole('COOPERATIVA') and @coopGuard.canWrite(authentication, #ruc)")
public ResponseEntity<RutaFinalDTO> updateRutaFinal(...) { ... }

@DeleteMapping("/cooperativas/{ruc}/{rutaId}")
@PreAuthorize("hasRole('COOPERATIVA') and @coopGuard.canWrite(authentication, #ruc)")
public ResponseEntity<Void> deleteRutaFinal(...) { ... }

// Lectura de rutas finales por cooperativa: admin conserva soporte
@GetMapping("/cooperativas/{ruc}")
@PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA') and @coopGuard.canRead(authentication, #ruc)")
public ResponseEntity<List<RutaFinalDTO>> getRutasByCooperativa(@PathVariable String ruc) { ... }
```

---

### 2.7 `ReporteController.java` — agregar guard de pertenencia

**Problema:** todos los endpoints permiten `ADMIN` y `COOPERATIVA` sin verificar que la `COOPERATIVA` solicitante sea dueña del `ruc` consultado. Ya usa `@RequestMapping("/api/cooperativas/{ruc}/reportes")`, el `ruc` está disponible.

```java
@GetMapping("/ventas-ruta")
@PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA') and @coopGuard.canRead(authentication, #ruc)")
public ResponseEntity<List<ReporteVentasRutaDTO>> ventasPorRuta(@PathVariable String ruc) { ... }

@GetMapping("/ventas-fecha")
@PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA') and @coopGuard.canRead(authentication, #ruc)")
public ResponseEntity<List<ReporteVentasFechaDTO>> ventasPorFecha(@PathVariable String ruc, ...) { ... }

@GetMapping("/ocupacion-horario")
@PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA') and @coopGuard.canRead(authentication, #ruc)")
public ResponseEntity<List<ReporteOcupacionHorarioDTO>> ocupacionPorHorario(@PathVariable String ruc, ...) { ... }

@GetMapping("/ventas-ruta/pdf")
@PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA') and @coopGuard.canRead(authentication, #ruc)")
public ResponseEntity<byte[]> ventasPorRutaPdf(@PathVariable String ruc) { ... }
```

---

### 2.8 `AdminController.java` / `AdminService.java` — el cambio más urgente

**Problema:** el dashboard global (`totalCooperativas`, `totalUsuarios`, `totalVentas` de toda la plataforma) se expone a `COOPERATIVA`.

**Corrección — separar en dos endpoints con DTOs distintos:**

```java
// AdminController.java
@RestController
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/api/admin/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardDTO> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/api/cooperativas/{ruc}/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA') and @coopGuard.canRead(authentication, #ruc)")
    public ResponseEntity<CooperativaDashboardDTO> getCooperativaDashboard(@PathVariable String ruc) {
        return ResponseEntity.ok(adminService.getCooperativaDashboardStats(ruc));
    }
}
```

```java
// dto/admin/CooperativaDashboardDTO.java — nuevo DTO, sin datos de otras cooperativas
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CooperativaDashboardDTO {
    private long totalUnidades;
    private long totalConductores;
    private long totalViajes;       // solo de esta cooperativa
    private double totalVentas;     // solo de esta cooperativa
    private int capacidadPromedio;
}
```

```java
// AdminService.java — agregar método con filtro por ruc
public CooperativaDashboardDTO getCooperativaDashboardStats(String ruc) {
    long totalUnidades = unidadRepository.countByRuc(ruc);          // Unidad.ruc es String plano, no @ManyToOne
    long totalConductores = conductorRepository.countByCooperativaRuc(ruc);
    long totalViajes = boletoRepository.countViajesByCooperativa(ruc);
    double totalVentas = boletoRepository.sumMontoByCooperativa(ruc);
    return CooperativaDashboardDTO.builder()
            .totalUnidades(totalUnidades)
            .totalConductores(totalConductores)
            .totalViajes(totalViajes)
            .totalVentas(totalVentas)
            .capacidadPromedio(0)
            .build();
}
```

Esto requiere agregar las siguientes queries en los repositorios correspondientes. **Atención a la diferencia entre entidades:** `Conductor` tiene `@ManyToOne → Cooperativa` (acceso vía `c.cooperativa.ruc`), mientras que `Unidad` tiene un campo `ruc` plano (String), no una relación JPA (acceso vía `u.ruc`).

```java
// UnidadRepository.java — NOTA: Unidad.ruc es String plano, no @ManyToOne
@Query("SELECT COUNT(u) FROM Unidad u WHERE u.ruc = :ruc")
long countByRuc(@Param("ruc") String ruc);

// ConductorRepository.java — Conductor sí tiene @ManyToOne a Cooperativa
@Query("SELECT COUNT(c) FROM Conductor c WHERE c.cooperativa.ruc = :ruc")
long countByCooperativaRuc(@Param("ruc") String ruc);

// BoletoRepository.java — cadena Boleto → Horario → RutaFinal → Cooperativa
@Query("SELECT COUNT(DISTINCT b.horario.idHorario) FROM Boleto b WHERE b.horario.rutaFinal.cooperativa.ruc = :ruc")
long countViajesByCooperativa(@Param("ruc") String ruc);

@Query("SELECT COALESCE(SUM(b.monto), 0) FROM Boleto b WHERE b.horario.rutaFinal.cooperativa.ruc = :ruc")
double sumMontoByCooperativa(@Param("ruc") String ruc);
```

> **Verificar el campo exacto de monto en `Boleto.java`** antes de codificar (`b.monto`, `b.montoTotal`, `b.total`, etc.).

> **Verificar nombres reales de campos en la entidad `Boleto` antes de codificar.** Este ejemplo asume `b.monto` basado en la convención del proyecto, pero podría ser `montoTotal`, `precio`, `total`, etc. Confirmar con la entidad `Boleto.java`.

---

### 2.9 `SecurityConfig.java` — alinear reglas globales

```java
.requestMatchers("/api/admin/**").hasRole("ADMIN")
.requestMatchers(HttpMethod.POST, "/api/rutas/generales").hasRole("ADMIN")
.requestMatchers(HttpMethod.POST, "/api/rutas/ciudades").hasRole("ADMIN")
.requestMatchers(HttpMethod.DELETE, "/api/rutas/ciudades/**").hasRole("ADMIN")
.requestMatchers("/api/conductores-app/**").hasRole("CONDUCTOR")
.requestMatchers("/api/cooperativas/**").hasAnyRole("ADMIN", "COOPERATIVA")
```

Estas reglas a nivel de filtro son una **defensa en profundidad**: el `@PreAuthorize` por método sigue siendo la autoridad final, pero bloquear aquí evita que un endpoint nuevo se cree sin anotación y quede abierto por accidente (fail-secure).

> **Nota importante:** la regla `.requestMatchers("/api/cooperativas/**").hasAnyRole("ADMIN", "COOPERATIVA")` **no debe cambiarse** porque es un comodín general de defensa. Las restricciones más finas se aplican vía `@PreAuthorize` en cada método, que es más específico y prevalece. Esta regla en `SecurityConfig` solo asegura que, como mínimo, se requiera autenticación — las denegaciones más restrictivas las hace el método.

---

### 2.10 `CooperativaController.java` — guard de pertenencia faltante en `update`

**Problema:** `PUT /api/cooperativas/{ruc}` tiene `@PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA')")` sin ningún `@coopGuard`. Una cooperativa autenticada puede cambiar el `{ruc}` en la URL y modificar los datos de perfil de otra cooperativa (nombre, dirección, correo, teléfono). El service `CooperativaService.update()` recibe `authenticatedUsername` como parámetro y hace la validación internamente, pero esto es una validación blanda que depende de que el service se acuerde de hacerla — falta la defensa en profundidad a nivel de anotación.

**Corrección:**

```java
@PutMapping("/{ruc}")
@PreAuthorize("hasAnyRole('ADMIN', 'COOPERATIVA') and @coopGuard.canWrite(authentication, #ruc)")
public ResponseEntity<CooperativaDTO> update(
        @PathVariable String ruc,
        @Valid @RequestBody CooperativaUpdateRequest request,
        Authentication authentication) {
    CooperativaDTO dto = cooperativaService.update(ruc, request, authentication.getName());
    return ResponseEntity.ok(dto);
}
```

> **Nota 1 — semántica del guard:** a diferencia de conductores/ayudantes/unidades, aquí el ADMIN **sí necesita poder editar** cooperativas (razón: es parte de su rol de regulador — por ejemplo, actualizar datos de contacto de una cooperativa). Sin embargo, `@coopGuard.canWrite` **bloquea al ADMIN** porque retorna `false` para ADMIN.  
> **Solución:** expresión compuesta en el `@PreAuthorize`:
> ```java
> @PreAuthorize("hasRole('ADMIN') or (hasRole('COOPERATIVA') and @coopGuard.canWrite(authentication, #ruc))")
> ```
> 
> **Nota 2 — validación duplicada en el service debe eliminarse:** `CooperativaService.update()` (líneas 80-87) ya tiene su propia validación inline:
> ```java
> boolean isAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
>     .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
> if (!isAdmin && !authenticatedUsername.equals(ruc)) {
>     throw new UnauthorizedException("No puedes editar otra cooperativa");
> }
> ```
> Una vez que el `@PreAuthorize` del controlador está en su lugar, esta validación en el service es redundante y, peor, es otra fuente de verdad que puede desincronizarse (exactamente el problema que `@coopGuard` busca eliminar).  
> **Acción:** eliminar ese bloque del service y dejar que el `@PreAuthorize` y `@coopGuard` sean la única fuente de verdad. El service se simplifica a:
> ```java
> public CooperativaDTO update(String ruc, CooperativaUpdateRequest request) {
>     Cooperativa cooperativa = cooperativaRepository.findByRuc(ruc)
>         .orElseThrow(() -> new ResourceNotFoundException("Cooperativa not found with RUC: " + ruc));
>     // ... actualizar campos ...
> }
> ```

---

## 3. Frontend — rutas de interfaz y permisos visuales

### 3.1 Problema actual

`App.tsx` agrupa `rutas`, `horarios`, `conductores`, `ayudantes`, `reportes`, `unidades` bajo un único `<RoleRoute roles={['ADMIN', 'COOPERATIVA']}>`, mostrando exactamente la misma pantalla a ambos roles. Esto refuerza visualmente la idea de que el admin "opera" la cooperativa, cuando solo debería **supervisar**.

Además, las llamadas API actuales del frontend apuntan a rutas que cambiarán:

| Recurso | URL actual | URL nueva |
|---|---|---|
| Ayudantes | `GET /api/ayudantes` | `GET /api/cooperativas/{ruc}/ayudantes` |
| Ayudante by id | `GET /api/ayudantes/{cedula}` | `GET /api/cooperativas/{ruc}/ayudantes/{cedula}` |
| Dashboard cooperativa | `GET /api/admin/dashboard` | `GET /api/cooperativas/{ruc}/dashboard` |

Es necesario actualizar los archivos del frontend que hacen estas llamadas (services/api, hooks, etc.).

### 3.2 Estructura de rutas propuesta

```tsx
// App.tsx
<Route element={<RoleRoute roles={['ADMIN']} />}>
  <Route path="cooperativas" element={<CooperativasList />} />
  <Route path="ciudades" element={<CiudadesAdmin />} />
  <Route path="rutas-generales" element={<RutasGeneralesAdmin />} />
  <Route path="metricas" element={<MetricasGlobales />} />
</Route>

<Route element={<RoleRoute roles={['COOPERATIVA']} />}>
  <Route path="rutas" element={<RutasList />} />
  <Route path="horarios" element={<HorariosList />} />
  <Route path="conductores" element={<ConductoresList />} />
  <Route path="ayudantes" element={<AyudantesList />} />
  <Route path="unidades" element={<UnidadesList />} />
  <Route path="reportes" element={<ReportesList />} />
</Route>

<Route element={<RoleRoute roles={['USUARIO']} />}>
  <Route path="boletos" element={<BoletosList />} />
  <Route path="mis-boletos" element={<MisBoletos />} />
</Route>

<Route element={<RoleRoute roles={['CONDUCTOR']} />}>
  <Route path="conductor-dashboard" element={<ConductorDashboard />} />
</Route>
```

**Cambio clave:** las páginas operativas (`rutas`, `horarios`, `conductores`, `ayudantes`, `unidades`, `reportes`) dejan de ser accesibles para `ADMIN`. Si se necesita soporte ocasional, se crea una vista de **solo lectura** separada bajo `/admin/cooperativas/:ruc/...` en lugar de reutilizar el CRUD de la cooperativa.

### 3.3 Sidebar / navegación condicional

`MainLayout.tsx` debe construir el menú según el rol activo, no según una lista compartida:

```tsx
const navByRole: Record<string, NavItem[]> = {
  ADMIN: [
    { label: 'Cooperativas', path: '/dashboard/cooperativas', icon: 'building' },
    { label: 'Ciudades', path: '/dashboard/ciudades', icon: 'map-pin' },
    { label: 'Rutas generales', path: '/dashboard/rutas-generales', icon: 'route' },
    { label: 'Métricas globales', path: '/dashboard/metricas', icon: 'chart-bar' },
  ],
  COOPERATIVA: [
    { label: 'Rutas', path: '/dashboard/rutas', icon: 'route' },
    { label: 'Horarios', path: '/dashboard/horarios', icon: 'calendar' },
    { label: 'Unidades', path: '/dashboard/unidades', icon: 'bus' },
    { label: 'Conductores', path: '/dashboard/conductores', icon: 'user' },
    { label: 'Ayudantes', path: '/dashboard/ayudantes', icon: 'users' },
    { label: 'Reportes', path: '/dashboard/reportes', icon: 'chart-bar' },
  ],
  USUARIO: [
    { label: 'Mis boletos', path: '/dashboard/mis-boletos', icon: 'ticket' },
  ],
  CONDUCTOR: [
    { label: 'Mis horarios', path: '/dashboard/conductor-dashboard', icon: 'steering-wheel' },
  ],
};
```

Esto evita que el admin vea ítems de menú a páginas que ya no le corresponden, y refuerza visualmente el modelo de negocio: el admin gestiona la plataforma, la cooperativa gestiona su operación.

### 3.4 `Dashboard.tsx` — separar vista por rol

El `Dashboard.tsx` actual probablemente llama a `/api/admin/dashboard` sin distinguir el rol. Debe llamar al endpoint correspondiente:

```tsx
const { data } = useQuery(['dashboard'], () =>
  role === 'ADMIN'
    ? api.get('/admin/dashboard')                       // métricas globales
    : api.get(`/cooperativas/${rucCooperativa}/dashboard`) // métricas propias
);
```

Y renderizar componentes de KPI distintos: el admin ve "total cooperativas activas", "cooperativas pendientes de aprobar"; la cooperativa ve "mis unidades", "mis viajes del mes", "mis ventas".

---

## 4. Resumen de cambios por prioridad

| Prioridad | Cambio | Archivos afectados |
|---|---|---|
| 🔴 Crítica | Agregar `cooperativa_ruc` a entidad `Ayudante` + migración de datos | `Ayudante.java`, `AyudanteController.java`, `AyudanteService.java` |
| 🔴 Crítica | Filtrar `AyudanteController`/`Service` por `ruc` | `AyudanteController.java`, `AyudanteService.java` |
| 🔴 Crítica | Separar dashboard global del dashboard por cooperativa | `AdminController.java`, `AdminService.java`, nuevo `CooperativaDashboardDTO` |
| 🔴 Crítica | Crear `HorarioPublicDTO` y sanitizar `search` público (PII) | nuevo `HorarioPublicDTO.java`, `HorarioController.java`, `HorarioService.java` |
| 🟠 Alta | Quitar escritura de `ADMIN` en conductores/horarios/rutas finales + agregar `@coopGuard` | `ConductorController.java`, `HorarioController.java`, `RutaController.java` |
| 🟠 Alta | Crear `@coopGuard` y aplicarlo en todos los endpoints con `{ruc}` | nuevo `CooperativaAccessGuard.java` |
| 🟡 Media | Restringir rutas generales/ciudades a `ADMIN` en escritura | `RutaController.java`, `SecurityConfig.java` |
| 🟡 Media | Agregar guard de pertenencia en `UnidadController`, `ReporteController` | ambos controladores |
| 🟡 Media | Agregar `@PathVariable String ruc` a `UnidadController.getById()` | `UnidadController.java` |
| 🟡 Media | Agregar `@coopGuard` en `CooperativaController.update()` (ADMIN puede editar, COOPERATIVA solo la suya) | `CooperativaController.java` |
| 🟡 Media | Sanitizar `getById`/`getByRuta`/`getAsientos` para `USUARIO` (usar `HorarioPublicDTO`) | `HorarioService.java`, `HorarioController.java` |
| 🟢 Baja | Separar rutas de frontend y menú por rol | `App.tsx`, `MainLayout.tsx`, `Dashboard.tsx` |
| 🟢 Baja | Actualizar URLs de API en frontend (breaking changes) | services/api, hooks, páginas que llamen a `ayudantes` |

## 5. Validación recomendada

Para cada endpoint corregido, escribir un test de integración con dos cooperativas (`ruc=A`, `ruc=B`) que verifique:

1. La cooperativa A **no puede leer ni escribir** recursos de B vía ningún endpoint.
2. El ADMIN **no puede escribir** recursos operativos de ninguna cooperativa (conductores, ayudantes, unidades, horarios, rutas finales).
3. El ADMIN **sí puede leer** recursos operativos de cualquier cooperativa (soporte).
4. El ADMIN **sí puede** crear/aprobar/rechazar cooperativas y gestionar catálogo global (ciudades, rutas generales).
5. El endpoint público `GET /api/horarios/search` **no devuelve PII** (conductorCedula, conductorNombre) ni datos internos (`asientosReservados`).
6. Un `USUARIO` autenticado que llame a `GET /api/horarios/{id}` recibe datos públicos, no PII.

> **Nota:** actualmente no existen tests en el proyecto (`src/test` está vacío). Esto simplifica la implementación porque no hay regresiones que temer, pero estos tests de integración son necesarios antes de pasar a producción.
