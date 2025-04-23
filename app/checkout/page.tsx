'use client';

import { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  CreditCard,
  QrCode, 
  CheckCircle2, 
  Copy, 
  RefreshCcw,
  Clock,
  Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

// Interface for cart item
interface CartItem {
  item: {
    id: number;
    name: string;
    price: number;
    category: string;
  };
  quantity: number;
}

interface CheckoutProps {
  cartItems?: CartItem[];
  formatPrice?: (price: number) => string;
  clearCart?: () => void;
}

// Dummy data untuk testing
const dummyCartItems: CartItem[] = [
  {
    item: {
      id: 1,
      name: 'Nasi Goreng Spesial',
      price: 35000,
      category: 'Main Course'
    },
    quantity: 2
  },
  {
    item: {
      id: 3,
      name: 'Sate Ayam',
      price: 25000,
      category: 'Appetizer'
    },
    quantity: 1
  },
  {
    item: {
      id: 5,
      name: 'Jus Alpukat',
      price: 15000,
      category: 'Beverages'
    },
    quantity: 2
  }
];

export default function Checkout({ 
  cartItems = dummyCartItems, // Gunakan data dummy sebagai default
  formatPrice = (price) => price.toLocaleString('id-ID'),
  clearCart = () => {} 
}: CheckoutProps) {
  const router = useRouter();
  const [tableNumber, setTableNumber] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('qris');
  const [showQRCode, setShowQRCode] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentExpiry, setPaymentExpiry] = useState({ minutes: 15, seconds: 0 });
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Calculate total
  const subtotal = cartItems.reduce((total, item) => total + (item.item.price * item.quantity), 0);
  const serviceCharge = Math.round(subtotal * 0.05); // 5% service charge
  const tax = Math.round(subtotal * 0.1); // 10% tax
  const total = subtotal + serviceCharge + tax;

  // Simulasi loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Check for form validity
  const isFormValid = tableNumber !== '';

  // Generate random order number
  useEffect(() => {
    const randomOrderNumber = 'TRX' + Math.floor(10000 + Math.random() * 90000);
    setOrderNumber(randomOrderNumber);
  }, []);

  // Countdown timer for payment
  useEffect(() => {
    if (!isCountdownActive) return;

    const timerInterval = setInterval(() => {
      setPaymentExpiry(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          clearInterval(timerInterval);
          return { minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [isCountdownActive]);

  // Function to handle form submission and proceed to payment
  const handleProceedToPayment = () => {
    if (!isFormValid) return;
    
    setShowQRCode(true);
    setIsCountdownActive(true);
  };

  // Function to simulate successful payment
  const handleCompletePayment = () => {
    setPaymentComplete(true);
    setIsCountdownActive(false);
    
    // In a real app, this would come from your payment gateway
    setTimeout(() => {
      clearCart();
      router.push('/order-success');
    }, 3000);
  };

  // Function to reset payment timer
  const resetTimer = () => {
    setPaymentExpiry({ minutes: 15, seconds: 0 });
  };

  // Function to copy virtual account number
  const copyReferenceNumber = () => {
    navigator.clipboard.writeText(orderNumber);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="mt-4 text-muted-foreground">Memuat checkout...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm p-4 sticky top-0 z-10 flex items-center">
        <button 
          onClick={() => router.back()}
          className="p-1 rounded-full hover:bg-muted absolute left-4"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-center flex-1">Checkout</h1>
      </header>

      <div className="flex-1 p-4 pb-24">
        {/* Order summary */}
        <div className="bg-card rounded-lg shadow-md p-4 mb-4">
          <h2 className="font-semibold mb-2">Ringkasan Pesanan</h2>
          <div className="space-y-2">
            {cartItems.map((item) => (
              <div key={item.item.id} className="flex justify-between">
                <div className="flex-1">
                  <span className="font-medium">{item.quantity}x</span> {item.item.name}
                </div>
                <div className="font-medium">
                  Rp {formatPrice(item.item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t mt-3 pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>Rp {formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service Charge (5%)</span>
              <span>Rp {formatPrice(serviceCharge)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Pajak (10%)</span>
              <span>Rp {formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between font-bold pt-2">
              <span>Total</span>
              <span>Rp {formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* Table Information */}
        <div className="bg-card rounded-lg shadow-md p-4 mb-4">
          <h2 className="font-semibold mb-3">Informasi Meja</h2>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Nomor Meja <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Contoh: A12, 15, dst."
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                <Users className="w-4 h-4" /> Jumlah Orang
              </label>
              <div className="flex items-center">
                <button 
                  className="px-3 py-1 border rounded-l-md bg-muted"
                  onClick={() => setNumberOfPeople(prev => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <input 
                  type="number"
                  className="w-full p-2 border-y text-center text-sm focus:outline-none"
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                />
                <button 
                  className="px-3 py-1 border rounded-r-md bg-muted"
                  onClick={() => setNumberOfPeople(prev => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Catatan Tambahan
              </label>
              <textarea 
                className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                rows={2}
                placeholder="Misal: level pedas, tanpa bawang, dll."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Payment method */}
        <div className="bg-card rounded-lg shadow-md p-4 mb-4">
          <h2 className="font-semibold mb-3">Metode Pembayaran</h2>
          
          <div className="space-y-2">
            <div 
              className={`flex items-center p-3 border rounded-md cursor-pointer ${paymentMethod === 'qris' ? 'border-primary bg-primary/5' : ''}`}
              onClick={() => setPaymentMethod('qris')}
            >
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${paymentMethod === 'qris' ? 'border-primary' : 'border-muted-foreground'}`}>
                {paymentMethod === 'qris' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
              </div>
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                <span>QRIS (GoPay, OVO, DANA, LinkAja, ShopeePay)</span>
              </div>
            </div>
            
            <div 
              className={`flex items-center p-3 border rounded-md cursor-pointer ${paymentMethod === 'kasir' ? 'border-primary bg-primary/5' : ''}`}
              onClick={() => setPaymentMethod('kasir')}
            >
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${paymentMethod === 'kasir' ? 'border-primary' : 'border-muted-foreground'}`}>
                {paymentMethod === 'kasir' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                <span>Bayar di Kasir</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t">
        <button 
          className={`w-full rounded-lg py-3 flex items-center justify-center ${isFormValid ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}
          onClick={handleProceedToPayment}
          disabled={!isFormValid}
        >
          {paymentMethod === 'qris' ? 'Bayar Sekarang' : 'Pesan Sekarang'} - Rp {formatPrice(total)}
        </button>
      </div>

      {/* QRIS Payment Sheet */}
      {showQRCode && paymentMethod === 'qris' && (
        <Sheet open={showQRCode} onOpenChange={setShowQRCode}>
          <SheetContent side="bottom" className="h-[90vh] rounded-t-xl p-0">
            <div className="bg-background h-full overflow-y-auto">
              <SheetHeader className="border-b p-4 sticky top-0 bg-card z-10">
                <div className="flex items-center">
                  <SheetClose className="p-1 mr-2 rounded-full hover:bg-muted">
                    <ChevronLeft className="w-5 h-5" />
                  </SheetClose>
                  <SheetTitle>Pembayaran QRIS</SheetTitle>
                </div>
              </SheetHeader>

              <div className="p-4 text-center">
                {!paymentComplete ? (
                  <>
                    <div className="mb-4">
                      <h3 className="font-semibold">Scan QR code untuk membayar</h3>
                      <p className="text-sm text-muted-foreground">
                        Total pembayaran: <span className="font-medium">Rp {formatPrice(total)}</span>
                      </p>
                    </div>
                    
                    {/* Payment timer */}
                    <div className="mb-4 flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        Bayar dalam {String(paymentExpiry.minutes).padStart(2, '0')}:{String(paymentExpiry.seconds).padStart(2, '0')}
                      </span>
                      <button 
                        onClick={resetTimer}
                        className="rounded-full p-1 hover:bg-muted"
                      >
                        <RefreshCcw className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                    
                    {/* QR Code */}
                    <div className="flex justify-center mb-4">
                      <div className="bg-white p-4 rounded-lg border">
                        <div className="w-64 h-64 bg-muted flex items-center justify-center">
                          <QrCode className="w-48 h-48 text-primary" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Order Details */}
                    <div className="mb-6 bg-muted rounded-lg p-3 text-left">
                      <p className="text-sm mb-1 flex justify-between">
                        <span className="text-muted-foreground">No. Transaksi:</span>
                        <span className="font-medium">{orderNumber}</span>
                      </p>
                      <p className="text-sm mb-1 flex justify-between">
                        <span className="text-muted-foreground">No. Meja:</span>
                        <span className="font-medium">{tableNumber}</span>
                      </p>
                      <p className="text-sm flex justify-between">
                        <span className="text-muted-foreground">Jumlah Orang:</span>
                        <span className="font-medium">{numberOfPeople} orang</span>
                      </p>
                    </div>
                    
                    {/* Payment instructions */}
                    <div className="bg-muted rounded-lg p-4 text-left mb-4">
                      <h4 className="font-medium mb-2">Cara Pembayaran:</h4>
                      <ol className="text-sm space-y-2 list-decimal pl-4">
                        <li>Buka aplikasi e-wallet pilihan Anda (GoPay, OVO, DANA, dll)</li>
                        <li>Pilih opsi scan QR code</li>
                        <li>Scan QR code di atas</li>
                        <li>Periksa detail transaksi</li>
                        <li>Selesaikan pembayaran</li>
                      </ol>
                    </div>
                    
                    {/* For demo purposes - payment simulation */}
                    <button 
                      className="w-full rounded-lg py-3 bg-primary text-primary-foreground"
                      onClick={handleCompletePayment}
                    >
                      Simulasi Pembayaran Berhasil
                    </button>
                  </>
                ) : (
                  <div className="py-8 flex flex-col items-center">
                    <div className="mb-4 text-green-500">
                      <CheckCircle2 className="w-16 h-16" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Pembayaran Berhasil!</h2>
                    <p className="text-muted-foreground mb-6">
                      Pesanan Anda sedang diproses
                    </p>
                    <div className="w-full p-4 bg-muted rounded-lg mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">No. Transaksi:</span>
                        <span className="font-medium">{orderNumber}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">No. Meja:</span>
                        <span className="font-medium">{tableNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total:</span>
                        <span className="font-medium">Rp {formatPrice(total)}</span>
                      </div>
                    </div>
                    <p className="text-center text-sm text-muted-foreground">
                      Silahkan tunggu pesanan Anda...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
      
      {/* Order Confirmation for Kasir Payment */}
      {showQRCode && paymentMethod === 'kasir' && (
        <Sheet open={showQRCode} onOpenChange={setShowQRCode}>
          <SheetContent side="bottom" className="h-[70vh] rounded-t-xl p-0">
            <div className="bg-background h-full overflow-y-auto">
              <SheetHeader className="border-b p-4 sticky top-0 bg-card z-10">
                <div className="flex items-center">
                  <SheetClose className="p-1 mr-2 rounded-full hover:bg-muted">
                    <ChevronLeft className="w-5 h-5" />
                  </SheetClose>
                  <SheetTitle>Konfirmasi Pesanan</SheetTitle>
                </div>
              </SheetHeader>

              <div className="p-6 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                </div>
                
                <h2 className="text-xl font-bold mb-2">Pesanan Berhasil!</h2>
                <p className="text-muted-foreground mb-6">
                  Pesanan Anda telah diterima dan sedang diproses
                </p>
                
                <div className="bg-muted rounded-lg p-4 text-left mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">No. Transaksi:</span>
                    <span className="font-medium">{orderNumber}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">No. Meja:</span>
                    <span className="font-medium">{tableNumber}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Jumlah Orang:</span>
                    <span className="font-medium">{numberOfPeople} orang</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-medium">Rp {formatPrice(total)}</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  Silahkan lakukan pembayaran di kasir menggunakan nomor transaksi Anda
                </p>
                
                <button 
                  className="w-full rounded-lg py-3 bg-primary text-primary-foreground"
                  onClick={() => {
                    clearCart();
                    router.push('/order-success');
                  }}
                >
                  Kembali ke Menu
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}