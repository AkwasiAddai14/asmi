'use client'

import { StarIcon } from '@heroicons/react/24/outline';
import { werknemerAfzeggen } from '@/lib/actions/vacature.actions';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

interface DienstenSectiePageProps {
    diensten: [{
      dienstId: string;
    opdrachtgever: string;
    vacature: string;
    datum: string;
    werktijden: {
        begintijd: string,
        eindtijd: string,
        pauze: number;
    }
    opdrachtnemers: [{
        freelancerId: string;
        naam: string;
        profielfoto: string
        rating: number;
        geboortedatum: string;
        klussen: number;
        emailadres: string;
        telefoonnummer: string;
        stad: string;
    }],
    bedrag: number,
    status: string,
    index: number,
    }]
}
  
  export default function Dienstensectie( { diensten }: DienstenSectiePageProps) {
    const { toast } = useToast();
    const router = useRouter();

    const afzeggenWerknemer = async (arg0: { dienstId: any; freelancerId: any; }) => {

      const response = await werknemerAfzeggen(arg0);
      if (response.success){
        toast({
          variant: 'succes',
          description: "Werkenemer afgemeld voor de dienst! "
        });
        router.refresh();
      } else {
        toast({
          variant: 'destructive',
          description: `Actie is niet toegestaan! ${response.message}`
        });
        throw new Error('Het annuleren van werknemer niet mogelijk. Neem contact op voor vragen.');
      }
      
    }

    return (
        <>
          {diensten.map((dienst) => (
            <div key={dienst.datum} className="px-4 sm:px-6 lg:px-8">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h1 className="text-base font-semibold text-gray-900">{dienst.datum}</h1>
                  <p className="mt-2 text-sm text-gray-700">
                    {dienst.werktijden.begintijd} - {dienst.werktijden.eindtijd}
                  </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                  <button
                    type="button"
                    className="block rounded-md bg-sky-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                  >
                    Aanpassen
                  </button>
                </div>
              </div>
    
              <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                            Werknemer
                          </th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Woonplaats
                          </th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Klussen
                          </th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Beoordelingen
                          </th>
                          <th className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                            <span className="sr-only">Aanpassen</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {dienst.opdrachtnemers.map((opdrachtnemer) => (
                          <tr key={opdrachtnemer.freelancerId}>
                            <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                              <div className="flex items-center">
                                <div className="size-11 shrink-0">
                                  <img
                                    alt={opdrachtnemer.naam}
                                    src={opdrachtnemer.profielfoto}
                                    className="size-11 rounded-full"
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="font-medium text-gray-900">{opdrachtnemer.naam}</div>
                                  <div className="mt-1 text-gray-500">{opdrachtnemer.geboortedatum}</div>
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                              {opdrachtnemer.stad}
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              <div className="mt-1 text-gray-500 flex items-center">
                                {opdrachtnemer.rating}
                                <StarIcon aria-hidden="true" className="size-6 text-yellow-400 ml-1" />
                              </div>
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                            <div className="text-gray-900">{opdrachtnemer.klussen} voltooid</div>
                            </td>
                            <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                              <button 
                              onClick={()=> {afzeggenWerknemer({ dienstId: dienst.dienstId, freelancerId: opdrachtnemer.freelancerId })}}
                              className="inline-flex items-center rounded-md bg-sky-50 px-2 py-1 text-xs font-medium text-sky-600 hover:text-sky-900 ring-1 ring-inset ring-sky-600/20">
                                Afzeggen<span className="sr-only">, {opdrachtnemer.naam}</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      );
  }
  