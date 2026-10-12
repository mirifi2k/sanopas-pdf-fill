import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { prefilledDefaults } from '../config/prefill'
import { fillAndDownloadPdf } from '../lib/fillPdf'
import { emptyFormValues, type FormValues } from '../types/form'
import { DatePickerField } from './DatePickerField'
import { SegmentedInput } from './SegmentedInput'

const defaultValues: FormValues = { ...emptyFormValues, ...prefilledDefaults }

export function PdfForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues, mode: 'onBlur' })

  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle')
  const [message, setMessage] = useState<string | null>(null)

  const onSubmit = async (data: FormValues) => {
    setStatus('loading')
    setMessage(null)
    try {
      const { missingFields } = await fillAndDownloadPdf(data)
      setStatus('success')
      if (missingFields.length > 0) {
        setMessage(
          `PDF descărcat. Verifică în consolă câmpurile care nu s-au potrivit (${missingFields.length}).`,
        )
      } else {
        setMessage('PDF completat și descărcat.')
      }
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Eroare la generarea PDF.')
    }
  }

  return (
    <form className="pdf-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <section className="form-section">
        <h2>Date personale</h2>
        <div className="field">
          <label className="field-label" htmlFor="name">
            Nume
          </label>
          <input id="name" className="text-input" {...register('name', { required: 'Completează numele.' })} />
          {errors.name ? <p className="field-error">{errors.name.message}</p> : null}
        </div>

        <Controller
          name="cnp"
          control={control}
          rules={{
            required: 'Completează CNP-ul.',
            minLength: { value: 13, message: 'CNP-ul are 13 cifre.' },
            maxLength: { value: 13, message: 'CNP-ul are 13 cifre.' },
            pattern: { value: /^\d{13}$/, message: 'CNP-ul conține doar cifre.' },
          }}
          render={({ field }) => (
            <SegmentedInput
              label="Cod numeric personal (CNP)"
              length={13}
              inputMode="numeric"
              pattern={/^\d$/}
              hint="13 cifre — poți lipi întreg CNP-ul."
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.cnp ? <p className="field-error">{errors.cnp.message}</p> : null}

        <Controller
          name="ca"
          control={control}
          render={({ field }) => (
            <SegmentedInput
              label="Cod angajat"
              length={13}
              inputMode="text"
              hint="13 caractere — ca_0 … ca_12 în PDF."
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <div className="field">
          <label className="field-label" htmlFor="address">
            Adresă
          </label>
          <textarea id="address" className="text-input textarea" rows={2} {...register('address')} />
        </div>

        <div className="field-grid">
          <div className="field">
            <label className="field-label" htmlFor="phone">
              Număr de telefon
            </label>
            <input id="phone" className="text-input" type="tel" {...register('phone')} />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="email">
              Adresă de e-mail
            </label>
            <input
              id="email"
              className="text-input"
              type="email"
              {...register('email', {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Adresă de e-mail invalidă.',
                },
              })}
            />
            {errors.email ? <p className="field-error">{errors.email.message}</p> : null}
          </div>
        </div>
      </section>

      <section className="form-section">
        <h2>Date bancare</h2>
        <Controller
          name="iban"
          control={control}
          rules={{
            minLength: { value: 24, message: 'IBAN România: 24 caractere.' },
            maxLength: { value: 24, message: 'IBAN România: 24 caractere.' },
          }}
          render={({ field }) => (
            <SegmentedInput
              label="IBAN"
              length={24}
              autoUppercase
              hint="24 caractere — iban_0 … iban_23 în PDF."
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.iban ? <p className="field-error">{errors.iban.message}</p> : null}

        <div className="field-grid">
          <div className="field">
            <label className="field-label" htmlFor="bank">
              Deschis la banca
            </label>
            <input id="bank" className="text-input" {...register('bank')} />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="bank_branch">
              Sucursala bancii
            </label>
            <input id="bank_branch" className="text-input" {...register('bank_branch')} />
          </div>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="owner">
            Titular cont
          </label>
          <input id="owner" className="text-input" {...register('owner')} />
        </div>

        <Controller
          name="ocnp"
          control={control}
          render={({ field }) => (
            <SegmentedInput
              label="CNP titular cont"
              length={13}
              inputMode="numeric"
              pattern={/^\d$/}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </section>

      <section className="form-section">
        <h2>Servicii medicale</h2>
        <div className="field-grid">
          <div className="field">
            <label className="field-label" htmlFor="clinic_0">
              Furnizor (clinică)
            </label>
            <input id="clinic_0" className="text-input" {...register('clinic_0')} />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="medic_0">
              Medic
            </label>
            <input id="medic_0" className="text-input" {...register('medic_0')} />
          </div>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="specialty_0">
            Specialitate
          </label>
          <input id="specialty_0" className="text-input" {...register('specialty_0')} />
        </div>

        <Controller
          name="date"
          control={control}
          rules={{ required: 'Selectează data.' }}
          render={({ field }) => (
            <DatePickerField label="Data" value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.date ? <p className="field-error">{errors.date.message}</p> : null}
      </section>

      {message ? (
        <p className={`form-banner ${status === 'error' ? 'form-banner-error' : 'form-banner-ok'}`} role="status">
          {message}
        </p>
      ) : null}

      <div className="form-actions">
        <button type="submit" className="primary-button" disabled={status === 'loading'}>
          {status === 'loading' ? 'Se generează PDF…' : 'Descarcă PDF completat'}
        </button>
      </div>
    </form>
  )
}
