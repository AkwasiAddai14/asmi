import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVacature extends Document {
    opdrachtgever: mongoose.Schema.Types.ObjectId;
    sollicitaties: mongoose.Schema.Types.ObjectId[];
    diensten: mongoose.Schema.Types.ObjectId[];
    opdrachtgeverNaam: string,
    titel: string;
    functie: string;
    afbeelding: string;
    uurloon: number;
    adres: {
        straatnaam: string,
        huisnummer: string,
        postcode: string,
        stad: string,
    };
    begindatum: Date;
    einddatum: Date;
    tijden: [{
        begintijd: string; // Bijvoorbeeld: "09:00"
        eindtijd: string; // Bijvoorbeeld: "17:00"
        pauze?: number; // Bijvoorbeeld: 30 (voor 30 minuten pauze)
      }];
      beschrijving: string;
      vaardigheden?: string[];
      kledingsvoorschriften?: string[];
      beschikbaar: boolean;
      toeslagen: [{
        toeslag: boolean,
        toeslagType: number,
        toeslagPercentage: number,
        toeslagVan: string,
        toeslagTot: string,
      }]
}

const vacatureSchema: Schema<IVacature> = new mongoose.Schema({
    opdrachtgever: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bedrijf',
        required: true
    },
    sollicitaties: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Sollicitatie',
            required: false
        }
    ],
    diensten: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dienst',
            required: false
        }
    ],
    titel: { type: String, required: true },
    opdrachtgeverNaam: { type:  String, required: true},
    functie: { type: String, required: true },
    afbeelding: { type: String, required: true },
    uurloon: { type: Number, required: true },
    adres: {
        straatnaam: { type: String, required: true },
        huisnummer: { type: String, required: true },
        postcode: { type: String, required: true },
        stad: { type: String, required: true },
    },
    begindatum: { type: Date, required: false },
    einddatum: { type: Date, required: false },
    tijden: [{
        begintijd: { type: String, required: true }, // Bijvoorbeeld: "09:00"
        eindtijd: { type: String, required: true }, // Bijvoorbeeld: "17:00"
        pauze: { type: Number, required: false }, // Bijvoorbeeld: 30 (voor 30 minuten pauze)
      }],
    beschrijving: { type: String, required: true },
    vaardigheden: [{ type: String, required: false }],
    kledingsvoorschriften: [{ type: String, required: false }],
    beschikbaar: { type: Boolean, required: true, default: true },
    toeslagen: [{
        toeslag: { type: Boolean},
        toeslagType: { type: Number},
        toeslagPercentage: { type: Number},
        toeslagVan: { type: String},
        toeslagTot: {type: String},
}],

});

const Vacature: Model<IVacature> = mongoose.models.Vacature || mongoose.model<IVacature>('Vacature', vacatureSchema);
export default Vacature;