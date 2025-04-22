"use client";

import React, { useEffect, useState } from 'react';
import { CheckIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { NieuwkomerValidation } from '@/lib/validations/nieuwkomer';
import axios from 'axios';
import { maakFreelancer} from '@/lib/actions/nieuwkomer.actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import "react-datepicker/dist/react-datepicker.css";
import { FileUploader } from '@/components/FileUploader';
import { useUploadThing } from '@/lib/uploadthing';
import DatePicker from 'react-datepicker';


const steps = [
  { id: 1, name: 'Persoonlijke gegevens', fields: ['voornaam', 'tussenvoegsel', 'achternaam', 'geboortedatum'] },
  { id: 2, name: 'Zakelijke gegevens', fields: ['btwid', 'iban', 'huisnummer', 'postcode', 'straatnaam', 'stad'] },
  { id: 3, name: 'Profiel', fields: ['profielfoto', 'bio', 'cv'] },
  { id: 4, name: 'Compleet' }
];

type Inputs = z.infer<typeof NieuwkomerValidation>;

interface Props {
  freelancer: {
    freelancerID: any;
    profielfoto: string;
    voornaam: string;
    tussenvoegsel: string;
    achternaam: string;
    geboortedatum: Date;
    emailadres: string;
    straat: string;
    stad: string;
    telefoonnummer: string;
    korregeling: boolean;
    btwid: string;
    iban: string;
    path: string;
  };
}

const Page: React.FC<Props> = ({ freelancer }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [previousStep, setPreviousStep] = useState(0);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const router = useRouter();
  const { startUpload } = useUploadThing("media");
  const pathname = usePathname();
  const {user, isLoaded} = useUser()
  const [loading, setLoading] = useState(false);

  const fetchAddressData = async (postcode: string, huisnummer: string) => {
    try {
      const url = `/api/postcode?postcode=${postcode}&huisnummer=${huisnummer}`;
  
      const response = await axios.get(url);
  
      const { street, city } = response.data;
  
      setStreet(street);
      setCity(city);
  
      setValue('straatnaam', street);
      setValue('stad', city);
    } catch (error) {
      console.error('Error fetching address data:', error);
    }
  };

  type FieldName = keyof Inputs;

  const nextStep = async () => {
    console.log("Current Step Before: ", currentStep);
    const fields = steps[currentStep].fields;
    const output = await trigger(fields as FieldName[], { shouldFocus: true });
    console.log("Validation Output: ", output);
    console.log(errors);
  
    if (!output) return;
  
    setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    console.log("Current Step After: ", currentStep);
  };

  const prevStep = () => {
    setPreviousStep(currentStep);
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const delta = currentStep - previousStep;

  const getUserPhoneNumber = (user: any) => {
    if (user?.primaryPhoneNumber) {
      return user.primaryPhoneNumber;
    }
    
    const primaryPhone = user?.phoneNumbers?.find(
      (phoneNumber: any) => phoneNumber.id === user?.primaryPhoneNumberId
    );
  
    return primaryPhone?.primaryPhoneNumber || "";
  };


  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    setValue,
    formState: { errors }
  } = useForm<Inputs>({
    resolver: zodResolver(NieuwkomerValidation),
    defaultValues: {
      freelancerID: freelancer?.freelancerID || user?.id || "",
      profielfoto: user?.imageUrl || "",
      voornaam: freelancer?.voornaam || user?.firstName || user?.fullName || "",
      tussenvoegsel: freelancer?.tussenvoegsel || "",
      achternaam: freelancer?.achternaam || user?.lastName ||"",
      geboortedatum: freelancer?.geboortedatum || new Date("01/01/2000"),
      emailadres: freelancer?.emailadres || user?.emailAddresses[0].emailAddress || "" ,
      telefoonnummer: freelancer?.telefoonnummer || getUserPhoneNumber(user) || "",
      btwid: freelancer?.btwid || "",
      iban: freelancer?.iban || "",
      cv: undefined
    }
  });

  useEffect(() => {
    const fetchDetails = async () => {
      const postcode = watch('postcode');
      const huisnummer = watch('huisnummer');
      if (postcode && huisnummer) {
        await fetchAddressData(postcode, huisnummer);
      }
    };
  
    fetchDetails();
  }, [watch('postcode'), watch('huisnummer')]);

  const selectedDate = watch('geboortedatum') as Date | undefined;

  const processForm: SubmitHandler<Inputs> = async (data) => {

    let uploadedImageUrl = data.profielfoto;

// Check if there are files to upload
if (files.length > 0) {
  try {
    // Start the upload and wait for the response
    const uploadedImages = await startUpload(files);

    // Check if the upload was successful
    if (!uploadedImages || uploadedImages.length === 0) {
      console.error('Failed to upload images');
      return;
    }

    // Use the URL provided by the upload service
    uploadedImageUrl = uploadedImages[0].url;
    console.log("Final URL:", uploadedImageUrl);
  } catch (error) {
    console.error('Error uploading image:', error);
    return;
  }
}
    setLoading(true)
    await maakFreelancer({


      clerkId: user?.id || "0000",
      voornaam: data.voornaam || user?.firstName || user?.fullName ||"",
      tussenvoegsel: data.tussenvoegsel || "",
      achternaam: data.achternaam || user?.lastName || "",
      geboortedatum: data.geboortedatum || new Date("01/01/2000"),
      emailadres: data.emailadres ||  user?.emailAddresses[0].emailAddress || "",
      telefoonnummer: data.telefoonnummer || getUserPhoneNumber(user) || "",
      postcode: data.postcode || "",
      huisnummer: data.huisnummer || "",
      straat: data.straatnaam || "",
      stad: data.stad,
      korregeling: false,
      btwid: data.btwid || "",
      iban: data.iban || "",
      path: "profiel/wijzigen",
      onboarded: false,
      profielfoto: data.profielfoto || user?.imageUrl,
      werkervaring: [], // Pass an empty array
      vaardigheden: [], // Pass an empty array
      opleidingen: [], // Pass an empty array
      bio: data.bio || "",
      kvknr: '',
      cv: data.cv || "" || undefined,
      bsn: ""  // Ensure bsn is provided


    });
    setLoading(false)
    router.push("../dashboard")
  };

  if (loading) {
    return  <div>Loading...</div>
  }

  return (
    <main>
      <section className="flex flex-col justify-between p-24">
        <nav aria-label="Progress">
          <ol role="list" className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className="relative md:flex md:flex-1">
                {currentStep > stepIdx ? (
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-sky-600 group-hover:bg-sky-600">
                      <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </span>
                    <span className="ml-4 text-sm font-medium text-gray-900">{step.name}</span>
                  </span>
                ) : currentStep === stepIdx ? (
                  <div className="flex items-center px-6 py-4 text-sm font-medium" aria-current="step">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-sky-600">
                      <span className="text-sky-600">{step.id}</span>
                    </span>
                    <span className="ml-4 text-sm font-medium text-sky-600">{step.name}</span>
                  </div>
                ) : (
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300">
                      <span className="text-gray-500">{step.id}</span>
                    </span>
                    <span className="ml-4 text-sm font-medium text-gray-500">{step.name}</span>
                  </span>
                )}

                {stepIdx !== steps.length - 1 && (
                  <div className="absolute top-0 right-0 hidden h-full w-5 md:block" aria-hidden="true">
                    <svg className="h-full w-full text-gray-300" viewBox="0 0 22 80" fill="none" preserveAspectRatio="none">
                      <path
                        d="M0 -2L20 40L0 82"
                        vectorEffect="non-scaling-stroke"
                        stroke="currentColor"
                        strokeLinecap="round" />
                    </svg>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <form onSubmit={handleSubmit(processForm)} className="relative my-8  items-center rounded-lg bg-white shadow-lg ring-1 ring-black/5">
          {currentStep === 0 && (
            <>
              <motion.div
                initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }} 
              >
                <div className="px-8 space-y-12 sm:space-y-16">
                  <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 mt-10 text-gray-900">Persoonlijke gegevens</h2>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                      Vul je persoonlijke gegevens in.
                    </p>
                    <div className="mt-10 space-y-8  pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label htmlFor="voornaam" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                          Voornaam
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <input
                            type="text"
                            {...register('voornaam', { required: true })}
                            id="voornaam"
                            className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                          {errors.voornaam && <p className="mt-2 text-sm text-red-600">{errors.voornaam.message}</p>}
                        </div>
                      </div>
                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label htmlFor="tussenvoegsel" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                          Tussenvoegsel
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <input
                            type="text"
                            {...register('tussenvoegsel')}
                            id="tussenvoegsel"
                            className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                      </div>
                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label htmlFor="achternaam" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                          Achternaam
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <input
                            type="text"
                            {...register('achternaam', { required: true })}
                            id="achternaam"
                            className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                          {errors.achternaam && <p className="mt-2 text-sm text-red-600">{errors.achternaam.message}</p>}
                        </div>
                      </div>

                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label htmlFor="geboortedatum" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                      Geboortedatum
                    <p className="text-sm text-slate-400">(MM/dd/yyyy)</p>
                    </label>
                    
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                    <DatePicker
                        selected={selectedDate} // Assign selectedDate or null to the selected attribute
                        onChange={(date: Date | null) => setValue('geboortedatum', date as Date, { shouldValidate: true })} // Update the form state
                        dateFormat="MM/dd/yyyy"
                        wrapperClassName="datePicker"
                      />
                      {errors.geboortedatum && <p className="mt-2 text-sm text-red-600">{errors.geboortedatum.message}</p>}
                    </div>
                  </div> 

                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
          {currentStep === 1 && (
            <motion.div
              initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="px-8 space-y-12 sm:space-y-16">
                <div className="border-b border-gray-900/10 pb-12">
                  <h2 className="text-base font-semibold leading-7 mt-10 text-gray-900">Zakelijke gegevens</h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                    Vul je zakelijke gegevens in.
                  </p>
                  <div className="mt-10 space-y-8  pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                      <label htmlFor="btwid" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                        BTW ID
                      </label>
                      <div className="mt-2 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          {...register('btwid', { required: true })}
                          id="btwid"
                          className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        {errors.btwid && <p className="mt-2 text-sm text-red-600">{errors.btwid.message}</p>}
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                      <label htmlFor="iban" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                        IBAN
                      </label>
                      <div className="mt-2 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          {...register('iban', { required: true })}
                          id="iban"
                          className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        {errors.iban && <p className="mt-2 text-sm text-red-600">{errors.iban.message}</p>}
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                      <label htmlFor="huisnummer" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                        Huisnummer
                      </label>
                      <div className="mt-2 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          {...register('huisnummer', { required: true })}
                          id="huisnummer"
                          className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        {errors.huisnummer && <p className="mt-2 text-sm text-red-600">{errors.huisnummer.message}</p>}
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                      <label htmlFor="postcode" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                        Postcode
                      </label>
                      <div className="mt-2 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          {...register('postcode', { required: true })}
                          id="postcode"
                          className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        {errors.postcode && <p className="mt-2 text-sm text-red-600">{errors.postcode.message}</p>}
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                      <label htmlFor="stad" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                        Stad
                      </label>
                      <div className="mt-2 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          {...register('stad', { required: true })}
                          id="stad"
                          className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                        {errors.stad && <p className="mt-2 text-sm text-red-600">{errors.stad.message}</p>}
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                      <label htmlFor="straatnaam" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                        Straatnaam
                      </label>
                      <div className="mt-2 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          {...register('straatnaam', { required: true })}
                          id="straatnaam"
                          className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                        />
                        {errors.straatnaam && <p className="mt-2 text-sm text-red-600">{errors.straatnaam.message}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {currentStep === 2 && (
            <motion.div
              initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="px-8 space-y-12 sm:space-y-16">
                <div className="border-b border-gray-900/10 pb-12">
                  <h2 className="text-base font-semibold leading-7 mt-10 text-gray-900">Profiel</h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                    Jouw visitekaartje naar opdrachtgevers toe. 😁👋
                  </p>

                  <div className="mt-10 space-y-8  pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                      <label htmlFor="profielfoto" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                        Profielfoto
                      </label>
                      <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <FileUploader
                        onFieldChange={(uploadedUrl: string) => setValue('profielfoto', uploadedUrl, { shouldValidate: true })}
                        imageUrl={watch('profielfoto') || ''}
                        setFiles={setFiles}
                      />  
                        {errors.profielfoto && <p className="mt-2 text-sm text-red-600">{errors.profielfoto.message}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 space-y-8  pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                      <label htmlFor="bio" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                        Bio
                      </label>
                      <div className="mt-2 sm:col-span-2 sm:mt-0">
                        <textarea
                          {...register('bio')}
                          id="bio"
                          rows={4}
                          className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        {errors.bio && <p className="mt-2 text-sm text-red-600">{errors.bio.message}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="px-8 space-y-7 sm:space-y-16">
                <h2 className="text-base font-semibold leading-7 text-gray-900 pt-10">Compleet</h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                  Je bent klaar! Klik op 'Voltooien' om het proces af te ronden.
                </p>
              </div>
            </motion.div>
          )}

<div className="mt-8 pb-10 pr-10 flex justify-end space-x-4">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={prevStep}
              className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              Vorige
            </button>
          )}
          {currentStep < steps.length - 1 && (
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex justify-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              Volgende
            </button>
          )}
          {currentStep === steps.length - 1 && (
      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
      >
        Voltooien
      </button>
    )}
        </div>
        </form>
      </section>
    </main>
  );
}

export default Page;
