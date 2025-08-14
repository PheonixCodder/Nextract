'use client';

import { useEffect, useState } from 'react';
import braintree from 'braintree-web-drop-in';
import { CreditsPack, PackId } from '@/types/billing';
import { toast } from 'sonner';

interface BraintreePaymentFormProps {
  selectedPack: PackId;
}

const BraintreePaymentForm = ({ selectedPack }: BraintreePaymentFormProps) => {
  const [clientToken, setClientToken] = useState<string | null>(null);

  // Fetch client token from backend
  useEffect(() => {
    const fetchClientToken = async () => {
      const res = await fetch('/api/billing/braintree');
      const data = await res.json();
      setClientToken(data.clientToken);
    };
    fetchClientToken();
  }, []);

  useEffect(() => {
    if (clientToken) {
      braintree.create(
        {
          authorizationFingerprint: clientToken,
          container: '#dropin-container',
        },
        (err, dropinInstance) => {
          if (err) {
            console.error('Error initializing Braintree Drop-in:', err);
          } else {
            window.braintreeDropinInstance = dropinInstance;
          }
        }
      );
    }
  }, [clientToken]);

  // Handle payment submission
  const handlePaymentSubmit = async () => {
    const dropinInstance = window.braintreeDropinInstance;

    if (dropinInstance) {
      dropinInstance.requestPaymentMethod((err, payload) => {
        if (err) {
          console.error('Error fetching payment method:', err);
        } else {
          // Send the nonce and selected pack details to backend to complete payment
          fetch('/api/billing/complete-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              nonce: payload.nonce,
              planId: selectedPack, // Send the selected planId to the backend
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                toast.success(`Subscription created successfully! Transaction ID: ${data.transactionId}`);
              } else {
                toast.error(`Payment failed: ${data.error}`);
              }
            })
            .catch((err) => {
              console.error('Error during subscription creation:', err);
            });
        }
      });
    }
  };

  return (
    <div>
      <div id="dropin-container"></div>
      <button onClick={handlePaymentSubmit}>Subscribe</button>
    </div>
  );
};

export default BraintreePaymentForm;
