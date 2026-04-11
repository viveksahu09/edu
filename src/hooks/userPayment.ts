import { useState } from "react";

interface PaymentHookResult {
  showPayment: boolean;
  initiatePayment: (amount: number) => void;
  handlePaymentComplete: () => void;
  closePayment: () => void;
  amount: number;
}

export function usePayment(): PaymentHookResult {
  const [showPayment, setShowPayment] = useState(false);
  const [amount, setAmount] = useState(0);

  const initiatePayment = (paymentAmount: number) => {
    setAmount(paymentAmount);
    setShowPayment(true);
  };

  const handlePaymentComplete = () => {
    // Handle successful payment
    setShowPayment(false);
  };

  const closePayment = () => {
    setShowPayment(false);
  };

  return {
    showPayment,
    initiatePayment,
    handlePaymentComplete,
    closePayment,
    amount,
  };
}
