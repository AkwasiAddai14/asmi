"use client"

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { DeleteConfirmation } from '@/components/DeleteConfirmation';
import { IVacature } from '@/lib/models/vacature.model';
import { isBedrijf } from '@/lib/actions/bedrijf.actions';
import { IDienst } from '@/lib/models/dienst.model';
import { haalBijbehorendeDiensten } from '@/lib/actions/vacature.actions';

type CardProps = {
  vacature: IVacature;
};

const Card = ({ vacature }: CardProps) => {

  const [isEenBedrijf, setIsEenBedrijf] = useState<boolean | undefined>(false);
  const [diensten, setDiensten] = useState<IDienst[]>([]);

  useEffect(() => {
    if (vacature && vacature.id) {  // Only fetch shifts if bedrijfId is available
      const fetchDiensten = async () => {
        try {
          const diensten = await haalBijbehorendeDiensten({ vacatureId: vacature.id });
          setDiensten(diensten || []);  // Ensure diensten is always an array
        } catch (error) {
          console.error('Error fetching diensten:', error);
          setDiensten([]);  // Handle error by setting an empty array
        }
      };
      fetchDiensten();
    }
  }, [vacature.id]);

  useEffect(() => {
    const bedrijfCheck = async () => {
      try {
        const isEventCreator = await isBedrijf();
        setIsEenBedrijf(isEventCreator);
      } catch (error) {
        console.error("Error checking if user is a bedrijf:", error);
      }
    };
  
    bedrijfCheck();
  }, []);

  const calculateTotalBedrag = (diensten: IDienst[]): number => {
    return diensten.reduce((total, dienst) => total + (dienst.bedrag || 0), 0);
  };
  const backgroundImageUrl = vacature.afbeelding;
  const totaalbedrag = calculateTotalBedrag(diensten);
    
  


  return (
    <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
        <Link 
      href={`/dashboard/vacture/${vacature._id}`}
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500"
    />

      {isEenBedrijf && (
        <div className="absolute items-stretch right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
          <DeleteConfirmation shiftId={vacature._id as string} />
        </div>
      ) 
}

      <div className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4">
        <div className="flex gap-2">
            { isEenBedrijf ?  (
                 <span className="p-semibold-14 w-min rounded-full line-clamp-1 bg-green-100 px-4 py-1 text-green-60">
                 €{vacature.uurloon}
               </span>
            ) : (
                <span className="p-semibold-14 w-min rounded-full line-clamp-1 bg-green-100 px-4 py-1 text-green-60">
                €{totaalbedrag} voor {vacature.diensten?.length || 0} diensten 
              </span>
            )
        }
          <p className="p-semibold-14 w-min rounded-full bg-grey-500/10 px-4 py-1 text-grey-500 line-clamp-1">
            {vacature.functie}
          </p> 
          
          {
            isEenBedrijf && (
                <p className="text-sm md:p-medium-16 text-grey-600 line-clamp-1">
                {vacature.diensten?.length || 0} diensten 
               </p>
            )
          }
          <p className="text-sm md:p-medium-16 text-grey-600 line-clamp-1">
           {vacature.sollicitaties?.length || 0} sollicitaties 
          </p>
        </div>


        {
        vacature.beschikbaar && (
             <div className="flex-between w-full">
                <p className="p-medium-16 p-medium-18 text-grey-500">
                  {new Intl.DateTimeFormat('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(vacature.begindatum))} tot 
                </p>
                <p className="p-medium-16 p-medium-18 text-grey-500">
                {new Intl.DateTimeFormat('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(vacature.einddatum))}
                </p>
            </div>
                  )
                }
          
        
          <Link href={`/dashboard/vacture/${vacature._id}`}>
          <p className="p-medium-16 md:p-medium-20 line-clamp-1 flex-1 text-black">{vacature.titel}</p>
        </Link>
      

        <div className="flex-between w-full"></div>
        <p className="line-clamp-1 p-medium-14 md:p-medium-16 text-grey-600">
          {vacature.adres.straatnaam} {vacature.adres.huisnummer}
          {vacature.adres.postcode} {vacature.adres.stad}
          </p> 
          
          {!isEenBedrijf && (
               <div className="flex-between w-full">
               {vacature.kledingsvoorschriften?.length === 1 ? (
                    <p className="line-clamp-1 p-medium-14 md:p-medium-16 text-grey-600">
                   {vacature.kledingsvoorschriften.length} kledingsvoorschrift
                   </p>
               ) : (
                   <p className="line-clamp-1 p-medium-14 md:p-medium-16 text-grey-600">
                   {vacature.kledingsvoorschriften?.length || 0} kledingsvoorschriften
                   </p>
               )}
              
              {vacature.kledingsvoorschriften?.length === 1 ? (
                    <p className="line-clamp-1 p-medium-14 md:p-medium-16 text-grey-600">
                   {vacature.vaardigheden?.length} vaardigheid
                   </p>
               ) : (
                   <p className="line-clamp-1 p-medium-14 md:p-medium-16 text-grey-600">
                   {vacature.vaardigheden?.length || 0} vaardigeheden
                   </p>
               )}
           </div>
          )}
     
      </div>
    </div>
  );
};

export default Card;