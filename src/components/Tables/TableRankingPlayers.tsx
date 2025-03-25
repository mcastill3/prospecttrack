import prisma from "@/lib/prisma";

const getPlayersRanking = async () => {
  const players = await prisma.player.findMany({
    include: {
      leads: {
        select: {
          status: true,
        },
      },
    },
  });

  // Calcular la tasa de conversión de cada jugador
  const ranking = players.map((player) => {
    const totalLeads = player.leads.length ?? 0;
    const convertedLeads = player.leads.filter((lead) => lead.status === "CLOSED").length ?? 0;
    const conversionRate = totalLeads > 0 ? (Number(convertedLeads) / Number(totalLeads)) * 100 : 0;

    return {
      id: player.id,
      name: `${player.name} ${player.surname}`,
      conversionRate: conversionRate.toFixed(2),
    };
  });

  // Ordenar de mayor a menor tasa de conversión
  return ranking.sort((a, b) => Number(b.conversionRate) - Number(a.conversionRate));
};

const TableRankingPlayers = async ({ playerId }: { playerId: string }) => {
  const ranking = await getPlayersRanking();

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <h2 className="text-lg font-semibold text-center">🏆 Ranking de Jugadores</h2>
      <table className="w-full mt-4 text-sm border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 text-left">📊 Posición</th>
            <th className="py-2 px-4 text-left">🏅 Jugador</th>
            <th className="py-2 px-4 text-left">🎯 Tasa de Conversión</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((player, index) => (
            <tr
              key={player.id}
              className={`border-b ${player.id === playerId ? "bg-blue-100 font-bold" : "bg-white"}`}
            >
              <td className="py-2 px-4">
                {index === 0 ? "🏆" : index < 3 ? "🔝" : ""} {index + 1}°
              </td>
              <td className="py-2 px-4">{player.name}</td>
              <td className="py-2 px-4">{player.conversionRate}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableRankingPlayers;