import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDienst extends Document {
    opdrachtgever: mongoose.Schema.Types.ObjectId;
    vacature: mongoose.Schema.Types.ObjectId;
    afbeelding: string;
    titel: string;
    datum: string;
    werktijden: {
        begintijd: string,
        eindtijd: string,
        pauze: number
    }
    opdrachtnemers: {
        freelancerId: mongoose.Schema.Types.ObjectId;
        naam: string;
        profielfoto: string;
        rating: number;
        geboortedatum: string;
      }[];
    bedrag: number,
    status: string,
    index: number,
}

const dienstSchema: Schema<IDienst> = new mongoose.Schema({
    opdrachtgever: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bedrijf',
        required: true
    },
    vacature: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vacature',
        required: true
    },
    afbeelding: { type: String, required: true },
    titel: { type: String, required: true },
    datum: {type: String, required: true},
    werktijden: {
        begintijd: { type: String, required: true }, // Bijvoorbeeld: "09:00"
        eindtijd: { type: String, required: true }, // Bijvoorbeeld: "17:00"
        pauze: { type: Number, required: true }, // Pauze in minuten
      },
      opdrachtnemers: [
        {
            freelancerId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Freelancer', // Referentie naar Freelancer-model
                required: true,
              },
          naam: { type: String, required: true },
          profielfoto: { type: String, required: true },
          rating: { type: Number, required: false },
          geboortedatum: { type: String, required: true },
        },
      ],
      bedrag: {
        type: Number, // Gebruik `Number` in plaats van `Double` voor compatibiliteit met Mongoose
        required: true,
      },
      status: { 
        type: String, 
        required: false
    },
    index: {
        type: Number, 
        required: true 
    },
});

const Dienst: Model<IDienst> = mongoose.models.Dienst || mongoose.model<IDienst>('Dienst', dienstSchema);
export default Dienst;