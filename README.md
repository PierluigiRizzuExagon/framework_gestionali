# Framework Gestionale

Un framework completo per la creazione di sistemi gestionali basato su Next.js 15, Auth.js, Drizzle ORM e MySQL.

## Caratteristiche

- **Autenticazione completa** con Auth.js
- **Gestione utenti e ruoli**
- **Sistema di notifiche** basato sui ruoli
- **Menu dinamico** basato sui permessi
- **Database MySQL** con Drizzle ORM
- **Docker** per l'ambiente di sviluppo

## Requisiti

- Node.js 18+
- Docker e Docker Compose
- pnpm

## Installazione

1. Clona il repository:

```bash
git clone https://github.com/PierluigiRizzuExagon/framework_gestionali.git
cd framework_gestionali
```

2. Installa le dipendenze:

```bash
pnpm install
```

3. Crea un file `.env` nella root del progetto con i seguenti contenuti:

```env
# Configurazione del database
DATABASE_URL=mysql://admin:password@localhost:3306/gestionale

# Configurazione di Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Configurazione di SendGrid (opzionale per le email)
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com
```

## Avvio dell'ambiente di sviluppo

1. Avvia il container Docker per MySQL:

```bash
pnpm run docker:up
```

2. Genera e applica le migrazioni del database:

```bash
pnpm run db:generate
pnpm run db:push
```

3. Esegui il seed del database con dati iniziali:

```bash
pnpm run db:seed
```

4. Avvia il server di sviluppo:

```bash
pnpm run dev
```

5. Apri [http://localhost:3000](http://localhost:3000) nel browser.

## Credenziali di default

Dopo aver eseguito il seed, saranno disponibili i seguenti utenti:

- **Admin**

  - Email: admin@example.com
  - Password: Admin123!

- **Utente standard**
  - Email: user@example.com
  - Password: User123!

## Struttura del progetto

```
src/
├── app/                    # Pagine e route handlers di Next.js
│   ├── (app)/              # Area riservata (dashboard)
│   └── (auth)/             # Pagine di autenticazione
├── components/             # Componenti React riutilizzabili
│   ├── auth/               # Componenti per l'autenticazione
│   ├── dashboard/          # Componenti per la dashboard
│   └── notifications/      # Componenti per le notifiche
├── lib/                    # Librerie e utility
│   ├── auth/               # Configurazione Auth.js
│   ├── db/                 # Configurazione database
│   │   ├── schema/         # Schema del database
│   │   └── seed.ts         # Script di seed
│   └── notifications/      # Logica per le notifiche
```

## Comandi disponibili

- `pnpm run dev`: Avvia il server di sviluppo
- `pnpm run build`: Compila l'applicazione per la produzione
- `pnpm run start`: Avvia l'applicazione compilata
- `pnpm run docker:up`: Avvia i container Docker
- `pnpm run docker:down`: Ferma i container Docker
- `pnpm run db:generate`: Genera le migrazioni Drizzle
- `pnpm run db:push`: Applica le migrazioni al database
- `pnpm run db:studio`: Avvia Drizzle Studio per gestire il database
- `pnpm run db:seed`: Popola il database con dati iniziali

## Funzionalità implementate

- **Sistema di autenticazione**: Login, logout e protezione delle rotte
- **Dashboard con sidebar dinamica**: Menu basato sui ruoli utente
- **Sistema di notifiche**: Notifiche e messaggi filtrati per ruolo
- **Gestione utenti e ruoli**: Amministrazione di utenti con diversi livelli di accesso

## Licenza

MIT
