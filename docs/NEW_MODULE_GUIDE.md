# Guía para Crear un Nuevo Módulo

## 1. Estructura de Carpetas

Cada módulo (feature) debe seguir esta estructura:

```
src/features/<module-name>/
├── api/
│   └── <module>.api.ts       # Llamadas a la API con axios
├── schemas/
│   └── <module>.schema.ts    # Schemas Zod para validación
├── types/
│   └── <module>.types.ts     # Tipos TypeScript
└── ui/
    ├── <Component1>.tsx      # Componentes del módulo
    ├── <Component2>.tsx
    └── index.ts              # Barrel exports
```

## 2. Páginas en App Router

```
src/app/[locale]/(dashboard)/<module-name>/
├── page.tsx                  # Lista principal
├── new/
│   └── page.tsx              # Crear nuevo
└── [<id>]/
    ├── page.tsx              # Detalle
    └── edit/
        └── page.tsx          # Editar
```

---

## 3. Checklist Antes de Iniciar

### 3.1 Definir el Modelo de Datos

```typescript
// src/features/<module>/types/<module>.types.ts

export type Entity = {
  id: string;
  // ... campos del modelo
  createdAt: string;
  updatedAt: string;
};

export type CreateEntityRequest = Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateEntityRequest = Partial<CreateEntityRequest>;

export type EntityListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  // ... otros filtros
};
```

### 3.2 Crear Schemas Zod

```typescript
// src/features/<module>/schemas/<module>.schema.ts

import { z } from 'zod';

// Schema para parsear respuestas de API
export const entitySchema = z.object({
  id: z.string(),
  // ... campos que vienen del backend
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Schema para validar formularios
export const entityFormSchema = z.object({
  field1: z.string().min(1, 'errors.required'),
  field2: z.string().email('errors.invalidEmail'),
  // ... validaciones de cada campo
});

export type EntityFormData = z.infer<typeof entityFormSchema>;

// Schema para lista paginada
export const entityListResponseSchema = z.object({
  items: z.array(entitySchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
});
```

### 3.3 Crear API Client

```typescript
// src/features/<module>/api/<module>.api.ts

import { client } from '@/lib/api/client';
import { ApiResponseSchema } from '@/types/contracts/api-response';
import { entitySchema, entityListResponseSchema } from '../schemas/<module>.schema';
import type { Entity, CreateEntityRequest, UpdateEntityRequest, EntityListParams } from '../types/<module>.types';
import type { PaginatedData } from '@/types/contracts/api-response';

const ENDPOINT = '/<module-name>';

export async function getEntities(params?: EntityListParams): Promise<PaginatedData<Entity>> {
  const response = await client.get(
    ENDPOINT,
    ApiResponseSchema(entityListResponseSchema),
    { params }
  );
  return response.data;
}

export async function getEntityById(id: string): Promise<Entity> {
  const response = await client.get(
    `${ENDPOINT}/${id}`,
    ApiResponseSchema(entitySchema)
  );
  return response.data;
}

export async function createEntity(data: CreateEntityRequest): Promise<Entity> {
  const response = await client.post(
    ENDPOINT,
    data,
    ApiResponseSchema(entitySchema)
  );
  return response.data;
}

export async function updateEntity(id: string, data: UpdateEntityRequest): Promise<Entity> {
  const response = await client.put(
    `${ENDPOINT}/${id}`,
    data,
    ApiResponseSchema(entitySchema)
  );
  return response.data;
}

export async function deleteEntity(id: string): Promise<void> {
  await client.delete(
    `${ENDPOINT}/${id}`,
    ApiResponseSchema(entitySchema)
  );
}
```

---

## 4. Agregar Traducciones

### 4.1 Español (`src/messages/es.json`)

```json
{
  "<moduleName>": {
    "title": "Título del Módulo",
    "description": "Descripción del módulo",
    "newItem": "Nuevo Item",
    "editItem": "Editar Item",
    "itemDetails": "Detalles del Item",
    "field1": "Campo 1",
    "field2": "Campo 2",
    "emptyTitle": "No hay items",
    "emptyDescription": "Comienza agregando tu primer item",
    "deleteConfirmTitle": "Eliminar Item",
    "deleteConfirmDescription": "¿Estás seguro de eliminar este item?",
    "createdSuccess": "Item creado exitosamente",
    "updatedSuccess": "Item actualizado exitosamente",
    "deletedSuccess": "Item eliminado exitosamente"
  }
}
```

