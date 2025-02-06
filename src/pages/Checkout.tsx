import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore, useAuthStore } from '../lib/store';
import { supabase } from '../lib/supabase';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  handler: (response: { razorpay_payment_id: string }) => void; // Specify type for response
  prefill: {
    email: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: {
      new (options: RazorpayOptions): {
        open: () => void;
      };
    };
  }
}

export default function Checkout() {
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const total = items.reduce((sum, item) => sum + item.price, 0);
  const amountInPaise = Math.round(total * 100);

  const handlePayment = async () => {
    if (!user) return;
    setIsProcessing(true);
    setError('');

    try {
      const options: RazorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amountInPaise,
        currency: "INR",
        name: "ProjectHub",
        description: "Project Purchase",
        handler: async function (response: { razorpay_payment_id: string }) { // Specify type for response
          try {
            const { error: purchaseError } = await supabase
              .from('purchases')
              .insert(
                items.map((item) => ({
                  user_id: user.id,
                  project_id: item.id,
                  amount: item.price,
                  payment_id: response.razorpay_payment_id
                }))
              );

            if (purchaseError) throw purchaseError;

            const downloadLinks = await Promise.all(
              items.map(async (item) => {
                const { data } = await supabase
                  .storage
                  .from('project-files')
                  .createSignedUrl(`${item.id}/project-files.zip`, 60 * 60);

                return {
                  projectId: item.id,
                  downloadUrl: data?.signedUrl,
                };
              })
            );

            clearCart();
            navigate('/checkout/success', {
              state: { downloadLinks },
            });
          } catch (err) {
            setError('Failed to process payment. Please contact support.');
            console.error('Payment processing error:', err);
          }
        },
        prefill: {
          email: user.email || '', // Ensure email is a string
        },
        theme: {
          color: "#4F46E5"
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError('Payment initialization failed. Please try again.');
      console.error('Checkout error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8 dark:text-white">Checkout</h1>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4 dark:text-white">Order Summary</h2>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between py-2">
              <span className="dark:text-white">{item.title}</span>
              <span className="font-medium dark:text-white">₹{item.price}</span>
            </div>
          ))}
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between">
              <span className="font-medium dark:text-white">Total</span>
              <span className="text-xl font-bold dark:text-white">
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
            <p className="text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={isProcessing || items.length === 0}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {isProcessing ? 'Processing Payment...' : `Pay ₹${total.toFixed(2)}`}
        </button>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Secure payment powered by Razorpay</p>
          <p className="mt-1">Supports UPI, Cards, Net Banking, and EMI</p>
        </div>
      </div>
    </div>
  );
}
