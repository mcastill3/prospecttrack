"use server"

import { clerkClient } from "@clerk/nextjs/server";
import { CampaignSchema, PlayerSchema } from "./formValidationSchema";
import prisma from "./prisma";

type CurrentState = { success: boolean; error: boolean };

export const createCampaign = async (
    currentState: CurrentState,
    data: CampaignSchema
)=>{
    try{
          await prisma?.campaign.create({
            data:{
                name: data.name,
                type: data.type,
                date: data.date,
                targetContacts: data.targetContacts,
            },
          });
        //  revalidatePath("/list/campaign");
          return{ success: true, error: false };
    }catch(err){
        console.log(err);
        return{ success: false, error: true };
    }
};

export const updateCampaign = async (
    currentState: CurrentState,
    data: CampaignSchema
)=>{
    try{
          await prisma?.campaign.update({
            where:{
              id:data.id
            },
            data:{
                name: data.name,
                type: data.type,
                date: data.date,
                targetContacts: data.targetContacts,
            },
          });
        //  revalidatePath("/list/campaign");
          return{ success: true, error: false };
    }catch(err){
        console.log(err);
        return{ success: false, error: true };
    }
};

export const deleteCampaign = async (
    currentState: CurrentState,
    data: FormData
)=>{

    const id=data.get("id") as string
    try{
          await prisma?.campaign.delete({
            where: {
                id:id,
            },
          });
        //  revalidatePath("/list/campaign");
          return{ success: true, error: false };
    }catch(err){
        console.log(err);
        return{ success: false, error: true };
    }
};

export const createPlayer = async (
  currentState: { success: boolean; error: boolean },
  data: PlayerSchema
) => {

  try {
    // Verificar si el username o email ya existen
    const existingPlayer = await prisma.player.findFirst({
      where: {
        OR: [{ username: data.username }, { email: data.email }],
      },
    });

    if (existingPlayer) {
      return { success: false, error: true, message: "Username or email already exists" };
    }

    // Crear el jugador en la base de datos
    await prisma.player.create({
      data: {
        username: data.username,
        email: data.email,
        name: data.name,
        surname: data.surname,
        phone: data.phone || null,
        department: data.department,
        role: data.role,
        sex: data.sex.toUpperCase() as "MALE" | "FEMALE",
        img: data.img || null, // Asegúrate de validar si img es una URL o necesita subir a un servicio externo
        clerkUserId: data.clerkUserId,
        country: {
          connect: { id: data.countryId }, // Usar la clave correcta
        },
        
        city: {
          connect: { id: data.cityId }, 
        },
        
      },
    });

    // Revalidar la caché para actualizar la UI
    // revalidatePath("/list/player"); // Habilitar si usas Next.js App Router con cache

    return { success: true, error: false };
  } catch (err) {
    console.error("Error creating player:", err);
    return { success: false, error: true, message: "Something went wrong" };
  }
};

export const updatePlayer = async (currentState: { success: boolean; error: boolean }, data: PlayerSchema) => {
  try {
      console.log("Received data for update:", data); // 🚀 Debugging Log

      if (!data.id) {
          console.error("Error: Missing player ID!");
          return { success: false, error: true, message: "Player ID is required" };
      }

      const existingPlayer = await prisma.player.findUnique({ where: { id: data.id } });
      if (!existingPlayer) {
          console.log("Player not found!");
          return { success: false, error: true, message: "Player not found" };
      }

      await prisma.player.update({
          where: { id: data.id },
          data: {
              username: data.username,
              email: data.email,
              name: data.name,
              surname: data.surname,
              phone: data.phone || null,
              department: data.department,
              role: data.role,
              sex: data.sex.toUpperCase() as "MALE" | "FEMALE",
              img: data.img || null,
              country: { connect: { id: data.countryId } },
              city: { connect: { id: data.cityId } },
          },
      });

      console.log("Player updated successfully!");
      return { success: true, error: false };
  } catch (err) {
      console.error("Error updating player:", err);
      return { success: false, error: true, message: "Something went wrong" };
  }
};



export const deletePlayer = async (
  currentState: CurrentState,
  data: FormData
)=>{

  const id=data.get("id") as string
  try{
        await prisma?.player.delete({
          where: {
              id:id,
          },
        });
      //  revalidatePath("/list/player");
        return{ success: true, error: false };
  }catch(err){
      console.log(err);
      return{ success: false, error: true };
  }
};