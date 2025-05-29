import type { ChangeEvent } from 'react'

export default function Checkbox({
  id,
  checked,
  onChange,
  label,
}: {
  id: string
  checked: boolean
  label: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="ml-2 mr-2"
      />
      <label htmlFor={id}>{label}</label>
    </div>
  )
}
