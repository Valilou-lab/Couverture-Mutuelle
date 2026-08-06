/**
 * Client Vertikl — à implémenter plus tard pour l’envoi des leads.
 * Aucune connexion API active pour le moment.
 */

export type VertiklLeadPayload = {
  // Champs à définir lors de l’intégration du formulaire multi-étapes
  [key: string]: unknown;
};

export async function sendLeadToVertikl(
  payload: VertiklLeadPayload,
): Promise<never> {
  void payload;
  throw new Error("Vertikl n’est pas encore connecté.");
}
