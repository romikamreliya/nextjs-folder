import * as Yup from "yup";

export const formSchema = Yup.object().shape({
  fullName: Yup.string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .required("Full name is required"),
  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email address is required"),
  role: Yup.string()
    .required("Please select an account role"),
  agreeToTerms: Yup.boolean()
    .oneOf([true], "You must agree to the terms and conditions"),
});
