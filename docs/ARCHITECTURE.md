# Dashboard Médico - Arquitectura Frontend

## 1. Sitemap App Router

```
src/app/
├── [locale]/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   └── layout.tsx                    # AuthLayout (centrado, sin sidebar)
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx                    # DashboardLayout (sidebar + header + breadcrumb)
│   │   ├── page.tsx                      # /dashboard (redirect o home)
│   │   │
│   │   ├── patients/
│   │   │   ├── page.tsx                  # Lista de pacientes
│   │   │   ├── new/
│   │   │   │   └── page.tsx              # Crear paciente
│   │   │   └── [patientId]/
│   │   │       ├── page.tsx              # Detalle paciente (tabs: info, antecedentes, historial)
│   │   │       └── edit/
│   │   │           └── page.tsx          # Editar paciente
│   │   │
│   │   ├── appointments/
│   │   │   ├── page.tsx                  # Lista citas (filtros: estado, fecha)
│   │   │   ├── new/
│   │   │   │   └── page.tsx              # Crear cita
│   │   │   └── [appointmentId]/
│   │   │       ├── page.tsx              # Detalle cita
│   │   │       └── edit/
│   │   │           └── page.tsx          # Editar cita
│   │   │
│   │   ├── clinical-histories/
│   │   │   ├── page.tsx                  # Lista historiales
│   │   │   ├── new/
│   │   │   │   └── page.tsx              # Crear historial (desde appointment)
│   │   │   └── [historyId]/
│   │   │       └── page.tsx              # Detalle historial (solo lectura)
│   │   │
│   │   └── settings/
│   │       └── page.tsx                  # Configuración doctor
│   │
│   ├── layout.tsx                        # RootLayout (providers, i18n)
│   └── not-found.tsx
│
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts                  # NextAuth handlers
│
└── globals.css
```

---

## 2. Navegación Sidebar + Estrategia Breadcrumb

### 2.1 Estructura Sidebar

```typescript
// src/lib/config/navigation.ts
export const sidebarNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    title: 'Pacientes',
    href: '/patients',
    icon: 'Users',
    children: [
      { title: 'Lista', href: '/patients' },
      { title: 'Nuevo', href: '/patients/new' },
    ],
  },
  {
    title: 'Citas',
    href: '/appointments',
    icon: 'Calendar',
    children: [
      { title: 'Lista', href: '/appointments' },
      { title: 'Nueva', href: '/appointments/new' },
    ],
  },
  {
    title: 'Historiales',
    href: '/clinical-histories',
    icon: 'FileText',
  },
  {
    title: 'Configuración',
    href: '/settings',
    icon: 'Settings',
  },
] as const;
```

### 2.2 Estrategia Breadcrumb

| Ruta | Breadcrumb |
|------|------------|
| `/patients` | Dashboard > Pacientes |
| `/patients/new` | Dashboard > Pacientes > Nuevo |
| `/patients/[id]` | Dashboard > Pacientes > {nombre} |
| `/patients/[id]/edit` | Dashboard > Pacientes > {nombre} > Editar |
| `/appointments` | Dashboard > Citas |
| `/appointments/[id]` | Dashboard > Citas > #{id} |
| `/clinical-histories` | Dashboard > Historiales |
| `/clinical-histories/[id]` | Dashboard > Historiales > #{id} |

**Implementación:** Usar `usePathname()` + lookup dinámico para nombres de entidades.

```typescript
// src/lib/hooks/use-breadcrumbs.ts
type BreadcrumbItem = {
  label: string;
  href: string;
  isCurrentPage?: boolean;
};

// Se construye dinámicamente basado en pathname y data cacheada
```

---

## 3. Backlog por Épicas

### EPIC-01: Autenticación

#### Feature: AUTH-001 - Login Doctor

**User Stories:**

