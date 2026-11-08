// Creates the signed-in user's workspace and saves their sign-up answers on it.
// Safe to call again: if they already have a workspace, it simply succeeds.
export async function createWorkspace(supabase, answers) {
  const { data: orgId, error } = await supabase.rpc('create_organization', { org_name: answers.name.trim() });
  if (error && !error.message.includes('already have a workspace')) return { error };
  if (orgId) {
    const { error: answersError } = await supabase.from('organizations').update({
      business_type: answers.businessType,
      trips_per_year: answers.tripsPerYear || null,
      interests: answers.interests,
      heard_from: answers.heardFrom,
    }).eq('id', orgId);
    // The workspace still works without the answers, so don't block the user on this.
    if (answersError) console.error('Saving sign-up answers failed:', answersError);
  }
  return { error: null };
}
