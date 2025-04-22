'use server'


import mongoose, { Types } from "mongoose";
import Bedrijf, { IBedrijf } from "../models/bedrijf.model";
import { connectToDB } from "../mongoose";
import { currentUser } from "@clerk/nextjs/server";
import Nieuwkomer from "@/lib/models/nieuwkomer.model";
import Flexpool, { IFlexpool } from "../models/flexpool.model";

export const haalFlexpools = async (bedrijfId: string): Promise<IFlexpool[]> => {
    try {
      console.log('Fetching flexpools for Bedrijf ID:', bedrijfId);
  
      // Fetch the Bedrijf document and populate the flexpools
      const bedrijf: IBedrijf | null = await Bedrijf.findById(bedrijfId)
        .populate('flexpools') // Populate the flexpools field
        .lean(); // Convert to plain JS objects to avoid circular references
  
      if (bedrijf && bedrijf.flexpools && bedrijf.flexpools.length > 0) {
        // Fetch the related Flexpool documents
        const flexpools = await Flexpool.find({ _id: { $in: bedrijf.flexpools } })
          .lean(); // Convert to plain JS objects
  
        console.log("Flexpools fetched successfully.");
  
        return flexpools;
      } else {
        console.log('No flexpools found for this Bedrijf.');
        return [];
      }
    } catch (error) {
      console.error('Error fetching flexpools:', error);
      throw new Error('Failed to fetch flexpools');
    }
  };


export async function maakFlexpool({
    bedrijfId,
    titel,
    freelancers = [],
    shifts = []
  }: {
    bedrijfId: mongoose.Types.ObjectId,
    titel: string,
    freelancers?: mongoose.Types.ObjectId[],
    shifts?: mongoose.Types.ObjectId[]
  }) {
    try {
      // Create a new Flexpool instance
      await connectToDB();
      const newFlexpool = new Flexpool({
        titel,
        bedrijf: bedrijfId,
        freelancers,
        shifts
      });
  
      // Save the new Flexpool to the database
      const savedFlexpool = await newFlexpool.save();
  
      // Find the associated company and update it
      const company = await Bedrijf.findById(bedrijfId);
      if (!company) {
        throw new Error(`Company with ID ${bedrijfId} not found`);
      }
  
      company.flexpools.push(savedFlexpool._id as unknown as mongoose.Types.ObjectId); // Ensure the ID is of correct type
      await company.save(); // Save the updated company document
  
      return [savedFlexpool._id, savedFlexpool.titel];
    } catch (error) {
      console.error('Error creating flexpool:', error);
      throw new Error('Error creating flexpool');
    }
  };

  export const haalFlexpoolFreelancer = async (userId: Types.ObjectId | string ): Promise<IFlexpool[] | []> => {
    try {
      await connectToDB();
        // Zoek de freelancer op basis van het gegeven ID
        let freelancer;
        let flexpools;
    if(mongoose.Types.ObjectId.isValid(userId)){
         freelancer = await Nieuwkomer.findById(userId)
        if (freelancer && freelancer.flexpools && freelancer.flexpools.length > 0) {
          // Fetch the related Flexpool documents
          flexpools = await Flexpool.find({ _id: { $in: freelancer.flexpools } })
          console.log(flexpools)
          console.log("Flexpools fetched successfully.");
          return flexpools;
        }
    }
        // Case 2: If freelancerId is not provided, use the logged-in user (Clerk)
        if(userId.toString() !== ""){
          freelancer = await Nieuwkomer.findOne({clerkId : userId});
          if (freelancer && freelancer.flexpools && freelancer.flexpools.length > 0) {
            // Fetch the related Flexpool documents
            flexpools = await Flexpool.find({ _id: { $in: freelancer.flexpools } })
            console.log(flexpools)
            console.log("Flexpools fetched successfully.");
            return flexpools;
          }
        } else {
          const user = await currentUser();
          if (user) {
             freelancer = await Nieuwkomer.findOne({ clerkId: user.id });
            if (freelancer && freelancer.flexpools && freelancer.flexpools.length > 0) {
              // Fetch the related Flexpool documents
              flexpools = await Flexpool.find({ _id: { $in: freelancer.flexpools } })
              console.log(flexpools)
              console.log("Flexpools fetched successfully.");
              return flexpools;
            }
        } else {
          console.log('No flexpools found for this freelancer.');
          return [];
        }   
    }
    return flexpools || [];// Retourneer de flexpools van de freelancer
  } catch (error) {
  console.error('Error fetching flexpools:', error);
  throw new Error('Failed to fetch flexpools');
  }
}
