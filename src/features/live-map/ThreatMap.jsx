import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchThreatEvents, POLL_MS } from './threatFeed.service';
import '../../styles/features/live-map.css';

const severityColor = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
  critical: '#dc2626',
};

const makeArc = (a, b, steps = 40, bend = 0.22) => {
  const pts = [];
  const mx = (a.lat + b.lat) / 2;
  const my = (a.lng + b.lng) / 2;
  const dx = b.lng - a.lng;
  const dy = b.lat - a.lat;
  const cx = mx - dy * bend;
  const cy = my + dx * bend;

  for (let t = 0; t <= 1; t += 1 / steps) {
    const lat = (1 - t) * (1 - t) * a.lat + 2 * (1 - t) * t * cx + t * t * b.lat;
    const lng = (1 - t) * (1 - t) * a.lng + 2 * (1 - t) * t * cy + t * t * b.lng;
    pts.push([lat, lng]);
  }

  return pts;
};

const ThreatMap = ({ mini = false }) => {
  const [events, setEvents] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const data = await fetchThreatEvents();
        if (mounted) {
          setEvents(Array.isArray(data) ? data : []);
          setLastUpdated(Date.now());
        }
      } catch (_err) {
        // Keep previous data frame when provider is unavailable.
      }
    };

    load();
    const intervalId = setInterval(load, POLL_MS);
    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const arcs = useMemo(
    () =>
      events.map((event) => ({
        id: event.id,
        severity: event.severity,
        scale: event.scale || 1,
        path: makeArc(event.src, event.dst, mini ? 24 : 40, mini ? 0.16 : 0.22),
      })),
    [events, mini]
  );

  const severityTotals = useMemo(() => {
    const totals = { low: 0, medium: 0, high: 0, critical: 0 };
    events.forEach((event) => {
      const key = event.severity in totals ? event.severity : 'low';
      totals[key] += 1;
    });
    return totals;
  }, [events]);

  const destination = events[0]?.dst || { lat: 40.7128, lng: -74.006 };

  return (
    <div className={mini ? 'threat-map-shell threat-map-shell--mini' : 'threat-map-shell threat-map-shell--full'}>
      <MapContainer
        center={[20, 0]}
        zoom={mini ? 1 : 2}
        minZoom={1}
        maxZoom={6}
        zoomControl={!mini}
        attributionControl={!mini}
        className={mini ? 'threat-map threat-map--mini' : 'threat-map threat-map--full'}
        worldCopyJump
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

        <CircleMarker
          center={[destination.lat, destination.lng]}
          radius={mini ? 5 : 7}
          pathOptions={{ color: '#38bdf8', fillColor: '#38bdf8', fillOpacity: 0.9, className: 'soc-node' }}
        />

        {events.map((event) => (
          <CircleMarker
            key={`src-${event.id}`}
            center={[event.src.lat, event.src.lng]}
            radius={Math.max(3, 2 + (event.scale || 1))}
            pathOptions={{ color: severityColor[event.severity], fillOpacity: 0.75 }}
          />
        ))}

        {arcs.map((arc) => (
          <Polyline
            key={`arc-${arc.id}`}
            positions={arc.path}
            pathOptions={{
              color: severityColor[arc.severity],
              weight: 1.4 + arc.scale,
              opacity: 0.85,
              className: `threat-arc threat-arc--${arc.severity}`,
            }}
          />
        ))}
      </MapContainer>

      <div className="threat-map-overlay threat-map-overlay--header">
        <p className="threat-map-kicker">LIVE THREAT STREAM</p>
        <h3>{mini ? 'Global Threat Snapshot' : 'Global Live Threat Movement'}</h3>
        <span>{events.length} active events</span>
      </div>

      <div className="threat-map-overlay threat-map-overlay--legend">
        {['low', 'medium', 'high', 'critical'].map((level) => (
          <div key={level} className={`threat-chip threat-chip--${level}`}>
            <span>{level}</span>
            <strong>{severityTotals[level]}</strong>
          </div>
        ))}
      </div>

      {lastUpdated && (
        <div className="threat-map-overlay threat-map-overlay--timestamp">
          Updated {new Date(lastUpdated).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default ThreatMap;
