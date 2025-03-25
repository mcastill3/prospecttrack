import prisma from '@/lib/prisma';
import FormModal from "./FormModal";

export type FormContainerProps = {
    table: 
    | "lead" 
    | "ad"
    | "campaign"
    | "task"
    | "event"
    | "contact"
    | "partner"
    | "company"
    | "player";
    type: "create" | "update" | "delete";
    id?: string;
    data?: any;
};

const FormContainer = async ({ table, type, id }: FormContainerProps) => {
    let relatedData = null;
    let data = null;

    // Si no es un "delete", obtener datos
    if (type !== "delete") {
        switch (table) {
            case "player":
                // Obtener países y ciudades
                const countries = await prisma.country.findMany({
                    select: { id: true, name: true },
                });

                const cities = await prisma.city.findMany({
                    select: { id: true, name: true },
                });

                relatedData = { countries, cities };

                // Si es una actualización, obtener la información del jugador
                if (type === "update" && id) {
                    data = await prisma.player.findUnique({
                        where: { id },
                        select: {
                            id: true,
                            username: true,
                            email: true,
                            name: true,
                            surname: true,
                            phone: true,
                            cityId: true,
                            countryId: true,
                            department: true,
                            role: true,
                            sex: true,
                            img: true,
                        },
                    });
                }
                break;

            case "campaign":
                // Si es una actualización, obtener los datos de la campaña
                if (type === "update" && id) {
                    data = await prisma.campaign.findUnique({
                        where: { id },
                    });
                }
                break;

            default:
                break;
        }
    }

    return (
        <div>
            <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData} />
        </div>
    );
};

export default FormContainer;