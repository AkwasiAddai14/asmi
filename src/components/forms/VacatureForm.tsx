"use client";

import React, { useState, useEffect, } from 'react';
import { CheckIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { VacatureValidation } from '@/app/lib/validations/vacature';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import "react-datepicker/dist/react-datepicker.css";
import { FileUploader } from '../shared/FileUploader';
import { useUploadThing } from '@/app/lib/uploadthing';
import DatePicker from 'react-datepicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/nl';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { IVacature } from '@/app/lib/models/vacature.model';
import { createVacature } from '@/app/lib/actions/vacature.actions';
import { fetchBedrijfDetails } from "@/app/lib/actions/bedrijven.actions";

const steps = [
  { id: 1, name: 'Vacature details', fields: ['titel', 'functie', 'beschrijving', 'adres', 'kledingsvoorschriften', 'vaardigheden', 'afbeelding'] },
  { id: 2, name: 'Adres', fields: ['postcode', 'huisnummer', 'straatnaam', 'stad'] },
  { id: 3, name: 'Data', fields: ['begindatum', 'einddatum', 'begintijd', 'eindtijd'] },
  { id: 4, name: 'Uurloon', fields: ['uurloon', 'toeslag', 'toeslagtype', 'toeslagpercentage'] },
  { id: 5, name: 'Compleet' }
];

type Inputs = z.infer<typeof VacatureValidation>;

type FieldName = keyof Inputs;

interface Props {
  vacature: {
    vactureID: any;
    afbeelding: string;
    titel: string;
    functie: string;
    adres: string;
    beschrijving: string;
    kledingsvoorschriften: string;
    vaardigheden: string;
    begindatum: string;
    einddatum: string;
    begintijd: string;
    uurloon: number;
    eindtijd: string;
    toeslag: boolean;
    toeslagtype: number;
    toeslagpercentage: number
  };
}

type VacatureFormProps = {
  userId: string;
  type: "maak" | "update";
  vacature?: IVacature;
  vacatureId?: string;
};

const  VacatureForm = ({ userId, type, vacature, vacatureId }: VacatureFormProps) => {
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
  const [werktijden, setWerktijden] = useState([
    { begintijd: "", eindtijd: "", pauze: 0 },
  ]);
  const [showToeslagFields, setShowToeslagFields] = useState(false);
  const [toeslagType, setToeslagType] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(new Date('2025-01-01'));
  const [endDate, setEndDate] = useState<Date | null>(new Date('2025-01-01'));
  const [bedrijfDetails, setBedrijfDetails] = useState<any>(null);

  useEffect(() => {
    if (userId) {
      fetchBedrijfDetails(userId)
        .then((details) => {
          setBedrijfDetails(details);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [userId]);

  const voegWerktijdToe = () => {
    setWerktijden([...werktijden, { begintijd: "", eindtijd: "", pauze: 0 }]);
  };

  // Functie om een werktijd aan te passen
  const werkWerktijdBij = (index: number, field: string, value: string | number) => {
    const nieuweWerktijden = [...werktijden];
    nieuweWerktijden[index] = { ...nieuweWerktijden[index], [field]: value };
    setWerktijden(nieuweWerktijden);
  };

  // Functie om een werktijd te verwijderen
  const verwijderWerktijd = (index: number) => {
    const nieuweWerktijden = werktijden.filter((_, i) => i !== index);
    setWerktijden(nieuweWerktijden);
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
    resolver: zodResolver(VacatureValidation),
    defaultValues: {
     afbeelding: '',
     titel: '',
     functie: '',
     beschrijving: '',
     vaardigheden: '',
     kledingsvoorschriften: "zwarte broek, zwarte schoenen",
     begindatum: new Date('01-01-2025'),
     einddatum: new Date('01-01-2025'),
     begintijd: '12:00',
     eindtijd: '20:00',
     uurloon: 12,
     toeslag: false,
     toeslagtype: 0,
     toeslagpercentage:100,
    }
  });

  const selectedToeslagType = watch("toeslagtype");

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

const processForm: SubmitHandler<Inputs> = async (data) => {
  try {
    // Je zou de data kunnen mappen naar het juiste formaat voor de createVacature functie
    const vacatureInput = {
      opdrachtgever: bedrijfDetails?._id ?? "", // Bedrijf ID
      titel: data.titel, // Titel van de vacature
      opdrachtgeverNaam: bedrijfDetails?.opdrachtgeverNaam ?? "", // Naam van het bedrijf
      functie: data.functie, // Functienaam
      afbeelding: data.afbeelding, // Afbeelding die bij de vacature hoort (bijv. logo van het bedrijf)
      uurloon: data.uurloon, // Uurloon voor de functie
      adres: {
        huisnummer: data.huisnummer,
        postcode: data.postcode,
        straatnaam: street ?? data.straatnaam,
        stad: city ?? data.stad,
      }, // Adres van de werkplek
      begindatum: new Date(data.begindatum), // Startdatum van de functie
      einddatum: new Date(data.einddatum), // Einddatum van de functie
      tijden: werktijden,
      beschrijving: data.beschrijving, // Algemene beschrijving van de functie
      vaardigheden: Array.isArray(data.vaardigheden) ? data.vaardigheden : data.vaardigheden ? data.vaardigheden.split(',') : [], // Vaardigheden, controleer of het een array is
      kledingsvoorschriften: Array.isArray(data.kledingsvoorschriften) ? data.kledingsvoorschriften : data.kledingsvoorschriften ? data.kledingsvoorschriften.split(',') : [], // Kledingsvoorschriften, controleer of het een array is
      toeslagen: [{
      toeslag: data.toeslag,
      toeslagType: data.toeslagtype,
      toeslagPercentage: data.toeslagpercentage,
      toeslagVan: data.toeslagVan,
      toeslagTot: data.toeslagTot,
    }]
    };

    // Roep de createVacature functie aan om de vacature op te slaan
    const nieuweVacature = await createVacature(vacatureInput);
    console.log('Vacature succesvol aangemaakt:', nieuweVacature);
  } catch (error) {
    console.error('Fout bij het aanmaken van de vacature:', error);
  }
};

if (loading) {
  return  <div>Loading...</div>
}

return (
  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="nl">
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
                    <h2 className="text-base font-semibold leading-7 mt-10 text-gray-900">Vacature Details</h2>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                      Beschrijf de vacature
                    </p>
                    <div className="mt-10 space-y-8  pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">

                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label htmlFor="titel" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                          titel
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <input
                            type="text"
                            {...register('titel', { required: true })}
                            id="titel"
                            className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                          {errors.titel && <p className="mt-2 text-sm text-red-600">{errors.titel.message}</p>}
                        </div>
                      </div>


                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label htmlFor="functie" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                          functie
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <input
                            type="text"
                            {...register('functie', { required: true })}
                            id="functie"
                            className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                          {errors.functie && <p className="mt-2 text-sm text-red-600">{errors.functie.message}</p>}
                        </div>
                      </div>

                      <div className="mt-10 space-y-8  pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                      <label htmlFor="beschrijving" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                        beschrijving
                      </label>
                      <div className="mt-2 sm:col-span-2 sm:mt-0">
                        <textarea
                          {...register('beschrijving')}
                          id="beschrijving"
                          rows={4}
                          className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        {errors.beschrijving && <p className="mt-2 text-sm text-red-600">{errors.beschrijving.message}</p>}
                      </div>
                    </div>
                  </div>

                    <div className="mt-10 space-y-8  pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                      <label htmlFor="afbeelding" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                        afbeelding
                      </label>
                      <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <FileUploader
                        onFieldChange={(uploadedUrl: string) => setValue('afbeelding', uploadedUrl, { shouldValidate: true })}
                        imageUrl={watch('afbeelding') || ''}
                        setFiles={setFiles}
                      />  
                        {errors.afbeelding && <p className="mt-2 text-sm text-red-600">{errors.afbeelding.message}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label htmlFor="vaardigheden" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                          vaardigheden
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <input
                            type="text"
                            {...register('vaardigheden', { required: true })}
                            id="vaardigheden"
                            placeholder="nederlands, engels, met 3 borden lopen, dienblad lopen, wijn presenteren, wijn inschenken, bestellingen opnemen"
                            className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                          {errors.vaardigheden && <p className="mt-2 text-sm text-red-600">{errors.vaardigheden.message}</p>}
                        </div>
                      </div>


                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label htmlFor="kledingsvoorschriften" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                          kledingsvoorschriften
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <input
                            type="text"
                            {...register('kledingsvoorschriften', { required: true })}
                            id="kledingsvoorschriften"
                            placeholder="zwarte schoenen, zwarte broek/pantalon, wit overhemd"
                            className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                          {errors.kledingsvoorschriften && <p className="mt-2 text-sm text-red-600">{errors.kledingsvoorschriften.message}</p>}
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
                  <h2 className="text-base font-semibold leading-7 mt-10 text-gray-900">Adres </h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                    Waar gaat de vacature uitgevoerd worden ?
                  </p>
                  <div className="mt-10 space-y-8  pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">

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
                  <h2 className="text-base font-semibold leading-7 mt-10 text-gray-900">Data</h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                    Voor welke dagen en tijden zoek je personeel ?
                  </p>
                  <div className="mt-10 space-y-8  pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                  <h1 className="text-lg font-bold">Werktijden Invullen</h1>

                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                  </svg>
                    <p className="whitespace-nowrap text-grey-600">Begindatum:</p>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      dateFormat="dd/MM/yyyy"
                      wrapperClassName="datePicker"
                      />
                  </div>


                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                  </svg>

                    <p className="whitespace-nowrap text-grey-600">Einddatum:</p>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      dateFormat="dd/MM/yyyy"
                      wrapperClassName="datePicker"
                    />
                  </div>

{werktijden.map((werktijd, index) => (
  <div key={index} className="flex flex-wrap items-center gap-4 border p-4 rounded-lg">
    <div className="flex flex-col">
      <label htmlFor={`begintijd-${index}`} className="text-sm font-medium">
        Begintijd
      </label>
      <input
        type="time"
        id={`begintijd-${index}`}
        value={werktijd.begintijd}
        onChange={(e) => werkWerktijdBij(index, "begintijd", e.target.value)}
        className="border rounded px-2 py-1"
        required
      />
    </div>

    <div className="flex flex-col">
      <label htmlFor={`eindtijd-${index}`} className="text-sm font-medium">
        Eindtijd
      </label>
      <input
        type="time"
        id={`eindtijd-${index}`}
        value={werktijd.eindtijd}
        onChange={(e) => werkWerktijdBij(index, "eindtijd", e.target.value)}
        className="border rounded px-2 py-1"
        required
      />
    </div>

    <div className="flex flex-col">
      <label htmlFor={`pauze-${index}`} className="text-sm font-medium">
        Pauze (minuten)
      </label>
      <input
        type="number"
        id={`pauze-${index}`}
        value={werktijd.pauze}
        onChange={(e) => werkWerktijdBij(index, "pauze", parseInt(e.target.value))}
        className="border rounded px-2 py-1"
        min={0}
      />
    </div>

    <button
      type="button"
      onClick={() => verwijderWerktijd(index)}
      className="text-red-600 hover:underline"
    >
      Verwijderen
    </button>
  </div>
))}

<button
  type="button"
  onClick={voegWerktijdToe}
  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>
  Werktijd Toevoegen
</button>

<button
  type="submit"
  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
>
  Versturen
</button>

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
              <div className="px-8 space-y-12 sm:space-y-16">
                <div className="border-b border-gray-900/10 pb-12">
                  <h2 className="text-base font-semibold leading-7 mt-10 text-gray-900">Salaris</h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                    Wat gaat de werknemer verdienen ?
                  </p>

                  <div className="mt-10 space-y-8  pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                  <div className="mt-10 space-y-8 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="uurloon"
                  className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >
                  uurloon (€)
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <input
                    type="number"
                    {...register("uurloon", { required: "uurloon is verplicht" })}
                    id="brutoloon"
                    className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.uurloon && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.uurloon.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Toeslag Toggle */}
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="toeslagToggle"
                  className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >
                  Toeslag
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0 flex items-center">
                  <input
                    type="checkbox"
                    id="toeslagToggle"
                    {...register("toeslag")}
                    onChange={(e) => setShowToeslagFields(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="toeslagToggle"
                    className="ml-2 text-sm text-gray-600"
                  >
                    Toeslag toepassen
                  </label>
                </div>
              </div>

              {/* Toeslagvelden */}
              {showToeslagFields && (
                <div className="space-y-4">
                  {/* Type Toeslag */}
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="toeslagType"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Type toeslag
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <select
                        {...register("toeslagtype", { required: true })}
                        id="toeslagType"
                        className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        onChange={(e) => setToeslagType(e.target.value)}
                      >
                        <option value="">Selecteer</option>
                        <option value="doordeweeks">Doordeweeks</option>
                        <option value="zaterdag">Zaterdag</option>
                        <option value="zon_en_feestdagen">
                          Zon- en feestdagen
                        </option>
                      </select>
                      {errors.toeslagtype && (
                        <p className="mt-2 text-sm text-red-600">
                          Kies een type toeslag.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Percentage Toeslag */}
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="toeslagPercentage"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Percentage toeslag
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <select
                        {...register("toeslagpercentage", { required: true })}
                        id="toeslagPercentage"
                        className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option value="">Selecteer</option>
                        <option value="125">125%</option>
                        <option value="150">150%</option>
                        <option value="200">200%</option>
                      </select>
                    </div>
                  </div>

                  {/* Tijdinstellingen */}
                  {toeslagType !== "zon_en_feestdagen" || "zaterdag" && (
                    <>
                      {/* Van tijd */}
                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label
                          htmlFor="toeslagVan"
                          className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                        >
                          Van
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <input
                            type="time"
                            {...register("toeslagVan", { required: true })}
                            id="toeslagVan"
                            className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      {/* Tot tijd */}
                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label
                          htmlFor="toeslagTot"
                          className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                        >
                          Tot
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <input
                            type="time"
                            {...register("toeslagTot", { required: true })}
                            id="toeslagTot"
                            className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
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
    </LocalizationProvider>
  );
}

export default VacatureForm;