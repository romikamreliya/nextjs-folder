"use client";

import React, { useState } from "react";
import AppButton from "@/components/ui/button";
import AppInput from "@/components/ui/input";
import AppSections from "@/components/ui/select";
import AppCheckbox from "@/components/ui/checkbox";
import AppSwitch from "@/components/ui/switch";
import StatsCard from "@/components/ui/statsCard";
import AppConfirmModal from "@/components/ui/confirmModal";
import AppDeleteModal from "@/components/ui/deleteModal";
import AppDrawer from "@/components/ui/drawer";
import AppToast from "@/components/ui/toast";
import DemoForm from "@/components/form/demo-form";
import { Globe, Users, ShieldUser, Sparkles, Box, Check, Copy } from "@/components/icon/icons";

export default function ComponentShowcasePage() {
  // Modal & Drawer open/close states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Form states for live demo
  const [inputText, setInputText] = useState("");
  const [selectVal, setSelectVal] = useState("");
  const [checkboxVal, setCheckboxVal] = useState(false);
  const [switchVal, setSwitchVal] = useState(true);

  // State to track copied snippets
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    AppToast.success("Code snippet copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const selectItems = [
    { id: "admin", label: "Administrator" },
    { id: "editor", label: "Editor" },
    { id: "viewer", label: "Viewer" },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-12">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-border-subtle p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <h1 className="text-3xl font-extrabold text-(--color-text-primary) tracking-tight flex items-center gap-2">
              <Sparkles className="text-indigo-500 animate-pulse" />
              UI Component Library
            </h1>
            <p className="text-sm text-(--color-text-muted) mt-1 max-w-2xl">
              Explore the premium, highly-reusable core UI components designed for this starter template. Copy the snippets below to spin up new features instantly.
            </p>
          </div>
        </div>
      </div>

      {/* ── Section: Buttons & Controls ── */}
      <div>
        <h2 className="text-xl font-bold text-(--color-text-primary) mb-4 border-b border-border-subtle pb-2">
          Buttons & Form Inputs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* AppButton Showcase */}
          <div className="flex flex-col bg-(--color-surface) border border-border-subtle rounded-2xl p-6 shadow-xs">
            <h3 className="font-semibold text-lg text-(--color-text-primary) mb-1">AppButton</h3>
            <p className="text-xs text-(--color-text-muted) mb-4">
              Standard button supporting primary, secondary, danger variants, start/end icons, and loading states.
            </p>
            
            <div className="flex flex-col gap-3 flex-1 justify-center py-4 border-y border-zinc-100 dark:border-zinc-800 my-4">
              <div className="flex flex-wrap gap-2">
                <AppButton name="Primary Button" variant="primary" fullWidth={false} onClick={() => AppToast.info("Clicked Primary!")} />
                <AppButton name="Secondary" variant="secondary" fullWidth={false} onClick={() => AppToast.info("Clicked Secondary!")} />
                <AppButton name="Danger" variant="danger" fullWidth={false} onClick={() => AppToast.danger("Clicked Danger!")} />
              </div>
              <div className="flex flex-wrap gap-2">
                <AppButton name="Loading..." variant="primary" loading={true} fullWidth={false} />
                <AppButton name="With Icon" variant="secondary" startIcon={<Globe className="size-4" />} fullWidth={false} onClick={() => AppToast.success("Flag triggered!")} />
              </div>
            </div>

            <details className="group">
              <summary className="text-xs font-semibold text-indigo-500 cursor-pointer list-none flex items-center justify-between hover:underline">
                <span>View Usage Snippet</span>
                <span className="transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="relative mt-2">
                <button 
                  onClick={() => copyToClipboard(`import AppButton from "@/components/ui/button";\n\n<AppButton\n  name="Submit Form"\n  variant="primary"\n  onClick={() => {}}\n/>`, "btn")}
                  className="absolute right-2 top-2 p-1.5 rounded-lg border border-border-subtle bg-surface-hover hover:bg-surface-active"
                >
                  {copiedId === "btn" ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                </button>
                <pre className="bg-zinc-950 text-zinc-200 text-xs p-4 rounded-xl overflow-x-auto font-mono mt-2">
                  {`import AppButton from "@/components/ui/button";

<AppButton
  name="Submit Form"
  variant="primary"
  onClick={() => {}}
/>`}
                </pre>
              </div>
            </details>
          </div>

          {/* AppInput Showcase */}
          <div className="flex flex-col bg-(--color-surface) border border-border-subtle rounded-2xl p-6 shadow-xs">
            <h3 className="font-semibold text-lg text-(--color-text-primary) mb-1">AppInput</h3>
            <p className="text-xs text-(--color-text-muted) mb-4">
              Enhanced text field with labels, descriptions, prefix/suffix icons, and error handling.
            </p>

            <div className="flex flex-col gap-4 flex-1 justify-center py-4 border-y border-zinc-100 dark:border-zinc-800 my-4">
              <AppInput
                name="demoInput"
                label="Full Name"
                placeholder="e.g. John Doe"
                value={inputText}
                onChange={(val) => setInputText(val)}
                description="Your name will be displayed on your profile."
              />
            </div>

            <details className="group">
              <summary className="text-xs font-semibold text-indigo-500 cursor-pointer list-none flex items-center justify-between hover:underline">
                <span>View Usage Snippet</span>
                <span className="transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="relative mt-2">
                <button 
                  onClick={() => copyToClipboard(`import AppInput from "@/components/ui/input";\n\n<AppInput\n  name="email"\n  label="Email Address"\n  placeholder="Enter your email"\n  value={email}\n  onChange={(val) => setEmail(val)}\n/>`, "input")}
                  className="absolute right-2 top-2 p-1.5 rounded-lg border border-border-subtle bg-surface-hover hover:bg-surface-active"
                >
                  {copiedId === "input" ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                </button>
                <pre className="bg-zinc-950 text-zinc-200 text-xs p-4 rounded-xl overflow-x-auto font-mono mt-2">
                  {`import AppInput from "@/components/ui/input";

<AppInput
  name="email"
  label="Email Address"
  placeholder="Enter your email"
  value={email}
  onChange={(val) => setEmail(val)}
/>`}
                </pre>
              </div>
            </details>
          </div>

          {/* AppSections (Select) Showcase */}
          <div className="flex flex-col bg-(--color-surface) border border-border-subtle rounded-2xl p-6 shadow-xs">
            <h3 className="font-semibold text-lg text-(--color-text-primary) mb-1">AppSections (Select)</h3>
            <p className="text-xs text-(--color-text-muted) mb-4">
              Select list wrapper supporting single/multiple option states.
            </p>

            <div className="flex flex-col gap-4 flex-1 justify-center py-4 border-y border-zinc-100 dark:border-zinc-800 my-4">
              <AppSections
                name="demoSelect"
                label="Role Category"
                placeholder="Choose a user role"
                items={selectItems}
                selectedKey={selectVal}
                onChange={(e) => setSelectVal(e.target.value)}
              />
            </div>

            <details className="group">
              <summary className="text-xs font-semibold text-indigo-500 cursor-pointer list-none flex items-center justify-between hover:underline">
                <span>View Usage Snippet</span>
                <span className="transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="relative mt-2">
                <button 
                  onClick={() => copyToClipboard(`import AppSections from "@/components/ui/select";\n\n<AppSections\n  name="role"\n  label="Select Role"\n  placeholder="Select role"\n  items={items}\n  selectedKey={roleKey}\n  onChange={(e) => setRoleKey(e.target.value)}\n/>`, "select")}
                  className="absolute right-2 top-2 p-1.5 rounded-lg border border-border-subtle bg-surface-hover hover:bg-surface-active"
                >
                  {copiedId === "select" ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                </button>
                <pre className="bg-zinc-950 text-zinc-200 text-xs p-4 rounded-xl overflow-x-auto font-mono mt-2">
                  {`import AppSections from "@/components/ui/select";

<AppSections
  name="role"
  label="Select Role"
  placeholder="Select role"
  items={[{ id: "1", label: "Admin" }]}
  selectedKey={roleKey}
  onChange={(e) => setRoleKey(e.target.value)}
/>`}
                </pre>
              </div>
            </details>
          </div>

          {/* AppCheckbox & AppSwitch Showcase */}
          <div className="flex flex-col bg-(--color-surface) border border-border-subtle rounded-2xl p-6 shadow-xs">
            <h3 className="font-semibold text-lg text-(--color-text-primary) mb-1">Checkbox & Switch</h3>
            <p className="text-xs text-(--color-text-muted) mb-4">
              Checkbox controls and Switch toggles with labels and descriptive subtext.
            </p>

            <div className="flex flex-col gap-4 flex-1 justify-center py-4 border-y border-zinc-100 dark:border-zinc-800 my-4">
              <AppCheckbox
                name="demoCheckbox"
                label="Subscribe to newsletter"
                description="We'll send weekly template updates."
                isSelected={checkboxVal}
                onChange={(checked) => setCheckboxVal(checked)}
              />
              <AppSwitch
                isSelected={switchVal}
                onChange={(val) => setSwitchVal(val)}
                aria-label="Toggle dark mode preference"
              >
                <span className="text-sm font-medium text-(--color-text)">
                  {switchVal ? "Notifications Enabled" : "Notifications Disabled"}
                </span>
              </AppSwitch>
            </div>

            <details className="group">
              <summary className="text-xs font-semibold text-indigo-500 cursor-pointer list-none flex items-center justify-between hover:underline">
                <span>View Usage Snippet</span>
                <span className="transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="relative mt-2">
                <button 
                  onClick={() => copyToClipboard(`import AppCheckbox from "@/components/ui/checkbox";\nimport AppSwitch from "@/components/ui/switch";\n\n<AppCheckbox\n  name="agree"\n  label="I agree to terms"\n  isSelected={agree}\n  onChange={setAgree}\n/>\n\n<AppSwitch isSelected={enabled} onChange={setEnabled}>\n  <span>Enable Option</span>\n</AppSwitch>`, "checkswitch")}
                  className="absolute right-2 top-2 p-1.5 rounded-lg border border-border-subtle bg-surface-hover hover:bg-surface-active"
                >
                  {copiedId === "checkswitch" ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                </button>
                <pre className="bg-zinc-950 text-zinc-200 text-xs p-4 rounded-xl overflow-x-auto font-mono mt-2">
                  {`import AppCheckbox from "@/components/ui/checkbox";
import AppSwitch from "@/components/ui/switch";

<AppCheckbox
  name="agree"
  label="I agree to terms"
  isSelected={agree}
  onChange={setAgree}
/>

<AppSwitch isSelected={enabled} onChange={setEnabled}>
  <span>Enable Option</span>
</AppSwitch>`}
                </pre>
              </div>
            </details>
          </div>

        </div>
      </div>

      {/* ── Section: Information Cards & Switches ── */}
      <div>
        <h2 className="text-xl font-bold text-(--color-text-primary) mb-4 border-b border-border-subtle pb-2">
          Information & State Cards
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <StatsCard
            title="Total Users"
            value="1,280"
            icon={Users}
            gradientFrom="#6366f1"
            gradientTo="#818cf8"
            glowColor="rgba(99,102,241,0.05)"
            shadowColor="rgba(99,102,241,0.2)"
          />

          <StatsCard
            title="Active Licenses"
            value="450"
            icon={ShieldUser}
            gradientFrom="#10b981"
            gradientTo="#34d399"
            glowColor="rgba(16,185,129,0.05)"
            shadowColor="rgba(16,185,129,0.2)"
          />

          <StatsCard
            title="Total Assets"
            value="24"
            icon={Box}
            gradientFrom="#f59e0b"
            gradientTo="#fbbf24"
            glowColor="rgba(245,158,11,0.05)"
            shadowColor="rgba(245,158,11,0.2)"
          />

        </div>
      </div>

      {/* ── Section: Modals & Overlays ── */}
      <div>
        <h2 className="text-xl font-bold text-(--color-text-primary) mb-4 border-b border-border-subtle pb-2">
          Modals, Drawers & Toasts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Modal triggering */}
          <div className="flex flex-col bg-(--color-surface) border border-border-subtle rounded-2xl p-6 shadow-xs">
            <h3 className="font-semibold text-lg text-(--color-text-primary) mb-1">Confirm & Delete Modals</h3>
            <p className="text-xs text-(--color-text-muted) mb-4">
              Pre-styled modals for general confirmations and destructive deletions.
            </p>
            <div className="flex flex-col gap-2 flex-1 justify-center py-4 border-y border-zinc-100 dark:border-zinc-800 my-4">
              <AppButton name="Open Confirm Modal" variant="primary" onClick={() => setIsConfirmOpen(true)} />
              <AppButton name="Open Delete Modal" variant="danger" onClick={() => setIsDeleteOpen(true)} />
            </div>
          </div>

          {/* Drawer Showcase */}
          <div className="flex flex-col bg-(--color-surface) border border-border-subtle rounded-2xl p-6 shadow-xs">
            <h3 className="font-semibold text-lg text-(--color-text-primary) mb-1">AppDrawer</h3>
            <p className="text-xs text-(--color-text-muted) mb-4">
              Animated slide-out right drawer panel for complex edit/view forms.
            </p>
            <div className="flex flex-col justify-center flex-1 py-4 border-y border-zinc-100 dark:border-zinc-800 my-4">
              <AppButton name="Toggle Slide-Out Drawer" variant="secondary" onClick={() => setIsDrawerOpen(true)} />
            </div>
          </div>

          {/* Toast Notification Showcase */}
          <div className="flex flex-col bg-(--color-surface) border border-border-subtle rounded-2xl p-6 shadow-xs">
            <h3 className="font-semibold text-lg text-(--color-text-primary) mb-1">AppToast Notifications</h3>
            <p className="text-xs text-(--color-text-muted) mb-4">
              Trigger beautiful glassmorphic top-right toast alerts for feedback.
            </p>
            <div className="flex flex-col gap-2 flex-1 justify-center py-4 border-y border-zinc-100 dark:border-zinc-800 my-4">
              <div className="grid grid-cols-2 gap-2">
                <AppButton name="Success" variant="secondary" size="md" onClick={() => AppToast.success("Action completed!")} />
                <AppButton name="Error" variant="secondary" size="md" onClick={() => AppToast.danger("Something failed.")} />
                <AppButton name="Info" variant="secondary" size="md" onClick={() => AppToast.info("System update.")} />
                <AppButton name="Warning" variant="secondary" size="md" onClick={() => AppToast.warning("Limit reached.")} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Section: Validation Form ── */}
      <div>
        <h2 className="text-xl font-bold text-(--color-text-primary) mb-4 border-b border-border-subtle pb-2">
          Validation Forms (React Hook Form & Yup)
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <DemoForm />
          
          <div className="flex flex-col bg-(--color-surface) border border-border-subtle rounded-2xl p-6 shadow-xs h-full">
            <h3 className="font-semibold text-lg text-(--color-text-primary) mb-1">Form Pattern Explanation</h3>
            <p className="text-xs text-(--color-text-muted) mb-4">
              Our core input components (`AppInput`, `AppSections`, `AppCheckbox`) seamlessly integrate with `react-hook-form` and validation resolvers like `yup`.
            </p>
            <div className="text-xs text-text-secondary space-y-3 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-4 flex-1">
              <p>
                <strong>Key Principles:</strong>
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Provide the <code>register</code> prop from <code>useForm()</code> directly to the inputs.</li>
                <li>Pass the <code>errors</code> object to let components automatically display validation errors inline.</li>
                <li>Write robust schemas using Yup to enforce field boundaries, formats (emails, numbers), and constraints.</li>
              </ul>
            </div>
            
            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <details className="group">
                <summary className="text-xs font-semibold text-indigo-500 cursor-pointer list-none flex items-center justify-between hover:underline">
                  <span>View Setup Snippet</span>
                  <span className="transition-transform group-open:rotate-180">▼</span>
                </summary>
                <div className="relative mt-2">
                  <button 
                    onClick={() => copyToClipboard(`const { register, handleSubmit, formState: { errors } } = useForm({\n  resolver: yupResolver(schema)\n});\n\n<AppInput name="name" register={register} errors={errors} />`, "formsetup")}
                    className="absolute right-2 top-2 p-1.5 rounded-lg border border-border-subtle bg-surface-hover hover:bg-surface-active"
                  >
                    {copiedId === "formsetup" ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                  </button>
                  <pre className="bg-zinc-950 text-zinc-200 text-xs p-4 rounded-xl overflow-x-auto font-mono mt-2">
                    {`const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: yupResolver(schema)
});

<AppInput name="name" register={register} errors={errors} />`}
                  </pre>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>

      {/* ── Interactive Modals & Drawer Overlays rendering ── */}
      <AppConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          AppToast.success("Confirmed successfully!");
          setIsConfirmOpen(false);
        }}
        title="Approve Submission"
        description="Are you sure you want to approve this changes request? This action will write data updates."
        confirmText="Approve Changes"
      />

      <AppDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          AppToast.danger("Record deleted successfully!");
          setIsDeleteOpen(false);
        }}
        title="Delete User Account"
        description="Are you sure you want to delete this user? All associated sessions will be revoked instantly."
        itemName="Alice Johnson"
        itemLabel="User"
      />

      <AppDrawer
        title="User Settings Panel"
        description="Configure permissions and details for this account."
        toggle={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        footer={
          <div className="flex gap-2 justify-end w-full">
            <AppButton name="Cancel" variant="secondary" size="md" fullWidth={false} onClick={() => setIsDrawerOpen(false)} />
            <AppButton name="Save Settings" variant="primary" size="md" fullWidth={false} onClick={() => {
              AppToast.success("Settings saved!");
              setIsDrawerOpen(false);
            }} />
          </div>
        }
      >
        <div className="flex flex-col gap-6 py-4">
          <AppInput name="drawerUser" label="User Name" defaultValue="Alice Johnson" />
          <AppSections name="drawerRole" label="Assigned Role" items={selectItems} selectedKey="admin" />
          <AppCheckbox name="drawerStatus" label="Verify account status" isSelected={true} />
        </div>
      </AppDrawer>
    </div>
  );
}
