import { NextResponse } from 'next/server'; // Import NextResponse
import braintree from 'braintree';  // Make sure to use `require` for compatibility
import { getCreditsPack, PackId } from '@/types/billing';

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,  // Use .Production for production
  merchantId: process.env.MERCHANT_ID,
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
});

// GET route to generate client token
export async function GET(req) {
  try {
    const clientToken = await gateway.clientToken.generate({});
    return NextResponse.json({ clientToken });  // Return a JSON response using NextResponse
  } catch (error) {
    console.error('Error generating client token:', error);
    return NextResponse.json({ error: 'Failed to generate client token' }, { status: 500 });
  }
}

// POST route to handle the payment and subscription
export async function POST(req) {
  const { nonce, planId } = await req.json();  // Get body data from the request

  try {
    const selectedPack = getCreditsPack(planId as PackId);
    if (!selectedPack) {
      return NextResponse.json({ error: 'Invalid pack selected' }, { status: 400 });
    }

    const result = await gateway.subscription.create({
      paymentMethodNonce: nonce,
      planId: planId,
      options: {
        startImmediately: false,
      },
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        transactionId: result.subscription.id,
      });
    } else {
      return NextResponse.json({ success: false, error: result.message }, { status: 500 });
    }
  } catch (error) {
    console.error('Error completing subscription:', error);
    return NextResponse.json({ success: false, error: 'Payment failed: ' + error.message }, { status: 500 });
  }
}
