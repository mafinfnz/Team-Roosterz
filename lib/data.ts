/** Only owner-supplied nicknames, roster assignments and images.
 * Source: github.com/mafinfnz/nakxal, commit 98d424fed78acc0faca4dbbeac5b612a3ea470af.
 * No inferred real names, countries, roles, stats, biographies or accounts.
 */
export interface Player { slug:string; nick:string; image:string; academy:boolean }
const player=(nick:string,academy=false):Player=>({slug:nick,nick,image:`/images/players/${nick}.webp`,academy});
export const players:Player[]=['gaston','kokosic147','mafin','overflod','ukkis'].map(n=>player(n));
// Owner spells the nickname sv1ntuzz; its image is named $v1ntuzz.png upstream.
export const academy:Player[]=['sv1ntuzz','matv1k','vanya'].map(n=>player(n,true));
export const allPlayers=[...players,...academy];
