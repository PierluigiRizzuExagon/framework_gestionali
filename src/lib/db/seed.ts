import { db, closeDb } from "@/lib/db";
import {
  users,
  roles,
  permissions,
  notifications,
  menus,
  roleMenus,
  type NewRole,
  type NewPermission,
  type NewUser,
  type NewMenu,
  type NewRoleMenu,
} from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import { createId } from "@paralleldrive/cuid2";
import {
  NewRolePermission,
  rolePermissions,
} from "./schema/relations/rolePermissions";

/**
 * Funzione per eseguire il seed del database
 * @param force Se true, forza il seed anche se ci sono già dati nel database
 */
async function seed(force = false): Promise<void> {
  console.log("Inizializzazione del seed...");

  try {
    // Verifica se ci sono già ruoli nel database
    const existingRoles = await db.select().from(roles).limit(1).execute();

    // Se ci sono già ruoli e non stiamo forzando il seed, verifica se ci sono menu
    if (existingRoles.length > 0 && !force) {
      const existingMenus = await db.select().from(menus).execute();

      if (existingMenus.length > 0) {
        console.log(
          "Il database contiene già dati. Verifico se mancano menu..."
        );

        // Definisci i percorsi dei menu che dovrebbero esistere
        const expectedMenuPaths = [
          "/dashboard",
          "/dashboard/users",
          "/dashboard/users/list",
          "/dashboard/users/create",
          "/dashboard/roles",
          "/dashboard/roles/list",
          "/dashboard/roles/create",
          "/dashboard/notifications",
          "/dashboard/settings",
        ];

        // Trova i percorsi dei menu esistenti
        const existingMenuPaths = existingMenus.map((menu) => menu.path);

        // Trova i percorsi dei menu mancanti
        const missingMenuPaths = expectedMenuPaths.filter(
          (path) => !existingMenuPaths.includes(path)
        );

        if (missingMenuPaths.length === 0) {
          console.log(
            "Tutti i menu sono già presenti. Operazione di seed annullata."
          );
          return;
        }

        console.log(
          `Mancano ${missingMenuPaths.length} menu. Aggiungo solo quelli mancanti...`
        );

        // Recupera i ruoli esistenti
        const adminRoleResult = await db
          .select()
          .from(roles)
          .where(eq(roles.name, "admin"))
          .limit(1)
          .execute();
        const userRoleResult = await db
          .select()
          .from(roles)
          .where(eq(roles.name, "user"))
          .limit(1)
          .execute();

        if (adminRoleResult.length === 0 || userRoleResult.length === 0) {
          throw new Error("Impossibile recuperare i ruoli");
        }

        const adminRole = adminRoleResult[0];
        const userRole = userRoleResult[0];

        // Crea solo i menu mancanti
        await createMissingMenus(
          missingMenuPaths,
          existingMenus,
          adminRole,
          userRole
        );

        console.log("Menu mancanti aggiunti con successo!");
        return;
      }

      console.log("Il database contiene ruoli ma non menu. Aggiungo i menu...");

      // Recupera i ruoli esistenti
      const adminRoleResult = await db
        .select()
        .from(roles)
        .where(eq(roles.name, "admin"))
        .limit(1)
        .execute();
      const userRoleResult = await db
        .select()
        .from(roles)
        .where(eq(roles.name, "user"))
        .limit(1)
        .execute();

      if (adminRoleResult.length === 0 || userRoleResult.length === 0) {
        throw new Error("Impossibile recuperare i ruoli");
      }

      const adminRole = adminRoleResult[0];
      const userRole = userRoleResult[0];

      // Crea tutti i menu
      await createAllMenus(adminRole, userRole);

      console.log("Menu aggiunti con successo!");
      return;
    }

    // Se stiamo forzando il seed o il database è vuoto, esegui un seed completo
    if (force) {
      console.log("Forzatura del seed. Elimino tutti i dati esistenti...");

      // Elimina tutti i dati esistenti in ordine inverso rispetto alle dipendenze
      await db.delete(roleMenus).execute();
      await db.delete(menus).execute();
      await db.delete(notifications).execute();
      await db.delete(rolePermissions).execute();
      await db.delete(permissions).execute();
      await db.delete(users).execute();
      await db.delete(roles).execute();
    }

    console.log("Esecuzione del seed completo...");

    console.log("Creazione dei ruoli...");
    // Crea ruoli
    const roleValues: NewRole[] = [
      {
        id: createId(),
        name: "admin",
        description: "Amministratore con accesso completo",
      },
      {
        id: createId(),
        name: "user",
        description: "Utente standard con accesso limitato",
      },
    ];

    // Inserisci i ruoli
    await db.insert(roles).values(roleValues).execute();

    // Recupera i ruoli inseriti
    const adminRoleResult = await db
      .select()
      .from(roles)
      .where(eq(roles.name, "admin"))
      .limit(1)
      .execute();
    const userRoleResult = await db
      .select()
      .from(roles)
      .where(eq(roles.name, "user"))
      .limit(1)
      .execute();

    if (adminRoleResult.length === 0 || userRoleResult.length === 0) {
      throw new Error("Impossibile recuperare i ruoli");
    }

    const adminRole = adminRoleResult[0];
    const userRole = userRoleResult[0];

    console.log("Creazione dei permessi...");
    // Crea permessi
    const permissionValues: NewPermission[] = [
      {
        id: createId(),
        name: "dashboard:view",
        description: "Visualizzare la dashboard",
      },
      {
        id: createId(),
        name: "users:view",
        description: "Visualizzare gli utenti",
      },
      {
        id: createId(),
        name: "users:create",
        description: "Creare nuovi utenti",
      },
      {
        id: createId(),
        name: "users:edit",
        description: "Modificare gli utenti esistenti",
      },
      {
        id: createId(),
        name: "users:delete",
        description: "Eliminare gli utenti",
      },
      {
        id: createId(),
        name: "roles:view",
        description: "Visualizzare i ruoli",
      },
      {
        id: createId(),
        name: "roles:create",
        description: "Creare nuovi ruoli",
      },
      {
        id: createId(),
        name: "roles:edit",
        description: "Modificare i ruoli esistenti",
      },
      {
        id: createId(),
        name: "roles:delete",
        description: "Eliminare i ruoli",
      },
      {
        id: createId(),
        name: "notifications:view",
        description: "Visualizzare le notifiche",
      },
      {
        id: createId(),
        name: "settings:view",
        description: "Visualizzare le impostazioni",
      },
      {
        id: createId(),
        name: "settings:edit",
        description: "Modificare le impostazioni",
      },
    ];

    // Inserisci i permessi
    await db.insert(permissions).values(permissionValues).execute();

    // Recupera tutti i permessi
    const allPermissions = await db.select().from(permissions).execute();

    console.log("Assegnazione dei permessi ai ruoli...");
    // Assegna tutti i permessi al ruolo admin
    const adminPermissions: NewRolePermission[] = allPermissions.map(
      (permission) => ({
        id: createId(),
        roleId: adminRole.id,
        permissionId: permission.id,
      })
    );

    await db.insert(rolePermissions).values(adminPermissions).execute();

    // Assegna solo alcuni permessi al ruolo user
    const userPermissionNames = ["dashboard:view", "notifications:view"];
    const userPermissions = allPermissions.filter((permission) =>
      userPermissionNames.includes(permission.name)
    );

    const userRolePermissions: NewRolePermission[] = userPermissions.map(
      (permission) => ({
        id: createId(),
        roleId: userRole.id,
        permissionId: permission.id,
      })
    );

    await db.insert(rolePermissions).values(userRolePermissions).execute();

    console.log("Creazione degli utenti...");
    // Crea utenti
    const hashedAdminPassword = await bcrypt.hash("Admin123!", 10);
    const hashedUserPassword = await bcrypt.hash("User123!", 10);

    const userValues: NewUser[] = [
      {
        id: createId(),
        name: "Admin User",
        email: "admin@example.com",
        password: hashedAdminPassword,
        roleId: adminRole.id,
      },
      {
        id: createId(),
        name: "Regular User",
        email: "user@example.com",
        password: hashedUserPassword,
        roleId: userRole.id,
      },
    ];

    // Inserisci gli utenti
    await db.insert(users).values(userValues).execute();

    // Recupera gli utenti inseriti
    const adminUser = await db
      .select()
      .from(users)
      .where(eq(users.email, "admin@example.com"))
      .limit(1)
      .execute();
    const regularUser = await db
      .select()
      .from(users)
      .where(eq(users.email, "user@example.com"))
      .limit(1)
      .execute();

    console.log("Creazione delle notifiche...");
    // Crea notifiche di esempio
    await seedNotifications(adminUser, regularUser, adminRole, userRole);

    // Crea tutti i menu
    await createAllMenus(adminRole, userRole);

    console.log("Seed completato con successo!");
    console.log("Credenziali di accesso:");
    console.log("- Admin: admin@example.com / Admin123!");
    console.log("- User: user@example.com / User123!");
  } catch (error) {
    console.error("Errore durante il seed:", error);
    throw error;
  } finally {
    await closeDb();
  }
}

