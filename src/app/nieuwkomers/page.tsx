import { BriefcaseIcon, UserGroupIcon, AcademicCapIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import foto from '@/images/photos/iStock-2149706236.jpg'
const features = [
  {
    name: 'Begeleiding naar passend werk.',
    description:
      'Wij helpen je bij het vinden van een baan die past bij jouw talenten en interesses. Samen kijken we welke stappen nodig zijn om aan de slag te gaan.',
    icon: BriefcaseIcon,
  },
  {
    name: 'Persoonlijke ondersteuning.',
    description:
      'Onze coaches staan voor je klaar tijdens het hele traject. We begeleiden je bij sollicitaties, gesprekken met werkgevers en de eerste periode op de werkvloer.',
    icon: UserGroupIcon,
  },
  {
    name: 'Taal- en vaardigheidstrainingen.',
    description:
      'We bieden ondersteuning bij het verbeteren van je Nederlandse taal en helpen je met trainingen die jouw kansen op werk vergroten.',
    icon: AcademicCapIcon,
  },
];

export default function StatushoudersPage({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:ml-auto lg:pl-4 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-sky-600">Samen bouwen aan jouw toekomst</h2>
              <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                Aan de slag in Nederland
              </p>
              <p className="mt-6 text-lg/8 text-gray-600">
                Wil jij graag werken, ervaring opdoen en deel uitmaken van de Nederlandse samenleving? 
                Wij begeleiden jou stap voor stap naar werk dat bij jou past.
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
          <div className="flex items-start justify-end lg:order-first">
            <Image
              alt="Statushouder aan het werk"
              src={foto}
              width={2432}
              height={1442}
              className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
