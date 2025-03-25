"use client";

import { deleteCampaign, deletePlayer } from "@/lib/actions";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { FormContainerProps } from "./FormContainer";

// Mapeo de funciones de eliminación
const deleteActionMap = {
  campaign: deleteCampaign,
  player: deletePlayer,
 // lead: deleteCampaign,
};

// Carga dinámica de formularios
const PlayerForm = dynamic(() => import("./forms/PlayerForm"), {
  loading: () => <h1>Loading...</h1>,
});

const CampaignForm = dynamic(() => import("./forms/CampaignForm"), {
  loading: () => <h1>Loading...</h1>,
});

// Mapeo de formularios según el tipo de entidad
const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update",
    data?: any,
    relatedData?: any
  ) => JSX.Element;
} = {
  player: (setOpen, type, data, relatedData) => (
    <PlayerForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  campaign: (setOpen, type, data) => (
    <CampaignForm type={type} data={data} setOpen={setOpen} />
  ),
};

const FormModal = ({ table, type, data, id, relatedData }: FormContainerProps & { relatedData?: any }) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaBlue"
      : "bg-lamaPurple1";

  const [open, setOpen] = useState(false);

  const router = useRouter();

  // Componente del formulario interno
  const Form = () => {
    const deleteAction = deleteActionMap[table as keyof typeof deleteActionMap];
  
    if (type === "delete" && id) {
      if (!deleteAction) {
        return <p>Error: Delete action not available for {table}</p>;
      }
  
      const [state, formAction] = useFormState(deleteAction, {
        success: false,
        error: false,
      });
  
      useEffect(() => {
        if (state.success) {
          toast(`${table.charAt(0).toUpperCase() + table.slice(1)} has been deleted!`);
          setOpen(false);
          router.refresh();
        }
      }, [state, table, router]);
  
      return (
        <form action={formAction} className="p-4 flex flex-col gap-4">
          <input type="hidden" name="id" value={id} />
          <span className="text-center font-medium">
            All data will be lost. Are you sure you want to delete this {table}?
          </span>
          <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
            Delete
          </button>
        </form>
      );
    }
  
    return type === "create" || type === "update" ? (
      forms[table] ? forms[table](setOpen, type, data, relatedData) : <p>Form not found!</p>
    ) : (
      "Form not found!"
    );
  };
  

  return (
    <>
      <button className={`${size} flex items-center justify-center rounded-full ${bgColor}`} onClick={() => setOpen(true)}>
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex place-items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div className="absolute top-4 right-4 cursor-pointer" onClick={() => setOpen(false)}>
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
