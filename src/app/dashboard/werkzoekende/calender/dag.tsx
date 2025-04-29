"use client"

import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/20/solid'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { useUser } from "@clerk/nextjs";
import { startTransition, useEffect, useState } from 'react'
import React from 'react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameDay, parseISO } from 'date-fns'
import { fetchBedrijfByClerkId } from "@/lib/actions/bedrijf.actions";
import { useRouter } from 'next/navigation';
import ElButton from '@/app/dashboard/werkzoekende/calender/ElButton';
import { IDienst } from '@/lib/models/dienst.model';
import { haalGeplaatsteDiensten } from '@/lib/actions/vacature.actions';


function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

  

    const CalenderD = () => {

  const { isLoaded, user } = useUser();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [ diensten, setDiensten ] = useState<IDienst[]>([]);
  const [bedrijfiD, setBedrijfiD] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && user) {
      const getBedrijfId = async () => {
        try {
          const bedrijf = await fetchBedrijfByClerkId(user!.id);
          if (bedrijf && bedrijf._id) {
            setBedrijfiD(bedrijf._id.toString());
          }
        } catch (error) {
          console.error("Error fetching bedrijf by Clerk ID:", error);
        }
      };
    
      if (user && !bedrijfiD) {  // Only fetch if user exists and bedrijfiD is not already set
        getBedrijfId();
      }
    }
  }, [isLoaded, user]);

  

  useEffect(() => {
    if (bedrijfiD) {  // Only fetch shifts if bedrijfId is available
      const fetchDiensten = async () => {
        try {
          const diensten = await haalGeplaatsteDiensten({ bedrijfId: bedrijfiD });
          setDiensten(diensten || []);  // Ensure shifts is always an array
        } catch (error) {
          console.error('Error fetching diensten:', error);
          setDiensten([]);  // Handle error by setting an empty array
        }
      };
  
      fetchDiensten();
    }
  }, [bedrijfiD]); 


  const startDate = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 })
  const endDate = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 })

  interface Day {
    date: string;
    isCurrentMonth: boolean;
    isToday?: boolean;
    isSelected?: boolean;
    events: Event[];
  }

  interface Event {
    id: string;
    name: string;
    time: string;
    datetime: string;
    href: string;
  }

  const today = format(new Date(), 'yyyy-MM-dd');
  
  const days: Day[] = [];
  let day = startDate;
  while (day <= endDate) {
    days.push({
      date: format(day, 'yyyy-MM-dd'),
      isCurrentMonth: day.getMonth() === currentMonth.getMonth(),
      isToday: format(day, 'yyyy-MM-dd') === today,
      isSelected: false,
      events: [], // This is now typed as Event[]
    });
    day = addDays(day, 1);
  }

  days.forEach((day) => {
    const dayDate = new Date(day.date);
  
    // Voeg diensten toe aan de events per dag
    diensten.forEach((dienst) => {
      const dienstDate = new Date(dienst.datum);
      if (
        dienstDate.getFullYear() === dayDate.getFullYear() &&
        dienstDate.getMonth() === dayDate.getMonth() &&
        dienstDate.getDate() === dayDate.getDate()
      ) {
        day.events.push({
          id: dienst._id as string,
          name: dienst.titel,
          time: dienst.werktijden.begintijd,
          datetime: new Date(dienst.datum).toISOString(),
          href: `/dashboard/vacature/pagina/${dienst.vacature}`,
        });
      }
    });
  });
  
  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleDateClick = (date: Date) => {
    setSelectedDay(date); // Use setSelectedDay to update the selected day
  };

  const selectedDayObject = days.find((day) => day.isSelected);

  const filteredShifts = diensten.filter((dienst) =>
    isSameDay(parseISO(dienst.datum.toString()), selectedDay)
  );



  return (
    <div className="pl-96 mt-10 md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
      <div className="md:pr-14">
        <div className="flex items-center">
          <h2 className="flex-auto text-sm font-semibold text-gray-900"><time dateTime={format(currentMonth, 'MM-yyyy')}>{format(currentMonth, 'MMMM yyyy')}</time></h2>
          <button
            type="button"
            className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            onClick={handlePrevMonth}
          >
            <span className="sr-only">Previous month</span>
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            onClick={handleNextMonth}
          >
            <span className="sr-only">Next month</span>
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-10 grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>T</div>
          <div>F</div>
          <div>S</div>
          <div>S</div>
        </div>
        <div className="mt-2 grid grid-cols-7 text-sm">
        
        {days.map((day, dayIdx) => {
            const hasEvents = day.events.length > 0; // Check if there are events on this day
            return (
              <div key={day.date} className={classNames(dayIdx > 6 && 'border-t border-gray-200', 'py-2')}>
                <button
                  type="button"
                  className={classNames(
                    day.isSelected && 'text-white',
                    !day.isSelected && day.isToday && 'text-sky-500',
                    !day.isSelected && !day.isToday && day.isCurrentMonth && 'text-gray-900',
                    !day.isSelected && !day.isToday && !day.isCurrentMonth && 'text-gray-400',
                    day.isSelected && day.isToday && 'bg-sky-500',
                    day.isSelected && !day.isToday && 'bg-gray-900',
                    !day.isSelected && 'hover:bg-gray-200',
                    (day.isSelected || day.isToday) && 'font-semibold',
                    'mx-auto flex h-8 w-8 items-center justify-center rounded-full'
                  )}
                  onClick={() => handleDateClick(new Date(day.date))}
                >
                  <time dateTime={day.date}>{(day.date.split('-').pop() ?? '').replace(/^0/, '')}</time>
                  {/* Render a dot if the day has events */}
                  {hasEvents && (
                    <div className="flex justify-center">
                      <span className="block w-1.5 h-1.5 mt-1 rounded-full bg-orange-500"></span>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <section className="mt-12 md:mt-0 md:pl-14">
        <h2 className="text-base font-semibold leading-6 text-gray-900">
          Schedule for <time dateTime={selectedDay.toISOString()}>{selectedDay.toDateString()}</time>
        </h2>
        <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
          {filteredShifts.length > 0 ? (
            filteredShifts.map((dienst) => (
              <li
                key={dienst._id as string}
                className="group flex items-center space-x-4 rounded-xl px-4 py-2 focus-within:bg-gray-100 hover:bg-gray-100"
              >
                <img src={dienst.afbeelding} alt="" className="h-10 w-10 flex-none rounded-full" />
                <div className="flex-auto">
                  <p className="text-gray-900">{dienst.titel}</p>
                  <p className="mt-0.5">
                    <time dateTime={dienst.werktijden.begintijd}>{dienst.werktijden.begintijd}</time> -{' '}
                    <time dateTime={dienst.werktijden.eindtijd}>{dienst.werktijden.eindtijd}</time> |
                    Bezetting: {' '} {dienst.opdrachtnemers.length}
                  </p>
                </div>
                <Menu as="div" className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100">
                  <div>
                    <MenuButton className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
                      <span className="sr-only">Open options</span>
                      <EllipsisVerticalIcon className="h-6 w-6" aria-hidden="true" />
                    </MenuButton>
                  </div>

                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    <div className="py-1">
                      <MenuItem>
                        <ElButton link={`/dashboard/vacature/${dienst.vacature}`} buttonText="Bekijk"/>
                      </MenuItem> 
                      <MenuItem>
                        <button
                          onClick={() =>
                            startTransition(async () => {
                              await verwijderShiftArray({ shiftArrayId: shift._id as string, forceDelete: true, path: "/dashboard" })
                            })
                          }
                          className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                        >
                          verwijder
                        </button>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Menu>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No shifts available for this day.</p>
          )}
        </ol>
      </section>
    </div>
  )
}

export default CalenderD
