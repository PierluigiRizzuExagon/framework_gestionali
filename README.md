# Framework Gestionale

Un framework completo per la creazione di sistemi gestionali basato su Next.js 15, Auth.js, Drizzle ORM e MySQL.

## Caratteristiche

- **Autenticazione completa** con Auth.js
- **Gestione utenti e ruoli**
- **Sistema di notifiche** basato sui ruoli
- **Menu dinamico** basato sui permessi
- **Recupero password** via email
- **Database MySQL** con Drizzle ORM
- **Docker** per l'ambiente di sviluppo

## Requisiti

- Node.js 18+
- Docker e Docker Compose
- pnpm

## Installazione

1. Clona il repository:

```bash
git clone https://github.com/tuousername/framework_gestionali.git
cd framework_gestionali
```

2. Installa le dipendenze:

```bash
pnpm install
```

3. Crea un file `.env` nella root del progetto con i seguenti contenuti:

```env
# Configurazione del database
NEXT_PUBLIC_DATABASE_HOST=localhost
NEXT_PUBLIC_DATABASE_PORT=3306
NEXT_PUBLIC_DATABASE_USER=admin
NEXT_PUBLIC_DATABASE_PASSWORD=password
NEXT_PUBLIC_DATABASE_NAME=gestionale

# Configurazione di Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Configurazione di SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com
```

## Avvio dell'ambiente di sviluppo

1. Avvia il container Docker per MySQL:

```bash
pnpm run docker:up
```

2. Inizializza le tabelle del database:

```bash
pnpm tsx src/lib/db/init-tables.ts
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
  - Password: Password123!

- **Utente standard**
  - Email: user@example.com
  - Password: Password123!

## Struttura del progetto

```
src/
├── app/                    # Pagine e route handlers di Next.js
│   ├── api/                # API routes
│   ├── dashboard/          # Area riservata
│   ├── admin/              # Area amministrativa
│   ├── login/              # Pagina di login
│   ├── forgot-password/    # Recupero password
│   └── reset-password/     # Reset password
├── components/             # Componenti React riutilizzabili
├── lib/                    # Librerie e utility
│   ├── db/                 # Configurazione database
│   │   ├── schema/         # Schema del database
│   │   └── seed.ts         # Script di seed
├── auth.ts                 # Configurazione Auth.js
└── middleware.ts           # Middleware per la protezione delle rotte
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

## Sviluppo

### Aggiungere nuove tabelle

1. Crea un nuovo file nella cartella `src/lib/db/schema/`
2. Definisci la tabella usando Drizzle
3. Esporta la tabella in `src/lib/db/schema/index.ts`
4. Genera e applica le migrazioni:

```bash
pnpm run db:generate
pnpm run db:push
```

### Aggiungere nuove relazioni

1. Crea un nuovo file nella cartella `src/lib/db/schema/relations/`
2. Definisci le relazioni usando Drizzle
3. Esporta le relazioni in `src/lib/db/schema/relations/index.ts`

## Licenza

MIT
# framework_gestionali
