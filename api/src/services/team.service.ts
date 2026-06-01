import { TeamMember, ITeamMember } from '../models/team-member.model';

/**
 * Get all team members ordered by the `order` field.
 * No seed/placeholder data: the public team section only shows members
 * explicitly added through the admin panel (no static photos or fallbacks).
 */
export async function getTeamMembers(): Promise<ITeamMember[]> {
  const members = await TeamMember.find().sort({ order: 1 }).lean() as unknown as ITeamMember[];
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
