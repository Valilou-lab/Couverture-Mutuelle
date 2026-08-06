/**
 * Emplacement réservé pour le chatbot partenaire.
 * À brancher plus tard (bouton flottant bas-droite).
 * Ne contient aucun script partenaire pour l’instant.
 */
export function ChatbotSlot() {
  return (
    <div
      id="chatbot-slot"
      aria-hidden="true"
      className="pointer-events-none fixed right-4 bottom-4 z-[60] h-14 w-14 md:right-6 md:bottom-6"
    />
  );
}
