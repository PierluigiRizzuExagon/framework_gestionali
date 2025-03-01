"use server";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { menus, roleMenus, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { MenuWithChildren } from "./types";

/**
 * Recupera i menu disponibili per l'utente corrente in base al suo ruolo
 */
export async function fetchUserMenus() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Utente non autenticato",
      };
    }

    // Ottieni il ruolo dell'utente
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      with: {
        role: true,
      },
    });

    if (!user?.role) {
      return {
        success: false,
        error: "Ruolo utente non trovato",
      };
    }

    // Recupera tutti i menu associati al ruolo dell'utente
    const userRoleMenus = await db
      .select({
        menu: menus,
      })
      .from(roleMenus)
      .innerJoin(menus, eq(roleMenus.menuId, menus.id))
      .where(and(eq(roleMenus.roleId, user.roleId), eq(menus.isActive, true)))
      .execute();

    // Estrai i menu dalla query
    const flatMenus = userRoleMenus.map((rm) => rm.menu);

    // Organizza i menu in una struttura gerarchica
    const menuTree = buildMenuTree(flatMenus);

    // Ordina i menu per il campo order
    const sortedMenus = sortMenus(menuTree);

    return {
      success: true,
      data: sortedMenus,
    };
  } catch (error) {
    console.error("Errore durante il recupero dei menu:", error);
    return {
      success: false,
      error: "Errore durante il recupero dei menu",
    };
  }
}

/**
 * Costruisce una struttura ad albero dai menu piatti
 */
function buildMenuTree(
  flatMenus: (typeof menus.$inferSelect)[]
): MenuWithChildren[] {
  // Prima crea una mappa di tutti i menu per id
  const menuMap = new Map<string, MenuWithChildren>();

  // Inizializza la mappa con tutti i menu
  flatMenus.forEach((menu) => {
    menuMap.set(menu.id, {
      ...menu,
      children: [],
    });
  });

  // Array per i menu di primo livello
  const rootMenus: MenuWithChildren[] = [];

  // Popola la struttura ad albero
  flatMenus.forEach((menu) => {
    const menuWithChildren = menuMap.get(menu.id)!;

    if (menu.parentId && menuMap.has(menu.parentId)) {
      // Se ha un genitore, aggiungilo come figlio
      const parent = menuMap.get(menu.parentId)!;
      parent.children.push(menuWithChildren);
    } else {
      // Altrimenti è un menu di primo livello
      rootMenus.push(menuWithChildren);
    }
  });

  return rootMenus;
}

/**
 * Ordina i menu in base al campo order
 */
function sortMenus(menus: MenuWithChildren[]): MenuWithChildren[] {
  // Ordina i menu di primo livello
  const sortedMenus = [...menus].sort((a, b) => {
    return a.order.localeCompare(b.order);
  });

  // Ordina ricorsivamente i figli
  sortedMenus.forEach((menu) => {
    if (menu.children.length > 0) {
      menu.children = sortMenus(menu.children);
    }
  });

  return sortedMenus;
}
