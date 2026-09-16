import Link from 'next/link';
import { ArrowRight } from '../Icons';
import { richHtml } from '@/lib/rich';

const IMAGE_HEX = 'M112.683 3.73c8.607-4.973 22.56-4.974 31.168 0l97.1 56.1c8.607 4.973 15.584 17.065 15.584 27.01v112.202c0 9.945-6.976 22.038-15.584 27.01l-97.1 56.1c-8.606 4.974-22.56 4.975-31.167 0l-97.1-56.1C6.978 221.083 0 208.99 0 199.043v-112.2C0 76.895 6.976 64.8 15.584 59.83l97.1-56.1z';
const BORDER_HEX = 'M812 714.987c0-10.984 5.83-21.135 15.295-26.628l96.91-56.24c9.465-5.493 21.125-5.493 30.59 0l96.91 56.24c9.463 5.492 15.295 15.643 15.295 26.627v112.48c0 10.985-5.832 21.136-15.295 26.628l-96.91 56.24c-9.465 5.492-21.125 5.492-30.59 0l-96.91-56.24C817.83 848.603 812 838.452 812 827.467v-112.48z';

type Step = { title: string; description: string };

// The five big hexagons of the original home page: image hex (appears on hover), gradient stroke, gradient number.
export function HowItWorks({ steps, joinHref }: { steps: Step[]; joinHref: string }) {
  return (
    <div className="hexagon-list-big">
      {steps.map((s, idx) => {
        const n = idx + 1;
        const odd = n % 2 === 1;
        const image = (
          <div className="hexagon-big-image">
            <svg className="big-image" viewBox="0 0 257 286" aria-hidden="true">
              <defs>
                <pattern id={`hex-img-${n}`} patternUnits="userSpaceOnUse" width="257" height="286">
                  <image href={`/media/site/how-${n}.jpg`} x="-100" y="-100" width="450" height="450" preserveAspectRatio="xMidYMid slice" />
                </pattern>
              </defs>
              <path d={IMAGE_HEX} fill={`url(#hex-img-${n})`} />
            </svg>
            <svg className="big-border" viewBox="807 623 265 297" aria-hidden="true">
              <defs>
                <linearGradient id={`hex-grad-${n}`} x1="50%" y1="-5.797%" x2="50%" y2="108.085%">
                  <stop stopColor="#F05F61" offset="0%" /><stop stopColor="#FBB022" offset="100%" />
                </linearGradient>
              </defs>
              <path d={BORDER_HEX} stroke={`url(#hex-grad-${n})`} strokeWidth="2" fill="none" />
            </svg>
            <div className="number">
              <svg viewBox="0 0 84 174" aria-hidden="true">
                <defs>
                  <linearGradient id={`num-grad-${n}`} x1="-77.489%" y1="0%" x2="185.372%" y2="100%">
                    <stop stopColor="#F05F61" offset="0%" /><stop stopColor="#FBB022" offset="100%" />
                  </linearGradient>
                </defs>
                <text x="42" y="140" fontSize="145" textAnchor="middle" fontFamily="'Open Sans', sans-serif" fontWeight="300" fill={`url(#num-grad-${n})`}>{n}</text>
              </svg>
            </div>
          </div>
        );
        const content = (
          <div className="big-content">
            <div className="big-head">{s.title}</div>
            <div className="big-content-full" dangerouslySetInnerHTML={{ __html: richHtml(s.description) }} />
            {n === 5 && (
              <div className="read-more group-center">
                <Link href={joinHref} className="btn-gradient"><span>Join now</span><ArrowRight /></Link>
              </div>
            )}
          </div>
        );
        return (
          <div key={n} className={`hexagon-big hex-${n} wow ${odd ? 'fadeInRight' : 'fadeInLeft'}`} data-wow-duration="1s">
            {odd ? image : content}
            {odd ? content : image}
          </div>
        );
      })}
    </div>
  );
}