/**
 * Crea tutti i menu e li assegna ai ruoli
 */
async function createAllMenus(
  adminRole: typeof roles.$inferSelect,
  userRole: typeof roles.$inferSelect
): Promise<void> {
  console.log("Creazione dei menu...");
  // Crea menu
  const dashboardMenuId = createId();
  const usersMenuId = createId();
  const rolesMenuId = createId();
  const notificationsMenuId = createId();
  const settingsMenuId = createId();

  const menuValues: NewMenu[] = [
    {
      id: dashboardMenuId,
      label: "Dashboard",
      path: "/dashboard",
      icon: "dashboard",
      order: "1",
      isActive: true,
    },
    {
      id: usersMenuId,
      label: "Utenti",
      path: "/dashboard/users",
      icon: "users",
      order: "2",
      isActive: true,
    },
    {
      id: createId(),
      label: "Lista Utenti",
      path: "/dashboard/users/list",
      parentId: usersMenuId,
      order: "1",
      isActive: true,
    },
    {
      id: createId(),
      label: "Crea Utente",
      path: "/dashboard/users/create",
      parentId: usersMenuId,
      order: "2",
      isActive: true,
    },
    {
      id: rolesMenuId,
      label: "Ruoli",
      path: "/dashboard/roles",
      icon: "shield",
      order: "3",
      isActive: true,
    },
    {
      id: createId(),
      label: "Lista Ruoli",
      path: "/dashboard/roles/list",
      parentId: rolesMenuId,
      order: "1",
      isActive: true,
    },
    {
      id: createId(),
      label: "Crea Ruolo",
      path: "/dashboard/roles/create",
      parentId: rolesMenuId,
      order: "2",
      isActive: true,
    },
    {
      id: notificationsMenuId,
      label: "Notifiche",
      path: "/dashboard/notifications",
      icon: "bell",
      order: "4",
      isActive: true,
    },
    {
      id: settingsMenuId,
      label: "Impostazioni",
      path: "/dashboard/settings",
      icon: "settings",
      order: "5",
      isActive: true,
    },
  ];

  // Inserisci i menu
  await db.insert(menus).values(menuValues).execute();

  console.log("Assegnazione dei menu ai ruoli...");
  // Recupera tutti i menu inseriti
  const allMenus = await db.select().from(menus).execute();

  // Assegna tutti i menu al ruolo admin
  const adminMenus: NewRoleMenu[] = allMenus.map((menu) => ({
    id: createId(),
    roleId: adminRole.id,
    menuId: menu.id,
  }));

  await db.insert(roleMenus).values(adminMenus).execute();

  // Assegna solo alcuni menu al ruolo user (dashboard, notifiche, impostazioni)
  const userMenuPaths = [
    "/dashboard",
    "/dashboard/notifications",
    "/dashboard/settings",
  ];

  const userMenuItems = allMenus.filter((menu) =>
    userMenuPaths.includes(menu.path)
  );

  const userRoleMenus: NewRoleMenu[] = userMenuItems.map((menu) => ({
    id: createId(),
    roleId: userRole.id,
    menuId: menu.id,
  }));

  await db.insert(roleMenus).values(userRoleMenus).execute();
}

