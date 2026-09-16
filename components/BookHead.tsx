import type { ReactNode } from 'react';

// Full-width parallax banner with title + intro text used by the original static pages (".book-head").
export function BookHead({ image, title, text, center, short, children, position }: {
  image: string; title: string; text?: ReactNode; center?: boolean; short?: boolean; children?: ReactNode; position?: string;
}) {
  return (
    <div className={`book-head${center ? ' text-center' : ''}${short ? ' short' : ''}`} style={{ backgroundImage: `url(${image})`, backgroundPositionY: position }}>
      <div className="book-head-container container">
        <div className="book-head-content">
          <div className="main-content">
            <div className="head"><h1>{title}</h1></div>
            {text && <div className="content">{typeof text === 'string' ? <p>{text}</p> : text}</div>}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
