import BaseDialog from './BaseDialog'
import Button from './Button'

export default function ConfirmDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <BaseDialog
      open={open}
      onClose={() => {
        /* must click submit */
      }}
    >
      <div className="max-w-[500px] flex flex-col space-y-8">
        <p>
          By using this website you agree to usage of the &quot;Privacy
          Policy&quot; below
        </p>
        <p>
          This website (the &quot;app&quot;) uses an &quot;API Client&quot; to
          access the Youtube Data API. The &quot;app&quot; allows third parties
          to serve content, including advertisements just by virtue of YouTube
          doing so. See also{' '}
          <a href="https://www.youtube.com/t/terms">
            YouTube&apos;s Terms of Service
          </a>{' '}
          and{' '}
          <a href="http://www.google.com/policies/privacy">
            Google&apos;s privacy policy
          </a>
          .
        </p>
        <p>
          By using this website you agree to the YouTube Terms of Service. The
          &quot;app&quot; processes data that the user pastes into the
          &quot;app&quot;, and shares it with the YouTube Data API. User data
          may also be collected from their device by analytics scripts from the
          page by the YouTube embedded widget. The &quot;app&quot; itself does
          not collect any user data or analytics.
        </p>
        <p>
          I added this consent screen because Google asks users of their API to
          do so{' '}
          <a href="https://developers.google.com/youtube/terms/developer-policies">
            here
          </a>
          . If there are any concerns, you can e-mail{' '}
          <a href="mailto:colin.diesh@gmail.com">me</a>.
        </p>

        <Button
          onClick={() => {
            localStorage.setItem('confirmed', 'true')
            onClose()
          }}
        >
          accept
        </Button>
      </div>
    </BaseDialog>
  )
}
