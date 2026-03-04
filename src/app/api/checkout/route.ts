import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createClient } from '@/utils/supabase/server';

export async function POST() {
    try {
        console.log("1. INICIANDO CHECKOUT LIMPIO");

        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.log("Error de auth:", authError);
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        console.log("2. USUARIO CONFIRMADO:", user.id);

        const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || 'APP_USR-TEST-TOKEN' });
        const preference = new Preference(client);

        console.log("3. CREANDO PREFERENCIA EN MERCADO PAGO...");
        const response = await preference.create({
            body: {
                items: [
                    {
                        id: 'plan_pro',
                        title: 'Plan Pro - FinanzApp',
                        quantity: 1,
                        unit_price: 12000,
                        currency_id: 'ARS',
                    }
                ],
                external_reference: user.id,
                back_urls: {
                    success: 'http://localhost:3000/dashboard/profile',
                    failure: 'http://localhost:3000/dashboard/profile',
                    pending: 'http://localhost:3000/dashboard/profile',
                },
                auto_return: 'approved',
            }
        });

        console.log("4. LINK CREADO CON ÉXITO:", response.init_point);
        return NextResponse.json({ init_point: response.init_point });

    } catch (error: any) {
        console.error('5. ERROR ATRAPADO:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}