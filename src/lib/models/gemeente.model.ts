import mongoose, { Schema, Document, model } from 'mongoose';

export interface IGemeente extends Document {
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
  
    // Email notificatievoorkeuren
    emailNotificaties: {
      vacatures: boolean;
      kandidaten: boolean;
      aanbiedingen: boolean;
    };
  
    // Push notificatievoorkeur
    pushnotifications: 'alles' | 'zelfde_als_email' | 'geen';
  }

const GemeenteSchema = new Schema<IGemeente>(
    {
      gemeente: { type: String, required: true },
      provincie: { type: String, required: true },
      voornaam: { type: String, required: true },
      achternaam: { type: String, required: true },
      emailadres: { type: String },
      telefoonnummer: { type: String },
      postcode: { type: String, required: true },
      huisnummer: { type: String, required: true },
      straat: { type: String, required: true },
      plaats: { type: String, required: true },
      omslagfoto: { type: String },
      // Email notificaties
      emailNotificaties: {
        vacatures: { type: Boolean, default: false },
        kandidaten: { type: Boolean, default: false },
        aanbiedingen: { type: Boolean, default: false },
      },
      // Push notificatie voorkeur
      pushnotifications: {
        type: String,
        enum: ['alles', 'zelfde_als_email', 'geen'],
        default: 'geen',
      },
      iban: { type: String, required: true },
    },
    {
      timestamps: true,
    }
  );
  

// Zorg dat het model niet opnieuw wordt aangemaakt bij hot reloads
const GemeenteModel = mongoose.models.Gemeente || model<IGemeente>('Gemeente', GemeenteSchema);

export default GemeenteModel;
