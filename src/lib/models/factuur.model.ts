import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IFactuur extends Document {
    week: string;
    diensten: mongoose.Schema.Types.ObjectId[];
    shifts: mongoose.Schema.Types.ObjectId[];
    opdrachtgever: mongoose.Schema.Types.ObjectId;
    opdrachtnemer: mongoose.Schema.Types.ObjectId;
    datum: Date;
    tijd: string;
    werkdatum: string;
    totaalbedrag: number; // Update to number
    isVoltooid: boolean;  // Update to boolean
  }

const factuurSchema = new mongoose.Schema({
   week: {type: String, required: true},
   diensten: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Dienst"
   }],
    shifts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shift"
    }],
    opdrachtgever: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bedrijf"
    },
    opdrachtnemer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Freelancer"
    },
    datum: {type: Date, default: Date.now},
    tijd: {type: String, required: true},
    werkdatum: {type: String, required: true},
    totaalbedrag: {type: Number, required: true},
    isVoltooid: {type: Boolean, default: false}
});

const Factuur = mongoose.models.Factuur || mongoose.model('Factuur', factuurSchema);
export default Factuur;

