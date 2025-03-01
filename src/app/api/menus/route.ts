import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { MenuWithChildren } from "@/lib/menu/types";

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

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Utente non autenticato" },
        { status: 401 }
      );
    }

    // Recupera l'utente con il suo ruolo e i menu associati
    const userWithMenus = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      with: {
        role: {
          with: {
            roleMenus: {
              with: {
                menu: {
                  with: {
                    children: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!userWithMenus?.role) {
      return NextResponse.json(
        { success: false, error: "Ruolo utente non trovato" },
        { status: 404 }
      );
    }

    // Estrai i menu dalla query
    const roleMenusWithMenu = userWithMenus.role.roleMenus || [];

    // Mappa per tenere traccia dei menu per ID
    const menuMap = new Map<string, MenuWithChildren>();

    // Converti i menu in MenuWithChildren e filtra quelli attivi
    roleMenusWithMenu.forEach((rm) => {
      if (rm.menu && rm.menu.isActive) {
        const menuWithChildren: MenuWithChildren = {
          ...rm.menu,
          children: [],
        };
        menuMap.set(rm.menu.id, menuWithChildren);
      }
    });

    // Costruisci la struttura ad albero
    const rootMenus: MenuWithChildren[] = [];

    // Popola la struttura ad albero
    menuMap.forEach((menu) => {
      if (menu.parentId && menuMap.has(menu.parentId)) {
        // Se ha un genitore, aggiungilo come figlio
        const parent = menuMap.get(menu.parentId)!;
        parent.children.push(menu);
      } else {
        // Altrimenti è un menu di primo livello
        rootMenus.push(menu);
      }
    });

    // Ordina i menu
    const sortedMenus = sortMenus(rootMenus);

    return NextResponse.json({
      success: true,
      data: sortedMenus,
    });
  } catch (error) {
    console.error("Errore durante il recupero dei menu:", error);
    return NextResponse.json(
      { success: false, error: "Errore durante il recupero dei menu" },
      { status: 500 }
    );
  }
}
