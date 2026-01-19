# Inventario de Componentes - Clínica San Miguel

## Componentes Base Disponibles

### Atoms (`src/ui/atoms/`)

| Componente | Descripción | Props |
|------------|-------------|-------|
| `Logo` | Logo de la clínica | `size?: 'sm' \| 'md' \| 'lg'`, `showText?: boolean` |
| `StatusBadge` | Badge para estados | `status: string`, `variant?: 'default' \| 'success' \| 'warning' \| 'error' \| 'info'` |
| `LoadingSpinner` | Spinner de carga | `size?: 'sm' \| 'md' \| 'lg'` |

```typescript
import { Logo, StatusBadge, LoadingSpinner } from '@/ui/atoms';

<Logo size="md" showText />
<StatusBadge status="Activo" variant="success" />
<LoadingSpinner size="sm" />
```

---

### Molecules (`src/ui/molecules/`)

| Componente | Descripción | Props principales |
|------------|-------------|-------------------|
| `SearchInput` | Input con búsqueda | `value`, `onChange`, `placeholder` |
| `EmptyState` | Estado vacío | `type`, `title`, `description`, `actionLabel`, `onAction` |
| `ErrorState` | Estado de error | `title`, `description`, `retryLabel`, `onRetry` |
| `PageHeader` | Encabezado de página | `title`, `description`, `actions` |
| `FormSection` | Sección de formulario | `title`, `description`, `children` |
| `ConfirmDialog` | Diálogo de confirmación | `open`, `title`, `description`, `onConfirm`, `variant` |
| `BreadcrumbNav` | Navegación breadcrumb | `items: BreadcrumbItemData[]` |
| `TableSkeleton` | Skeleton para tablas | `columns`, `rows` |

```typescript
import { 
  SearchInput, 
  EmptyState, 
  ErrorState, 
  PageHeader,
  FormSection,
  ConfirmDialog,
  BreadcrumbNav,
  TableSkeleton 
} from '@/ui/molecules';

// Búsqueda
<SearchInput 
  value={search} 
  onChange={setSearch} 
  placeholder={t('common.search')} 
/>

// Estado vacío
<EmptyState
  type="patients"
  title={t('patients.emptyTitle')}
  description={t('patients.emptyDescription')}
  actionLabel={t('patients.newPatient')}
  onAction={() => router.push('/patients/new')}
/>

// Encabezado
<PageHeader
  title={t('patients.title')}
  description={t('patients.description')}
  actions={<Button>Acción</Button>}
/>

// Diálogo de confirmación
<ConfirmDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title={t('common.confirmDelete')}
  description="¿Estás seguro?"
  confirmLabel={t('common.delete')}
  cancelLabel={t('common.cancel')}
  onConfirm={handleDelete}
  variant="destructive"
/>
```

---

### Organisms (`src/ui/organisms/`)

| Componente | Descripción | Props principales |
|------------|-------------|-------------------|
| `Sidebar` | Barra lateral con navegación | `className` |
| `MobileSidebar` | Sidebar para móvil (Sheet) | `open`, `onOpenChange` |
| `Header` | Header con breadcrumbs | `breadcrumbs`, `onMenuClick` |
| `DataTable` | Tabla con paginación | `data`, `columns`, `keyExtractor`, `page`, `totalPages`, `onPageChange` |

```typescript
import { Sidebar, MobileSidebar, Header, DataTable, type Column } from '@/ui/organisms';

// Definir columnas
const columns: Column<Patient>[] = [
  {
    key: 'fullName',
    headerKey: 'patients.fullName',
    render: (item) => `${item.firstName} ${item.lastName}`,
  },
  {
    key: 'email',
    headerKey: 'patients.email',
  },
  {
    key: 'actions',
    headerKey: 'common.actions',
    className: 'w-[80px]',
    render: (item) => <ActionMenu item={item} />,
  },
];

<DataTable
  data={patients}
  columns={columns}
  keyExtractor={(p) => p.id}
  page={1}
  totalPages={5}
  onPageChange={setPage}
  onRowClick={handleView}
/>
```

---

### Templates (`src/ui/templates/`)

| Componente | Descripción | Props |
|------------|-------------|-------|
| `AuthLayout` | Layout para páginas de auth | `children` |
| `DashboardLayout` | Layout principal con sidebar | `children`, `breadcrumbs` |
| `ListPageTemplate` | Template para listas | `title`, `description`, `actions`, `filters`, `children` |
| `FormPageTemplate` | Template para formularios | `title`, `description`, `actions`, `children` |

