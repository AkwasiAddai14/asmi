"use client";

import { useState } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import NieuwkomerForm from "@/components/forms/NieuwkomerForm";
import BedrijfsForm from '@/components/forms/BedrijfForm';
import GemeenteForm from '@/components/forms/GemeenteForm';
import OnboardingDialog from "@/components/OnboardingDialog";
import { useRouter } from 'next/navigation';

function Page() {
  const router = useRouter()
  const [showDialog, setShowDialog] = useState(true);
  const [isNieuwkomer, setIsNieuwkomer] = useState(true);
  const [isGemeente, setIsGemeente] = useState(false);

  const handleNieuwkomerSelected = () => {
    setIsNieuwkomer(true);
    setIsGemeente(false);
    setShowDialog(false);
  };

  const handleCompanySelected = () => {
    setIsNieuwkomer(false);
    setIsGemeente(false);
    setShowDialog(false);
  };

  const handleMunicipalitySelected = () => {
    setIsNieuwkomer(false);
    setIsGemeente(true);
    setShowDialog(false);
  };

  return (
<>
      <main className="flex-grow">
        {showDialog ? (
          <OnboardingDialog
            onNieuwkomerSelected={handleNieuwkomerSelected}
            onCompanySelected={handleCompanySelected}
            onMunicipalitySelected={handleMunicipalitySelected}
          />
        ) : isGemeente ? (
          <GemeenteForm gemeente={{
            gemeente: '',
            provincie: '',
            voornaam: '',
            achternaam: '',
            postcode: '',
            huisnummer: '',
            straat: '',
            plaats: '',
            telefoonnummer: '',
            emailadres: '',
            omslagfoto: '',
            iban: '',
            pushnotifications: 'geen',
            emailberichten: {
              vacatures:false,
              kandidaten: false,
              aanbiedingen: false,
          }} 
        }/>
        ) : isNieuwkomer ? (
          <NieuwkomerForm freelancer={{
            freelancerID: undefined,
            profielfoto: "",
            voornaam: "",
            tussenvoegsel: "",
            achternaam: "",
            geboortedatum: new Date("01/01/2000"),
            emailadres: "",
            straat: "",
            stad: "",
            telefoonnummer: "",
            korregeling: false,
            btwid: "",
            iban: "",
            path: ""
          }} />
        ) : (
          <BedrijfsForm bedrijven={{
            bedrijvenID: '',
            profielfoto: '',
            naam: '',
            displaynaam: '',
            kvknr: '',
            btwnr: '',
            postcode: '',
            huisnummer: '',
            straat: '',
            stad: '',
            telefoonnummer: '',
            emailadres: '',
            iban: '',
          }} />
        )}
      </main>
    </>
  );
}
  {/* <RedirectToCreateOrganization/> */}
export default Page;

