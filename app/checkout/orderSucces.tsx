'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, ArrowLeft, ChevronDown, Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrderSuccess() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState('');
  const [tableNumber, setTableNumber] = useState('A15');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Generate dummy order number
    const randomOrderNumber = 'TRX' + Math.floor(10000 + Math.random() * 90000);
    setOrderNumber(randomOrderNumber);
    
    // Randomize estimated time between 15-30 minutes
    const randomMinutes = Math.floor(15 + Math.random() * 15);
    setEstimatedTime(`${randomMinutes} menit`);
    
    // Simulate order progress for demo purposes
    const progressTimer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < 3) return prev + 1;
        clearInterval(progressTimer);
        return prev;
      });
    }, 5000);
    
    return () => clearInterval(progressTimer);
  }, []);

  // Function to copy order number
  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm p-4 sticky top-0 z-10 flex items-center">
        <button 
          onClick={() => router.push('/menu')}
          className="p-1 rounded-full hover:bg-muted absolute left-4"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-center flex-1">Detail Pesanan</h1>
      </header>

      <div className="flex-1 p-4 pb-24">
        {/* Success message */}
        <div className="bg-card rounded-lg shadow-md p-6 mb-4 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <h2 className="text-xl font-bold mb-1">Pesanan Berhasil!</h2>
          <p className="text-muted-foreground">Pesanan Anda sedang diproses</p>
          
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">No. Transaksi:</span>
              <div className="flex items-center gap-1">
                <span className="font-medium font-mono">{orderNumber}</span>
                <button 
                  onClick={copyOrderNumber}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-muted-foreground">No. Meja:</span>
              <span className="font-medium">{tableNumber}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-muted-foreground">Estimasi Siap:</span>
              <span className="font-medium">{estimatedTime}</span>
            </div>
          </div>
        </div>

        {/* Order tracking */}
        <div className="bg-card rounded-lg shadow-md p-4 mb-4">
          <h3 className="font-semibold mb-4">Status Pesanan</h3>
          
          <div className="relative">
            {/* Progress line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted z-0" />
            
            {/* Step 1: Order received */}
            <div className="flex items-start relative z-10 mb-6">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 
                ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                1
              </div>
              <div className="ml-4">
                <h4 className="font-medium">Pesanan Diterima</h4>
                <p className="text-sm text-muted-foreground">Restoran telah menerima pesanan Anda</p>
                {currentStep >= 1 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {new Date().toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
            
            {/* Step 2: Order preparation */}
            <div className="flex items-start relative z-10 mb-6">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 
                ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                2
              </div>
              <div className="ml-4">
                <h4 className="font-medium">Pesanan Sedang Diproses</h4>
                <p className="text-sm text-muted-foreground">Koki kami sedang menyiapkan pesanan Anda</p>
                {currentStep >= 2 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {new Date().toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
            
            {/* Step 3: Food ready */}
            <div className="flex items-start relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 
                ${currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                3
              </div>
              <div className="ml-4">
                <h4 className="font-medium">Pesanan Siap</h4>
                <p className="text-sm text-muted-foreground">Pesanan Anda sudah siap dan akan segera disajikan</p>
                {currentStep >= 3 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {new Date().toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Details */}
        <div className="bg-card rounded-lg shadow-md overflow-hidden mb-4">
          <button 
            className="flex justify-between items-center w-full p-4 text-left font-semibold"
            onClick={() => setShowDetails(!showDetails)}
          >
            <span>Detail Pesanan</span>
            <ChevronDown className={`w-5 h-5 transition-transform ${showDetails ? 'transform rotate-180' : ''}`} />
          </button>
          
          {showDetails && (
            <div className="p-4 border-t">
              {/* Dummy order items */}
              <div className="space-y-2 mb-3">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <span className="font-medium">2x</span> Nasi Goreng Spesial
                  </div>
                  <div className="font-medium">
                    Rp 70.000
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex-1">
                    <span className="font-medium">1x</span> Sate Ayam
                  </div>
                  <div className="font-medium">
                    Rp 25.000
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex-1">
                    <span className="font-medium">2x</span> Jus Alpukat
                  </div>
                  <div className="font-medium">
                    Rp 30.000
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>Rp 125.000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service Charge (5%)</span>
                  <span>Rp 6.250</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pajak (10%)</span>
                  <span>Rp 12.500</span>
                </div>
                <div className="flex justify-between font-bold pt-2">
                  <span>Total</span>
                  <span>Rp 143.750</span>
                </div>
              </div>
              
              {/* Notes if any */}
              <div className="mt-4 pt-3 border-t">
                <p className="text-sm text-muted-foreground">Catatan:</p>
                <p className="text-sm">Nasi goreng tidak pedas, sate tanpa bawang</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t">
        <div className="grid grid-cols-2 gap-3">
          <button 
            className="py-3 px-4 bg-muted hover:bg-secondary text-foreground rounded-lg font-medium"
            onClick={() => router.push('/menu')}
          >
            Tambah Pesanan
          </button>
          <button 
            className="py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium"
            onClick={() => {
              // In a real app, this would route to a customer support or call page
              alert('Memanggil pelayan...');
            }}
          >
            Panggil Pelayan
          </button>
        </div>
      </div>
    </div>
  );
}