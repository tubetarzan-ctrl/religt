/** wa.me numbers are stored digits-only with country code (e.g. "923360816469");
 * this renders the familiar local display form "0336-0816469". */
export function formatPkWhatsapp(waNumber: string): string {
  if (!waNumber) return "";
  const local = "0" + waNumber.replace(/^92/, "");
  return `${local.slice(0, 4)}-${local.slice(4)}`;
}