| ID | Historia | Criterios de Aceptación |
|----|----------|------------------------|
| US-001 | Como doctor, quiero iniciar sesión con email y contraseña para acceder al dashboard | - Formulario con email y password validados con Zod<br>- Mostrar errores de validación inline<br>- Mostrar toast de error si credenciales inválidas (AUTH_001)<br>- Redirect a /dashboard tras login exitoso<br>- Loading state en botón durante request |
| US-002 | Como doctor logueado, quiero que mi sesión persista para no hacer login cada vez | - Token almacenado en cookie httpOnly via NextAuth<br>- Refresh automático antes de expiración<br>- Redirect a /login si sesión expira |

---

### EPIC-02: Gestión de Pacientes

#### Feature: PAT-001 - Listar Pacientes

| ID | Historia | Criterios de Aceptación |
|----|----------|------------------------|
| US-003 | Como doctor, quiero ver una lista de mis pacientes para gestionar su información | - Tabla con columnas: nombre, documento, teléfono, acciones<br>- Estado loading con skeletons<br>- Estado empty con mensaje e ilustración<br>- Paginación server-side<br>- Búsqueda por nombre/documento |
| US-004 | Como doctor, quiero buscar pacientes por nombre o documento para encontrarlos rápido | - Input de búsqueda con debounce 300ms<br>- Query params en URL (?q=...)<br>- Clear button visible cuando hay texto |

#### Feature: PAT-002 - Crear Paciente

| ID | Historia | Criterios de Aceptación |
|----|----------|------------------------|
| US-005 | Como doctor, quiero registrar un nuevo paciente con sus datos básicos | - Formulario: nombre, apellido, documento, fecha nacimiento, género, teléfono, email, dirección<br>- Validación Zod de todos los campos<br>- Loading state en submit<br>- Toast success + redirect a detalle<br>- Toast error si documento duplicado (VAL_001) |

#### Feature: PAT-003 - Ver/Editar Paciente

| ID | Historia | Criterios de Aceptación |
|----|----------|------------------------|
| US-006 | Como doctor, quiero ver el detalle de un paciente con toda su información | - Tabs: Información, Antecedentes, Historial Clínico<br>- Loading state por tab<br>- Error 404 si paciente no existe (RES_001) |
| US-007 | Como doctor, quiero editar los datos de un paciente | - Formulario precargado con datos actuales<br>- Solo campos modificables<br>- Validación idéntica a creación<br>- Toast success tras guardar |

#### Feature: PAT-004 - Gestionar Antecedentes

| ID | Historia | Criterios de Aceptación |
|----|----------|------------------------|
| US-008 | Como doctor, quiero agregar antecedentes médicos permanentes a un paciente | - Tipos: Alergias, Enfermedades crónicas, Cirugías, Medicamentos, Familiares<br>- Form dinámico por tipo<br>- Lista editable de antecedentes existentes |
| US-009 | Como doctor, quiero ver los antecedentes de un paciente en su ficha | - Agrupados por tipo con badges<br>- Expandible/colapsable<br>- Empty state si no hay antecedentes |

#### Feature: PAT-005 - Eliminar Paciente

| ID | Historia | Criterios de Aceptación |
|----|----------|------------------------|
| US-010 | Como doctor, quiero eliminar un paciente si fue registrado por error | - Diálogo de confirmación<br>- Soft delete (no eliminar historiales)<br>- Toast success + redirect a lista |

---

### EPIC-03: Gestión de Citas

#### Feature: APT-001 - Listar Citas

| ID | Historia | Criterios de Aceptación |
|----|----------|------------------------|
| US-011 | Como doctor, quiero ver mis citas del día para organizar mi agenda | - Vista por defecto: citas de hoy<br>- Filtro por estado: scheduled, completed, cancelled<br>- Filtro por rango de fechas<br>- Orden cronológico |
| US-012 | Como doctor, quiero filtrar citas por fecha y estado para encontrar específicas | - Date range picker<br>- Select múltiple de estados<br>- Query params persistidos en URL<br>- Clear filters button |

#### Feature: APT-002 - Crear Cita

