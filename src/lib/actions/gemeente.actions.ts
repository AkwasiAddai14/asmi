"use server"

import { connectToDB} from "../mongoose";
import Gemeente from "@/lib/models/gemeente.model";



connectToDB();

  
type EmailNotificaties = {
    vacatures: boolean;
    kandidaten: boolean;
    aanbiedingen: boolean;
  };
  
  type Gemeente = {
    gemeente: string;
    provincie: string;
    voornaam: string;
    achternaam: string;
    emailadres?: string;
    telefoonnummer?: string;
    postcode: string;
    huisnummer: string;
    straat: string;
    plaats: string;
    omslagfoto?: string;
    iban: string;
    emailNotificaties: EmailNotificaties;
    pushnotifications: 'alles' | 'zelfde_als_email' | 'geen';
  };


export const maakGemeente = async (user:Gemeente) => {
    try {
        const newGemeente = await Gemeente.create(user);
        await Gemeente.findOneAndUpdate({gemeente: user.gemeente}, 
        {
            upsert:true, new: true 
        });
        
        return JSON.parse(JSON.stringify(newGemeente))
        
        } 
    catch (error: any) {
                throw new Error(`Failed to create or update user: ${error.message}`);
        }
    }