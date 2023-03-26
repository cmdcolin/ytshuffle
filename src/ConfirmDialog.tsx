import useDialogShown from './useDialogShown'

export default function ConfirmDialog({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (arg: boolean) => void
}) {
  const ref = useDialogShown(open)
  return (
    <dialog ref={ref} style={{ maxWidth: 500 }}>
      <p>
        By using this website you agree to usage of the "Privacy Policy" below
      </p>
      <p>
        This website (the "app") uses an "API Client" to access the Youtube Data
        API. The "app" allows third parties to serve content, including
        advertisements just by virtue of YouTube doing so. See also{' '}
        <a href="https://www.youtube.com/t/terms">YouTube's Terms of Service</a>{' '}
        and{' '}
        <a href="http://www.google.com/policies/privacy">
          Google's privacy policy
        </a>
        . By using this website you agree to the YouTube Terms of Service. The
        "app" processes data that the user pastes into the "app", and shares it
        with the YouTube Data API. User data may also be collected from their
        device by analytics scripts from the page by the YouTube embedded
        widget. The "app" itself does not collect any user data or analytics.
      </p>
      <p>
        I added this consent screen because Google asks users of their API to do
        so{' '}
        <a href="https://developers.google.com/youtube/terms/developer-policies">
          here
        </a>
        . If there are any concerns, you can e-mail{' '}
        <a href="mailto:colin.diesh@gmail.com">me</a>.
      </p>

      <button
        onClick={() => {
          localStorage.setItem('confirmed', 'true')
          setOpen(false)
        }}
      >
        accept
      </button>
    </dialog>
  )
}
