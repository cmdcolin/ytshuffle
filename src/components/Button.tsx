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
      className={['btn', 'btn-sm', 'btn-soft', 'font-normal', className]
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
