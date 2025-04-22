"use server"

import { connectToDB} from "../mongoose";
import Nieuwkomer from "../models/nieuwkomer.model";
import { revalidatePath } from "next/cache";
import mongoose, { SortOrder } from "mongoose";
import { currentUser } from "@clerk/nextjs/server";


connectToDB();

type Werkervaring = {
    bedrijf: string;
    functie: string;
    duur: string;
  };
  
  type Vaardigheid = {
    vaardigheid: string;
  };
  
  type Opleiding = {
    naam: string;
    school: string;
    niveau?: string;
  };
  
  type Freelancer = {
    clerkId: string;
    voornaam: string;
    tussenvoegsel?: string;
    achternaam: string;
    geboortedatum: Date;
    emailadres?: string;
    telefoonnummer?: string;
    postcode: string;
    huisnummer: string;
    straat: string;
    stad: string;
    onboarded: boolean;
    korregeling?: boolean;
    btwid?: string;
    iban: string;
    path: string;
    bio?: string;
    kvknr?: string;
    profielfoto?: any;
    cv?: any;
    werkervaring?: Werkervaring[];
    vaardigheden?: Vaardigheid[];
    opleidingen?: Opleiding[];
    bsn?: string; // Ensure bsn is included as it is required in the schema
  };


export const maakFreelancer = async (user:Freelancer) => {
    try {
        const newFreelancer = await Nieuwkomer.create(user);
        await Nieuwkomer.findOneAndUpdate({clerkId: user.clerkId}, {
            onboarded:false
        },
        {
            upsert:true, new: true 
        });
        if(user.path === "profiel/wijzigen"){
            revalidatePath(user.path)
        }
        return JSON.parse(JSON.stringify(newFreelancer))
        
        } 
            catch (error: any) {
                throw new Error(`Failed to create or update user: ${error.message}`);
               }
}

export const checkOnboardingStatusFreelancer = async (clerkId:string) => {
  try {
    await connectToDB();
   
    const freelancer = await Nieuwkomer.findOne({clerkId: clerkId})
    
     return freelancer?.onboarded ?? null;
  } catch (error) {
    console.error('failed to find stauts:', error);
    throw new Error('Failed to find status');
  }
}

export const haalFreelancer = async  (clerkId: string) => {
  try {
    await connectToDB();
    let freelancer;
    if(mongoose.Types.ObjectId.isValid(clerkId)){
      freelancer = await Nieuwkomer.findById(clerkId).lean();
    }
    if (clerkId.toString() !== ""){
      freelancer = await Nieuwkomer.findOne({clerkId: clerkId}).lean();
    } else {
      const user = await currentUser();
      if (user) {
        freelancer = await Nieuwkomer.findOne({clerkId: user!.id}).lean();
      }
      else {
        console.log("No user logged in or found!")
      }
    }
    console.log(freelancer)
      return freelancer;
  } catch (error) {
      console.error('Error retrieving freelancers:', error);
      throw new Error('Error retrieving freelancers');
  }
}