| ID | Historia | Criterios de Aceptación |
|----|----------|------------------------|
| US-013 | Como doctor, quiero agendar una nueva cita para un paciente | - Selector de paciente (combobox con búsqueda)<br>- Date picker (no fechas pasadas)<br>- Time picker (slots disponibles)<br>- Motivo de consulta (textarea)<br>- Validación de conflictos horarios |

#### Feature: APT-003 - Ver/Editar Cita

| ID | Historia | Criterios de Aceptación |
|----|----------|------------------------|
| US-014 | Como doctor, quiero ver el detalle de una cita con info del paciente | - Card con datos: paciente, fecha, hora, estado, motivo<br>- Link a ficha del paciente<br>- Acciones contextuales según estado |
| US-015 | Como doctor, quiero reprogramar una cita si es necesario | - Solo si estado = scheduled<br>- Nuevos date/time pickers<br>- Validación de conflictos |

#### Feature: APT-004 - Cancelar Cita

| ID | Historia | Criterios de Aceptación |
|----|----------|------------------------|
| US-016 | Como doctor, quiero cancelar una cita agendada | - Solo si estado = scheduled<br>- Diálogo con motivo de cancelación (requerido)<br>- Estado cambia a cancelled<br>- Toast confirmación |

#### Feature: APT-005 - Completar Cita

| ID | Historia | Criterios de Aceptación |
|----|----------|------------------------|
| US-017 | Como doctor, quiero marcar una cita como completada y crear historial | - Botón "Iniciar consulta" → redirect a crear historial<br>- Estado cambia a completed automáticamente<br>- Fecha de completado registrada |

---

### EPIC-04: Historial Clínico

#### Feature: HIS-001 - Crear Historial

| ID | Historia | Criterios de Aceptación |
|----|----------|------------------------|
| US-018 | Como doctor, quiero registrar un historial clínico tras una consulta | - Vinculado a appointment y patient<br>- Campos: motivo, síntomas, examen físico, diagnóstico, tratamiento, notas<br>- Sección de signos vitales<br>- Rich text opcional para notas |
| US-019 | Como doctor, quiero ver los antecedentes del paciente mientras registro | - Panel lateral o sección colapsable<br>- Antecedentes visibles durante edición<br>- Medicamentos actuales destacados |

#### Feature: HIS-002 - Listar Historiales

| ID | Historia | Criterios de Aceptación |
|----|----------|------------------------|
| US-020 | Como doctor, quiero ver todos los historiales de un paciente | - Cronología descendente<br>- Cards con: fecha, diagnóstico principal, preview<br>- Click para ver detalle |
| US-021 | Como doctor, quiero buscar en historiales por diagnóstico o fecha | - Filtro por rango de fechas<br>- Búsqueda por texto en diagnóstico |

#### Feature: HIS-003 - Ver Detalle Historial

| ID | Historia | Criterios de Aceptación |
|----|----------|------------------------|
| US-022 | Como doctor, quiero ver el detalle completo de un historial clínico | - Todas las secciones expandidas<br>- Signos vitales en cards visuales<br>- Link a cita y paciente relacionados<br>- Opción de imprimir/PDF |

---

## 4. Component Inventory (Atomic Design)

### 4.1 Global UI Components (`src/ui/`)

#### Atoms (`src/ui/atoms/`)

| Componente | Descripción | Props Principales |
|------------|-------------|-------------------|
| `Logo` | Logo de la aplicación | size: 'sm' \| 'md' \| 'lg' |
| `StatusBadge` | Badge de estado genérico | status, variant |
| `LoadingSpinner` | Spinner de carga | size |
| `EmptyIcon` | Icono para estados vacíos | type: 'patients' \| 'appointments' \| ... |

#### Molecules (`src/ui/molecules/`)

