# Suivi Meta (Pixel + API Conversions)

Le suivi Meta est codé directement dans le site (Next.js). **Il ne passe pas par GTM.**
GTM (GTM-5DNGWV7K) reste utilisé uniquement pour GA4 / Google Ads.

## Variables d'environnement à définir dans Vercel

| Variable | Valeur | Où |
| --- | --- | --- |
| `NEXT_PUBLIC_META_PIXEL_ID` | `1065365083166325` | Navigateur + serveur |
| `META_CAPI_ACCESS_TOKEN` | Jeton de l'API Conversions (Events Manager > Paramètres) | Serveur uniquement, **secret** |
| `META_TEST_EVENT_CODE` | Code « Tester les événements » (facultatif) | Serveur, à vider en production |

Après modification des variables dans Vercel, il faut **redéployer** (la variable
`NEXT_PUBLIC_…` est intégrée au moment du build).

Si une variable manque, le suivi Meta est simplement désactivé (aucune erreur côté visiteur).

## Consentement

- Le script Meta (`fbevents.js`) n'est chargé **qu'après** l'acceptation de la catégorie
  « Publicité / marketing » dans le bandeau cookies du site.
- Si le visiteur retire son consentement, le pixel est révoqué (`fbq('consent','revoke')`)
  et les cookies `_fbp` / `_fbc` sont supprimés.
- Les événements serveur (API Conversions) ne sont envoyés **que** si le visiteur a donné
  ce consentement.

## Événements envoyés

Chaque événement a un `event_id` commun au pixel et à l'API Conversions : Meta
dédoublonne automatiquement.

| Événement | Quand | Pixel | API Conversions | Paramètres |
| --- | --- | --- | --- | --- |
| `PageView` | Chargement de page et changement de page dans le site | Oui | Oui | aucun |
| `FormStart` (personnalisé) | Première interaction avec le formulaire de devis | Oui | Oui | aucun |
| `FormStep` (personnalisé) | Chaque étape du formulaire validée | Oui | Oui | `step_number`, `step_key` (nom technique de l'étape, jamais la réponse) |
| `Lead` | Demande de devis envoyée avec succès | Oui | Oui (depuis le serveur) | aucun côté pixel |

Données envoyées côté serveur : adresse IP, navigateur (user agent), cookies `_fbp` / `_fbc`
(ou `fbc` reconstruit à partir du `fbclid`). Pour `Lead` uniquement, en plus et **hachées
en SHA-256** : email, téléphone (format 33…), prénom, nom, code postal, ville, pays (`fr`)
et un identifiant externe (email haché).

Aucune donnée personnelle ni réponse au formulaire n'est envoyée au pixel navigateur.

## Vérifier

1. Mettre un code dans `META_TEST_EVENT_CODE`, redéployer.
2. Ouvrir le site, accepter les cookies, remplir le formulaire.
3. Dans Events Manager > « Tester les événements », vérifier que chaque événement apparaît
   en « Navigateur » et « Serveur » et qu'il est marqué « Dédoublonné ».
4. Vider `META_TEST_EVENT_CODE` et redéployer.

## Fichiers

- `src/lib/meta/pixel.ts` : pixel navigateur (chargement, consentement, événements)
- `src/components/meta/MetaPixel.tsx` : chargement selon le consentement + `PageView`
- `src/lib/meta/capi.ts` : envoi à l'API Conversions (serveur uniquement)
- `src/app/api/meta/events/route.ts` : relais serveur pour `PageView`, `FormStart`, `FormStep`
- `src/app/api/leads/route.ts` : envoi serveur du `Lead`
