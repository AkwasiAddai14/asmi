import Factuur from "../models/factuur.model";
import { connectToDB } from "../mongoose";
import { veranderDienstenNaarVoltooidEnMaakFacturen, veranderDienstenNaarVoltooidEnMaakFacturenVoorBedrijven } from "./vacature.actions";

export async function haalFacturen(id: string) {
    try {
        // Find all facturen
        const facturen = await Factuur.find({
            opdrachtgever: { $in: [id] }  // Checks if the id is within the opdrachtgever array
        })
        
        return facturen;
    } catch (error:any) {
        console.error('Error retrieving facturen:', error);
        throw new Error(`Failed to retrieve facturen: ${error.message}`);
    }
}

export async function haalFacturenFreelancer(id: string) {
    try {
        await connectToDB();
        const facturen = await Factuur.find({
            opdrachtnemers: { $in: [id] }  // Checks if the id is within the opdrachtgever array
        })
        return facturen;
    } catch (error: any) {
        console.error('Error retrieving facturen:', error);
        throw new Error(`Failed to retrieve facturen: ${error.message}`);
    }
}

export const cloudFacturen = async () => {
    await veranderDienstenNaarVoltooidEnMaakFacturenVoorBedrijven();
    await veranderDienstenNaarVoltooidEnMaakFacturen();
}