| Componente | Descripción | Composición |
|------------|-------------|-------------|
| `SearchInput` | Input con icono búsqueda y clear | Input + Icon + Button |
| `DateRangePicker` | Selector de rango fechas | Popover + Calendar + Button |
| `ConfirmDialog` | Diálogo de confirmación | AlertDialog + Button |
| `StatusSelect` | Selector de estados | Select + StatusBadge |
| `PatientCombobox` | Combobox búsqueda pacientes | Combobox + Avatar |
| `BreadcrumbNav` | Navegación breadcrumb | Breadcrumb items |
| `EmptyState` | Estado vacío con CTA | EmptyIcon + Text + Button |
| `ErrorState` | Estado error con retry | Icon + Text + Button |
| `TableSkeleton` | Skeleton para tablas | Skeleton rows |
| `CardSkeleton` | Skeleton para cards | Skeleton shapes |
| `FormSection` | Sección de formulario | Label + Description + Children |
| `PageHeader` | Header de página | Title + Description + Actions |

#### Organisms (`src/ui/organisms/`)

| Componente | Descripción | Composición |
|------------|-------------|-------------|
| `Sidebar` | Navegación lateral completa | Logo + NavItems + UserMenu |
| `Header` | Header del dashboard | Breadcrumb + Search + Notifications |
| `DataTable` | Tabla con sorting/paginación | Table + Pagination + Sorting |
| `FormCard` | Card contenedor de formularios | Card + FormSection |

#### Templates (`src/ui/templates/`)

| Componente | Descripción | Composición |
|------------|-------------|-------------|
| `AuthLayout` | Layout para páginas auth | Centered container + Logo |
| `DashboardLayout` | Layout principal dashboard | Sidebar + Header + Main |
| `ListPageTemplate` | Template para páginas lista | PageHeader + Filters + Table |
| `DetailPageTemplate` | Template para páginas detalle | PageHeader + Tabs + Content |
| `FormPageTemplate` | Template para páginas formulario | PageHeader + FormCard |

---

### 4.2 Feature Components (`src/features/<name>/ui/`)

#### Patients (`src/features/patients/ui/`)

| Componente | Tipo | Descripción |
|------------|------|-------------|
| `PatientForm` | organism | Formulario crear/editar paciente |
| `PatientCard` | molecule | Card resumen paciente |
| `PatientTable` | organism | Tabla de pacientes |
| `PatientFilters` | molecule | Filtros de búsqueda |
| `PatientTabs` | organism | Tabs de detalle (info, antecedentes, historial) |
| `AntecedentList` | organism | Lista de antecedentes por tipo |
| `AntecedentForm` | organism | Form agregar antecedente |
| `AntecedentBadge` | atom | Badge tipo antecedente |

#### Appointments (`src/features/appointments/ui/`)

| Componente | Tipo | Descripción |
|------------|------|-------------|
| `AppointmentForm` | organism | Formulario crear/editar cita |
| `AppointmentCard` | molecule | Card resumen cita |
| `AppointmentTable` | organism | Tabla de citas |
| `AppointmentFilters` | organism | Filtros fecha + estado |
| `AppointmentStatusBadge` | atom | Badge estado cita |
| `CancelAppointmentDialog` | molecule | Diálogo cancelación |
| `TimeSlotPicker` | molecule | Selector de horarios |

#### Clinical Histories (`src/features/clinical-histories/ui/`)

| Componente | Tipo | Descripción |
|------------|------|-------------|
| `ClinicalHistoryForm` | organism | Formulario crear historial |
| `ClinicalHistoryCard` | molecule | Card resumen historial |
| `ClinicalHistoryDetail` | organism | Vista detalle completa |
| `ClinicalHistoryTimeline` | organism | Línea tiempo historiales |
| `VitalSignsCard` | molecule | Card signos vitales |
| `VitalSignsForm` | molecule | Form signos vitales |
| `PatientAntecedentsPanel` | organism | Panel antecedentes (lateral) |

---

## 5. Definición de MVPs

### MVP 1 - Core Flows (3 flujos principales)

**Objetivo:** Doctor puede realizar el flujo completo de una consulta.

| Flujo | Features Incluidas | User Stories |
|-------|-------------------|--------------|
| **1. Autenticación** | AUTH-001 | US-001, US-002 |
| **2. Gestión Pacientes** | PAT-001, PAT-002, PAT-003 | US-003, US-005, US-006, US-007 |
| **3. Crear Historial** | HIS-001, HIS-003 | US-018, US-022 |

