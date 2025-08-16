"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Store,
  MapPin,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { useFormValidation } from "@/hooks/use-form-validation";
import {
  vendorRegistrationSchema,
  type VendorRegistrationData,
} from "@/lib/schemas";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function VendorRegistration() {
  const [step, setStep] = useState(1);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [vendorId, setVendorId] = useState("");

  const {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    getFieldProps,
    getSelectProps,
    setValue,
    setTouched,
    handleSubmit,
  } = useFormValidation<VendorRegistrationData>({
    schema: vendorRegistrationSchema,
    initialValues: {
      businessName: "",
      ownerName: "",
      phone: "",
      location: "",
      businessType: undefined,
      description: "",
    },
    onSubmit: async (data) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate vendor ID
      const newVendorId = `CV-${Math.random()
        .toString(36)
        .substr(2, 8)
        .toUpperCase()}`;
      setVendorId(newVendorId);
      setRegistrationSuccess(true);
    },
  });

  const handleNext = () => {
    // Validate current step before proceeding
    const currentStepValid = isStepValid();
    if (currentStepValid && step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return (
          values.businessName &&
          values.ownerName &&
          !errors.businessName &&
          !errors.ownerName
        );
      case 2:
        return (
          values.phone &&
          values.location &&
          values.businessType &&
          !errors.phone &&
          !errors.location &&
          !errors.businessType
        );
      case 3:
        return !errors.description;
      default:
        return false;
    }
  };

  if (registrationSuccess) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Registration Successful!
              </h3>
              <p className="text-muted-foreground mb-4">
                Welcome to CashlessVendor, {values.ownerName}! Your QR payment
                system is ready.
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Your Vendor ID:
              </p>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {vendorId}
              </Badge>
            </div>
            <Button
              onClick={() => (window.location.href = "/dashboard")}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Vendor Registration</CardTitle>
            <CardDescription>
              Step {step} of 3 - Let's get you set up
            </CardDescription>
          </div>
          <div className="flex space-x-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-primary mb-4">
              <Store className="w-5 h-5" />
              <h3 className="font-semibold">Business Information</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                placeholder="e.g., Maria's Fresh Fruits"
                {...getFieldProps("businessName")}
              />
              {errors.businessName && touched.businessName && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.businessName}</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerName">Owner Name *</Label>
              <Input
                id="ownerName"
                placeholder="Your full name"
                {...getFieldProps("ownerName")}
              />
              {errors.ownerName && touched.ownerName && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.ownerName}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-primary mb-4">
              <MapPin className="w-5 h-5" />
              <h3 className="font-semibold">Contact & Location</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                placeholder="+1 (555) 123-4567"
                {...getFieldProps("phone")}
              />
              {errors.phone && touched.phone && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.phone}</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Business Location *</Label>
              <Input
                id="location"
                placeholder="e.g., Corner of Main St & 5th Ave"
                {...getFieldProps("location")}
              />
              {errors.location && touched.location && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.location}</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type *</Label>
              <Select {...getSelectProps("businessType")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food & Beverages</SelectItem>
                  <SelectItem value="clothing">
                    Clothing & Accessories
                  </SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="crafts">Arts & Crafts</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.businessType && touched.businessType && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.businessType}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-primary mb-4">
              <CreditCard className="w-5 h-5" />
              <h3 className="font-semibold">Final Details</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">
                Business Description (Optional)
              </Label>
              <Textarea
                id="description"
                placeholder="Tell customers about your business..."
                {...getFieldProps("description")}
                rows={3}
              />
              {errors.description && touched.description && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.description}</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">What happens next?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Get your unique QR code instantly</li>
                <li>• Start accepting payments immediately</li>
                <li>• Track all transactions in your dashboard</li>
                <li>• Request withdrawals anytime</li>
              </ul>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          <div className="ml-auto">
            {step < 3 ? (
              <Button onClick={handleNext} disabled={!isStepValid()}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Creating Account..." : "Complete Registration"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
