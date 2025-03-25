"use client";

import { campaignSchema, CampaignSchema } from '@/lib/formValidationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import { createCampaign, updateCampaign } from '@/lib/actions';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { toast } from 'react-toastify';

const CampaignForm = ({
  type,
  data,
  setOpen
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CampaignSchema>({
    resolver: zodResolver(campaignSchema),
    defaultValues: data || {}, // Asigna valores iniciales si existen
  });

  const [state, formAction] = useFormState(
    type === "create" ? createCampaign : updateCampaign,
    {
      success: false,
      error: false,
    }
  );

  const router = useRouter();

  // Si data cambia, actualizar manualmente los valores en el formulario
  useEffect(() => {
    if (data) {
      Object.keys(data).forEach((key) => {
        setValue(key as keyof CampaignSchema, data[key]);
      });
    }
  }, [data, setValue]);

  const onSubmit = handleSubmit((formData) => {
    console.log(formData);
    formAction(formData);
  });

  useEffect(() => {
    if (state.success) {
      toast(`Campaign has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, type, setOpen, router]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new Campaign" : "Update the campaign"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Name"
          name="name"
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Scheduled"
          name="date"
          register={register}
          error={errors.date}
          type="datetime-local"
        />
        <InputField
          label="Participants"
          name="targetContacts"
          register={register}
          error={errors.targetContacts}
          type="number"
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Campaign Type</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("type")}
          >
            <option value="EMAIL">Email</option>
            <option value="SOCIAL_MEDIA">Social Media</option>
            <option value="WEBINAR">Webinar</option>
          </select>
          {errors.type?.message && (
            <p className="text-xs text-red-400">{errors.type.message.toString()}</p>
          )}
        </div>
      </div>
      
      {state.error && <span className="text-red-500">Something went wrong!</span>}  

      <button className="bg-[#7855F9] text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default CampaignForm;