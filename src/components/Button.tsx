export default function Button({
  onClick,
  type,
  className,
  disabled,
  children,
  id,
}: {
  onClick?: () => void
  id?: string
  type?: 'reset' | 'submit' | 'button' | undefined
  className?: string
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
        className,
      ]
        .filter(f => !!f)
        .join(' ')}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  )
}
