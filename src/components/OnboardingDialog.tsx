'use client'

import Image from 'next/image';
import werkzoekende from '@/images/photos/nieuwkomer.png';
import bedrijf from '@/images/photos/bedrijf.png';
import gemeente from '@/images/photos/gemeente.png'
 

interface OnboardingDialogProps {
  onNieuwkomerSelected: () => void;
  onCompanySelected: () => void;
  onMunicipalitySelected: () => void;
}

  
  export default function OnboardingDialog({ onNieuwkomerSelected, onCompanySelected, onMunicipalitySelected }: OnboardingDialogProps) {

    const buttons = [
      {
        id: 1,
        title: 'Gemeente',
        href: onMunicipalitySelected,
        description:
          'Beheer eenvoudig accounts, plaats vacatures en help inwoners sneller aan werk. Als gemeente speel je een centrale rol in het verbinden van mensen met kansen.',
          imageUrl: gemeente
      },
      {
        id: 2,
        title: 'Werkgever',
        onClick: onCompanySelected,
        description:
          'Plaats opdrachten, vind direct geschikte kandidaten en bouw aan een flexibele schil van talent. Als werkgever heb je volledige controle over je personeelsbehoeften.',
          imageUrl: bedrijf,
      },
      {
        id: 3,
        title: 'Werkzoekende',
        OnClick: onNieuwkomerSelected,
        description:
          'Ontdek opdrachten die bij je passen, werk wanneer het jou uitkomt en krijg snel uitbetaald. Als werkzoekende ben jij in controle over jouw werkweek.',
          imageUrl: werkzoekende,
      }
    ]

    return (
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Aanmelden
            </h2>
            <p className="mt-2 text-lg/8 text-gray-600">Kies het type account dat bij jou past.</p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {buttons.map((button) => (
              <article
                key={button.id}
                className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
              >
                <button
                type="button"
                className="absolute inset-0 -z-10 size-full"
                onClick={button.onClick}
              >
                <Image
                  alt={button.title}
                  src={button.imageUrl}
                  fill
                  className="object-cover rounded-2xl"
                  sizes="100vw"
                />
              </button>
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
                <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />


                <h3 className="mt-3 text-lg/6 font-semibold text-white">
                    <span className="absolute inset-0" />
                    {button.title}
                </h3>

                <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm/6 text-gray-300">
                  <div className="-ml-4 flex items-center gap-x-4">
                    <svg viewBox="0 0 2 2" className="-ml-0.5 size-0.5 flex-none fill-white/50">
                      <circle r={1} cx={1} cy={1} />
                    </svg>
                    <div className="flex gap-x-2.5">
                      {button.description}
                    </div>
                  </div>
                </div>
                
              </article>
            ))}
          </div>
        </div>
      </div>
    )
  }
  