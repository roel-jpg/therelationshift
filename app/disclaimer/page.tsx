import { permanentRedirect } from 'next/navigation';

// The 2016 "Disclaimer & Privacy Policy" has been replaced by one current statement,
// so there is never more than one story about what happens to people's data.
export default function DisclaimerRedirect() {
  permanentRedirect('/privacy');
}
