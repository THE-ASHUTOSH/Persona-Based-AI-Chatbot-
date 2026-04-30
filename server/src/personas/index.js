import { anshumanPersona } from "./anshuman.js";
import { abhimanyuPersona } from "./abhimanyu.js";
import { kshitijPersona } from "./kshitij.js";

export const personas = {
  [anshumanPersona.id]: anshumanPersona,
  [abhimanyuPersona.id]: abhimanyuPersona,
  [kshitijPersona.id]: kshitijPersona
};

export const personaList = [anshumanPersona, abhimanyuPersona, kshitijPersona];

export function getPersona(id) {
  return personas[id] || null;
}

export function getPublicPersonaList() {
  return personaList.map(({ id, name, title, blurb, accent, suggestions }) => ({
    id,
    name,
    title,
    blurb,
    accent,
    suggestions
  }));
}
