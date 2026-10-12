import { format, parseISO, isValid } from 'date-fns'
import { ro } from 'date-fns/locale'
import { useEffect, useId, useRef, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'

type DatePickerFieldProps = {
  label: string
  value: string
  onChange: (isoDate: string) => void
}

function parseValue(value: string): Date | undefined {
  if (!value) return undefined
  const parsed = parseISO(value)
  return isValid(parsed) ? parsed : undefined
}

export function DatePickerField({ label, value, onChange }: DatePickerFieldProps) {
  const id = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const selected = parseValue(value)

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const display = selected ? format(selected, 'dd.MM.yyyy', { locale: ro }) : 'Selectează data'

  return (
    <div className="field date-field" ref={rootRef}>
      <span className="field-label" id={`${id}-label`}>
        {label}
      </span>
      <button
        type="button"
        className="date-trigger"
        aria-labelledby={`${id}-label`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {display}
      </button>
      {open ? (
        <div className="date-popover">
          <DayPicker
            mode="single"
            selected={selected}
            locale={ro}
            onSelect={(day) => {
              if (day) {
                onChange(format(day, 'yyyy-MM-dd'))
                setOpen(false)
              }
            }}
          />
        </div>
      ) : null}
    </div>
  )
}