### 4.2 Inglés (`src/messages/en.json`)

```json
{
  "<moduleName>": {
    "title": "Module Title",
    "description": "Module description",
    "newItem": "New Item",
    "editItem": "Edit Item",
    "itemDetails": "Item Details",
    "field1": "Field 1",
    "field2": "Field 2",
    "emptyTitle": "No items",
    "emptyDescription": "Start by adding your first item",
    "deleteConfirmTitle": "Delete Item",
    "deleteConfirmDescription": "Are you sure you want to delete this item?",
    "createdSuccess": "Item created successfully",
    "updatedSuccess": "Item updated successfully",
    "deletedSuccess": "Item deleted successfully"
  }
}
```

---

## 5. Agregar Navegación

### 5.1 Sidebar (`src/lib/config/navigation.ts`)

```typescript
import { NewIcon } from 'lucide-react';

// Agregar al array sidebarNavItems:
{
  titleKey: 'navigation.<moduleName>',
  href: '/<module-name>',
  icon: NewIcon,
  children: [
    { titleKey: '<moduleName>.title', href: '/<module-name>' },
    { titleKey: '<moduleName>.newItem', href: '/<module-name>/new' },
  ],
},
```

### 5.2 Traducciones de Navegación

```json
{
  "navigation": {
    "<moduleName>": "Nombre del Módulo"
  }
}
```

---

## 6. Componentes UI Requeridos

### 6.1 Formulario (`<Module>Form.tsx`)

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FormSection } from '@/ui/molecules';
import { LoadingSpinner } from '@/ui/atoms';
import { entityFormSchema, type EntityFormData } from '../schemas/<module>.schema';
import type { Entity } from '../types/<module>.types';

