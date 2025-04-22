import { z } from 'zod';
import axios from 'axios';
import router from 'next/router';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useUploadThing } from '@/lib/uploadthing';
import { useOrganizationList } from "@clerk/nextjs";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { maakGemeente } from '@/lib/actions/gemeente.actions';
import { GemeenteValidation } from '@/lib/validations/gemeente';
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';

type Inputs = z.infer<typeof GemeenteValidation>;

interface Props {
  gemeente: {
    gemeente: string;
    provincie: string;
    plaats: string;
    voornaam: string;
    achternaam: string;
    emailadres: string;
    telefoonnummer: string;
    straat: string;
    postcode: string;
    huisnummer: string;
    omslagfoto: string;
    iban: string;
    pushnotifications: 'geen';
    emailberichten: {
      vacatures:boolean,
      kandidaten: boolean,
      aanbiedingen: boolean,
    }
  };
}

const GemeenteForm: React.FC<Props> = ({ gemeente }) => {
  const { createOrganization } = useOrganizationList();
  const { isLoaded, user } = useUser();
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("media");
  const [loading, setLoading] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');

  const fetchAddressData = async (postcode: string, huisnummer: string) => {
    try {
      const url = `/api/postcode?postcode=${postcode}&huisnummer=${huisnummer}`;
  
      const response = await axios.get(url);
  
      const { street, city } = response.data;
  
      setStreet(street);
      setCity(city);
  
      setValue('straat', street);
      setValue('plaats', city);
    } catch (error) {
      console.error('Error fetching address data:', error);
    }
  };

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
    resolver: zodResolver(GemeenteValidation),
    defaultValues: {
      gemeente: gemeente.gemeente,
      voornaam: gemeente?.voornaam || user?.firstName || user?.fullName || "",
      achternaam: gemeente?.achternaam || user?.lastName || "",
      iban: gemeente?.iban || "",
      emailadres: gemeente?.emailadres || user?.emailAddresses[0].emailAddress || "",
      telefoonnummer: gemeente?.telefoonnummer || getUserPhoneNumber(user) || "",
      omslagfoto: user?.imageUrl || gemeente.omslagfoto || "",
    
      pushnotifications: gemeente?.pushnotifications || 'geen', // ✅ fix
    
      emailNotificaties: {
        vacatures: gemeente?.emailberichten?.vacatures || false,
        kandidaten: gemeente?.emailberichten?.kandidaten || false,
        aanbiedingen: gemeente?.emailberichten?.aanbiedingen || false,
      },
    }});

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

  const processForm: SubmitHandler<Inputs> = async (data) => {

    let uploadedImageUrl = data.omslagfoto;

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


    user?.update({
      unsafeMetadata: { typeGebruiker: 'gemeente' },
    })

    await maakGemeente({
      gemeente: data.gemeente || "0000",
      provincie: data.provincie,
      voornaam: data.voornaam || user?.firstName || user?.fullName ||"",
      achternaam: data.achternaam || user?.lastName || "",
      emailadres: data.emailadres ||  user?.emailAddresses[0].emailAddress || "",
      telefoonnummer: data.telefoonnummer || getUserPhoneNumber(user) || "",
      postcode: data.postcode || "",
      huisnummer: data.huisnummer || "",
      straat: data.straat || "",
      plaats: data.plaats,
      iban: data.iban || "",
      omslagfoto: data.omslagfoto || user?.imageUrl,
      pushnotifications: data.pushnotifications,
      emailNotificaties: {
        vacatures: data.emailNotificaties.vacatures,
        kandidaten: data.emailNotificaties.kandidaten,
        aanbiedingen: data.emailNotificaties.aanbiedingen,
      }
    });
    if (createOrganization) {
      await createOrganization({ name: data.gemeente});
  } else {
      console.error("createOrganization function is undefined");
  }
    setLoading(false)
    router.push("../dashboard")
  };

  if (loading) {
    return  <div>Loading...</div>
  }

  return (
    <form onSubmit={handleSubmit(processForm)} className="relative my-8  items-center rounded-lg bg-white shadow-lg ring-1 ring-black/5">
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">Profile</h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            This information will be displayed publicly so be careful what you share.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="gemeente" className="block text-sm/6 font-medium text-gray-900">
                Gemeente
              </label>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white pl-3  outline-1 -outline-offset-1 outline-gray-300  focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                  <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6">workcation.com/</div>
                  <input
                    id="gemeente"
                    {...register('gemeente', { required: true })}
                    name="gemeente"
                    type="text"
                    placeholder="Zwijndrecht"
                    className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400  focus:outline-0 sm:text-sm/6"
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="provincie" className="block text-sm/6 font-medium text-gray-900">
                Provincie
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  id="provincie"
                  {...register('provincie', { required: true })}
                  name="provincie"
                  autoComplete="provincie-name"
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                >
                  <option>Noord-Holland</option>
                  <option>Zuid-Holland</option>
                  <option>Utrecht</option>
                  <option>Flevoland</option>
                  <option>Friesland</option>
                  <option>Groningen</option>
                  <option>Drenthe</option>
                  <option>Gelderland</option>
                  <option>Overijssel</option>
                  <option>Limburg</option>
                  <option>Noord-Brabant</option>
                  <option>Zeeland</option>
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="photo" className="block text-sm/6 font-medium text-gray-900">
                Photo
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <UserCircleIcon aria-hidden="true" className="size-12 text-gray-300" />
                <button
                  type="button"
                  className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Change
                </button>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="cover-photo" className="block text-sm/6 font-medium text-gray-900">
                Omslagfoto
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
                  <div className="mt-4 flex text-sm/6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-sky-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-sky-600 focus-within:ring-offset-2 hover:text-sky-500"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">Contactpersoon</h2>
          <p className="mt-1 text-sm/6 text-gray-600">Use a permanent address where you can receive mail.</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="first-name" className="block text-sm/6 font-medium text-gray-900">
                Voornaam
              </label>
              <div className="mt-2">
                <input
                  id="first-name"
                  {...register('voornaam', { required: true })}
                  name="first-name"
                  type="text"
                  autoComplete="given-name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="achternaam" className="block text-sm/6 font-medium text-gray-900">
                Achternaam
              </label>
              <div className="mt-2">
                <input
                  id="achternaam"
                  {...register('achternaam', { required: true })}
                  name="achternaam"
                  type="text"
                  autoComplete="achternaam"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="emailadres" className="block text-sm/6 font-medium text-gray-900">
                Emailadres
              </label>
              <div className="mt-2">
                <input
                  id="emailadres"
                  {...register('emailadres', { required: true })}
                  name="emailadres"
                  type="emailadres"
                  autoComplete="emailadres"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="postcode" className="block text-sm/6 font-medium text-gray-900">
                Postcode
              </label>
              <div className="mt-2">
                <input
                  id="postcode"
                  {...register('postcode', { required: true })}
                  name="postcode"
                  type="text"
                  autoComplete="postcode"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="huisnummer" className="block text-sm/6 font-medium text-gray-900">
                Huisnummer
              </label>
              <div className="mt-2">
                <input
                  id="huisnummer"
                  {...register('huisnummer', { required: true })}
                  name="huisnummer"
                  type="text"
                  autoComplete="huisnummer"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="staatnaam" className="block text-sm/6 font-medium text-gray-900">
                Straatnaam
              </label>
              <div className="mt-2">
                <input
                  id="straatnaam"
                  {...register('straat', { required: true })}
                  name="straatnaam"
                  type="text"
                  autoComplete="straatnaam"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label htmlFor="plaats" className="block text-sm/6 font-medium text-gray-900">
                Plaats
              </label>
              <div className="mt-2">
                <input
                  id="plaats"
                  {...register('plaats', { required: true })}
                  name="plaats"
                  type="text"
                  autoComplete="plaats"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                />
              </div>
            </div>

          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">Meldingen</h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            We zullen in communicatie blijven omtrent de nieuwkomers en de vacatures in uw gemeente. Vertel ons uw voorkeuren.
          </p>

          <div className="mt-10 space-y-10">
            <fieldset>
              <legend className="text-sm/6 font-semibold text-gray-900">Via email</legend>
              <div className="mt-6 space-y-6">
                <div className="flex gap-3">
                  <div className="flex h-6 shrink-0 items-center">
                    <div className="group grid size-4 grid-cols-1">
                      <input
                        defaultChecked
                        id="vacatures"
                        {...register('emailNotificaties.vacatures', { required: true })}
                        name="vacatures"
                        type="checkbox"
                        aria-describedby="vacatures"
                        className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-sky-600 checked:bg-sky-600 indeterminate:border-sky-600 indeterminate:bg-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                      />
                      <svg
                        fill="none"
                        viewBox="0 0 14 14"
                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                      >
                        <path
                          d="M3 8L6 11L11 3.5"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-[:checked]:opacity-100"
                        />
                        <path
                          d="M3 7H11"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-[:indeterminate]:opacity-100"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm/6">
                    <label htmlFor="comments" className="font-medium text-gray-900">
                      Vacatures
                    </label>
                    <p id="vacatures" className="text-gray-500">
                      Krijg een bericht wanneer er een vacature beschikbaar komt in uw regio.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-6 shrink-0 items-center">
                    <div className="group grid size-4 grid-cols-1">
                      <input
                        id="kandidaten"
                        {...register('emailNotificaties.kandidaten', { required: true })}
                        name="kandidaten"
                        type="checkbox"
                        aria-describedby="candidates-description"
                        className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-sky-600 checked:bg-sky-600 indeterminate:border-indigo-600 indeterminate:bg-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                      />
                      <svg
                        fill="none"
                        viewBox="0 0 14 14"
                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                      >
                        <path
                          d="M3 8L6 11L11 3.5"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-[:checked]:opacity-100"
                        />
                        <path
                          d="M3 7H11"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-[:indeterminate]:opacity-100"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm/6">
                    <label htmlFor="kandidaten" className="font-medium text-gray-900">
                      Kandidaten
                    </label>
                    <p id="kandidaten" className="text-gray-500">
                      Krijg een bericht wanneer een kandidaat een aanbieding krijgt.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-6 shrink-0 items-center">
                    <div className="group grid size-4 grid-cols-1">
                      <input
                        id="aanbiedingen"
                        {...register('emailNotificaties.aanbiedingen', { required: true })}
                        name="aanbiedingen"
                        type="checkbox"
                        aria-describedby="offers-description"
                        className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-sky-600 checked:bg-sky-600 indeterminate:border-sky-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                      />
                      <svg
                        fill="none"
                        viewBox="0 0 14 14"
                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                      >
                        <path
                          d="M3 8L6 11L11 3.5"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-[:checked]:opacity-100"
                        />
                        <path
                          d="M3 7H11"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-[:indeterminate]:opacity-100"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm/6">
                    <label htmlFor="aanbiedingen" className="font-medium text-gray-900">
                      Aanbiedingen
                    </label>
                    <p id="aanbiedingen" className="text-gray-500">
                      Krijg een bericht wanneer een kandidaat een aanbieding accepteert of weigert. 
                    </p>
                  </div>
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm/6 font-semibold text-gray-900">Push notifications</legend>
              <p className="mt-1 text-sm/6 text-gray-600">Deze meldingen worden rechtstreeks naar uw telefoon gestuurd.</p>
              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-x-3">
                  <input
                    defaultChecked
                    id="push-everything"
                    {...register('pushnotifications', { required: true })}
                    name="push-notifications"
                    type="radio"
                    className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-sky-600 checked:bg-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                  />
                  <label htmlFor="push-everything" className="block text-sm/6 font-medium text-gray-900">
                    Alles
                  </label>
                </div>
                <div className="flex items-center gap-x-3">
                  <input
                    id="push-email"
                    {...register('pushnotifications', { required: true })}
                    name="push-notifications"
                    type="radio"
                    className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-sky-600 checked:bg-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                  />
                  <label htmlFor="push-email" className="block text-sm/6 font-medium text-gray-900">
                    Hetzelfde als email
                  </label>
                </div>
                <div className="flex items-center gap-x-3">
                  <input
                    id="push-nothing"
                    {...register('pushnotifications', { required: true })}
                    name="push-notifications"
                    type="radio"
                    className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-sky-600 checked:bg-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                  />
                  <label htmlFor="push-nothing" className="block text-sm/6 font-medium text-gray-900">
                    geen pushnotificatie
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm/6 font-semibold text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
        >
          Save
        </button>
      </div>
    </form>
  )
}

export default GemeenteForm;