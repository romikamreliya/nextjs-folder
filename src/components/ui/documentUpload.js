"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Upload, Trash, FilePdf, CheckCircle, WarningCircle,
  Eye, Close, Calendar as CalendarIcon, FileText, Code, Gallery,
} from "@/components/icon/icons";
import {
  InputGroup, Label, TextField, FieldError,
  Select, ListBox, Chip,
  Calendar, DatePicker, DateField,
  Modal, useOverlayState,
} from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { AltArrowDown } from "@/components/icon/icons";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ─── Yup schema for each staged document entry ──────────────────────────────
const docEntrySchema = yup.object({
  documentTypeId: yup.string().required("Document type is required"),
  documentName: yup.string().required("Document name is required").min(2, "Min 2 chars"),
  documentNumber: yup.string().optional(),
  remarks: yup.string().optional(),
  issueDate: yup.string().optional(),
  expiryDate: yup.string().optional(),
  notifyBeforeDays: yup
    .number()
    .transform((v, o) => (o === "" ? undefined : v))
    .optional()
    .min(0, "Must be ≥ 0")
    .nullable(),
});

const stagingSchema = yup.object({
  docs: yup.array().of(docEntrySchema),
});

/**
 * DocumentUploadSection — Reusable document upload/management panel
 *
 * Props:
 *  documentTypes       {Array}   [{ id, label }]
 *  newDocuments        {Array}   state: [{ file, documentTypeId, documentName, ... }]
 *  setNewDocuments     {fn}
 *  existingDocuments   {Array}   docs from server GET
 *  removedDocIds       {Array}   IDs marked for removal (PUT only)
 *  setRemovedDocIds    {fn}
 *  disabled            {boolean} view-only mode
 */
