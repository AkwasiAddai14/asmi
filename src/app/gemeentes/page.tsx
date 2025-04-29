import { CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/20/solid';
import foto from '@/images/photos/iStock-1298571081.jpg'
import Image from 'next/image';
import { SimpleLayout } from '@/components/SimpleLayout'


export default function GemeentenPage({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SimpleLayout title={''} intro={''}>
    <div className="bg-white px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-3xl text-base/7 text-gray-700">
        <p className="text-base/7 font-semibold text-sky-600">Samenwerken aan duurzame participatie</p>
        <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          Uitzendbureau voor statushouders: werk als sleutel tot integratie
        </h1>
        <p className="mt-6 text-xl/8">
          Wij helpen gemeenten bij het begeleiden van statushouders naar werk. Met persoonlijke bemiddeling, 
          aandacht voor taal en cultuur, en een breed netwerk van werkgevers zorgen we samen voor duurzame plaatsingen.
        </p>
        <div className="mt-10 max-w-2xl">
          <p>
            Statushouders willen graag aan de slag en onderdeel worden van de Nederlandse samenleving. Tegelijkertijd
            zoeken veel bedrijven gemotiveerde medewerkers. Wij slaan de brug tussen deze twee werelden, in nauwe samenwerking met uw gemeente.
          </p>
          <ul role="list" className="mt-8 max-w-xl space-y-8 text-gray-600">
            <li className="flex gap-x-3">
              <CheckCircleIcon aria-hidden="true" className="mt-1 size-5 flex-none text-sky-600" />
              <span>
                <strong className="font-semibold text-gray-900">Persoonlijke begeleiding.</strong> 
                Elke kandidaat krijgt intensieve ondersteuning bij het vinden en behouden van werk.
              </span>
            </li>
            <li className="flex gap-x-3">
              <CheckCircleIcon aria-hidden="true" className="mt-1 size-5 flex-none text-sky-600" />
              <span>
                <strong className="font-semibold text-gray-900">Taal- en werkfitheidstrainingen.</strong> 
                Waar nodig bieden we aanvullende trainingen voor taal, vakvaardigheden en werknemersvaardigheden.
              </span>
            </li>
            <li className="flex gap-x-3">
              <CheckCircleIcon aria-hidden="true" className="mt-1 size-5 flex-none text-sky-600" />
              <span>
                <strong className="font-semibold text-gray-900">Samenwerking met lokale werkgevers.</strong> 
                We beschikken over een breed netwerk van bedrijven die openstaan voor het inzetten van statushouders.
              </span>
            </li>
          </ul>
          <p className="mt-8">
            Samen zorgen we ervoor dat statushouders niet aan de zijlijn blijven staan, maar actief bijdragen aan de maatschappij.
          </p>
          <h2 className="mt-16 text-pretty text-3xl font-semibold tracking-tight text-gray-900">
            Onze aanpak: van intake tot duurzame match
          </h2>
          <p className="mt-6">
            Vanaf het eerste gesprek tot en met de nazorg werken we nauw samen met de gemeente, de kandidaat én de werkgever.
            Onze bemiddeling is maatwerk, met oog voor zowel de wensen van de kandidaat als de eisen van de werkgever.
          </p>
          <figure className="mt-10 border-l border-sky-600 pl-9">
            <blockquote className="font-semibold text-gray-900">
              <p>
                “Door de samenwerking met dit uitzendbureau hebben we meerdere statushouders succesvol kunnen plaatsen. 
                Het persoonlijke contact en de begeleiding maken echt het verschil.”
              </p>
            </blockquote>
            <figcaption className="mt-6 flex gap-x-4">
              <img
                alt="Contactpersoon gemeente"
                src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                className="size-6 flex-none rounded-full bg-gray-50"
              />
              <div className="text-sm/6">
                <strong className="font-semibold text-gray-900">Sophie Jansen</strong> – Consulent Werk & Participatie
              </div>
            </figcaption>
          </figure>
          <p className="mt-10">
            Wilt u als gemeente meer weten over onze aanpak of samenwerkingsmogelijkheden? Neem gerust contact met ons op voor een vrijblijvend gesprek.
          </p>
        </div>
        <figure className="mt-16">
          <Image
            alt="Statushouders aan het werk"
            src={foto}
            className="aspect-video rounded-xl bg-gray-50 object-cover"
          />
          <figcaption className="mt-4 flex gap-x-2 text-sm/6 text-gray-500">
            <InformationCircleIcon aria-hidden="true" className="mt-0.5 size-5 flex-none text-gray-300" />
            Werk als sleutel tot integratie en participatie.
          </figcaption>
        </figure>
        <div className="mt-16 max-w-2xl">
          <h2 className="text-pretty text-3xl font-semibold tracking-tight text-gray-900">
            Meer weten over samenwerking?
          </h2>
          <p className="mt-6">
            Neem contact op met ons team en ontdek hoe we samen statushouders duurzaam kunnen begeleiden naar werk.
            Wij denken graag met u mee over passende trajecten.
          </p>
        </div>
      </div>
    </div>
    </SimpleLayout>
  );
}
