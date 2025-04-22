
import mongoose, { Document, Types, Schema } from 'mongoose';

export interface INieuwkomer extends Document {
    flexpools: mongoose.Types.ObjectId[];
    shifts: mongoose.Types.ObjectId[];
    checkouts: mongoose.Types.ObjectId[];
    facturen: mongoose.Types.ObjectId[]; 
    sollicitaties: mongoose.Types.ObjectId[],
    diensten: mongoose.Types.ObjectId[],
    clerkId: string;
    voornaam: string;
    tussenvoegsel?: string;
    achternaam: string;
    geboortedatum: Date;
    telefoonnummer?: string;
    emailadres?: string;
    bsn?: string;
    korregeling?: boolean;
    loonheffingskorting?: boolean;
    kvknr?: string;
    btwid?: string;
    iban: string;
    postcode: string;
    huisnummer: string;
    straat?: string;
    stad?: string;
    onboarded?: boolean;
    profielfoto?: string;
    ratingCount?: number;
    rating?: number;
    opkomst?: number;
    punctualiteit?: number;
    bio?: string;
  }

const nieuwkomerSchema = new mongoose.Schema({
    clerkId: { type: String, required: true },
    voornaam: { type: String, required: true },
    tussenvoegsel: { type: String, required: false },
    achternaam: { type: String, required: true },
    geboortedatum: { type: Date, required: true },
    telefoonnummer: { type: String, required: false },
    emailadres: { type: String, required: false },
    bsn: { type: String, required: false },
    korregeling: { type: Boolean, default: false },
    loonheffingskorting: { type: Boolean, default: false },
    kvknr: { type: String, required: false },
    btwid: { type: String, required: false },
    iban: { type: String, required: true },
    postcode: { type: String, required: true },
    huisnummer: { type: String, required: true },
    straat: { type: String, required: false },
    stad: { type: String, required: false },
    onboarded: { type: Boolean, default: false },
    profielfoto: { type: String, required: false },
    ratingCount: { type: Number, default: 0 },
    rating: { type: Number, default: 5 },
    opkomst: { type: Number, default: 100 },
    punctualiteit: { type: Number, default: 100 },
    bio: { type: String, required: false, default: '' }, // Default value added
    werkervaring: [
        {
            bedrijf: { type: String, required: true },
            functie: { type: String, required: true },
            duur: { type: String, required: true }
        }
    ],
    vaardigheden: [
        {
            vaardigheid: { type: String, required: false }
        }
    ],
    opleidingen: [
        {
            naam: { type: String, required: true },
            school: { type: String, required: true },
            niveau: { type: String, required: false }
        }
    ],
    shifts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Shift",
                required: false,
            },
    ],
    checkouts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shift",
            required: false,
        },
],
    flexpools: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Flexpool"
        }
    ],
    facturen: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Factuur"
        }
    ],
    sollicitaties: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Sollicitaties",
            required: false,
        },
],
    diensten: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dienst",
        required: false,
    },
],
});

// Ensure indexes are created as needed (optional)
// freelancerSchema.index({ clerkId: 1 });

const Nieuwkomer = mongoose.models.Nieuwkomer || mongoose.model('Nieuwkomer', nieuwkomerSchema);
export default Nieuwkomer;
