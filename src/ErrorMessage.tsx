export default function ErrorMessage({ error }: { error: unknown }) {
  return <div style={{ color: 'red' }}>{`${error}`}</div>
}
