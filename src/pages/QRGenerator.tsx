
import { useState } from "react";
import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import QRCode from "react-qr-code";
import { VisitorType } from "@/types/visitors";

const QRGenerator = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [visitorType, setVisitorType] = useState<VisitorType>("regular");
  const [qrValue, setQrValue] = useState("");
  const [showQR, setShowQR] = useState(false);

  const handleGenerateQR = () => {
    if (!firstName || !lastName) {
      toast.error("Du måste ange både för- och efternamn");
      return;
    }

    const visitorData = {
      firstName,
      lastName,
      company,
      type: visitorType
    };

    setQrValue(JSON.stringify(visitorData));
    setShowQR(true);
    toast.success("QR-kod genererad!");
  };

  const handleReset = () => {
    setFirstName("");
    setLastName("");
    setCompany("");
    setVisitorType("regular");
    setQrValue("");
    setShowQR(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">QR-kod Generator</h1>
        <p className="text-gray-600">Förregistrera ditt besök och generera en QR-kod</p>
      </header>

      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-6 w-6" />
            {showQR ? "Din QR-kod" : "Fyll i information"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showQR ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Förnamn</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Förnamn"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Efternamn</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Efternamn"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Företag (valfritt)</Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Företag"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visitorType">Besökstyp</Label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="visitorType"
                      checked={visitorType === "regular"}
                      onChange={() => setVisitorType("regular")}
                      className="h-4 w-4 rounded-full"
                    />
                    <span>Vanligt besök</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="visitorType"
                      checked={visitorType === "service"}
                      onChange={() => setVisitorType("service")}
                      className="h-4 w-4 rounded-full"
                    />
                    <span>Service besök</span>
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="bg-white p-4 rounded-xl">
                <QRCode value={qrValue} size={200} />
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Visa denna QR-kod vid incheckning
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {!showQR ? (
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={handleGenerateQR}
            >
              Generera QR-kod
            </Button>
          ) : (
            <div className="flex w-full gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleReset}
              >
                Ny QR-kod
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => window.print()}
              >
                Skriv ut
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      <div className="mt-8">
        <Button variant="outline" onClick={() => window.location.href = "/"}>
          Tillbaka till incheckning
        </Button>
      </div>
    </div>
  );
};

export default QRGenerator;
