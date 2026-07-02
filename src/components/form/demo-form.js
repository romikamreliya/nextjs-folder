"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import AppInput from "@/components/ui/input";
import AppSections from "@/components/ui/select";
import AppCheckbox from "@/components/ui/checkbox";
import AppButton from "@/components/ui/button";
import AppToast from "@/components/ui/toast";
import { SaveIcon, VerifiedCheck } from "@/components/icon/icons";
import { formSchema } from "@/schema/demo.schema";

export default function DemoForm() {
  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      role: "",
      agreeToTerms: false,
    },
  });

  const onSubmit = (data) => {
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      setSubmittedData(data);
      AppToast.success("Form submitted successfully!");
      reset();
    }, 1500);
  };

  const roleItems = [
    { id: "admin", label: "Administrator" },
    { id: "editor", label: "Content Editor" },
    { id: "viewer", label: "Read-Only Viewer" },
  ];

  return (
    <div className="w-full max-w-lg mx-auto bg-(--color-surface) border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-xs">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-(--color-text-primary)">
          Demo Account Creation Form
        </h3>
        <p className="text-xs text-(--color-text-muted) mt-1">
          A blueprint demonstrating React Hook Form and Yup validation integrated with core UI inputs.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name Input */}
        <AppInput
          name="fullName"
          label="Full Name"
          placeholder="e.g. Alice Cooper"
          register={register}
          errors={errors}
          required
        />

        {/* Email Address Input */}
        <AppInput
          name="email"
          label="Email Address"
          placeholder="e.g. alice.cooper@example.com"
          type="email"
          register={register}
          errors={errors}
          required
        />

        {/* Role Select Dropdown */}
        <AppSections
          name="role"
          label="Account Role"
          placeholder="Choose user privilege level"
          items={roleItems}
          register={register}
          errors={errors}
          required
        />

        {/* Agreement Checkbox */}
        <AppCheckbox
          name="agreeToTerms"
          label="I agree to the terms and privacy policy"
          register={register}
          errors={errors}
        />

        {/* Submit Button */}
        <AppButton
          type="submit"
          name={loading ? "Creating Account..." : "Create Account"}
          variant="primary"
          loading={loading}
          startIcon={<SaveIcon className="text-base" />}
          fullWidth
        />
      </form>

      {/* Submitted Output Card */}
      {submittedData && (
        <div className="mt-8 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-2 text-emerald-800 dark:text-emerald-300 font-semibold text-sm">
            <VerifiedCheck className="size-4 shrink-0 text-emerald-600" />
            Submitted Account Information
          </div>
          <div className="space-y-1.5 text-xs text-emerald-900 dark:text-emerald-400 font-mono">
            <div>
              <span className="font-semibold">Full Name:</span> {submittedData.fullName}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {submittedData.email}
            </div>
            <div>
              <span className="font-semibold">Role:</span> {submittedData.role}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