/**
 * Crea solo i menu mancanti e li assegna ai ruoli
 */
async function createMissingMenus(
  missingMenuPaths: string[],
  existingMenus: (typeof menus.$inferSelect)[],
  adminRole: typeof roles.$inferSelect,
  userRole: typeof roles.$inferSelect
): Promise<void> {
  console.log("Creazione dei menu mancanti...");

  // Mappa dei menu esistenti per path
  const existingMenusMap = new Map();
  existingMenus.forEach((menu) => {
    existingMenusMap.set(menu.path, menu);
  });

  // Definizioni di tutti i menu possibili
  const allMenuDefinitions = [
    {
      id: createId(),
      label: "Dashboard",
      path: "/dashboard",
      icon: "dashboard",
      order: "1",
      isActive: true,
    },
    {
      id: createId(),
      label: "Utenti",
      path: "/dashboard/users",
      icon: "users",
      order: "2",
      isActive: true,
    },
    {
      id: createId(),
      label: "Lista Utenti",
      path: "/dashboard/users/list",
      parentPath: "/dashboard/users",
      order: "1",
      isActive: true,
    },
    {
      id: createId(),
      label: "Crea Utente",
      path: "/dashboard/users/create",
      parentPath: "/dashboard/users",
      order: "2",
      isActive: true,
    },
    {
      id: createId(),
      label: "Ruoli",
      path: "/dashboard/roles",
      icon: "shield",
      order: "3",
      isActive: true,
    },
    {
      id: createId(),
      label: "Lista Ruoli",
      path: "/dashboard/roles/list",
      parentPath: "/dashboard/roles",
      order: "1",
      isActive: true,
    },
    {
      id: createId(),
      label: "Crea Ruolo",
      path: "/dashboard/roles/create",
      parentPath: "/dashboard/roles",
      order: "2",
      isActive: true,
    },
    {
      id: createId(),
      label: "Notifiche",
      path: "/dashboard/notifications",
      icon: "bell",
      order: "4",
      isActive: true,
    },
    {
      id: createId(),
      label: "Impostazioni",
      path: "/dashboard/settings",
      icon: "settings",
      order: "5",
      isActive: true,
    },
  ];

  // Filtra solo i menu mancanti
  const menuToCreate = allMenuDefinitions.filter((menu) =>
    missingMenuPaths.includes(menu.path)
  );

  // Risolvi i parentId
  const menuValues: NewMenu[] = menuToCreate.map((menu) => {
    const { parentPath, ...menuData } = menu;
    if (parentPath) {
      // Cerca il parent tra i menu esistenti
      const parentMenu = existingMenusMap.get(parentPath);
      if (parentMenu) {
        return {
          ...menuData,
          parentId: parentMenu.id,
        };
      }

      // Se il parent non esiste tra i menu esistenti, cerca tra quelli da creare
      const parentToCreate = menuToCreate.find((m) => m.path === parentPath);
      if (parentToCreate) {
        return {
          ...menuData,
          parentId: parentToCreate.id,
        };
      }
    }

    return menuData;
  });

  if (menuValues.length === 0) {
    console.log("Nessun menu da creare.");
    return;
  }

  // Inserisci i menu mancanti
  await db.insert(menus).values(menuValues).execute();

  // Recupera i menu appena inseriti
  const createdMenus = await db
    .select()
    .from(menus)
    .where(inArray(menus.path, missingMenuPaths))
    .execute();

  console.log("Assegnazione dei menu mancanti ai ruoli...");

  // Assegna tutti i menu mancanti al ruolo admin
  const adminMenus: NewRoleMenu[] = createdMenus.map((menu) => ({
    id: createId(),
    roleId: adminRole.id,
    menuId: menu.id,
  }));

  await db.insert(roleMenus).values(adminMenus).execute();

  // Assegna solo alcuni menu al ruolo user (dashboard, notifiche, impostazioni)
  const userMenuPaths = [
    "/dashboard",
    "/dashboard/notifications",
    "/dashboard/settings",
  ];

  const userMenuItems = createdMenus.filter((menu) =>
    userMenuPaths.includes(menu.path)
  );

  if (userMenuItems.length > 0) {
    const userRoleMenus: NewRoleMenu[] = userMenuItems.map((menu) => ({
      id: createId(),
      roleId: userRole.id,
      menuId: menu.id,
    }));

    await db.insert(roleMenus).values(userRoleMenus).execute();
  }
}

