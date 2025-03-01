import sgMail from "@sendgrid/mail";

// Inizializzazione di SendGrid con la chiave API
sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY || "");

/**
 * Invia un'email per il reset della password
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<void> {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  const msg = {
    to: email,
    from: process.env.NEXT_PUBLIC_EMAIL_FROM || "noreply@tuodominio.it",
    subject: "Reset della password",
    text: `Clicca sul seguente link per reimpostare la tua password: ${resetUrl}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset della password</h2>
        <p>Hai richiesto il reset della password. Clicca sul pulsante qui sotto per reimpostarla:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Reimposta password
          </a>
        </div>
        <p>Se non hai richiesto il reset della password, ignora questa email.</p>
        <p>Il link scadrà tra un'ora.</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(
      "Errore nell'invio dell'email:",
      JSON.stringify(error, null, 2)
    );
    throw new Error("Impossibile inviare l'email di reset della password");
  }
}
