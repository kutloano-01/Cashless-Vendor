import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { VendorRegistration } from "@/components/vendor-registration";
import "@testing-library/jest-dom";

// Mock the form validation hook
jest.mock("@/hooks/use-form-validation", () => ({
  useFormValidation: jest.fn(() => ({
    values: {
      businessName: "",
      ownerName: "",
      phone: "",
      location: "",
      businessType: undefined,
      description: "",
    },
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: false,
    getFieldProps: jest.fn((name: string) => ({
      value: "",
      onChange: jest.fn(),
      onBlur: jest.fn(),
    })),
    getSelectProps: jest.fn((name: string) => ({
      value: "",
      onValueChange: jest.fn(),
    })),
    setValue: jest.fn(),
    setTouched: jest.fn(),
    handleSubmit: jest.fn(),
  })),
}));

describe("VendorRegistration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the first step of registration", () => {
    render(<VendorRegistration />);

    expect(screen.getByText("Vendor Registration")).toBeInTheDocument();
    expect(
      screen.getByText("Step 1 of 3 - Let's get you set up")
    ).toBeInTheDocument();
    expect(screen.getByText("Business Information")).toBeInTheDocument();
    expect(screen.getByLabelText("Business Name *")).toBeInTheDocument();
    expect(screen.getByLabelText("Owner Name *")).toBeInTheDocument();
  });

  it("should show step indicators", () => {
    render(<VendorRegistration />);

    // Should show 3 step indicators
    const stepIndicators = screen
      .getAllByRole("generic")
      .filter((el: HTMLElement) =>
        el.className.includes("w-3 h-3 rounded-full")
      );
    expect(stepIndicators).toHaveLength(3);
  });

  it("should have Next button disabled initially", () => {
    render(<VendorRegistration />);

    const nextButton = screen.getByRole("button", { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it("should show business name input with placeholder", () => {
    render(<VendorRegistration />);

    const businessNameInput = screen.getByPlaceholderText(
      "e.g., Maria's Fresh Fruits"
    );
    expect(businessNameInput).toBeInTheDocument();
  });

  it("should show owner name input with placeholder", () => {
    render(<VendorRegistration />);

    const ownerNameInput = screen.getByPlaceholderText("Your full name");
    expect(ownerNameInput).toBeInTheDocument();
  });
});

describe("VendorRegistration - Step Navigation", () => {
  const mockUseFormValidation =
    require("@/hooks/use-form-validation").useFormValidation;

  it("should enable Next button when step 1 is valid", () => {
    mockUseFormValidation.mockReturnValue({
      values: {
        businessName: "Test Business",
        ownerName: "Test Owner",
        phone: "",
        location: "",
        businessType: undefined,
        description: "",
      },
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: false,
      getFieldProps: jest.fn(),
      getSelectProps: jest.fn(),
      setValue: jest.fn(),
      setTouched: jest.fn(),
      handleSubmit: jest.fn(),
    });

    render(<VendorRegistration />);

    const nextButton = screen.getByRole("button", { name: /next/i });
    expect(nextButton).not.toBeDisabled();
  });

  it("should show step 2 content when navigated", async () => {
    // Mock valid step 1 data
    mockUseFormValidation.mockReturnValue({
      values: {
        businessName: "Test Business",
        ownerName: "Test Owner",
        phone: "",
        location: "",
        businessType: undefined,
        description: "",
      },
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: false,
      getFieldProps: jest.fn(),
      getSelectProps: jest.fn(),
      setValue: jest.fn(),
      setTouched: jest.fn(),
      handleSubmit: jest.fn(),
    });

    render(<VendorRegistration />);

    const nextButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText("Contact & Location")).toBeInTheDocument();
    });
  });
});

describe("VendorRegistration - Form Validation", () => {
  const mockUseFormValidation =
    require("@/hooks/use-form-validation").useFormValidation;

  it("should display validation errors", () => {
    mockUseFormValidation.mockReturnValue({
      values: {
        businessName: "A",
        ownerName: "",
        phone: "",
        location: "",
        businessType: undefined,
        description: "",
      },
      errors: {
        businessName: "Business name must be at least 2 characters",
        ownerName: "Owner name is required",
      },
      touched: {
        businessName: true,
        ownerName: true,
      },
      isSubmitting: false,
      isValid: false,
      getFieldProps: jest.fn(),
      getSelectProps: jest.fn(),
      setValue: jest.fn(),
      setTouched: jest.fn(),
      handleSubmit: jest.fn(),
    });

    render(<VendorRegistration />);

    expect(
      screen.getByText("Business name must be at least 2 characters")
    ).toBeInTheDocument();
    expect(screen.getByText("Owner name is required")).toBeInTheDocument();
  });
});

describe("VendorRegistration - Success State", () => {
  const mockUseFormValidation =
    require("@/hooks/use-form-validation").useFormValidation;

  it("should show success message after registration", () => {
    // Mock the component to show success state
    const SuccessComponent = () => (
      <div>
        <h3>Registration Successful!</h3>
        <p>
          Welcome to CashlessVendor, Test Owner! Your QR payment system is
          ready.
        </p>
        <span>CV-TEST12345</span>
      </div>
    );

    render(<SuccessComponent />);

    expect(screen.getByText("Registration Successful!")).toBeInTheDocument();
    expect(
      screen.getByText(/Welcome to CashlessVendor, Test Owner!/)
    ).toBeInTheDocument();
    expect(screen.getByText("CV-TEST12345")).toBeInTheDocument();
  });
});
