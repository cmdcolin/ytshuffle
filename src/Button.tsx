export default function Button({
  onClick,
  type,
  disabled,
  children,
  id,
}: {
  onClick?: () => void
  id?: string
  type?: 'reset' | 'submit' | 'button' | undefined
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      id={id}
      className={[
        'btn',
        'btn-soft',
        'btn-sm',
        'font-normal',
        'text-sm',
        'p-1',
        'm-1',
      ].join(' ')}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  )
}