**Entregables MVP 1:**
- Login funcional con NextAuth
- CRUD básico de pacientes (sin antecedentes)
- Crear historial clínico desde cero (sin cita)
- Ver detalle de historial

**Componentes críticos MVP 1:**
- AuthLayout, DashboardLayout
- Sidebar, Header, DataTable
- PatientForm, PatientTable
- ClinicalHistoryForm, ClinicalHistoryDetail
- EmptyState, ErrorState, LoadingSpinner

---

### MVP 2 - Full Features

**Objetivo:** Sistema completo con citas y antecedentes.

| Flujo | Features Incluidas | User Stories |
|-------|-------------------|--------------|
| **4. Antecedentes** | PAT-004 | US-008, US-009 |
| **5. Gestión Citas** | APT-001 → APT-005 | US-011 → US-017 |
| **6. Historial desde Cita** | HIS-001 (completo), HIS-002 | US-019, US-020, US-021 |
| **7. Eliminar Paciente** | PAT-005 | US-010 |

**Entregables MVP 2:**
- CRUD completo de citas con filtros
- Gestión de antecedentes por paciente
- Flujo completo: Cita → Historial
- Listado y búsqueda de historiales
- Funcionalidades de cancelación y eliminación

---

## 6. Definition of Done (DoD) por Feature

### Checklist Estándar

Cada feature debe cumplir TODOS estos criterios antes de considerarse "Done":

#### UI States

- [ ] **Loading State**: Skeletons o spinners durante fetch de datos
- [ ] **Empty State**: Mensaje + ilustración + CTA cuando no hay datos
- [ ] **Error State**: Mensaje descriptivo + botón retry
- [ ] **Success Feedback**: Toast de confirmación tras acciones exitosas

#### Validación y Parsing

- [ ] **Zod Input Schema**: Todos los formularios validados con Zod + zodResolver
- [ ] **Zod Response Parse**: Todas las respuestas API parseadas con schema Zod
- [ ] **Error Handling**: ProblemDetails manejados y mapeados a mensajes UI

#### API Client

- [ ] **Axios Only**: Todas las peticiones via `client.get/post/put/delete`
- [ ] **Type Safety**: Request y Response tipados end-to-end
- [ ] **Error Normalization**: Usar `AppError` de `src/lib/api/errors.ts`

#### Componentes

- [ ] **Atomic Design**: Componentes ubicados en nivel correcto (atom/molecule/organism)
- [ ] **Reutilización**: Si se usa 2+ veces → extraer a shared
- [ ] **shadcn/ui**: Usar componentes base de shadcn
- [ ] **Design Tokens**: Sin colores hardcodeados, usar CSS variables

#### Código

- [ ] **TypeScript Strict**: Sin `any`, sin `unknown` sin validar
- [ ] **No Console Logs**: Código limpio sin logs de debug
- [ ] **No Commented Code**: Sin código comentado

#### UX

- [ ] **Loading Button**: Disabled + spinner durante submit
- [ ] **Form Reset**: Limpiar form tras submit exitoso
- [ ] **Optimistic UI**: Considerar para acciones frecuentes
- [ ] **Keyboard Navigation**: Forms navegables con tab
- [ ] **Focus Management**: Focus en primer campo al abrir forms

---

## Estructura de Carpetas Final

