// MoldovaMap.jsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';

// Импорт SVG иконок
import windSvgTemplate from '../assets/wind.svg?raw';
import solarSvgTemplate from '../assets/solar.svg?raw';

// Функция для создания иконки с нужным цветом
const createCustomIcon = (svgString, color) => {
    const coloredSvg = svgString.replace('COLOR_PLACEHOLDER', color);
    const encodedSvg = encodeURIComponent(coloredSvg);
    const dataUri = `data:image/svg+xml,${encodedSvg}`;

    return new L.Icon({
        iconUrl: dataUri,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
};

// Функция для получения цвета по статусу
const getStatusColor = (status) => {
    switch (status) {
        case 'ok': return '#22c55e'; // зеленый
        case 'error': return '#ef4444'; // красный
        case 'warning': return '#f59e0b'; // желтый
        default: return '#6b7280'; // серый
    }
};

// Кнопка возврата к исходному виду
function ResetViewButton({ center, zoom }) {
    const map = useMap();

    useEffect(() => {
        const control = L.control({ position: 'topleft' });

        control.onAdd = () => {
            const button = L.DomUtil.create('button', 'leaflet-bar');
            button.innerHTML = '⤾';
            button.style.width = '32px';
            button.style.height = '32px';
            button.style.cursor = 'pointer';
            button.style.fontSize = '18px';
            button.style.backgroundColor = '#fff';
            button.title = 'Reset View';

            L.DomEvent.on(button, 'click', () => {
                map.setView(center, zoom, { animate: true });
            });

            return button;
        };

        control.addTo(map);
        return () => control.remove();
    }, [map, center, zoom]);

    return null;
}

export default function RenewableMapLeaflet() {
    const [points, setPoints] = useState([]);
    const initialCenter = [47, 28.5]; // Центр Молдовы
    const initialZoom = 7;

    // Функция загрузки данных
    const fetchData = async () => {
        const mockData = [
            { id: 1, type: 'wind', name: "Turbine A", status: "ok", power: 1500, lat: 46.355121, lng: 28.627681 },
            { id: 2, type: 'wind', name: "Turbine B", status: "ok", power: 2000, lat: 46.350175, lng: 28.628744 },
            { id: 3, type: 'solar', name: "Solar A", status: "error", power: 0, lat: 46.317238, lng: 28.603801 },
            { id: 4, type: 'wind', name: "Turbine C", status: "warning", power: 800, lat: 46.365244, lng: 28.623737 }
        ];
        setPoints(mockData);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="bg-white rounded-sm shadow-sm border border-gray-200 w-full">
            <div className="px-1 sm:px-4 py-2 sm:py-3 border-b border-gray-200 bg-gray-50">
                <h2 className="text-[14px] sm:text-lg font-semibold text-gray-900">
                    Renewable Energy Map of Moldova
                </h2>
                <p className="text-gray-500 text-sm">Here you can see your facilities.</p>
            </div>

            <div className='p-4 h-[75vh]'>
                <MapContainer
                    center={initialCenter}
                    zoom={initialZoom}
                    style={{ height: '100%', width: '100%' }}
                    keyboard={false}
                    tap={false}
                >
                    <TileLayer
                        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />

                    <ResetViewButton center={initialCenter} zoom={initialZoom} />

                    {points.map((p) => {
                        const color = getStatusColor(p.status);
                        const svgTemplate = p.type === 'wind' ? windSvgTemplate : solarSvgTemplate;
                        const icon = createCustomIcon(svgTemplate, color);

                        return (
                            <Marker
                                key={p.id}
                                position={[p.lat, p.lng]}
                                icon={icon}
                            >
                                <Popup>
                                    <div style={{ minWidth: '200px' }}>
                                        <strong style={{ fontSize: '16px', marginBottom: '8px', display: 'block' }}>
                                            {p.name}
                                        </strong>
                                        <div style={{ lineHeight: '1.5' }}>
                                            <div><strong>ID:</strong> {p.id}</div>
                                            <div><strong>Type:</strong> {p.type === 'wind' ? 'Wind Turbine' : 'Solar Panel'}</div>
                                            <div>
                                                <strong>Status:</strong>
                                                <span style={{
                                                    color: color,
                                                    fontWeight: 'bold',
                                                    marginLeft: '5px'
                                                }}>
                                                    {p.status === 'ok' ? 'Operating' : p.status === 'error' ? 'Error' : 'Warning'}
                                                </span>
                                            </div>
                                            <div><strong>Power:</strong> {p.power} kW</div>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>
        </div>
    );
}
