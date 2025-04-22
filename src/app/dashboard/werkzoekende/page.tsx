"use client"

import * as React from "react";

import FactuurCard from '@/components/cards/FactuurCard'; 
import { Button } from '@/components/ui/button'
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUser } from "@clerk/nextjs"
import mongoose from "mongoose"
import { useEffect, useState } from "react"
import { haalFlexpoolFreelancer } from "@/lib/actions/flexpool.actions"
import {  Bars3Icon, BellIcon, CalendarIcon, FolderIcon, UsersIcon, XMarkIcon, CurrencyEuroIcon, HomeIcon, ClockIcon} from '@heroicons/react/24/outline'
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Fragment } from "react"
import UitlogModal from "@/components/UitlogModal"
import logo from '@/images/photos/178884748_padded_logo.png';
import Image from 'next/image'; 
import { Calendar } from "@/components/ui/calendar"
import  Calender  from "@/app/dashboard/werkzoekende/calender/calender"
import { Dialog, Menu, MenuButton, MenuItems, } from '@headlessui/react'
import { haalFreelancer } from "@/lib/actions/nieuwkomer.actions"
import { haalFacturenFreelancer } from "@/lib/actions/factuur.actions"
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { IVacature } from '@/lib/models/vacature.model';
import { haalDienstenFreelancer, haalRelevanteVacatures, haalSollicitatiesFreelancer } from "@/lib/actions/vacature.actions";
import VacatureCard from "@/components/cards/VacatureCard";
import DienstCard from "@/components/cards/DienstCard";
import FlexpoolCard from "@/components/cards/FlexpoolCard";

const MAX = 100;
const MIN = 0;
const euromarks = [
  {
    value: MIN,
    label: '',
  },
  {
    value: MAX,
    label: '',
  },
];

const distancemarks = [
  {
    value: MIN,
    label: '',
  },
  {
    value: MAX,
    label: '',
  },
];

const navigation = [
  { name: 'Shifts', value: 'Shifts', icon: HomeIcon },
  { name: 'Aanmeldingen', value: 'Aanmeldingen', icon: CalendarIcon },
  { name: 'Geaccepteerde shifts', value: 'Geaccepteerde shifts', icon: FolderIcon },
  { name: 'Checkouts', value: 'Checkouts', icon: ClockIcon },
  { name: 'Facturen', value: 'Facturen', icon: CurrencyEuroIcon },
  { name: 'Flexpools', value: 'Flexpools', icon: UsersIcon },
];


const userNavigation = [
  { name: 'Profiel', href: '#' },
  { name: 'Uitloggen', href: '#' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}



export default function Example() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoaded, user } = useUser();
  const [position, setPosition] = React.useState("Shifts");
  const [vacatures, setVacatures] = useState<IVacature[]>([]);
  const [factuur, setFactuur] = useState<any[]>([]);
  const [flexpool, setFlexpool] = useState<any[]>([]);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [fullName, setFullName] = useState<string | null>(null); 
  const [showLogOut, setShowLogOut] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [tarief, setTarief] = useState<number>(14);
  const [afstand, setAfstand] = useState<number>(5);
  const [freelancerId, setFreelancerId] = useState<string>("");
  const [diensten, setDiensten] = useState<any[]>([]);
  const [sollicitaties, setSollicitaties] = useState <any[]>([]);
  const [freelancer, setFreelancer] = useState<any>(null);
  const [euroVal, setEuroVal] = React.useState<number>(MIN);
  const handleUurtariefChange = (_: Event, newValue: number | number[]) => {
    setEuroVal(newValue as number);
    setTarief(euroVal);
  };
  const [distanceVal, setDistanceVal] = React.useState<number>(MIN);
  const handleAfstandChange = (_: Event, newValue: number | number[]) => {
    setDistanceVal(newValue as number);
    setAfstand(distanceVal);
  };
  
  
  useEffect(() => {
    if (isLoaded && user) {
      setFullName(user.fullName);
      setProfilePhoto(user.imageUrl);
    }
  }, [isLoaded, user]);

  useEffect(() => {
    const getFreelancerId = async () => {
      try {
        const freelancer = await haalFreelancer(user!.id);
        
        if (freelancer) {
          setFreelancer(freelancer);
        } else{
          console.log("geen freelancerId gevonden.")
        }
      } catch (error) {
        console.error("Error fetching freelancer by Clerk ID:", error);
      }
    };
  
    if (user && !freelancerId) {  // Only fetch if user exists and freelancerId is not already set
      getFreelancerId();
    }
  }, [freelancerId]);


  useEffect(() => {
  
      const fetchVacatures = async () => {
        try {
          const vacatures = await haalRelevanteVacatures(freelancerId as unknown as mongoose.Types.ObjectId);
          setVacatures(vacatures || []);
          if (vacatures) {
            // Sort the shifts by date
            
            const sortedVacatures = vacatures.sort((a: any, b: any) => {
              return new Date(a.begindatum).getTime() - new Date(b.begindatum).getTime(); // Ascending order
            });
            console.log(sortedVacatures)
            setVacatures(sortedVacatures); // Set the sorted vacatures
          } else {
            setVacatures([]); // Handle case where vacatures is empty or null
          }
        } catch (error) {
          console.error('Error fetching vacature:', error);
          setVacatures([]);
        }
      };
      fetchVacatures();
    
  }, [freelancerId]); 

  
  useEffect(() => {
    const fetchFactuur = async () => {
      try {
        const response = await haalFacturenFreelancer(freelancerId);
        setFactuur(response || []);
      } catch (error) {
        console.error('Error fetching factuur:', error);
      }
    };
    
    fetchFactuur();
  }, [freelancerId]); 

  useEffect(() => {
    const fetchDiensten = async () => {
      try {
        const response = await haalDienstenFreelancer(freelancerId);
        setDiensten(response || []);
      } catch (error) {
        console.error('Error fetching factuur:', error);
      }
    };
    
    fetchDiensten();
  }, [freelancerId]);

  useEffect(() => {
    const fetchSollicitaties = async () => {
      try {
        const response = await haalSollicitatiesFreelancer(freelancerId);
        setSollicitaties(response || []);
      } catch (error) {
        console.error('Error fetching sollicitaties:', error);
      }
    };
    
    fetchSollicitaties();
  }, [freelancerId]);
   
    useEffect(() => {
      const fetchFlexpool = async () => {
        try {        
          const flexpools = await haalFlexpoolFreelancer(freelancerId || user?.id as string);
          setFlexpool(flexpools || []);
        } catch (error){
          console.log('Error fetching flexpools:', error);
          setFlexpool([]);
          }
      }
        fetchFlexpool();
      }, [freelancerId]);
 

