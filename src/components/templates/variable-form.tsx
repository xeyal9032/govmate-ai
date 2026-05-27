'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AUTHORITY_OPTIONS, NATIONALITY_OPTIONS } from '@/lib/constants/form-options';

interface TemplateVariable {
  key: string;
  label: string;
  type: 'text' | 'date' | 'textarea';
  required?: boolean;
}

interface VariableFormProps {
  variables: TemplateVariable[];
  form: UseFormReturn<any>;
  category?: string;
}

const keyToI18n: Record<string, string> = {
  full_name: 'fullName',
  address: 'address',
  customer_number: 'customerNumber',
  date: 'date',
  authority_name: 'authorityName',
  subject: 'subject',
  custom_reason: 'customReason',
  application_date: 'applicationDate',
  case_description: 'caseDescription',
  weeks_passed: 'weeksPassed',
  appointment_date: 'appointmentDate',
  appointment_time: 'appointmentTime',
  reason: 'reason',
  new_date: 'newDate',
  document_list: 'documentList',
  deadline_date: 'deadlineDate',
  extension_reason: 'extensionReason',
  insurance_number: 'insuranceNumber',
  child_name: 'childName',
  child_birthdate: 'childBirthdate',
  school_name: 'schoolName',
  issue_description: 'issueDescription',
  move_in_date: 'moveInDate',
  previous_address: 'previousAddress',
  new_address: 'newAddress',
  policy_number: 'policyNumber',
  damage_date: 'damageDate',
  damage_description: 'damageDescription',
  nationality: 'nationality',
  birth_date: 'birthDate',
  objection_reason: 'objectionReason',
  received_date: 'receivedDate',
  decision_date: 'decisionDate',
  change_details: 'changeDetails',
  change_date: 'changeDate',
  damage_location: 'damageLocation',
  additional_info: 'additionalInfo',
  termination_date: 'terminationDate',
  class_name: 'className',
  absence_start: 'absenceStart',
  expected_return: 'expectedReturn',
  leave_start: 'leaveStart',
  leave_end: 'leaveEnd',
  school_year: 'schoolYear',
  previous_school: 'previousSchool',
  appointment_purpose: 'appointmentPurpose',
  permit_expiry_date: 'permitExpiryDate',
  purpose: 'purpose',
  email: 'email',
  invoice_date: 'invoiceDate',
  amount: 'amount',
  questions: 'questions',
  old_address: 'oldAddress',
  reference_date: 'referenceDate',
  original_deadline: 'originalDeadline',
  requested_deadline: 'requestedDeadline',
  preferred_date: 'preferredDate',
  letter_date: 'letterDate',
  required_documents: 'requiredDocuments',
  rental_address: 'rentalAddress',
  defect_description: 'defectDescription',
  defect_location: 'defectLocation',
  defect_since: 'defectSince',
  availability: 'availability',
  cancellation_date: 'cancellationDate',
  end_date: 'endDate',
  submission_date: 'submissionDate',
  registration_date: 'registrationDate',
  tax_year: 'taxYear',
  family_members: 'familyMembers',
  move_date: 'moveDate',
  departure_date: 'departureDate',
  destination_country: 'destinationCountry',
  periods_to_check: 'periodsToCheck',
  authorized_person: 'authorizedPerson',
  authorized_address: 'authorizedAddress',
  authorization_scope: 'authorizationScope',
  validity: 'validity',
};

const COMBOBOX_KEYS = new Set(['authority_name', 'nationality']);
const TIME_KEYS = new Set(['appointment_time']);

export function VariableForm({ variables, form, category = '' }: VariableFormProps) {
  const t = useTranslations('templates');
  const { register, setValue, watch, formState: { errors } } = form;

  function getLabel(variable: TemplateVariable): string {
    const i18nKey = keyToI18n[variable.key];
    if (i18nKey) {
      try {
        return t(`variables.${i18nKey}` as any);
      } catch {
        return variable.label;
      }
    }
    return variable.label;
  }

  function getOptions(key: string): string[] {
    if (key === 'authority_name') {
      return AUTHORITY_OPTIONS[category] || [];
    }
    if (key === 'nationality') {
      return NATIONALITY_OPTIONS;
    }
    return [];
  }

  return (
    <div className="space-y-4">
      {variables.map((variable) => {
        const label = getLabel(variable);
        const options = getOptions(variable.key);
        const isCombobox = COMBOBOX_KEYS.has(variable.key) && options.length > 0;
        const isTimeField = TIME_KEYS.has(variable.key);

        return (
          <div key={variable.key} className="space-y-2">
            <Label htmlFor={variable.key}>
              {label}
              {variable.required && <span className="text-destructive ml-1">*</span>}
            </Label>

            {isCombobox ? (
              <ComboboxField
                id={variable.key}
                options={options}
                value={watch(variable.key) || ''}
                onChange={(val) => setValue(variable.key, val, { shouldValidate: true })}
                placeholder={label}
                useCustomLabel={t('comboboxUseCustom')}
                noResultsLabel={t('comboboxNoResults')}
              />
            ) : isTimeField ? (
              <Input
                id={variable.key}
                type="time"
                {...register(variable.key, {
                  required: variable.required ? `${label} *` : false,
                })}
              />
            ) : variable.type === 'text' ? (
              <Input
                id={variable.key}
                {...register(variable.key, {
                  required: variable.required ? `${label} *` : false,
                })}
                placeholder={label}
              />
            ) : variable.type === 'date' ? (
              <Input
                id={variable.key}
                type="date"
                {...register(variable.key, {
                  required: variable.required ? `${label} *` : false,
                })}
              />
            ) : (
              <Textarea
                id={variable.key}
                {...register(variable.key, {
                  required: variable.required ? `${label} *` : false,
                })}
                placeholder={label}
                className="min-h-[100px]"
              />
            )}

            {errors[variable.key] && (
              <p className="text-sm text-destructive">
                {errors[variable.key]?.message as string}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ComboboxField({
  id,
  options,
  value,
  onChange,
  placeholder,
  useCustomLabel = 'Kullan',
  noResultsLabel = 'Sonuç bulunamadı',
}: {
  id: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  useCustomLabel?: string;
  noResultsLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = search
    ? options.filter((o) => o.toLowerCase().includes(search.toLowerCase()))
    : options;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        title={placeholder}
        className={cn(
          'flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs cursor-pointer',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
        )}
      >
        <span className={cn('truncate', !value && 'text-muted-foreground')}>
          {value || placeholder}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {search.trim() ? (
                <button
                  type="button"
                  className="w-full cursor-pointer px-4 py-2 text-left text-sm hover:bg-accent"
                  onClick={() => {
                    onChange(search.trim());
                    setSearch('');
                    setOpen(false);
                  }}
                >
                  &quot;{search.trim()}&quot; — {useCustomLabel}
                </button>
              ) : (
                noResultsLabel
              )}
            </CommandEmpty>
            <CommandGroup>
              {filtered.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => {
                    onChange(option);
                    setSearch('');
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
