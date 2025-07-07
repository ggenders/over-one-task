
'use client';

import { PayPalScriptProvider, PayPalButtons, type OnApproveData, type OnApproveActions } from "@paypal/react-paypal-js";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";

interface PayPalButtonProps {
    onSuccess: () => void;
}

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

export function PayPalUpgradeButton({ onSuccess }: PayPalButtonProps) {
    const { toast } = useToast();

    if (!PAYPAL_CLIENT_ID) {
        console.error("PayPal client ID is not set. Please set NEXT_PUBLIC_PAYPAL_CLIENT_ID in your .env file.");
        return (
            <Button disabled className="w-full">
                PayPal Not Configured
            </Button>
        )
    }

    const createOrder = (data: Record<string, unknown>, actions: any) => {
        return actions.order.create({
            purchase_units: [{
                description: "Over one task - Pro Upgrade",
                amount: {
                    value: "5.00",
                    currency_code: "USD"
                }
            }]
        });
    };

    const onApprove = (data: OnApproveData, actions: OnApproveActions) => {
        if (!actions.order) {
            toast({ title: "Payment Error", description: "Could not finalize payment.", variant: "destructive" });
            return Promise.resolve();
        }
        return actions.order.capture().then((details) => {
            onSuccess();
        }).catch(err => {
            toast({ title: "Payment Error", description: "An error occurred during payment.", variant: "destructive" });
        });
    };
    
    const onError = (err: any) => {
         toast({ title: "PayPal Error", description: "An error occurred with the PayPal transaction.", variant: "destructive" });
    }

    return (
        <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "USD", intent: "capture" }}>
            <PayPalButtons
                style={{ layout: "vertical", color: "blue", shape: "rect", label: "paypal", tagline: false }}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
            />
        </PayPalScriptProvider>
    );
}
