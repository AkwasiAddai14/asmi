import mongoose, { Schema, Document, Model } from 'mongoose';


export interface ISollicitatie extends Document {
    opdrachtgever: mongoose.Schema.Types.ObjectId;
    vacature: mongoose.Schema.Types.ObjectId;
    status: string;
    diensten: 
        {
        dienstId: mongoose.Schema.Types.ObjectId
        begintijd: string,
        eindtijd: string,
        pauze: number
    }[],
    opdrachtnemer: {
        freelancerId: mongoose.Schema.Types.ObjectId
        naam: string,
        profielfoto: string
        rating: Number;
        bio: string;
        geboortedatum: string;
        klussen: number;
        stad: string;
        emailadres: string;
        telefoonnummer: string;
    },
}

const SollicitatieSchema: Schema<ISollicitatie> = new mongoose.Schema({
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
    status: {
        type: String,
        required: true,
    },
    diensten: [{
        dienstId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dienst', // Referentie naar Freelancer-model
            required: true,
          },
        begintijd: { type: String, required: true }, // Bijvoorbeeld: "09:00"
        eindtijd: { type: String, required: true }, // Bijvoorbeeld: "17:00"
        pauze: { type: Number, required: true }, // Pauze in minuten
      }],
      opdrachtnemer: 
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
          bio: { type: String, required: true},
          stad: { type: String, required: true },
          klussen: { type: Number, required: true },
          emailadres: { type: String, required: true },
          telefoonnummer: { type: String, required: true },
        },
});

const Sollicitatie: Model<ISollicitatie> = mongoose.models.Sollicitatie || mongoose.model<ISollicitatie>('Sollicitatie', SollicitatieSchema);
export default Sollicitatie;
