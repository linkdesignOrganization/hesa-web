/**
 * Shared helpers for message display across admin components.
 * Eliminates duplication of getTypeLabel and getRelativeDate
 * in messages, message-detail, and dashboard components.
 */

/** Map message type key to display label (REQ-296) */
export function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    info: 'Informacion',
    comercial: 'Comercial',
    soporte: 'Soporte',
    fabricante: 'Fabricante',
    otro: 'Otro',
  };
  return labels[type] || type;
}

/** Calculate relative date from ISO string */
export function getRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Justo ahora';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 7) return `Hace ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
  return date.toLocaleDateString('es-CR', { day: 'numeric', month: 'short' });
}
