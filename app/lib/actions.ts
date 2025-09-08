'use server';
// This marks all the exported functions as Server Actions
// These functions can be imported and used in Client and Server components.

import { z } from 'zod'; // To type-validation the form
import { revalidatePath } from 'next/cache'; // Used to clear cached router segments in browser since we are updating displayed data
import { redirect } from 'next/navigation';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
})

const CreateInvoice = FormSchema.omit({id: true, date: true});

export async function createInvoice(formData: FormData) {
  // Tip: If you're working with forms that have many fields, you may want 
  // to consider using the entries() method with JavaScript's Object.fromEntries().
  const { customerId, amount, status} = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `

  revalidatePath('/dashboard/invoinces');
  redirect('/dashboard/invoices');
}