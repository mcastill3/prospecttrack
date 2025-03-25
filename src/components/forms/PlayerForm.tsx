"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { playerSchema, PlayerSchema, PlayerRoleEnum, SexEnum } from "@/lib/formValidationSchema";
import { useFormState } from "react-dom";
import { createPlayer, updatePlayer } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from 'next-cloudinary';

const PlayerForm = ({
    type,
    data,
    setOpen,
    relatedData
}: {
    type: "create" | "update";
    data?: any;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: { countries: any[], cities: any[] };
}) => {

   const {
    register,
    handleSubmit,
    formState: { errors },
   } = useForm<PlayerSchema>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      ...data,
      clerkUserId: data?.clerkUserId || "", // Se añade el campo clerkUserId
      cityId: data?.cityId || "",
      countryId: data?.countryId || "",
      role: data?.role || "DIRECTOR_COMERCIAL",
      sex: data?.sex || "male"
    }
   });

   const [img,setImg] = useState<any>()

   const [state, formAction] = useFormState(
    type === "create" ? createPlayer : updatePlayer,
    { success: false, error: false }
  );

  const onSubmit = handleSubmit((formData) => {
    console.log("Submitting form:", formData); // <-- Log para depuración
    const payload = type === "update" ? { ...formData, id: data?.id } : formData;
    formAction({ ...payload, img: img?.secure_url });
  });
 
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Player has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, type, setOpen, router]);  

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
        <h1 className="text-xl font-semibold">
            {type === "create" ? "Create a new player" : "Update the player"}
        </h1>

        <span className="text-xs text-gray-400 font-medium">
           Authentication Information
        </span>
        <div className="flex justify-between flex-wrap gap-4">
          <InputField label="Username" name="username" defaultValue={data?.username} register={register} error={errors?.username} />
          <InputField label="Email" name="email" type="email" defaultValue={data?.email} register={register} error={errors?.email} />
          
          {/* Nuevo campo Clerk User ID */}
          <InputField 
            label="Clerk User ID" 
            name="clerkUserId" 
            defaultValue={data?.clerkUserId} 
            register={register} 
            error={errors.clerkUserId}             
          />
        </div>
        <span className="text-xs text-gray-400 font-medium">
           Personal Information
        </span>
        <div className="flex justify-between flex-wrap gap-4">
          <InputField label="First Name" name="name" defaultValue={data?.name} register={register} error={errors.name} />
          <InputField label="Last Name" name="surname" defaultValue={data?.surname} register={register} error={errors.surname} />
          <InputField label="Phone" name="phone" defaultValue={data?.phone} register={register} error={errors.phone} />
          <InputField label="Department" name="department" defaultValue={data?.department} register={register} error={errors.department} />
          
          {/* Select Country */}
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Country</label>
            <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("countryId")}
              defaultValue={data?.countryId || ""}
            >
              <option value="">Select a country</option>
              {relatedData?.countries.map(country => (
                <option key={country.id} value={country.id}>{country.name}</option>
              ))}
            </select>
            {errors.countryId?.message && <p className="text-xs text-red-400">{errors.countryId.message.toString()}</p>}
          </div>

          {/* Select City */}
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">City</label>
            <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("cityId")}
              defaultValue={data?.cityId || ""}
            >
              <option value="">Select a city</option>
              {relatedData?.cities.map(city => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
            {errors.cityId?.message && <p className="text-xs text-red-400">{errors.cityId.message.toString()}</p>}
          </div>
          {/* Select Role */}
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Role</label>
            <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("role")}
              defaultValue={data?.role || "DIRECTOR_COMERCIAL"}
            >
              {PlayerRoleEnum.options.map(role => (
                <option key={role} value={role}>{role.replace("_", " ")}</option>
              ))}
            </select>
            {errors.role?.message && <p className="text-xs text-red-400">{errors.role.message.toString()}</p>}
          </div>

          {/* Select Gender */}
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Gender</label>
            <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("sex")}
              defaultValue={data?.sex || "male"}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.sex?.message && <p className="text-xs text-red-400">{errors.sex.message.toString()}</p>}
          </div>

          {/* Upload Image */}
          <CldUploadWidget uploadPreset="prospecttrack" onSuccess={(result,{widget})=>{
            setImg(result.info)
            widget.close()
          }}>
            {({ open }) => {
              return (
                <div 
                  className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer" 
                   onClick={() => open()}
                >
                  <Image src="/upload.png" alt="" width={28} height={28} />
                  <span>Upload a photo</span>
                </div>
              );
            }}
          </CldUploadWidget>
        </div>
        {state.error && <span className="text-red-500">Something went wrong!</span>}
        <button className="bg-[#7855F9] text-white p-2 rounded-md">
          {type === "create" ? "Create" : "Update"}
        </button>
    </form>
  );
};

export default PlayerForm;