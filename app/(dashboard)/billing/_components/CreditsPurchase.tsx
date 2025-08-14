"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CoinsIcon, CreditCard } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import DropIn from "braintree-web-drop-in-react";
import { CreditsPack, PackId } from "@/types/billing";
import { PurchaseCredits } from "@/actions/billing/purchaseCredits";

const CreditsPurchase = () => {
  const [clientToken, setClientToken] = useState<string | null>(null);
  const [selectedPack, setSelectedPack] = useState<PackId>(PackId.MEDIUM);
  const [instance, setInstance] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchClientToken = useCallback(async () => {
    setLoading(true);
    console.log("[FetchClientToken] Fetching token...");
    try {
      const { data } = await axios.get("/api/billing");
      console.log("[FetchClientToken] API Response:", data);

      const token = data.clientToken || data.clienttoken || null;
      if (!token) throw new Error("No client token found in API response");

      setClientToken(token);
      console.log("[FetchClientToken] Token set in state:", token);
    } catch (error) {
      console.error("[FetchClientToken] Error:", error);
      toast.error("Failed to load payment options");
    } finally {
      setLoading(false);
      console.log("[FetchClientToken] Loading finished");
    }
  }, []);

  const handlePayment = async () => {
    if (!instance) {
      toast.error("Payment form is not ready");
      return;
    }

    try {
      console.log("[HandlePayment] Requesting nonce...");
      const { nonce } = await instance.requestPaymentMethod();
      console.log("[HandlePayment] Got nonce:", nonce);

      const { data } = await axios.post("/api/billing", {
        nonce,
        planId: selectedPack,
      });

      console.log("[HandlePayment] Payment response:", data);

      if (data.success) {
        toast.success(
          `Payment successful! Transaction ID: ${data.transactionId}`
        );
        mutation.mutate({
          packId: selectedPack,
          transactionId: data.transactionId,
        });
      } else {
        toast.error(`Payment failed: ${data.error}`);
      }
    } catch (error) {
      console.error("[HandlePayment] Error:", error);
      toast.error("Payment failed");
    }
  };

  useEffect(() => {
    fetchClientToken();
  }, [fetchClientToken]);

  const mutation = useMutation({
    mutationFn: PurchaseCredits,
    onSuccess: () => {
      toast.success("Credits added successfully!");
    },
    onError: (error) => {
      toast.error("Error: " + (error as Error).message);
    },
  });

  console.log("[Render] Current state:", {
    clientToken,
    loading,
    selectedPack,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl flex font-bold items-center gap-2">
          <CoinsIcon className="h-6 w-6 text-primary" />
          Purchase Credits
        </CardTitle>
        <CardDescription>
          Select the number of credits you want to purchase
        </CardDescription>
      </CardHeader>

      <CardContent>
        <RadioGroup
          value={selectedPack}
          onValueChange={(value) => setSelectedPack(value as PackId)}
        >
          {CreditsPack.map((pack) => (
            <div
              key={pack.id}
              className="flex items-center space-x-3 bg-secondary/50 rounded-lg p-3 hover:bg-secondary cursor-pointer"
            >
              <RadioGroupItem value={pack.id} id={pack.id} />
              <Label
                className="flex justify-between w-full cursor-pointer"
                htmlFor={pack.id}
              >
                <span className="font-medium">
                  {pack.name} - {pack.label}
                </span>
                <span className="font-bold text-primary">
                  ${(pack.price / 100).toFixed(2)}
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>

        {loading && <div className="mt-4">Loading payment options...</div>}

        {!loading && clientToken && (
          <>
            {console.log("[Render] Rendering DropIn...")}
            <DropIn
              options={{
                authorization: clientToken,
                paypal: { flow: "vault" },
              }}
              onInstance={(dropinInstance) => {
                setInstance(dropinInstance);
                console.log("[DropIn] Instance initialized");
              }}
            />
          </>
        )}

        {!loading && !clientToken && (
          <div className="mt-4">No payment options available</div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          onClick={handlePayment}
          disabled={loading || !instance}
        >
          <CreditCard className="mr-2 h-5 w-5" /> Purchase Credits
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreditsPurchase;