const MenuSluiten = (value: string) => {
  setPosition(value);
  setSidebarOpen(false);
}

  
  return (
    <Fragment>
    <>
      <div>
      <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80" />
          <div className="fixed inset-0 flex">
            <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-900 pb-2">
              <div className="absolute right-0 flex items-center pt-5">
                <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                  <XMarkIcon aria-hidden="true" className="h-6 w-6 text-white" />
                </button>
              </div>

              <div className="flex grow flex-col gap-y-5 overflow-y-auto">
                <div className="flex h-16 shrink-0 items-center justify-center">
                <Image 
                className="h-8 w-auto rounded-full"
                width={8}
                height={8} 
                src={logo} 
                alt="Junter logo" /> {/* Use Image component for optimized images */}
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="-mx-2  ml-4 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <button
                          onClick={() => MenuSluiten(item.value)}
                          className={classNames(
                            position === item.value ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                            'group flex w-full items-center gap-x-3 rounded-md p-2 text-sm font-semibold'
                            )}
                            >
                          <item.icon aria-hidden="true" className="h-6 w-6" />
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-20 lg:overflow-y-auto lg:bg-gray-900 lg:pb-4">
          <div className="flex h-16 shrink-0 items-center justify-center">
            <Image
              alt="Junter"
              src={logo}
              className="h-8 w-auto rounded-full"
              width={8}
              height={8}
              />
          </div>
          <nav className="flex grow flex-col items-center space-y-1 pt-5">
            {navigation.map((item) => (
              <button
              key={item.name}
              onClick={() => MenuSluiten(item.value)}
              className={classNames(
                position === item.value ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                'group flex w-full items-center justify-center gap-x-3 rounded-md p-3 text-sm font-semibold'
                )}
                >
                <item.icon aria-hidden="true" className="h-6 w-6" />
                <span className="sr-only">{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="lg:pl-20">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>

            {/* Separator */}
            <div aria-hidden="true" className="h-6 w-px bg-gray-900/10 lg:hidden" />

            <div className="flex flex-1 justify-between gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="h-6 w-6" />
                </button>

                {/* Separator */}
                <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src={freelancer?.profielfoto || profilePhoto}
                      className="h-8 w-8 rounded-full bg-gray-50"
                      />
                    <span className="hidden lg:flex lg:items-center">
                      <span aria-hidden="true" className="ml-4 text-sm font-semibold leading-6 text-gray-900">
                        {fullName} 
                      </span>
                      <ChevronDownIcon aria-hidden="true" className="ml-2 h-5 w-5 text-gray-400" />
                    </span>
                  </MenuButton>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                    {userNavigation.map((item) => (
                      
                      <Menu.Item key={item.name}>
                      {({ active }) => (
                        <a
                        href={item.href}
                        className={classNames(
                          active ? 'bg-gray-100' : '',
                          'block px-3 py-1 text-sm leading-6 text-gray-900'
                          )}
                          onClick={() => {
                            if (item.name === 'Uitloggen') {
                              setShowLogOut(true);
                            }
                          }}
                          >
                          {item.name}
                        </a>
                      )}
                    </Menu.Item>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          <main className={`${['Geaccepteerde shifts','Aanmeldingen', 'Checkouts', 'Facturen', 'Flexpools'].includes(position) ? 'xl:pl-0' : 'xl:pl-96'}`}>
            <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">{/* Main area */}
      
                {position === 'Geaccepteerde shifts' ?
            diensten.length > 0 ? (
              <ScrollArea>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {diensten.slice(0, diensten.length).map((dienstenItem, index) => (
                  <DienstCard key={index} dienst={dienstenItem} />
                ))}
                </div>
                </ScrollArea>
              ) : ( 
                <p className="text-center text-lg text-gray-500">Geen diensten</p>
                               )
                             : null
                            }
                          
               {position === 'Facturen' ?
              factuur.length > 0 ? (
                <ScrollArea>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {factuur.slice(0, factuur.length).map((factuurItem, index) => (
                  <FactuurCard key={index} factuur={factuurItem} />
                  ))}
                  </div>
                  </ScrollArea>
                ) : ( 
                <div>
                 Geen facturen gevonden
                </div> 
                               )
                             : null
                            } 
               {position === 'Flexpools' ?
              flexpool.length > 0 ? (
                <ScrollArea>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {flexpool.slice(0, flexpool.length).map((flexpoolItem, index) => (
                  <FlexpoolCard key={index} flexpool={flexpoolItem} />
                  ))}
                  </div>
                  </ScrollArea>
                ) : ( 
                <div>Geen flexpools gevonden</div>
                               )
                             : null
                            } 
            </div>
          </main>
            </div>


            {!['Geaccepteerde shifts', 'Aanmeldingen', 'Checkouts', 'Facturen', 'Flexpools'].includes(position) && (
  <aside className="fixed bottom-0 left-20 top-16 hidden w-96 overflow-y-auto border-r border-gray-200 px-4 py-6 sm:px-6 lg:px-8 xl:block">
    {/* Secondary column (hidden on smaller screens) */}
    <div>
      <div>
        <Calendar
          mode="range"
          selectedRange={dateRange}
          onDateRangeChange={(range: React.SetStateAction<{ from: Date | undefined; to: Date | undefined }>) => setDateRange(range)}
        />
      </div>
      <div>
        <p className="mt-20">Tarief</p>
        <Box sx={{ width: 250 }}>
          <Slider
            marks={euromarks}
            step={10}
            value={euroVal}
            valueLabelDisplay="auto"
            min={MIN}
            max={MAX}
            onChange={handleUurtariefChange}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography
              variant="body2"
              onClick={() => setEuroVal(MIN)}
              sx={{ cursor: 'pointer' }}
            >
              €{MIN} min
            </Typography>
            <Typography
              variant="body2"
              onClick={() => setEuroVal(MAX)}
              sx={{ cursor: 'pointer' }}
            >
              €{MAX}
            </Typography>
          </Box>
        </Box>
      </div>
      <p className="mt-20">Afstand</p>
      <Box sx={{ width: 250 }}>
        <Slider
          marks={distancemarks}
          step={10}
          value={distanceVal}
          valueLabelDisplay="auto"
          min={MIN}
          max={MAX}
          onChange={handleAfstandChange}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="body2"
            onClick={() => setDistanceVal(MIN)}
            sx={{ cursor: 'pointer' }}
          >
            {MIN} km
          </Typography>
          <Typography
            variant="body2"
            onClick={() => setDistanceVal(MAX)}
            sx={{ cursor: 'pointer' }}
          >
            {MAX} km
          </Typography>
        </Box>
      </Box>
      <div className="justify-between">
        <Button className="mt-20 bg-white text-black border-2 border-black mr-10" onClick={() => setPosition("Shifts")}>
          Reset
        </Button>
        <Button className="mt-20 bg-sky-500" onClick={() => setPosition('Filter')}>
          Zoek
        </Button>
      </div>
    </div>
  </aside>
)}

      </div>
    </>
    <UitlogModal isVisible={showLogOut} onClose={() => setShowLogOut(false)}/>
    </Fragment>
  )
}
