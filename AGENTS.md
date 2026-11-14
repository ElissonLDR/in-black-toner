# Architecture rules

- Keep lead validation and WhatsApp message encoding shared in `src/lib/lead-data.ts` so both contact forms send the same required information.