"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth/auth";
import {
  notifications,
  notificationReads,
  NotificationTargetType,
  NotificationType,
  NotificationPriority,
  type NewNotification,
  type NewNotificationRead,
} from "@/lib/db/schema/notifications";
import { users, roles } from "@/lib/db/schema";
import { eq, and, or, desc } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

/**
 * Crea una notifica globale
 */
export async function createGlobalNotification(
  title: string,
  message: string,
  type: NotificationType = NotificationType.NOTIFICATION,
  priority: NotificationPriority = NotificationPriority.NORMAL
) {
  try {
    const newNotification: NewNotification = {
      id: createId(),
      title,
      message,
      targetType: NotificationTargetType.GLOBAL,
      type,
      priority,
    };

    await db.insert(notifications).values(newNotification);
    return { success: true, notificationId: newNotification.id };
  } catch (error) {
    console.error("Errore durante la creazione della notifica globale:", error);
    return {
      success: false,
      error: "Errore durante la creazione della notifica",
    };
  }
}

/**
 * Crea una notifica per un ruolo specifico
 */
export async function createRoleNotification(
  roleId: string,
  title: string,
  message: string,
  type: NotificationType = NotificationType.NOTIFICATION,
  priority: NotificationPriority = NotificationPriority.NORMAL
) {
  try {
    // Verifica che il ruolo esista
    const roleExists = await db.query.roles.findFirst({
      where: eq(roles.id, roleId),
    });

    if (!roleExists) {
      return { success: false, error: "Ruolo non trovato" };
    }

    const newNotification: NewNotification = {
      id: createId(),
      title,
      message,
      targetType: NotificationTargetType.ROLE,
      type,
      priority,
      targetId: roleId,
    };

    await db.insert(notifications).values(newNotification);
    return { success: true, notificationId: newNotification.id };
  } catch (error) {
    console.error(
      "Errore durante la creazione della notifica per ruolo:",
      error
    );
    return {
      success: false,
      error: "Errore durante la creazione della notifica",
    };
  }
}

/**
 * Crea una notifica per un utente specifico
 */
export async function createUserNotification(
  userId: string,
  title: string,
  message: string,
  type: NotificationType = NotificationType.NOTIFICATION,
  priority: NotificationPriority = NotificationPriority.NORMAL
) {
  try {
    // Verifica che l'utente esista
    const userExists = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!userExists) {
      return { success: false, error: "Utente non trovato" };
    }

    const newNotification: NewNotification = {
      id: createId(),
      title,
      message,
      targetType: NotificationTargetType.USER,
      type,
      priority,
      targetId: userId,
    };

    await db.insert(notifications).values(newNotification);
    return { success: true, notificationId: newNotification.id };
  } catch (error) {
    console.error(
      "Errore durante la creazione della notifica per utente:",
      error
    );
    return {
      success: false,
      error: "Errore durante la creazione della notifica",
    };
  }
}

/**
 * Crea un messaggio per un utente specifico
 */
export async function createUserMessage(
  userId: string,
  title: string,
  message: string,
  priority: NotificationPriority = NotificationPriority.NORMAL
) {
  return createUserNotification(
    userId,
    title,
    message,
    NotificationType.MESSAGE,
    priority
  );
}

/**
 * Recupera le notifiche standard (non messaggi) per l'utente corrente
 */
export async function fetchUserStandardNotifications() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Utente non autenticato" };
    }

    // Ottieni il ruolo dell'utente
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      with: {
        role: true,
      },
    });

    if (!user?.role) {
      return { success: false, error: "Ruolo utente non trovato" };
    }

    // Recupera tutte le notifiche per l'utente (globali, per ruolo e personali)
    const userNotifications = await db.query.notifications.findMany({
      where: and(
        eq(notifications.type, NotificationType.NOTIFICATION),
        or(
          eq(notifications.targetType, NotificationTargetType.GLOBAL),
          and(
            eq(notifications.targetType, NotificationTargetType.ROLE),
            eq(notifications.targetId, user.roleId)
          ),
          and(
            eq(notifications.targetType, NotificationTargetType.USER),
            eq(notifications.targetId, user.id)
          )
        )
      ),
      with: {
        reads: {
          where: eq(notificationReads.userId, user.id),
        },
      },
      orderBy: [desc(notifications.priority), desc(notifications.createdAt)],
    });

    // Trasforma le notifiche per includere lo stato di lettura
    const transformedNotifications = userNotifications.map((notification) => ({
      ...notification,
      isRead: notification.reads.length > 0,
    }));

    return { success: true, data: transformedNotifications };
  } catch (error) {
    console.error("Errore durante il recupero delle notifiche:", error);
    return {
      success: false,
      error: "Errore durante il recupero delle notifiche",
    };
  }
}

/**
 * Recupera i messaggi per l'utente corrente
 */
