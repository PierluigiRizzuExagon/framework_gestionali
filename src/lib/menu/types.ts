import { Menu } from "@/lib/db/schema/menu";

/**
 * Tipo per un menu con i suoi figli
 */
export interface MenuWithChildren extends Menu {
  children: MenuWithChildren[];
}

/**
 * Tipo per il risultato della query dei menu
 */
export interface MenuResult {
  success: boolean;
  data?: MenuWithChildren[];
  error?: string;
}
