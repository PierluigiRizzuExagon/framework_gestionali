import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-600">
          Benvenuto, {session.user.name || session.user.email}!
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Informazioni utente</h2>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Nome:</span>{" "}
            {session.user.name || "N/A"}
          </p>
          <p>
            <span className="font-medium">Email:</span> {session.user.email}
          </p>
          <p>
            <span className="font-medium">Ruolo:</span>{" "}
            {session.user.role?.name || "N/A"}
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Sessione</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
}
