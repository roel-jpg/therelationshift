type Marker = { name: string; x: number | null; y: number | null };

// "Join the global community" section: dotted world map with pulsing markers and three widgets (original .home-maps).
export function MapSection({ title, markers, columns, exercisesCompleted, nationalities }: {
  title: string;
  markers: Marker[];
  columns: { c1: string; c2: string; c2items: string[]; c3: string };
  exercisesCompleted: string;
  nationalities: string;
}) {
  return (
    <section className="home-maps">
      <div className="map-box container">
        <div className="map-images">
          <div className="overlay-text">{title}</div>
          <img src="/media/site/map.png" alt="World map with Relationshift couples" width={1103} height={545} />
          {markers.filter((m) => m.x != null && m.y != null && m.name !== 'Country ID').map((m, i) => (
            <div key={i} className="marker" style={{ top: `calc(${m.y}% - 7px)`, left: `calc(${m.x}% - 7px)` }}>
              <div className="marker-ripple" />
              <div className="marker-ripple-fade" />
              <div className="arrow-top" />
              <div className="marker-content">{m.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="map-content container">
        <div className="map-widget">
          <div className="head">{columns.c1}</div>
          <div className="content map-number">{exercisesCompleted}</div>
        </div>
        <div className="map-widget">
          <div className="head">{columns.c2}</div>
          <div className="content"><ol>{columns.c2items.map((t) => <li key={t}>{t}</li>)}</ol></div>
        </div>
        <div className="map-widget">
          <div className="head">{columns.c3}</div>
          <div className="content map-small">{nationalities}</div>
        </div>
      </div>
    </section>
  );
}
