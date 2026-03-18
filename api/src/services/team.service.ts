import { TeamMember, ITeamMember } from '../models/team-member.model';

/**
 * REQ-173a: Generate differentiated professional placeholder SVG photos.
 * Each silhouette has distinct hair style, build, and accessories
 * to represent diverse team members rather than a single generic icon.
 */
function generatePlaceholderPhoto(variant: 'male-exec' | 'female-exec' | 'male-casual' | 'female-young' | 'male-senior' | 'female-professional'): string {
  const bg = '#e8f4f8';
  const skin = '#d4a574';
  const darkSkin = '#c49060';
  const suit = '#2c3e50';
  const blouse = '#34495e';

  const variants: Record<string, string> = {
    'male-exec': `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="${bg}"/><ellipse cx="100" cy="82" rx="32" ry="38" fill="${skin}"/><path d="M68 75 Q68 42 100 36 Q132 42 132 75" fill="#333"/><rect x="50" y="130" width="100" height="70" rx="6" fill="${suit}"/><path d="M90 130 L100 160 L110 130" fill="white"/><line x1="100" y1="145" x2="100" y2="200" stroke="#1a252f" stroke-width="1"/><circle cx="100" cy="148" r="2" fill="#c0392b"/></svg>`,
    'female-exec': `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="${bg}"/><ellipse cx="100" cy="82" rx="30" ry="36" fill="${skin}"/><path d="M65 82 Q62 45 100 34 Q138 45 135 82 Q132 68 120 62 L118 82 Q100 75 82 82 L80 62 Q68 68 65 82Z" fill="#4a3728"/><rect x="55" y="130" width="90" height="70" rx="6" fill="${blouse}"/><path d="M80 130 Q100 145 120 130" fill="none" stroke="${skin}" stroke-width="8"/><circle cx="100" cy="137" r="3" fill="#f1c40f"/></svg>`,
    'male-casual': `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="${bg}"/><ellipse cx="100" cy="82" rx="30" ry="36" fill="${skin}"/><path d="M70 72 Q70 44 100 38 Q130 44 130 72" fill="#5d4037"/><path d="M70 72 Q68 68 72 65" fill="#5d4037"/><rect x="55" y="130" width="90" height="70" rx="6" fill="#2980b9"/><path d="M85 130 L85 140 Q100 148 115 140 L115 130" fill="#2574a9"/></svg>`,
    'female-young': `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="${bg}"/><ellipse cx="100" cy="82" rx="29" ry="35" fill="${skin}"/><path d="M64 90 Q60 48 100 36 Q140 48 136 90 Q134 80 128 72 L126 95 Q100 85 74 95 L72 72 Q66 80 64 90Z" fill="#2c1810"/><rect x="55" y="130" width="90" height="70" rx="6" fill="#16a085"/><path d="M80 130 Q100 142 120 130" fill="none" stroke="${skin}" stroke-width="6"/></svg>`,
    'male-senior': `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="${bg}"/><ellipse cx="100" cy="82" rx="32" ry="38" fill="${darkSkin}"/><path d="M68 70 Q70 46 100 40 Q130 46 132 70" fill="#9e9e9e"/><rect x="80" y="72" width="40" height="6" rx="3" fill="rgba(0,0,0,0.15)"/><rect x="50" y="130" width="100" height="70" rx="6" fill="#1a3a4a"/><path d="M90 130 L100 155 L110 130" fill="white"/><line x1="100" y1="142" x2="100" y2="200" stroke="#0f2833" stroke-width="1"/></svg>`,
    'female-professional': `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="${bg}"/><ellipse cx="100" cy="82" rx="29" ry="35" fill="${skin}"/><path d="M66 85 Q64 50 100 38 Q136 50 134 85" fill="#1a1a2e"/><path d="M66 85 Q64 82 66 78 Q70 90 78 85" fill="#1a1a2e"/><path d="M134 85 Q136 82 134 78 Q130 90 122 85" fill="#1a1a2e"/><rect x="55" y="130" width="90" height="70" rx="6" fill="#8e44ad"/><path d="M80 130 Q100 143 120 130" fill="none" stroke="${skin}" stroke-width="6"/><circle cx="100" cy="138" r="2.5" fill="#e8e8e8"/></svg>`,
  };

  const svg = variants[variant];
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Default team members data — REQ-321c: 6 placeholder members.
 * REQ-173a: Each member has a differentiated professional placeholder photo.
 */
const defaultTeamMembers = [
  { name: { es: 'Carlos Herrera', en: 'Carlos Herrera' }, title: { es: 'Director General', en: 'General Director' }, photo: generatePlaceholderPhoto('male-exec'), order: 0 },
  { name: { es: 'Ana Elizondo', en: 'Ana Elizondo' }, title: { es: 'Directora Comercial', en: 'Commercial Director' }, photo: generatePlaceholderPhoto('female-exec'), order: 1 },
  { name: { es: 'Roberto Vargas', en: 'Roberto Vargas' }, title: { es: 'Gerente de Operaciones', en: 'Operations Manager' }, photo: generatePlaceholderPhoto('male-casual'), order: 2 },
  { name: { es: 'Maria Fernanda Lopez', en: 'Maria Fernanda Lopez' }, title: { es: 'Gerente de Ventas', en: 'Sales Manager' }, photo: generatePlaceholderPhoto('female-young'), order: 3 },
  { name: { es: 'Jorge Castillo', en: 'Jorge Castillo' }, title: { es: 'Director Financiero', en: 'Financial Director' }, photo: generatePlaceholderPhoto('male-senior'), order: 4 },
  { name: { es: 'Laura Sanchez', en: 'Laura Sanchez' }, title: { es: 'Gerente de Logistica', en: 'Logistics Manager' }, photo: generatePlaceholderPhoto('female-professional'), order: 5 },
];

/**
 * Get all team members ordered by the `order` field.
 * Seeds defaults if collection is empty (REQ-321c).
 */
export async function getTeamMembers(): Promise<ITeamMember[]> {
  let members = await TeamMember.find().sort({ order: 1 }).lean() as unknown as ITeamMember[];
  if (members.length === 0) {
    await TeamMember.insertMany(defaultTeamMembers);
    members = await TeamMember.find().sort({ order: 1 }).lean() as unknown as ITeamMember[];
  }
  return members;
}

/**
 * Get a single team member by ID.
 */
export async function getTeamMemberById(id: string): Promise<ITeamMember | null> {
  return TeamMember.findById(id).lean() as unknown as Promise<ITeamMember | null>;
}

/**
 * Create a new team member.
 * REQ-320: Add member with name (ES/EN), title (ES/EN), photo.
 */
export async function createTeamMember(data: {
  name: { es: string; en: string };
  title: { es: string; en: string };
  photo?: string;
}): Promise<ITeamMember> {
  // Set order to be last
  const maxOrder = await TeamMember.findOne().sort({ order: -1 }).lean() as unknown as ITeamMember | null;
  const order = maxOrder ? maxOrder.order + 1 : 0;

  return TeamMember.create({ ...data, order });
}

/**
 * Update a team member.
 * REQ-321: Edit name, title, photo.
 */
export async function updateTeamMember(
  id: string,
  data: Partial<{ name: { es: string; en: string }; title: { es: string; en: string }; photo: string; order: number }>
): Promise<ITeamMember | null> {
  return TeamMember.findByIdAndUpdate(id, { $set: data }, { new: true }).lean() as unknown as Promise<ITeamMember | null>;
}

/**
 * Delete a team member.
 * REQ-321a: With confirmation.
 */
export async function deleteTeamMember(id: string): Promise<boolean> {
  const result = await TeamMember.findByIdAndDelete(id);
  return !!result;
}

/**
 * Reorder team members.
 * REQ-321b: Drag-and-drop reorder.
 */
export async function reorderTeamMembers(orderedIds: string[]): Promise<void> {
  const bulkOps = orderedIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { $set: { order: index } },
    },
  }));
  if (bulkOps.length > 0) {
    await TeamMember.bulkWrite(bulkOps);
  }
}