// Crea notifiche di esempio
async function seedNotifications(
  adminUser: (typeof users.$inferSelect)[],
  regularUser: (typeof users.$inferSelect)[],
  adminRole: typeof roles.$inferSelect,
  userRole: typeof roles.$inferSelect
) {
  console.log("Creazione notifiche di esempio...");

  // Importa i tipi necessari
  const { NotificationTargetType, NotificationType, NotificationPriority } =
    await import("@/lib/db/schema/notifications");

  // Notifiche per utenti specifici
  const userNotifications = [
    {
      title: "Benvenuto Admin",
      message: "Benvenuto nel sistema di gestione. Hai accesso completo.",
      targetType: NotificationTargetType.USER,
      type: NotificationType.NOTIFICATION,
      priority: NotificationPriority.NORMAL,
      targetId: adminUser[0].id,
    },
    {
      title: "Benvenuto Utente",
      message:
        "Benvenuto nel sistema di gestione. Hai accesso limitato alle funzionalità.",
      targetType: NotificationTargetType.USER,
      type: NotificationType.NOTIFICATION,
      priority: NotificationPriority.NORMAL,
      targetId: regularUser[0].id,
    },
    {
      title: "Messaggio personale per Admin",
      message: "Questo è un messaggio personale per l'amministratore.",
      targetType: NotificationTargetType.USER,
      type: NotificationType.MESSAGE,
      priority: NotificationPriority.HIGH,
      targetId: adminUser[0].id,
    },
    {
      title: "Messaggio personale per Utente",
      message: "Questo è un messaggio personale per l'utente standard.",
      targetType: NotificationTargetType.USER,
      type: NotificationType.MESSAGE,
      priority: NotificationPriority.NORMAL,
      targetId: regularUser[0].id,
    },
  ];

  // Notifiche per ruoli
  const roleNotifications = [
    {
      title: "Notifica per Admin",
      message: "Questa notifica è visibile solo agli amministratori.",
      targetType: NotificationTargetType.ROLE,
      type: NotificationType.NOTIFICATION,
      priority: NotificationPriority.HIGH,
      targetId: adminRole.id,
    },
    {
      title: "Notifica per Utenti",
      message: "Questa notifica è visibile a tutti gli utenti standard.",
      targetType: NotificationTargetType.ROLE,
      type: NotificationType.NOTIFICATION,
      priority: NotificationPriority.NORMAL,
      targetId: userRole.id,
    },
    {
      title: "Messaggio per Admin",
      message: "Questo messaggio è visibile solo agli amministratori.",
      targetType: NotificationTargetType.ROLE,
      type: NotificationType.MESSAGE,
      priority: NotificationPriority.URGENT,
      targetId: adminRole.id,
    },
    {
      title: "Messaggio per Utenti",
      message: "Questo messaggio è visibile a tutti gli utenti standard.",
      targetType: NotificationTargetType.ROLE,
      type: NotificationType.MESSAGE,
      priority: NotificationPriority.LOW,
      targetId: userRole.id,
    },
  ];

  // Notifiche globali
  const globalNotifications = [
    {
      title: "Benvenuti nel sistema",
      message: "Benvenuti nel nuovo sistema di gestione.",
      targetType: NotificationTargetType.GLOBAL,
      type: NotificationType.NOTIFICATION,
      priority: NotificationPriority.NORMAL,
    },
    {
      title: "Manutenzione programmata",
      message: "Il sistema sarà in manutenzione domenica dalle 2:00 alle 4:00.",
      targetType: NotificationTargetType.GLOBAL,
      type: NotificationType.NOTIFICATION,
      priority: NotificationPriority.HIGH,
    },
    {
      title: "Messaggio globale",
      message: "Questo è un messaggio per tutti gli utenti.",
      targetType: NotificationTargetType.GLOBAL,
      type: NotificationType.MESSAGE,
      priority: NotificationPriority.NORMAL,
    },
  ];

  // Unisci tutte le notifiche
  const allNotifications = [
    ...userNotifications,
    ...roleNotifications,
    ...globalNotifications,
  ];

  // Inserisci le notifiche nel database
  for (const notification of allNotifications) {
    await db.insert(notifications).values({
      id: createId(),
      ...notification,
    });
  }

  console.log(`Inserite ${allNotifications.length} notifiche di esempio.`);
}

// Esegui il seed se questo file viene eseguito direttamente
if (require.main === module) {
  // Controlla se è stato passato l'argomento --force
  const force = process.argv.includes("--force");

  seed(force).catch((error) => {
    console.error("Errore durante il seed:", error);
    process.exit(1);
  });
}

export { seed };