```typescript
import { 
  AuthLayout, 
  DashboardLayout, 
  ListPageTemplate, 
  FormPageTemplate 
} from '@/ui/templates';

// Lista
<ListPageTemplate
  title={t('patients.title')}
  description={t('patients.description')}
  actions={<Button onClick={() => router.push('/patients/new')}>Nuevo</Button>}
  filters={<SearchInput value={search} onChange={setSearch} />}
>
  <PatientTable patients={patients} />
</ListPageTemplate>

// Formulario
<FormPageTemplate
  title={t('patients.newPatient')}
  description="Datos del paciente"
>
  <PatientForm onSubmit={handleSubmit} onCancel={handleCancel} />
</FormPageTemplate>
```

---

## Componentes shadcn/ui Instalados

| Componente | Import |
|------------|--------|
| `Button` | `@/components/ui/button` |
| `Input` | `@/components/ui/input` |
| `Label` | `@/components/ui/label` |
| `Card` | `@/components/ui/card` |
| `Form` | `@/components/ui/form` |
| `Table` | `@/components/ui/table` |
| `Tabs` | `@/components/ui/tabs` |
| `Dialog` | `@/components/ui/dialog` |
| `AlertDialog` | `@/components/ui/alert-dialog` |
| `Sonner (Toast)` | `@/components/ui/sonner` |
| `Skeleton` | `@/components/ui/skeleton` |
| `Badge` | `@/components/ui/badge` |
| `Avatar` | `@/components/ui/avatar` |
| `DropdownMenu` | `@/components/ui/dropdown-menu` |
| `Separator` | `@/components/ui/separator` |
| `Breadcrumb` | `@/components/ui/breadcrumb` |
| `Select` | `@/components/ui/select` |
| `Textarea` | `@/components/ui/textarea` |
| `Popover` | `@/components/ui/popover` |
| `Calendar` | `@/components/ui/calendar` |
| `ScrollArea` | `@/components/ui/scroll-area` |
| `Sheet` | `@/components/ui/sheet` |
| `Tooltip` | `@/components/ui/tooltip` |

---

## Hooks y Utilidades

### Navegación (next-intl)

```typescript
import { Link, useRouter, usePathname, redirect } from '@/i18n/navigation';

// Router con locale automático
const router = useRouter();
router.push('/patients');
router.push('/patients/123');

// Link con locale automático
<Link href="/patients">Pacientes</Link>

// Pathname sin locale
const pathname = usePathname(); // '/patients' en lugar de '/es/patients'
```

### Traducciones

```typescript
// Componente cliente
'use client';
import { useTranslations } from 'next-intl';

function Component() {
  const t = useTranslations();
  return <h1>{t('patients.title')}</h1>;
}

// Componente servidor
import { getTranslations } from 'next-intl/server';

async function ServerComponent() {
  const t = await getTranslations('patients');
  return <h1>{t('title')}</h1>;
}
```

### Formularios

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().min(1, 'errors.required').email('errors.invalidEmail'),
  name: z.string().min(2, 'errors.minLength'),
});

type FormData = z.infer<typeof schema>;

function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', name: '' },
  });

  const onSubmit = async (data: FormData) => {
    // ...
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
```

---

## API Client

```typescript
import { client } from '@/lib/api/client';
import { ApiResponseSchema } from '@/types/contracts/api-response';
import { entitySchema } from './schemas/entity.schema';

// GET con validación Zod
const response = await client.get('/entities', ApiResponseSchema(entitySchema));

// POST
const response = await client.post('/entities', data, ApiResponseSchema(entitySchema));

// PUT
const response = await client.put('/entities/123', data, ApiResponseSchema(entitySchema));

// DELETE
await client.delete('/entities/123', ApiResponseSchema(entitySchema));
```

---

## Paleta de Colores

| Variable CSS | Uso | Light | Dark |
|--------------|-----|-------|------|
| `--primary` | Botones, links activos | Teal 550 | Teal 400 |
| `--primary-foreground` | Texto sobre primary | Blanco | Dark |
| `--secondary` | Botones secundarios | Teal 50 | Teal 900 |
| `--muted` | Fondos sutiles | Gray 50 | Gray 800 |
| `--muted-foreground` | Texto secundario | Gray 500 | Gray 400 |
| `--destructive` | Acciones peligrosas | Red 500 | Red 400 |
| `--sidebar` | Fondo sidebar | Teal 900 | Teal 950 |
| `--sidebar-foreground` | Texto sidebar | White | White |

```css
/* Uso en Tailwind */
<div className="bg-primary text-primary-foreground">Botón</div>
<p className="text-muted-foreground">Texto secundario</p>
<button className="bg-destructive">Eliminar</button>
```