type EntityFormProps = {
  entity?: Entity;
  onSubmit: (data: EntityFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
};

export function EntityForm({ entity, onSubmit, onCancel, isLoading }: EntityFormProps) {
  const t = useTranslations();

  const form = useForm<EntityFormData>({
    resolver: zodResolver(entityFormSchema),
    defaultValues: {
      field1: entity?.field1 ?? '',
      field2: entity?.field2 ?? '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormSection title={t('<moduleName>.sectionTitle')}>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="field1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('<moduleName>.field1')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
            {t('common.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

### 6.2 Tabla (`<Module>Table.tsx`)

```typescript
'use client';

import { useTranslations } from 'next-intl';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable, type Column } from '@/ui/organisms';
import type { Entity } from '../types/<module>.types';

type EntityTableProps = {
  entities: Entity[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onView: (entity: Entity) => void;
  onEdit: (entity: Entity) => void;
  onDelete: (entity: Entity) => void;
};

export function EntityTable({
  entities,
  page,
  totalPages,
  onPageChange,
  onView,
  onEdit,
  onDelete,
}: EntityTableProps) {
  const t = useTranslations();

  const columns: Column<Entity>[] = [
    {
      key: 'field1',
      headerKey: '<moduleName>.field1',
    },
    {
      key: 'actions',
      headerKey: 'common.actions',
      className: 'w-[80px]',
      render: (entity) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(entity)}>
              <Eye className="mr-2 h-4 w-4" />
              {t('common.view')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(entity)}>
              <Pencil className="mr-2 h-4 w-4" />
              {t('common.edit')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(entity)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              {t('common.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTable
      data={entities}
      columns={columns}
      keyExtractor={(entity) => entity.id}
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      onRowClick={onView}
    />
  );
}
```

---

## 7. Páginas

### 7.1 Lista (`page.tsx`)

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListPageTemplate } from '@/ui/templates';
import { EmptyState, ConfirmDialog } from '@/ui/molecules';
import { EntityTable, EntityFilters } from '@/features/<module>/ui';
import type { Entity } from '@/features/<module>/types/<module>.types';

export default function EntitiesPage() {
  const t = useTranslations();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteEntity, setDeleteEntity] = useState<Entity | null>(null);

  // TODO: Reemplazar con llamada real a API
  const entities: Entity[] = [];

  const handleView = (entity: Entity) => {
    router.push(`/<module-name>/${entity.id}`);
  };

  const handleEdit = (entity: Entity) => {
    router.push(`/<module-name>/${entity.id}/edit`);
  };

  const handleDelete = () => {
    // TODO: Llamar API para eliminar
    setDeleteEntity(null);
  };

  return (
    <>
      <ListPageTemplate
        title={t('<moduleName>.title')}
        description={t('<moduleName>.description')}
        actions={
          <Button onClick={() => router.push('/<module-name>/new')}>
            <Plus className="mr-2 h-4 w-4" />
            {t('<moduleName>.newItem')}
          </Button>
        }
        filters={<EntityFilters search={search} onSearchChange={setSearch} />}
      >
        {entities.length === 0 ? (
          <EmptyState
            type="default"
            title={t('<moduleName>.emptyTitle')}
            description={t('<moduleName>.emptyDescription')}
            actionLabel={t('<moduleName>.newItem')}
            onAction={() => router.push('/<module-name>/new')}
          />
        ) : (
          <EntityTable
            entities={entities}
            page={page}
            totalPages={1}
            onPageChange={setPage}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={setDeleteEntity}
          />
        )}
      </ListPageTemplate>

      <ConfirmDialog
        open={!!deleteEntity}
        onOpenChange={(open) => !open && setDeleteEntity(null)}
        title={t('<moduleName>.deleteConfirmTitle')}
        description={t('<moduleName>.deleteConfirmDescription')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleDelete}
        variant="destructive"
      />
    </>
  );
}
```

### 7.2 Crear (`new/page.tsx`)

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { FormPageTemplate } from '@/ui/templates';
import { EntityForm } from '@/features/<module>/ui';
import type { EntityFormData } from '@/features/<module>/schemas/<module>.schema';

export default function NewEntityPage() {
  const t = useTranslations();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: EntityFormData) => {
    setIsLoading(true);
    try {
      // TODO: Llamar API para crear
      console.log('Create:', data);
      router.push('/<module-name>');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormPageTemplate title={t('<moduleName>.newItem')}>
      <EntityForm
        onSubmit={handleSubmit}
        onCancel={() => router.push('/<module-name>')}
        isLoading={isLoading}
      />
    </FormPageTemplate>
  );
}
```

---

## 8. Definition of Done (DoD)

Cada módulo debe cumplir:

- [ ] **Types**: Tipos definidos en `types/<module>.types.ts`
- [ ] **Schemas**: Validación Zod en `schemas/<module>.schema.ts`
- [ ] **API**: Cliente con axios en `api/<module>.api.ts`
- [ ] **UI Components**: Form, Table, Filters, etc.
- [ ] **Pages**: Lista, Crear, Detalle, Editar
- [ ] **i18n**: Traducciones en `es.json` y `en.json`
- [ ] **Navigation**: Entrada en sidebar
- [ ] **Loading States**: Skeletons o spinners
- [ ] **Empty States**: Mensaje cuando no hay datos
- [ ] **Error States**: Manejo de errores
- [ ] **Form Validation**: Errores inline con Zod
- [ ] **Success Feedback**: Toast de confirmación
- [ ] **Build exitoso**: `pnpm run build` sin errores

---

## 9. Convenciones de Código

### Nombres de Archivos
- Componentes: `PascalCase.tsx`
- Tipos/Schemas: `kebab-case.types.ts`, `kebab-case.schema.ts`
- API: `kebab-case.api.ts`

### Imports
```typescript
// 1. React/Next
import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';

// 2. Librerías externas
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

// 3. Componentes UI (shadcn)
import { Button } from '@/components/ui/button';

// 4. Componentes propios
import { PageHeader } from '@/ui/molecules';

// 5. Feature imports
import { EntityForm } from '../ui';
import type { Entity } from '../types/<module>.types';
```

### Traducciones
- Siempre usar `useTranslations()` (cliente) o `getTranslations()` (servidor)
- Nunca texto hardcodeado
- Keys descriptivas: `<namespace>.<key>`

### Formularios
- Siempre usar `react-hook-form` + `zodResolver`
- Validación con mensajes i18n
- Loading state en botón submit
- Campos disabled durante submit
