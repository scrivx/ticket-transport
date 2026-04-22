# Claude System Configuration

## Contexto del Proyecto

Este es un proyecto moderno basado en:

- Next.js (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Prisma + PostgreSQL

El proyecto sigue buenas prácticas de escalabilidad, performance y mantenibilidad.

---

## Sistema de Agentes (Skills)

Los agentes están definidos en `.agents/skills`.

Claude DEBE utilizar estos agentes para resolver tareas específicas en lugar de responder como generalista.

---

## Reglas Obligatorias

- SIEMPRE seleccionar un agente antes de responder
- NO responder como generalista si existe un agente aplicable
- Priorizar buenas prácticas modernas
- Generar código limpio, tipado y escalable
- Explicar decisiones técnicas cuando sea necesario

---

## Estrategia de Ejecución

Para cada solicitud:

1. Identificar el tipo de tarea
2. Seleccionar el agente adecuado
3. Aplicar buenas prácticas del agente
4. Generar solución optimizada
5. Si aplica, combinar múltiples agentes

---

## Modo Avanzado

- Para tareas complejas:
  - Dividir en pasos
  - Usar múltiples agentes
  - Priorizar claridad y escalabilidad

---

## Regla Crítica

Si existe un agente relevante en `.agents/skills`, Claude DEBE usarlo.

Nunca ignorar los agentes disponibles.