```
src/
├── app/
│   └── [locale]/
│       ├── (auth)/
│       └── (dashboard)/
│
├── features/
│   ├── auth/
│   │   ├── api/           # Hooks y llamadas API
│   │   ├── schemas/       # Zod schemas
│   │   ├── types/         # Tipos específicos
│   │   └── ui/            # Componentes feature
│   │
│   ├── patients/
│   │   ├── api/
│   │   ├── schemas/
│   │   ├── types/
│   │   └── ui/
│   │
│   ├── appointments/
│   │   ├── api/
│   │   ├── schemas/
│   │   ├── types/
│   │   └── ui/
│   │
│   └── clinical-histories/
│       ├── api/
│       ├── schemas/
│       ├── types/
│       └── ui/
│
├── ui/
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
│
├── lib/
│   ├── api/               # Axios client, errors
│   ├── config/            # Navigation, constants
│   ├── hooks/             # Hooks globales
│   ├── schemas/           # Schemas compartidos
│   └── types/             # Tipos globales
│
├── types/
│   └── contracts/         # Contratos API (ProblemDetails, ApiResponse)
│
├── i18n/
│   ├── routing.ts         # Configuración de locales (es, en)
│   ├── request.ts         # Carga dinámica de mensajes
│   └── navigation.ts      # Link, redirect, usePathname, useRouter
│
├── messages/
│   ├── es.json            # Traducciones español
│   └── en.json            # Traducciones inglés
│
└── middleware.ts          # Middleware i18n + auth
```

---

## 7. Internacionalización (i18n)

### Configuración

Usamos `next-intl` (^4.5.3) con la siguiente configuración:

| Locale | Nombre | Prefijo URL | Por Defecto |
|--------|--------|-------------|-------------|
| es | Español | No (as-needed) | Sí |
| en | English | /en | No |

### Archivos de Configuración

**`src/i18n/routing.ts`** - Define locales soportados:

```typescript
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'as-needed',
});

export type Locale = (typeof routing.locales)[number];
```

**`src/i18n/navigation.ts`** - Helpers de navegación:

```typescript
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

### Uso en Componentes

```typescript
// Componentes Cliente
import { useTranslations } from 'next-intl';

function ClientComponent() {
  const t = useTranslations('common');
  return <h1>{t('appName')}</h1>;
}

// Componentes Servidor
import { getTranslations } from 'next-intl/server';

async function ServerComponent() {
  const t = await getTranslations('common');
  return <h1>{t('appName')}</h1>;
}

// Navegación con locale
import { Link } from '@/i18n/navigation';

function Nav() {
  return (
    <>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/" locale="en">English</Link>
    </>
  );
}
```

### Estructura de Mensajes

Los archivos de mensajes están organizados por namespace:

```json
{
  "common": { "appName": "...", "loading": "...", ... },
  "navigation": { "dashboard": "...", "patients": "...", ... },
  "auth": { "login": "...", "password": "...", ... },
  "patients": { "title": "...", "firstName": "...", ... },
  "appointments": { "title": "...", "status": "...", ... },
  "clinicalHistories": { "title": "...", "diagnosis": "...", ... },
  "errors": { "required": "...", "serverError": "...", ... }
}
```

---

## Documentación Adicional

| Documento | Descripción |
|-----------|-------------|
| [NEW_MODULE_GUIDE.md](./NEW_MODULE_GUIDE.md) | Guía paso a paso para crear un nuevo módulo |
| [COMPONENT_INVENTORY.md](./COMPONENT_INVENTORY.md) | Inventario de componentes disponibles |

---

## Estado del Proyecto

### MVP 1 - Completado ✅

| Módulo | Estado | Funcionalidades |
|--------|--------|-----------------|
| Auth | ✅ Maquetado | Login, Forgot Password (sin lógica) |
| Patients | ✅ Completado | Lista, Crear, Ver detalle (tabs), Editar |
| Clinical Histories | ✅ Completado | Lista, Crear, Ver detalle |
| UI Base | ✅ Completado | Atoms, Molecules, Organisms, Templates |
| Navegación | ✅ Completado | Sidebar, Breadcrumbs dinámicos |

### Próximos Pasos (MVP 2)

1. **Integrar NextAuth** con credenciales provider y protección de rutas
2. **Conectar API real** con los endpoints del backend
3. **Módulo Appointments** - CRUD de citas médicas
4. **Antecedentes del paciente** - Sección dentro del detalle
5. **Notificaciones** - Toast para feedback de acciones

---

## Comandos Útiles

```bash
# Desarrollo
pnpm dev

# Build de producción
pnpm build

# Linting
pnpm lint

# Agregar componente shadcn
pnpm dlx shadcn@latest add <component>
```
