import React from "react";
import {
  Calendar,
  DateField,
  DatePicker,
  Label,
  FieldError,
  I18nProvider,
} from "@heroui/react";
import { parseDate, today, getLocalTimeZone } from "@internationalized/date";
import { Controller } from "react-hook-form";
import { AltArrowDown } from "@/components/icon/icons";

export default function AppDatePicker({
  name = "date",
  label = "Date",
  control,
  rules,
  required = false,
  disabled = false,
  className = "",
  placeholder,
  startIcon,
  value,
  onChange,
  error,
  maxValue,
  disableFuture = true,
}) {
  const todayDate = today(getLocalTimeZone());
  const effectiveMaxValue = disableFuture ? (maxValue && maxValue.compare(todayDate) < 0 ? maxValue : todayDate) : maxValue;
  const parseValue = (val) => {
    if (!val) return null;
    if (typeof val === "string") {
      try {
        return parseDate(val.substring(0, 10));
      } catch (e) {
        return null;
      }
    }
    return val;
  };

  const renderDatePicker = ({ fieldValue, fieldOnChange, fieldError }) => {
    const calendarValue = parseValue(fieldValue);
    const errorMessage = fieldError?.message || fieldError;

    const handleDateChange = (date) => {
      let adjusted = date;
      if (adjusted && effectiveMaxValue && adjusted.compare(effectiveMaxValue) > 0) {
        adjusted = effectiveMaxValue;
      }
      const stringValue = adjusted ? adjusted.toString() : "";
      if (fieldOnChange) {
        fieldOnChange(stringValue);
      }
    };

    return (
      <I18nProvider locale="en-GB">
      <DatePicker
        name={name}
        value={calendarValue}
        onChange={handleDateChange}
        isDisabled={disabled}
        isInvalid={!!errorMessage}
        className="w-full"
        maxValue={effectiveMaxValue}
      >
        {label && (
          <Label className="mb-1 text-sm font-medium text-(--color-text) block">
            {label}
            {required && <span className="text-danger ml-1">*</span>}
          </Label>
        )}

        <DateField.Group
          className={`
            w-full h-12 flex items-center px-3 gap-2
            rounded-lg border bg-(--color-input-bg) shadow-(--shadow-sm)
            transition-all
            border-(--color-input-border)
            hover:border-(--color-border-dark)
            focus-within:border-(--color-input-focus)
            focus-within:ring-1
            focus-within:ring-(--color-input-focus)
            ${errorMessage ? "border-danger focus-within:border-danger focus-within:ring-danger" : ""}
          `}
          fullWidth
        >
          {startIcon && (
            <span className="text-(--color-input-placeholder) flex items-center shrink-0">
              {startIcon}
            </span>
          )}

          <DateField.Input 
            className="flex-1 flex gap-0.5 text-sm text-(--color-input-text) outline-none bg-transparent h-full items-center pl-0"
            aria-label={placeholder || label}
          >
            {(segment) => (
              <DateField.Segment 
                segment={segment} 
                className="px-0.5 rounded focus:bg-(--color-active) focus:text-(--color-input-text) outline-none transition-all"
              />
            )}
          </DateField.Input>

          <DateField.Suffix className="ml-auto flex items-center shrink-0 mr-0">
            <DatePicker.Trigger className="text-(--color-input-placeholder) hover:text-(--color-border-dark) focus:outline-none cursor-pointer">
              <AltArrowDown className="h-4 w-4" />
            </DatePicker.Trigger>
          </DateField.Suffix>
        </DateField.Group>

        <DatePicker.Popover className="rounded-2xl p-3 bg-(--color-surface) border border-border shadow-xl">
          <Calendar aria-label={label || "Select date"} maxValue={effectiveMaxValue} isDateUnavailable={effectiveMaxValue ? (d) => d.compare(effectiveMaxValue) > 0 : undefined}>
            <Calendar.Header className="flex items-center justify-between pb-2 border-b border-border mb-2">
              <Calendar.YearPickerTrigger className="text-sm font-semibold flex items-center gap-1 hover:bg-hover p-1 rounded cursor-pointer">
                <Calendar.YearPickerTriggerHeading />
                <Calendar.YearPickerTriggerIndicator />
              </Calendar.YearPickerTrigger>

              <div className="flex gap-1">
                <Calendar.NavButton 
                  slot="previous" 
                  className="p-1 hover:bg-hover rounded cursor-pointer flex items-center justify-center"
                />
                <Calendar.NavButton 
                  slot="next" 
                  className="p-1 hover:bg-hover rounded cursor-pointer flex items-center justify-center"
                />
              </div>
            </Calendar.Header>

            <Calendar.Grid className="w-full border-collapse">
              <Calendar.GridHeader>
                {(day) => (
                  <Calendar.HeaderCell className="text-xs font-medium text-text-secondary w-9 h-9 text-center">
                    {day}
                  </Calendar.HeaderCell>
                )}
              </Calendar.GridHeader>

              <Calendar.GridBody>
                {(date) => (
                  <Calendar.Cell 
                    date={date} 
                    className="w-9 h-9 text-sm text-center align-middle rounded-lg cursor-pointer hover:bg-hover focus:bg-active outline-none select-none transition-all data-[selected=true]:bg-(--color-btn-primary) data-[selected=true]:text-(--color-btn-primary-text) data-[disabled=true]:text-(--color-text-muted) data-[disabled=true]:cursor-not-allowed data-[outside-month=true]:opacity-30 data-[today=true]:border data-[today=true]:border-(--color-input-focus) data-[today=true]:font-bold"
                  />
                )}
              </Calendar.GridBody>
            </Calendar.Grid>

            <Calendar.YearPickerGrid>
              <Calendar.YearPickerGridBody>
                {({ year }) => (
                  <Calendar.YearPickerCell 
                    year={year} 
                    className="p-2 text-center rounded-lg hover:bg-hover cursor-pointer data-[selected=true]:bg-(--color-btn-primary) data-[selected=true]:text-(--color-btn-primary-text) outline-none focus:bg-active transition-all"
                  />
                )}
              </Calendar.YearPickerGridBody>
            </Calendar.YearPickerGrid>
          </Calendar>
        </DatePicker.Popover>

        <div className="min-h-[10px]">
          {errorMessage && (
            <FieldError className="text-xs text-danger block">
              {errorMessage}
            </FieldError>
          )}
        </div>
      </DatePicker>
      </I18nProvider>
    );
  };

  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { value: fValue, onChange: fOnChange }, fieldState: { error: fError } }) => 
          <div className={`w-full relative mb-1.5 ${className}`}>
            {renderDatePicker({
              fieldValue: fValue,
              fieldOnChange: fOnChange,
              fieldError: fError
            })}
          </div>
        }
      />
    );
  }

  return (
    <div className={`w-full relative ${className}`}>
      {renderDatePicker({
        fieldValue: value,
        fieldOnChange: onChange,
        fieldError: error
      })}
    </div>
  );
}