export async function fetchUserMessages() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Utente non autenticato" };
    }

    // Ottieni il ruolo dell'utente
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      with: {
        role: true,
      },
    });

    if (!user?.role) {
      return { success: false, error: "Ruolo utente non trovato" };
    }

    // Recupera tutti i messaggi per l'utente (globali, per ruolo e personali)
    const userMessages = await db.query.notifications.findMany({
      where: and(
        eq(notifications.type, NotificationType.MESSAGE),
        or(
          eq(notifications.targetType, NotificationTargetType.GLOBAL),
          and(
            eq(notifications.targetType, NotificationTargetType.ROLE),
            eq(notifications.targetId, user.roleId)
          ),
          and(
            eq(notifications.targetType, NotificationTargetType.USER),
            eq(notifications.targetId, user.id)
          )
        )
      ),
      with: {
        reads: {
          where: eq(notificationReads.userId, user.id),
        },
      },
      orderBy: [desc(notifications.priority), desc(notifications.createdAt)],
    });

    // Trasforma i messaggi per includere lo stato di lettura
    const transformedMessages = userMessages.map((message) => ({
      ...message,
      isRead: message.reads.length > 0,
    }));

    return { success: true, data: transformedMessages };
  } catch (error) {
    console.error("Errore durante il recupero dei messaggi:", error);
    return {
      success: false,
      error: "Errore durante il recupero dei messaggi",
    };
  }
}

/**
 * Segna una notifica come letta per l'utente corrente
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Utente non autenticato" };
    }

    // Verifica che la notifica esista
    const notification = await db.query.notifications.findFirst({
      where: eq(notifications.id, notificationId),
    });

    if (!notification) {
      return { success: false, error: "Notifica non trovata" };
    }

    // Verifica se la notifica è già stata letta dall'utente
    const alreadyRead = await db.query.notificationReads.findFirst({
      where: and(
        eq(notificationReads.notificationId, notificationId),
        eq(notificationReads.userId, session.user.id)
      ),
    });

    if (alreadyRead) {
      return { success: true, message: "Notifica già letta" };
    }

    // Segna la notifica come letta
    await db.insert(notificationReads).values({
      id: createId(),
      notificationId,
      userId: session.user.id,
    });

    return { success: true };
  } catch (error) {
    console.error("Errore durante la lettura della notifica:", error);
    return {
      success: false,
      error: "Errore durante la lettura della notifica",
    };
  }
}

/**
 * Segna tutte le notifiche come lette per l'utente corrente
 * @param type Tipo opzionale per filtrare le notifiche da segnare come lette
 */
export async function markAllNotificationsAsRead(type?: NotificationType) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Utente non autenticato" };
    }

    // Ottieni il ruolo dell'utente
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      with: {
        role: true,
      },
    });

    if (!user?.role) {
      return { success: false, error: "Ruolo utente non trovato" };
    }

    // Costruisci la condizione di base per le notifiche dell'utente
    let conditions = or(
      eq(notifications.targetType, NotificationTargetType.GLOBAL),
      and(
        eq(notifications.targetType, NotificationTargetType.ROLE),
        eq(notifications.targetId, user.roleId)
      ),
      and(
        eq(notifications.targetType, NotificationTargetType.USER),
        eq(notifications.targetId, user.id)
      )
    );

    // Se è specificato un tipo, aggiungi la condizione
    if (type !== undefined) {
      conditions = and(conditions, eq(notifications.type, type));
    }

    // Recupera tutte le notifiche non lette per l'utente
    const unreadNotifications = await db.query.notifications.findMany({
      where: conditions,
      with: {
        reads: {
          where: eq(notificationReads.userId, user.id),
        },
      },
    });

    // Filtra solo le notifiche non lette
    const notificationsToMark = unreadNotifications
      .filter((notification) => notification.reads.length === 0)
      .map((notification) => notification.id);

    if (notificationsToMark.length === 0) {
      return { success: true, message: "Nessuna notifica da leggere" };
    }

    // Crea le letture per tutte le notifiche non lette
    const newReads: NewNotificationRead[] = notificationsToMark.map(
      (notificationId) => ({
        id: createId(),
        notificationId,
        userId: session.user.id,
      })
    );

    await db.insert(notificationReads).values(newReads);
    return { success: true, count: notificationsToMark.length };
  } catch (error) {
    console.error("Errore durante la lettura di tutte le notifiche:", error);
    return {
      success: false,
      error: "Errore durante la lettura delle notifiche",
    };
  }
}

/**
 * Conta le notifiche non lette per l'utente corrente
 * @param type Tipo opzionale per filtrare le notifiche da contare
 */
export async function countUnreadNotifications(type?: NotificationType) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Utente non autenticato" };
    }

    // Ottieni il ruolo dell'utente
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      with: {
        role: true,
      },
    });

    if (!user?.role) {
      return { success: false, error: "Ruolo utente non trovato" };
    }

    // Costruisci la condizione di base per le notifiche dell'utente
    let conditions = or(
      eq(notifications.targetType, NotificationTargetType.GLOBAL),
      and(
        eq(notifications.targetType, NotificationTargetType.ROLE),
        eq(notifications.targetId, user.roleId)
      ),
      and(
        eq(notifications.targetType, NotificationTargetType.USER),
        eq(notifications.targetId, user.id)
      )
    );

    // Se è specificato un tipo, aggiungi la condizione
    if (type !== undefined) {
      conditions = and(conditions, eq(notifications.type, type));
    }

    // Recupera tutte le notifiche per l'utente
    const userNotifications = await db.query.notifications.findMany({
      where: conditions,
      with: {
        reads: {
          where: eq(notificationReads.userId, user.id),
        },
      },
    });

    // Conta le notifiche non lette
    const unreadCount = userNotifications.filter(
      (notification) => notification.reads.length === 0
    ).length;

    return { success: true, count: unreadCount };
  } catch (error) {
    console.error(
      "Errore durante il conteggio delle notifiche non lette:",
      error
    );
    return {
      success: false,
      error: "Errore durante il conteggio delle notifiche",
    };
  }
}