export default function DocumentUploadSection({
  documentTypes = [],
  newDocuments = [],
  setNewDocuments,
  existingDocuments = [],
  removedDocIds = [],
  setRemovedDocIds,
  disabled = false,
}) {
  const { t } = useTranslation(["common"]);
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [mounted, setMounted] = useState(false);

  const previewModalState = useOverlayState({
    defaultOpen: false,
    onOpenChange: (isOpen) => {
      if (!isOpen) {
        setPreviewDocument(null);
      }
    },
  });

  // Sync external previewDocument state -> modalState
  useEffect(() => {
    if (previewDocument && !previewModalState.isOpen) {
      previewModalState.open();
    } else if (!previewDocument && previewModalState.isOpen) {
      previewModalState.close();
    }
  }, [previewDocument, previewModalState]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
  const ACCEPTED_EXT = ".pdf,.jpg,.jpeg,.png,.webp";
  const MAX_SIZE_MB = 10;

  // ─── react-hook-form for staging list ──────────────────────────────────────
  const {
    control,
    register,
    formState: { errors },
    getValues,
    setValue: rhfSetValue,
    watch,
  } = useForm({
    resolver: yupResolver(stagingSchema),
    defaultValues: { docs: [] },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({ control, name: "docs" });

  // Sync newDocuments state ← rhf values on every change
  const watchedDocs = watch("docs");
  useEffect(() => {
    if (!setNewDocuments) return;
    const merged = newDocuments.map((nd, i) => ({
      ...nd,
      ...(watchedDocs[i] ?? {}),
    }));
    // Only update if something actually changed to avoid infinite loops
    const str1 = JSON.stringify(merged.map((d) => ({ ...d, file: null, preview: null })));
    const str2 = JSON.stringify(newDocuments.map((d) => ({ ...d, file: null, preview: null })));
    if (str1 !== str2) setNewDocuments(merged);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedDocs]);

  const formatBytes = (bytes) => {
    if (!bytes) return "–";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getDocumentUrl = (doc) =>
    doc?.fileUrl || doc?.url || doc?.link || doc?.file?.url || doc?.documentUrl || doc?.document_url || doc?.file_url || "";

  const getDocumentMime = (doc, url) => {
    const knownMime =
      doc?.contentType || doc?.content_type || doc?.fileType ||
      doc?.file_type || doc?.mimeType || doc?.mime_type || doc?.file?.type;
    if (knownMime) return knownMime;
    if (url?.toLowerCase().endsWith(".pdf")) return "application/pdf";
    if (url?.toLowerCase().match(/\.(jpe?g|png|webp|gif|bmp|svg)$/)) return `image/${url.split(".").pop().toLowerCase()}`;
    return "application/octet-stream";
  };

  const isImageDocument = (mime, url) =>
    mime?.startsWith("image/") || url?.toLowerCase().match(/\.(jpe?g|png|webp|gif|bmp|svg)$/);

  const isPdfDocument = (mime, url) =>
    mime === "application/pdf" || url?.toLowerCase().endsWith(".pdf");

  const validateFile = (file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) return t("common:documents.invalidType");
    if (file.size > MAX_SIZE_MB * 1024 * 1024) return t("common:documents.tooLarge", { mb: MAX_SIZE_MB });
    return null;
  };

  const addFiles = useCallback(
    (files) => {
      const fileArr = Array.from(files);
      const newEntries = fileArr.map((file) => ({
        file,
        documentTypeId: documentTypes[0]?.id || "",
        documentName: file.name.replace(/\.[^/.]+$/, ""),
        documentNumber: "",
        remarks: "",
        issueDate: "",
        expiryDate: "",
        notifyBeforeDays: "",
        error: validateFile(file),
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      }));
      // Append to rhf
      newEntries.forEach((e) => append({
        documentTypeId: e.documentTypeId,
        documentName: e.documentName,
        documentNumber: "",
        remarks: "",
        issueDate: "",
        expiryDate: "",
        notifyBeforeDays: "",
      }));
      setNewDocuments?.((prev) => [...prev, ...newEntries]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [documentTypes, setNewDocuments, append]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    addFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e) => {
    if (e.target.files?.length) {
      addFiles(e.target.files);
      e.target.value = "";
    }
  };

  const removeNewDoc = (index) => {
    setNewDocuments?.((prev) => {
      const updated = [...prev];
      if (updated[index]?.preview) URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
    remove(index);
  };

  const toggleRemoveExisting = (id) => {
    setRemovedDocIds?.((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const openPreview = (doc) => {
    const url = getDocumentUrl(doc);
    if (!url) return;
    setPreviewDocument({
      title: doc.documentName || doc.fileName || t("common:documents.view"),
      url,
      mime: getDocumentMime(doc, url),
      doc,
    });
  };

  const closePreview = () => setPreviewDocument(null);

  // ─── Date helpers ────────────────────────────────────────────────────────
  const parseISODate = (val) => {
    if (!val) return null;
    try { return parseDate(String(val).substring(0, 10)); } catch { return null; }
  };

  // ─── Expiry status for existing docs ────────────────────────────────────
  const getExpiryStatus = (expiryStr) => {
    if (!expiryStr) return null;
    const today = new Date();
    const exp = new Date(expiryStr);
    const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { label: "Expired", color: "danger" };
    if (diffDays <= 30) return { label: `Expires in ${diffDays}d`, color: "warning" };
    return { label: "Valid", color: "success" };
  };

  // Shared style tokens
  const inputGroupClass = `
    w-full h-10 flex items-center px-3 gap-2
    rounded-lg border bg-(--color-input-bg) shadow-(--shadow-sm)
    transition-all
    border-(--color-input-border)
    hover:border-(--color-border-dark)
    focus-within:border-(--color-input-focus)
    focus-within:ring-1
    focus-within:ring-(--color-input-focus)
  `;
  const inputInnerClass =
    "w-full h-full flex-1 bg-transparent px-2 text-sm text-(--color-input-text) placeholder:text-(--color-input-placeholder) focus:outline-none";
  const labelClass = "mb-1 text-xs font-semibold text-(--color-text) block";
  const errorClass = "text-xs text-red-500 mt-0.5 block";

  const hasExisting = existingDocuments.length > 0;
  const hasNew = fields.length > 0;

  return (
    <div className="flex flex-col gap-6">

      {/* ── Existing Documents ───────────────────────────────────────────── */}
      {hasExisting && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold text-(--color-text-muted) uppercase tracking-wider">
              {t("common:documents.existing")}
            </p>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-(--color-bg-subtle) border border-border-subtle text-(--color-text-muted) font-bold">
              {existingDocuments.length}
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {existingDocuments.map((doc) => {
              const isMarked = removedDocIds.includes(doc.id);
              const expiry = doc.expiryDate || doc.expiry_date;
              const expiryStatus = getExpiryStatus(expiry);
              const hasUrl = !!getDocumentUrl(doc);
              const issueDate = doc.issueDate || doc.issue_date;
              const notifyDays = doc.notifyBeforeDays ?? doc.notify_before_days;

              // Left accent color based on status
              const accentColor = isMarked
                ? "bg-red-400"
                : expiryStatus?.color === "danger"
                ? "bg-red-400"
                : expiryStatus?.color === "warning"
                ? "bg-amber-400"
                : expiryStatus?.color === "success"
                ? "bg-emerald-400"
                : "bg-(--color-border-dark)";

              const iconBg = isMarked
                ? "bg-red-100 dark:bg-red-950/40"
                : expiryStatus?.color === "danger"
                ? "bg-red-50 dark:bg-red-950/30"
                : expiryStatus?.color === "warning"
                ? "bg-amber-50 dark:bg-amber-950/30"
                : expiryStatus?.color === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/30"
                : "bg-(--color-bg-subtle)";

              const iconColor = isMarked
                ? "text-red-400"
                : expiryStatus?.color === "danger"
                ? "text-red-500"
                : expiryStatus?.color === "warning"
                ? "text-amber-500"
                : expiryStatus?.color === "success"
                ? "text-emerald-500"
                : "text-(--color-text-muted)";

              return (
                <div
                  key={doc.id}
                  className={`group relative flex overflow-hidden rounded-xl border transition-all duration-200 ${
                    isMarked
                      ? "border-red-200 bg-red-50/40 dark:border-red-900/40 dark:bg-red-950/15"
                      : "border-border-subtle bg-(--color-surface) hover:border-(--color-border-dark) hover:shadow-md"
                  }`}
                >
                  {/* ── Left accent stripe ── */}
                  <div className={`w-1 shrink-0 ${accentColor}`} />

                  {/* ── Body ── */}
                  <div className="flex-1 min-w-0 p-3.5">

                    {/* Top row: icon + name/chips + action */}
                    <div className="flex items-start gap-3">
                      {/* File icon */}
                      <div className={`shrink-0 rounded-xl p-2.5 ${iconBg}`}>
                        <FilePdf className={`text-xl ${iconColor}`} />
                      </div>

                      {/* Name + status chips */}
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <p className={`text-sm font-bold leading-tight ${isMarked ? "line-through text-(--color-text-muted)" : "text-(--color-text-primary)"}`}>
                            {doc.documentName || doc.fileName || "–"}
                          </p>
                          {expiryStatus && !isMarked && (
                            <Chip
                              size="sm"
                              className={`h-[18px] min-w-max rounded-md px-1.5 text-[10px] font-bold border leading-none ${
                                expiryStatus.color === "danger"
                                  ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800"
                                  : expiryStatus.color === "warning"
                                  ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                              }`}
                            >
                              {expiryStatus.label}
                            </Chip>
                          )}
                          {isMarked && (
                            <Chip size="sm" className="h-[18px] min-w-max rounded-md px-1.5 text-[10px] font-bold border bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800">
                              {t("common:documents.markedForRemoval")}
                            </Chip>
                          )}
                        </div>

                        {/* Meta pill row */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {doc.documentTypeName && (
                            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-(--color-bg-subtle) text-(--color-text-muted) font-medium border border-border-subtle/70">
                              <FileText className="text-[9px]" />
                              {doc.documentTypeName}
                            </span>
                          )}
                          {doc.documentNumber && (
                            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-(--color-bg-subtle) text-(--color-text-muted) font-medium border border-border-subtle/70">
                              <Code className="text-[9px]" />
                              #{doc.documentNumber}
                            </span>
                          )}
                          {doc.fileSize && (
                            <span className="text-[11px] text-(--color-text-muted)">
                              {formatBytes(doc.fileSize)}
                            </span>
                          )}
                          {doc.remarks && (
                            <span className="text-[11px] text-(--color-text-muted) italic">
                              &ldquo;{doc.remarks}&rdquo;
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 shrink-0 pt-0.5">
                        {hasUrl && !isMarked && (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); openPreview(doc); }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-(--color-text-muted) border border-border-subtle bg-(--color-bg-subtle) hover:bg-(--color-hover) hover:text-(--color-text-primary) hover:border-(--color-border-dark) transition-all duration-150"
                            title={t("common:documents.view")}
                          >
                            <Eye className="text-sm" />
                            <span className="hidden sm:inline">{t("common:documents.view")}</span>
                          </button>
                        )}
                        {!disabled && (
                          <button
                            type="button"
                            onClick={() => toggleRemoveExisting(doc.id)}
                            title={isMarked ? t("common:documents.restore") : t("common:documents.remove")}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isMarked
                                ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                                : "text-(--color-text-muted) hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20"
                            }`}
                          >
                            {isMarked ? <CheckCircle className="text-base" /> : <Trash className="text-base" />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* ── Date info grid ── */}
                    {(issueDate || expiry || (notifyDays !== undefined && notifyDays !== null && notifyDays !== "")) && (
                      <div className="mt-3 pt-3 border-t border-border-subtle/50 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {issueDate && (
                          <div className="flex flex-col gap-0.5 px-3 py-2 rounded-lg bg-(--color-bg-subtle) border border-border-subtle/50">
                            <span className="text-[10px] font-semibold text-(--color-text-muted) uppercase tracking-wide">
                              {t("common:documents.fields.issueDate")}
                            </span>
                            <span className="text-xs font-bold text-(--color-text-primary)">
                              {String(issueDate).substring(0, 10)}
                            </span>
                          </div>
                        )}
                        {expiry && (
                          <div className={`flex flex-col gap-0.5 px-3 py-2 rounded-lg border ${
                            expiryStatus?.color === "danger"
                              ? "bg-red-50/60 border-red-200/60 dark:bg-red-950/20 dark:border-red-900/40"
                              : expiryStatus?.color === "warning"
                              ? "bg-amber-50/60 border-amber-200/60 dark:bg-amber-950/20 dark:border-amber-900/40"
                              : "bg-(--color-bg-subtle) border-border-subtle/50"
                          }`}>
                            <span className={`text-[10px] font-semibold uppercase tracking-wide ${
                              expiryStatus?.color === "danger" ? "text-red-500" : expiryStatus?.color === "warning" ? "text-amber-500" : "text-(--color-text-muted)"
                            }`}>
                              {t("common:documents.fields.expiryDate")}
                            </span>
                            <span className={`text-xs font-bold ${
                              expiryStatus?.color === "danger" ? "text-red-600 dark:text-red-400" : expiryStatus?.color === "warning" ? "text-amber-600 dark:text-amber-400" : "text-(--color-text-primary)"
                            }`}>
                              {String(expiry).substring(0, 10)}
                            </span>
                          </div>
                        )}
                        {notifyDays !== undefined && notifyDays !== null && notifyDays !== "" && (
                          <div className="flex flex-col gap-0.5 px-3 py-2 rounded-lg bg-(--color-bg-subtle) border border-border-subtle/50">
                            <span className="text-[10px] font-semibold text-(--color-text-muted) uppercase tracking-wide">
                              {t("common:documents.fields.notifyBeforeDays")}
                            </span>
                            <span className="text-xs font-bold text-(--color-text-primary)">
                              {notifyDays} {Number(notifyDays) === 1 ? "day" : "days"}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}


      {/* ── Dropzone ─────────────────────────────────────────────────────── */}
      {!disabled && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-8 cursor-pointer transition-all duration-200 select-none ${
            isDragging
              ? "border-(--color-input-focus) bg-(--color-input-focus)/8 scale-[1.01]"
              : "border-border-subtle bg-(--color-bg-subtle) hover:border-(--color-input-focus)/60 hover:bg-(--color-hover)"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPTED_EXT}
            onChange={handleFileInput}
            className="hidden"
          />
          <div className={`rounded-2xl p-3.5  transition-colors ${isDragging ? "bg-(--color-input-focus)/15" : "bg-(--color-surface) shadow-sm"}`}>
            <Upload className={`text-2xl transition-colors ${isDragging ? "text-(--color-input-focus)" : "text-(--color-text-muted)"}`} />
          </div>
          <div className="text-center pointer-events-none">
            <p className="text-sm font-semibold text-(--color-text-primary)">
              {isDragging ? t("common:documents.dropHere") : t("common:documents.dragDrop")}
            </p>
            <p className="text-xs text-(--color-text-muted) mt-1">
              {t("common:documents.acceptedFormats")}
            </p>
          </div>
        </div>
      )}

      {/* ── Staged New Documents ─────────────────────────────────────────── */}
      {hasNew && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold text-(--color-text-muted) uppercase tracking-wider">
            {t("common:documents.toUpload", { count: fields.length })}
          </p>

          {fields.map((field, index) => {
            const nd = newDocuments[index];
            const docErrors = errors?.docs?.[index];

            return (
              <div
                key={field.id}
                className={`rounded-xl border p-4 flex flex-col gap-4 transition-all animate-fade-in-up ${
                  nd?.error
                    ? "border-red-300 bg-red-50/40 dark:border-red-900/40 dark:bg-red-950/10"
                    : "border-border-subtle bg-(--color-surface)"
                }`}
              >
                {/* File header */}
                <div className="flex items-center gap-3">
                  {nd?.preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={nd.preview}
                      alt=""
                      className="h-10 w-10 rounded-lg object-cover shrink-0 border border-border-subtle"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-(--color-bg-subtle) flex items-center justify-center shrink-0 border border-border-subtle">
                      <FilePdf className="text-lg text-(--color-text-muted)" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-(--color-text-primary) truncate">{nd?.file?.name}</p>
                    <p className="text-xs text-(--color-text-muted)">{formatBytes(nd?.file?.size)}</p>
                  </div>
                  {nd?.error ? (
                    <WarningCircle className="text-lg text-red-500 shrink-0" />
                  ) : (
                    <CheckCircle className="text-lg text-emerald-500 shrink-0" />
                  )}
                  <button
                    type="button"
                    onClick={() => removeNewDoc(index)}
                    className="p-1.5 rounded-lg text-(--color-text-muted) hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20 transition-colors shrink-0"
                  >
                    <Trash className="text-base" />
                  </button>
                </div>

                {nd?.error && (
                  <p className="text-xs text-red-500 flex items-center gap-1.5 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg">
                    <WarningCircle className="text-sm shrink-0" />
                    {nd.error}
                  </p>
                )}

                {/* Metadata fields — shown when file is valid */}
                {!nd?.error && (
                  <div className="flex flex-col gap-4 pt-3 border-t border-border-subtle/60">

                    {/* Row 1: Doc Type + Doc Name */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {/* Document Type — HeroUI Select */}
                      <Controller
                        name={`docs.${index}.documentTypeId`}
                        control={control}
                        render={({ field: { value: fVal, onChange: fChange } }) => (
                          <Select
                            className="w-full relative"
                            value={fVal || null}
                            onChange={(val) => {
                              fChange(val);
                              setNewDocuments?.((prev) => {
                                const u = [...prev];
                                if (u[index]) u[index] = { ...u[index], documentTypeId: val };
                                return u;
                              });
                            }}
                            isInvalid={!!docErrors?.documentTypeId}
                          >
                            <Label className={labelClass}>
                              {t("common:documents.fields.documentType")}
                              <span className="text-red-500 ml-0.5">*</span>
                            </Label>
                            <Select.Trigger className={`w-full h-10 flex items-center px-3 gap-2 rounded-lg border bg-(--color-select-bg) shadow-(--shadow-sm) transition-all border-(--color-select-border) hover:border-(--color-border-dark) focus-within:border-(--color-input-focus) focus-within:ring-1 focus-within:ring-(--color-input-focus) ${docErrors?.documentTypeId ? "border-red-400" : ""}`}>
                              <Select.Value className="text-sm text-(--color-input-text) truncate flex-1" />
                              <Select.Indicator className="ml-auto" />
                            </Select.Trigger>
                            <Select.Popover>
                              <ListBox>
                                {documentTypes.length === 0 ? (
                                  <ListBox.Item id="__empty__" textValue="No options" isDisabled>
                                    No document types available
                                  </ListBox.Item>
                                ) : (
                                  documentTypes.map((dt) => (
                                    <ListBox.Item id={dt.id} textValue={dt.label} key={dt.id}>
                                      {dt.label}
                                      <ListBox.ItemIndicator />
                                    </ListBox.Item>
                                  ))
                                )}
                              </ListBox>
                            </Select.Popover>
                            {docErrors?.documentTypeId && (
                              <FieldError className={errorClass}>{docErrors.documentTypeId.message}</FieldError>
                            )}
                          </Select>
                        )}
                      />

                      {/* Document Name — HeroUI TextField */}
                      <TextField
                        className="w-full relative"
                        isInvalid={!!docErrors?.documentName}
                        {...register(`docs.${index}.documentName`)}
                        onChange={(val) => {
                          rhfSetValue(`docs.${index}.documentName`, val, { shouldValidate: true });
                          setNewDocuments?.((prev) => {
                            const u = [...prev]; if (u[index]) u[index] = { ...u[index], documentName: val }; return u;
                          });
                        }}
                        value={watchedDocs?.[index]?.documentName ?? ""}
                      >
                        <Label className={labelClass}>
                          {t("common:documents.fields.documentName")}
                          <span className="text-red-500 ml-0.5">*</span>
                        </Label>
                        <InputGroup className={`${inputGroupClass} ${docErrors?.documentName ? "border-red-400" : ""}`}>
                          <InputGroup.Input
                            placeholder={t("common:documents.fields.documentNamePlaceholder")}
                            className={inputInnerClass}
                          />
                        </InputGroup>
                        {docErrors?.documentName && (
                          <FieldError className={errorClass}>{docErrors.documentName.message}</FieldError>
                        )}
                      </TextField>
                    </div>

                    {/* Row 2: Doc Number + Remarks */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {/* Document Number */}
                      <TextField
                        className="w-full relative"
                        {...register(`docs.${index}.documentNumber`)}
                        onChange={(val) => {
                          rhfSetValue(`docs.${index}.documentNumber`, val);
                          setNewDocuments?.((prev) => { const u = [...prev]; if (u[index]) u[index] = { ...u[index], documentNumber: val }; return u; });
                        }}
                        value={watchedDocs?.[index]?.documentNumber ?? ""}
                      >
                        <Label className={labelClass}>{t("common:documents.fields.documentNumber")}</Label>
                        <InputGroup className={inputGroupClass}>
                          <InputGroup.Input
                            placeholder={t("common:documents.fields.documentNumberPlaceholder")}
                            className={inputInnerClass}
                          />
                        </InputGroup>
                      </TextField>

                      {/* Remarks */}
                      <TextField
                        className="w-full relative"
                        {...register(`docs.${index}.remarks`)}
                        onChange={(val) => {
                          rhfSetValue(`docs.${index}.remarks`, val);
                          setNewDocuments?.((prev) => { const u = [...prev]; if (u[index]) u[index] = { ...u[index], remarks: val }; return u; });
                        }}
                        value={watchedDocs?.[index]?.remarks ?? ""}
                      >
                        <Label className={labelClass}>{t("common:documents.fields.remarks")}</Label>
                        <InputGroup className={inputGroupClass}>
                          <InputGroup.Input
                            placeholder={t("common:documents.fields.remarksPlaceholder")}
                            className={inputInnerClass}
                          />
                        </InputGroup>
                      </TextField>
                    </div>

                    {/* Row 3: Issue Date + Expiry Date + Notify Days */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {/* Issue Date — HeroUI DatePicker */}
                      <Controller
                        name={`docs.${index}.issueDate`}
                        control={control}
                        render={({ field: { value: fVal, onChange: fChange } }) => (
                          <DatePicker
                            value={parseISODate(fVal)}
                            onChange={(date) => {
                              const str = date ? date.toString() : "";
                              fChange(str);
                              setNewDocuments?.((prev) => { const u = [...prev]; if (u[index]) u[index] = { ...u[index], issueDate: str }; return u; });
                            }}
                            className="w-full"
                          >
                            <Label className={labelClass}>
                              {t("common:documents.fields.issueDate")}
                            </Label>
                            <DateField.Group className={`${inputGroupClass}`} fullWidth>
                              <span className="text-(--color-input-placeholder) flex items-center shrink-0 pl-1">
                                <CalendarIcon className="h-4 w-4" />
                              </span>
                              <DateField.Input className="flex-1 flex gap-0.5 text-sm text-(--color-input-text) outline-none bg-transparent h-full items-center pl-1">
                                {(segment) => (
                                  <DateField.Segment
                                    segment={segment}
                                    className="px-0.5 rounded focus:bg-(--color-active) focus:text-(--color-input-text) outline-none transition-all"
                                  />
                                )}
                              </DateField.Input>
                              <DateField.Suffix className="ml-auto flex items-center shrink-0">
                                <DatePicker.Trigger className="text-(--color-input-placeholder) hover:text-(--color-border-dark) focus:outline-none cursor-pointer pr-2">
                                  <AltArrowDown className="h-3.5 w-3.5" />
                                </DatePicker.Trigger>
                              </DateField.Suffix>
                            </DateField.Group>
                            <DatePicker.Popover className="rounded-2xl max-w-70 p-3  bg-(--color-surface) border border-border shadow-xl z-50">
                              <Calendar aria-label={t("common:documents.fields.issueDate")}>
                                <Calendar.Header className="flex items-center justify-between pb-2 border-b border-border mb-2">
                                  <Calendar.YearPickerTrigger className="text-sm font-semibold flex items-center gap-1 hover:bg-hover p-1 rounded cursor-pointer">
                                    <Calendar.YearPickerTriggerHeading />
                                    <Calendar.YearPickerTriggerIndicator />
                                  </Calendar.YearPickerTrigger>
                                  <div className="flex gap-1">
                                    <Calendar.NavButton slot="previous" className="p-1 hover:bg-hover rounded cursor-pointer flex items-center justify-center" />
                                    <Calendar.NavButton slot="next" className="p-1 hover:bg-hover rounded cursor-pointer flex items-center justify-center" />
                                  </div>
                                </Calendar.Header>
                                <Calendar.Grid className="w-full border-collapse">
                                  <Calendar.GridHeader>
                                    {(day) => <Calendar.HeaderCell className="text-xs font-medium text-text-secondary w-9 h-9 text-center">{day}</Calendar.HeaderCell>}
                                  </Calendar.GridHeader>
                                  <Calendar.GridBody>
                                    {(date) => (
                                      <Calendar.Cell date={date} className="w-9 h-9 text-sm text-center align-middle rounded-lg cursor-pointer hover:bg-hover focus:bg-active outline-none select-none transition-all data-[selected=true]:bg-(--color-btn-primary) data-[selected=true]:text-(--color-btn-primary-text) data-[disabled=true]:opacity-40 data-[disabled=true]:cursor-not-allowed data-[outside-month=true]:opacity-30 data-[today=true]:border data-[today=true]:border-(--color-input-focus) data-[today=true]:font-bold" />
                                    )}
                                  </Calendar.GridBody>
                                </Calendar.Grid>
                                <Calendar.YearPickerGrid>
                                  <Calendar.YearPickerGridBody>
                                    {({ year }) => <Calendar.YearPickerCell year={year} className="p-2 text-center rounded-lg hover:bg-hover cursor-pointer data-[selected=true]:bg-(--color-btn-primary) data-[selected=true]:text-(--color-btn-primary-text) outline-none focus:bg-active transition-all" />}
                                  </Calendar.YearPickerGridBody>
                                </Calendar.YearPickerGrid>
                              </Calendar>
                            </DatePicker.Popover>
                          </DatePicker>
                        )}
                      />

                      {/* Expiry Date — HeroUI DatePicker */}
                      <Controller
                        name={`docs.${index}.expiryDate`}
                        control={control}
                        render={({ field: { value: fVal, onChange: fChange } }) => (
                          <DatePicker
                            value={parseISODate(fVal)}
                            onChange={(date) => {
                              const str = date ? date.toString() : "";
                              fChange(str);
                              setNewDocuments?.((prev) => { const u = [...prev]; if (u[index]) u[index] = { ...u[index], expiryDate: str }; return u; });
                            }}
                            className="w-full"
                          >
                            <Label className={labelClass}>
                              {t("common:documents.fields.expiryDate")}
                            </Label>
                            <DateField.Group className={inputGroupClass} fullWidth>
                              <span className="text-(--color-input-placeholder) flex items-center shrink-0 pl-1">
                                <CalendarIcon className="h-4 w-4" />
                              </span>
                              <DateField.Input className="flex-1 flex gap-0.5 text-sm text-(--color-input-text) outline-none bg-transparent h-full items-center pl-1">
                                {(segment) => (
                                  <DateField.Segment
                                    segment={segment}
                                    className="px-0.5 rounded focus:bg-(--color-active) focus:text-(--color-input-text) outline-none transition-all"
                                  />
                                )}
                              </DateField.Input>
                              <DateField.Suffix className="ml-auto flex items-center shrink-0">
                                <DatePicker.Trigger className="text-(--color-input-placeholder) hover:text-(--color-border-dark) focus:outline-none cursor-pointer pr-2">
                                  <AltArrowDown className="h-3.5 w-3.5" />
                                </DatePicker.Trigger>
                              </DateField.Suffix>
                            </DateField.Group>
                            <DatePicker.Popover className="rounded-2xl p-3 max-w-70  bg-(--color-surface) border border-border shadow-xl z-50">
                              <Calendar aria-label={t("common:documents.fields.expiryDate")}>
                                <Calendar.Header className="flex items-center justify-between pb-2 border-b border-border mb-2">
                                  <Calendar.YearPickerTrigger className="text-sm font-semibold flex items-center gap-1 hover:bg-hover p-1 rounded cursor-pointer">
                                    <Calendar.YearPickerTriggerHeading />
                                    <Calendar.YearPickerTriggerIndicator />
                                  </Calendar.YearPickerTrigger>
                                  <div className="flex gap-1">
                                    <Calendar.NavButton slot="previous" className="p-1 hover:bg-hover rounded cursor-pointer flex items-center justify-center" />
                                    <Calendar.NavButton slot="next" className="p-1 hover:bg-hover rounded cursor-pointer flex items-center justify-center" />
                                  </div>
                                </Calendar.Header>
                                <Calendar.Grid className="w-full border-collapse">
                                  <Calendar.GridHeader>
                                    {(day) => <Calendar.HeaderCell className="text-xs font-medium text-text-secondary w-9 h-9 text-center">{day}</Calendar.HeaderCell>}
                                  </Calendar.GridHeader>
                                  <Calendar.GridBody>
                                    {(date) => (
                                      <Calendar.Cell date={date} className="w-9 h-9 text-sm text-center align-middle rounded-lg cursor-pointer hover:bg-hover focus:bg-active outline-none select-none transition-all data-[selected=true]:bg-(--color-btn-primary) data-[selected=true]:text-(--color-btn-primary-text) data-[disabled=true]:opacity-40 data-[disabled=true]:cursor-not-allowed data-[outside-month=true]:opacity-30 data-[today=true]:border data-[today=true]:border-(--color-input-focus) data-[today=true]:font-bold" />
                                    )}
                                  </Calendar.GridBody>
                                </Calendar.Grid>
                                <Calendar.YearPickerGrid>
                                  <Calendar.YearPickerGridBody>
                                    {({ year }) => <Calendar.YearPickerCell year={year} className="p-2 text-center rounded-lg hover:bg-hover cursor-pointer data-[selected=true]:bg-(--color-btn-primary) data-[selected=true]:text-(--color-btn-primary-text) outline-none focus:bg-active transition-all" />}
                                  </Calendar.YearPickerGridBody>
                                </Calendar.YearPickerGrid>
                              </Calendar>
                            </DatePicker.Popover>
                          </DatePicker>
                        )}
                      />

                      {/* Notify Before Days — HeroUI TextField */}
                      <Controller
                        name={`docs.${index}.notifyBeforeDays`}
                        control={control}
                        render={({ field: { value: fVal, onChange: fChange } }) => (
                          <TextField
                            className="w-full relative"
                            isInvalid={!!docErrors?.notifyBeforeDays}
                            value={fVal !== undefined && fVal !== null ? String(fVal) : ""}
                            onChange={(val) => {
                              fChange(val === "" ? "" : val);
                              setNewDocuments?.((prev) => { const u = [...prev]; if (u[index]) u[index] = { ...u[index], notifyBeforeDays: val }; return u; });
                            }}
                          >
                            <Label className={labelClass}>{t("common:documents.fields.notifyBeforeDays")}</Label>
                            <InputGroup className={`${inputGroupClass} ${docErrors?.notifyBeforeDays ? "border-red-400" : ""}`}>
                              <InputGroup.Input
                                type="number"
                                min="0"
                                placeholder={t("common:documents.fields.notifyBeforeDaysPlaceholder")}
                                className={inputInnerClass}
                              />
                            </InputGroup>
                            {docErrors?.notifyBeforeDays && (
                              <FieldError className={errorClass}>{docErrors.notifyBeforeDays.message}</FieldError>
                            )}
                          </TextField>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Empty state (view-only, no docs) ─────────────────────────────── */}
      {!hasExisting && !hasNew && disabled && (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center rounded-xl border border-dashed border-border-subtle bg-(--color-bg-subtle)">
          <FilePdf className="text-2xl text-(--color-text-muted)" />
          <p className="text-sm text-(--color-text-muted)">{t("common:documents.noDocuments")}</p>
        </div>
      )}

      {/* ── Preview Modal ─────────────────────────────────────────────────── */}
      {previewDocument && mounted && (
        <Modal state={previewModalState}>
          <Modal.Backdrop className="bg-black/60 backdrop-blur-sm z-[999999]">
            <Modal.Container>
              <Modal.Dialog className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-(--color-surface) shadow-2xl border border-border flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4 gap-4 bg-(--color-surface)">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0 rounded-2xl p-2.5 bg-primary/10 text-primary">
                      {isImageDocument(previewDocument.mime, previewDocument.url) ? (
                        <Gallery className="text-xl" />
                      ) : (
                        <FilePdf className="text-xl" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-base font-bold text-(--color-text-primary) truncate">
                        {previewDocument.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {previewDocument.doc?.documentTypeName && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/5 text-primary font-semibold border border-primary/10">
                            {previewDocument.doc.documentTypeName}
                          </span>
                        )}
                        {previewDocument.doc?.documentNumber && (
                          <span className="text-[11px] text-(--color-text-muted) font-mono">
                            #{previewDocument.doc.documentNumber}
                          </span>
                        )}
                        {(() => {
                          const ed = previewDocument.doc?.expiryDate || previewDocument.doc?.expiry_date;
                          const es = getExpiryStatus(ed);
                          if (!es) return null;
                          return (
                            <Chip
                              size="sm"
                              className={`h-5 min-w-max rounded-md px-1.5 text-[10px] font-bold border ${
                                es.color === "danger"
                                  ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800"
                                  : es.color === "warning"
                                  ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                              }`}
                            >
                              {es.label}
                            </Chip>
                          );
                        })()}
                      </div>
                      {/* Dates row in preview header */}
                      {(() => {
                        const d = previewDocument.doc;
                        const id = d?.issueDate || d?.issue_date;
                        const ed = d?.expiryDate || d?.expiry_date;
                        const nd = d?.notifyBeforeDays ?? d?.notify_before_days;
                        if (!id && !ed && (nd === undefined || nd === null || nd === "")) return null;
                        return (
                          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-(--color-text-muted)">
                            {id && (
                              <span className="flex items-center gap-1">
                                <span className="font-medium">{t("common:documents.fields.issueDate")}:</span>
                                <span className="text-(--color-text-primary) font-semibold">{String(id).substring(0, 10)}</span>
                              </span>
                            )}
                            {id && (ed || nd) && <span className="text-border-subtle">•</span>}
                            {ed && (
                              <span className="flex items-center gap-1">
                                <span className="font-medium">{t("common:documents.fields.expiryDate")}:</span>
                                <span className="text-(--color-text-primary) font-semibold">{String(ed).substring(0, 10)}</span>
                              </span>
                            )}
                            {ed && nd !== undefined && nd !== null && nd !== "" && <span className="text-border-subtle">•</span>}
                            {nd !== undefined && nd !== null && nd !== "" && (
                              <span className="flex items-center gap-1">
                                <span className="font-medium">{t("common:documents.fields.notifyBeforeDays")}:</span>
                                <span className="text-(--color-text-primary) font-semibold">{nd} days</span>
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={previewDocument.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-(--color-text-primary) transition-all cursor-pointer border border-border/40"
                    >
                      <span>{t("common:documents.openInNewTab")}</span>
                    </a>
                    <button
                      type="button"
                      onClick={closePreview}
                      className="rounded-full p-2 text-(--color-text-muted) hover:bg-(--color-hover) hover:text-(--color-text-primary) transition-all duration-200 shrink-0 border border-border/40 bg-transparent flex items-center justify-center cursor-pointer"
                      aria-label={t("common:actions.close")}
                    >
                      <Close className="text-lg" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto bg-(--color-bg-subtle) flex items-center justify-center p-6 md:p-8 min-h-[350px]">
                  {isImageDocument(previewDocument.mime, previewDocument.url) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewDocument.url}
                      alt={previewDocument.title}
                      className="max-h-[70vh] max-w-full object-contain rounded-2xl shadow-lg border border-border/50 transition-transform duration-300 hover:scale-[1.015]"
                    />
                  ) : isPdfDocument(previewDocument.mime, previewDocument.url) ? (
                    <iframe
                      src={previewDocument.url}
                      width="100%"
                      height="100%"
                      className="min-h-[60vh] w-full rounded-xl border border-border/40 shadow-inner bg-white"
                      title={previewDocument.title}
                    />
                  ) : (
                    <div className="p-8 text-center text-sm text-(--color-text-muted) bg-(--color-surface) rounded-2xl border border-border/40 shadow-sm max-w-md">
                      <FilePdf className="text-4xl text-(--color-text-muted) mx-auto mb-3" />
                      <p className="mb-4 font-medium">{t("common:documents.previewNotAvailable")}</p>
                      <a href={previewDocument.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors shadow-sm">
                        {t("common:documents.openInNewTab")}
                      </a>
                    </div>
                  )}
                </div>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      )}
    </div>
  );
}
