import type { ParsedMirroredPage } from "./mirror";
import { getMirroredPage } from "./mirror";
import { GIFT_CARD_ROUTE } from "./routes";

const GIFT_CARD_SHELL_ROUTE = "/nosotros/";

let cachedGiftCardsShellPage: ParsedMirroredPage | undefined;

function normalizeHtmlClassName(value: string): string {
  const tokens = value
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token && !/^html_entry_id_\d+$/i.test(token));

  return Array.from(new Set([...tokens, "html_entry_id_gift_cards"])).join(" ");
}

function normalizeBodyClassName(value: string): string {
  const tokens = value
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token && !/^page-id-\d+$/i.test(token));

  return Array.from(new Set([...tokens, "page-id-gift-cards", "page-gift-cards"])).join(" ");
}

export function getGiftCardsShellPage(): ParsedMirroredPage {
  if (cachedGiftCardsShellPage) {
    return cachedGiftCardsShellPage;
  }

  const shellPage = getMirroredPage(GIFT_CARD_SHELL_ROUTE);

  cachedGiftCardsShellPage = {
    ...shellPage,
    route: GIFT_CARD_ROUTE,
    htmlClass: normalizeHtmlClassName(shellPage.htmlClass),
    bodyClass: normalizeBodyClassName(shellPage.bodyClass),
  };

  return cachedGiftCardsShellPage;
}
