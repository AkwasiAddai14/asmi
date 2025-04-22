import * as z from 'zod';

export const VacatureValidation = z.object({
    afbeelding: z.string(),
    titel: z.string(),
    functie: z.string(),
    uurloon: z.number().refine((val) => val >= 12.00, {
        message: 'Het uurtarief moet minimaal €12.00 zijn.',
      }),
    begindatum: z.date(),
    einddatum: z.date(),
    huisnummer: z.string(),
    stad: z.string(),
    postcode:z.string(),
    straatnaam: z.string(),
    begintijd: z.string(),
    eindtijd: z.string(),
    pauze: z.string(),
    beschrijving: z.string(),
    vaardigheden: z.union([z.string(), z.array(z.string())]),
    kledingsvoorschriften: z.union([z.string(), z.array(z.string())]),
    toeslag: z.boolean(),
    toeslagtype: z.number(),
    toeslagpercentage: z.number(),
    toeslagVan: z.string(),
    toeslagTot: z.string()
})