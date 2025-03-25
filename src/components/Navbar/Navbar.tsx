import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

const Navbar = async () => {
  const user = await currentUser();

  // Verificar si user?.fullName es un string y asignar un valor predeterminado
  const fullName = typeof user?.fullName === "string" ? user.fullName : "Usuario";

  // Obtener y formatear el rol del usuario (reemplaza "_" por espacio)
  const userRole =
    typeof user?.publicMetadata?.role === "string"
      ? user.publicMetadata.role.replace(/_/g, " ")
      : "Sin rol";

  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
      {/* MENSAJE DE BIENVENIDA EN EL EXTREMO IZQUIERDO */}
      <div className="flex items-center gap-4">
        <span className="font-semibold text-lg">
        👋 <span className="font-bold">{fullName}</span>, qué bueno verte
        </span>
      </div>

      {/* ICONOS Y USUARIO EN LA DERECHA */}
      <div className="flex items-center gap-6 justify-end">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image src="/message.png" alt="Mensajes" width={20} height={20} />
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image src="/announcement.png" alt="Anuncios" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">{userRole}</span>
        </div>

        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
