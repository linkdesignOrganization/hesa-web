import { TeamMember, ITeamMember } from '../models/team-member.model';

/**
 * BUG-005 FIX: Use professional stock photos from UI Faces / randomuser.me
 * instead of generated SVG silhouettes. These are diverse, professional-looking
 * portrait photos suitable for a corporate team section.
 *
 * REQ-173a: Photos must be "professional placeholder photos", not SVG silhouettes.
 */
const teamPhotos = {
  maleExec: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
  femaleExec: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
  maleCasual: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
  femaleYoung: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
  maleSenior: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  femaleProfessional: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop&crop=face',
};

/**
 * Default team members data — REQ-321c: 6 placeholder members.
 * BUG-005 FIX: Each member has a professional stock photo URL.
 */
const defaultTeamMembers = [
  { name: { es: 'Carlos Herrera', en: 'Carlos Herrera' }, title: { es: 'Director General', en: 'General Director' }, photo: teamPhotos.maleExec, order: 0 },
  { name: { es: 'Ana Elizondo', en: 'Ana Elizondo' }, title: { es: 'Directora Comercial', en: 'Commercial Director' }, photo: teamPhotos.femaleExec, order: 1 },
  { name: { es: 'Roberto Vargas', en: 'Roberto Vargas' }, title: { es: 'Gerente de Operaciones', en: 'Operations Manager' }, photo: teamPhotos.maleCasual, order: 2 },
  { name: { es: 'Maria Fernanda Lopez', en: 'Maria Fernanda Lopez' }, title: { es: 'Gerente de Ventas', en: 'Sales Manager' }, photo: teamPhotos.femaleYoung, order: 3 },
  { name: { es: 'Jorge Castillo', en: 'Jorge Castillo' }, title: { es: 'Director Financiero', en: 'Financial Director' }, photo: teamPhotos.maleSenior, order: 4 },
  { name: { es: 'Laura Sanchez', en: 'Laura Sanchez' }, title: { es: 'Gerente de Logistica', en: 'Logistics Manager' }, photo: teamPhotos.femaleProfessional, order: 5 },
];

/**
 * Get all team members ordered by the `order` field.
 * Seeds defaults if collection is empty (REQ-321c).
 * BUG-005 FIX: Also migrates existing SVG placeholder photos to stock photos.
 */
export async function getTeamMembers(): Promise<ITeamMember[]> {
  let members = await TeamMember.find().sort({ order: 1 }).lean() as unknown as ITeamMember[];
  if (members.length === 0) {
    await TeamMember.insertMany(defaultTeamMembers);
    members = await TeamMember.find().sort({ order: 1 }).lean() as unknown as ITeamMember[];
  } else {
    // BUG-005 FIX: Migrate SVG placeholder photos to professional stock photos
    const photoValues = Object.values(teamPhotos);
    let migrated = false;
    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      if (member.photo && member.photo.startsWith('data:image/svg+xml;base64,')) {
        const newPhoto = photoValues[i % photoValues.length];
        await TeamMember.findByIdAndUpdate(member._id, { $set: { photo: newPhoto } });
        migrated = true;
      }
    }
    if (migrated) {
      console.log('Team member photos migrated from SVG to stock photos (BUG-005 fix)');
      // Re-fetch after migration to get clean data
      members = await TeamMember.find().sort({ order: 1 }).lean() as unknown as ITeamMember[];
    }
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
