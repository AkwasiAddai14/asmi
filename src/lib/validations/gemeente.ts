import * as z from 'zod';

export const GemeenteValidation = z.object({
    gemeente: z.string(),
    omslagfoto: z.string(),
    provincie: z.string(),
    postcode: z.string(),
    huisnummer: z.string(),
    straat: z.string(),
    plaats: z.string(),
    emailadres: z.string(),
    telefoonnummer: z.string(),
    voornaam: z.string(),
    achternaam: z.string(),
    iban: z.string(),
    emailNotificaties: z.object({
        vacatures: z.boolean(),
        kandidaten: z.boolean(),
        aanbiedingen: z.boolean(),
      }),
    
      pushnotifications: z.enum(['alles', 'zelfde_als_email', 'geen']),
    });