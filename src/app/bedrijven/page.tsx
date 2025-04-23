import foto from '@/images/photos/iStock-1298571081.jpg'
import Image from 'next/image';
import { AcademicCapIcon, UserGroupIcon, PresentationChartLineIcon, InformationCircleIcon } from '@heroicons/react/20/solid'

const features = [
  {
    name: 'Gemotiveerde medewerkers.',
    description:
      'Wij verbinden u met enthousiaste statushouders die graag aan de slag willen en gemotiveerd zijn om zich verder te ontwikkelen.',
    icon: UserGroupIcon,
  },
  {
    name: 'Begeleiding op maat.',
    description: 'Van sollicitatietrainingen tot begeleiding op de werkvloer — wij zorgen ervoor dat elke kandidaat goed voorbereid aan de slag kan.',
    icon: AcademicCapIcon,
  },
  {
    name: 'Maatwerk en advies.',
    description: 'We denken met u mee over passende trajecten, subsidies en begeleiding die aansluiten bij uw organisatie.',
    icon: PresentationChartLineIcon,
  },
]

export default function BedrijvenPage() {
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:grid-cols-2 lg:items-start">
          <div className="px-6 lg:px-0 lg:pr-4 lg:pt-4">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-sky-600">Samenwerken aan kansen</h2>
              <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                Statushouders aan het werk: versterk uw team én de samenleving
              </p>
              <p className="mt-6 text-lg/8 text-gray-600">
                Bent u op zoek naar gemotiveerde medewerkers? Wij helpen u bij het vinden van geschikte kandidaten onder statushouders en nieuwkomers.
                Met aandacht voor begeleiding, taal en werkfitheid zorgen we voor duurzame matches tussen bedrijven en medewerkers.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon aria-hidden="true" className="absolute left-1 top-1 size-5 text-sky-600" />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="sm:px-6 lg:px-0">
              <div className="mx-auto max-w-2xl sm:mx-0 sm:max-w-none">
              <figure className="mt-16">
        <Image
          alt="Statushouders aan het werk"
          src={foto}
          width={2432}
          height={1442}
          className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:ml-0"
        />
        <figcaption className="mt-4 flex gap-x-2 text-sm/6 text-gray-500">
          <InformationCircleIcon aria-hidden="true" className="mt-0.5 size-5 flex-none text-gray-300" />
          Werk als sleutel tot integratie en participatie.
        </figcaption>
      </figure>
              </div>
             {/*  <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 sm:rounded-3xl"
              /> */}
          </div>
        </div>
      </div>
    </div>
  )
}
