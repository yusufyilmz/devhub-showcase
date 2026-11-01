import type React from "react";
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../Button";
import { Card } from "../Card";
import { FlexCol, FlexRow } from "../Flex";
import { Typography } from "../Typography";
import { SearchField, TextArea, TextField } from "./TextField";

/**
 * Demo component showcasing the TextField component with theme integration
 */
const TextFieldDemo: React.FC = () => {
  const [formData, setFormData] = useState({
    confirmPassword: "",
    email: "",
    message: "",
    name: "",
    password: "",
    search: "",
  });

  const [errors, showErrors] = useState<{ [key: string]: string }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      showErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    showErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Form submitted successfully!");
    }
  };

  return (
    <FlexCol gap="xl" padding="lg" width="full">
      <Typography variant="h1">TextField System Demo</Typography>

      {/* Basic TextField Examples */}
      <FlexCol gap="lg">
        <Typography variant="h2">Basic TextField Examples</Typography>

        <Card className="p-6">
          <FlexCol gap="md">
            <TextField
              helperText="This is a basic text input"
              label="Basic Input"
              placeholder="Enter some text"
            />

            <TextField
              helperText="This field is required"
              label="Required Field"
              placeholder="This field is required"
              required
            />

            <TextField
              disabled
              helperText="This input is disabled"
              label="Disabled Input"
              placeholder="This input is disabled"
            />
          </FlexCol>
        </Card>
      </FlexCol>

      {/* Input Variants */}
      <FlexCol gap="lg">
        <Typography variant="h2">Input Variants</Typography>

        <Card className="p-6">
          <FlexCol gap="md">
            <TextField label="Default" placeholder="Default variant" variant="default" />
            <TextField label="Primary" placeholder="Primary variant" variant="default" />
            <TextField
              label="Destructive"
              placeholder="Destructive variant"
              variant="destructive"
            />
            <TextField label="Success" placeholder="Success variant" variant="success" />
            <TextField label="Warning" placeholder="Warning variant" variant="warning" />
            <TextField label="Info" placeholder="Info variant" variant="info" />
          </FlexCol>
        </Card>
      </FlexCol>

      {/* Input Sizes */}
      <FlexCol gap="lg">
        <Typography variant="h2">Input Sizes</Typography>

        <Card className="p-6">
          <FlexCol gap="md">
            <TextField label="Small" placeholder="Small input" size="sm" />
            <TextField label="Default" placeholder="Default input" size="default" />
            <TextField label="Large" placeholder="Large input" size="lg" />
          </FlexCol>
        </Card>
      </FlexCol>

      {/* Input States */}
      <FlexCol gap="lg">
        <Typography variant="h2">Input States</Typography>

        <Card className="p-6">
          <FlexCol gap="md">
            <TextField
              error="Please enter a valid email address"
              label="Error State"
              placeholder="Enter your email"
              state="error"
            />

            <TextField
              label="Success State"
              placeholder="Enter your email"
              state="success"
              success="Email is valid"
            />

            <TextField
              label="Warning State"
              placeholder="Enter your password"
              state="warning"
              warning="Password is weak"
            />
          </FlexCol>
        </Card>
      </FlexCol>

      {/* Icons */}
      <FlexCol gap="lg">
        <Typography variant="h2">Input with Icons</Typography>

        <Card className="p-6">
          <FlexCol gap="md">
            <TextField label="Search" leftIcon={<span>🔍</span>} placeholder="Search products..." />

            <TextField
              label="Email"
              leftIcon={<span>📧</span>}
              placeholder="Enter your email"
              type="email"
            />

            <TextField
              label="Password"
              placeholder="Enter your password"
              rightIcon={<span>👁️</span>}
              type="password"
            />

            <TextField
              label="Amount"
              leftIcon={<span>💰</span>}
              placeholder="0.00"
              rightIcon={<span>USD</span>}
              type="number"
            />
          </FlexCol>
        </Card>
      </FlexCol>

      {/* TextArea */}
      <FlexCol gap="lg">
        <Typography variant="h2">TextArea Examples</Typography>

        <Card className="p-6">
          <FlexCol gap="md">
            <TextArea
              helperText="Tell us what you think"
              label="Message"
              placeholder="Enter your message"
              rows={4}
            />

            <TextArea
              helperText="Code will be formatted automatically"
              label="Code"
              placeholder="Enter your code"
              resize="none"
              rows={6}
            />

            <TextArea
              helperText="You can resize vertically"
              label="Description"
              placeholder="Enter a description"
              resize="vertical"
              rows={3}
            />
          </FlexCol>
        </Card>
      </FlexCol>

      {/* SearchField */}
      <FlexCol gap="lg">
        <Typography variant="h2">SearchField Examples</Typography>

        <Card className="p-6">
          <FlexCol gap="md">
            <SearchField
              onChange={(e) => handleInputChange("search", e.target.value)}
              onClear={() => handleInputChange("search", "")}
              placeholder="Search products..."
              value={formData.search}
            />

            <SearchField
              helperText="Use advanced search to find specific items"
              label="Advanced Search"
              placeholder="Search with filters..."
            />
          </FlexCol>
        </Card>
      </FlexCol>

      {/* Interactive Form */}
      <FlexCol gap="lg">
        <Typography variant="h2">Interactive Form</Typography>

        <Card className="p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <FlexCol gap="md">
              <TextField
                error={errors.name as string}
                label="Full Name"
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                required
                value={formData.name}
              />

              <TextField
                error={errors.email as string}
                helperText="We'll never share your email"
                label="Email Address"
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
                required
                type="email"
                value={formData.email}
              />

              <TextField
                error={errors.password}
                helperText="Must be at least 8 characters"
                label="Password"
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Enter your password"
                required
                type="password"
                value={formData.password}
              />

              <TextField
                error={errors.confirmPassword}
                label="Confirm Password"
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                placeholder="Confirm your password"
                required
                type="password"
                value={formData.confirmPassword}
              />

              <TextArea
                helperText="Optional message"
                label="Message"
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Enter your message"
                rows={4}
                value={formData.message}
              />

              <FlexRow gap="md" justify="end">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button type="submit" variant="default">
                  Submit
                </Button>
              </FlexRow>
            </FlexCol>
          </form>
        </Card>
      </FlexCol>

      {/* Form Validation States */}
      <FlexCol gap="lg">
        <Typography variant="h2">Form Validation States</Typography>

        <Card className="p-6">
          <FlexCol gap="md">
            <TextField
              label="Valid Email"
              placeholder="user@example.com"
              state="success"
              success="Email is valid"
              type="email"
              value="user@example.com"
            />

            <TextField
              error="Please enter a valid email address"
              label="Invalid Email"
              placeholder="invalid-email"
              state="error"
              type="email"
              value="invalid-email"
            />

            <TextField
              label="Weak Password"
              placeholder="123"
              state="warning"
              type="password"
              value="123"
              warning="Password is too weak"
            />
          </FlexCol>
        </Card>
      </FlexCol>

      {/* Responsive Grid */}
      <FlexCol gap="lg">
        <Typography variant="h2">Responsive Grid</Typography>

        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="First Name" placeholder="Enter first name" />
            <TextField label="Last Name" placeholder="Enter last name" />
            <TextField label="Email" placeholder="Enter email" type="email" />
            <TextField label="Phone" placeholder="Enter phone number" type="tel" />
          </div>
        </Card>
      </FlexCol>
    </FlexCol>
  );
};

const meta = {
  component: TextFieldDemo,
  parameters: { layout: "fullscreen" },
  title: "Components/TextField",
} satisfies Meta<typeof TextFieldDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Demo: Story = {};
