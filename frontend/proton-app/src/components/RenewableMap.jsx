import { useEffect, useRef, useState } from "react";

export default function RenewableMap() {
  const points = [
    {
      x: 373,
      y: 191,
      items: [
        { id: 1, name: "Turbine A", type: "wind", status: "ok" },
        { id: 2, name: "Solar Panel 1", type: "solar", status: "error" },
        { id: 3, name: "Turbine B", type: "wind", status: "ok" },
        { id: 4, name: "Solar Panel 2", type: "solar", status: "ok" },
      ],
    },
    {
      x: 645,
      y: 485,
      items: [{ id: 5, name: "Turbine C", type: "wind", status: "error" }],
    },
    {
      x: 539,
      y: 637    ,
      items: [
        { id: 6, name: "Turbine D", type: "wind", status: "ok" },
        { id: 7, name: "Solar Panel 3", type: "solar", status: "ok" },
        { id: 8, name: "Turbine E", type: "wind", status: "error" },
        { id: 9, name: "Solar Panel 4", type: "solar", status: "ok" },
        { id: 10, name: "Turbine F", type: "wind", status: "ok" },
      ],
    },
  ];

  // viewBox size (совпадает с атрибутом viewBox у SVG)
  const VB_WIDTH = 1000;
  const VB_HEIGHT = 1000;

  // Иконки / сетка
  const ICON_SIZE = 28; // в единицах viewBox
  const GAP = 6;

  // Допустимое отклонение клика в пикселях (под телефоны ставим ~28)
  const CLICK_TOLERANCE_PX = 40;

  const svgRef = useRef(null);
  const wrapperRef = useRef(null);

  // selectedPoint — ссылка на объект points[index]
  const [selectedPointIndex, setSelectedPointIndex] = useState(null);
  // popup position в пикселях относительно wrapperRef (для абсолютного HTML попапа)
  const [popupPos, setPopupPos] = useState({ left: 0, top: 0 });

  // Обработчик клика/тапа по SVG (универсальный — для mouse и touch)
  function handleSvgPointer(evt) {
    if (!svgRef.current || !wrapperRef.current) return;

    const rect = svgRef.current.getBoundingClientRect(); // область SVG в пикселях
    const clientX = evt.clientX ?? (evt.touches && evt.touches[0]?.clientX);
    const clientY = evt.clientY ?? (evt.touches && evt.touches[0]?.clientY);
    if (clientX == null || clientY == null) return;

    // Перевод в координаты viewBox
    const pxToVbX = (x) => ((x - rect.left) * VB_WIDTH) / rect.width;
    const pxToVbY = (y) => ((y - rect.top) * VB_HEIGHT) / rect.height;

    const vbX = pxToVbX(clientX);
    const vbY = pxToVbY(clientY);

    // Толерантность в viewBox-координатах
    const tolVb =
      (CLICK_TOLERANCE_PX * VB_WIDTH) / Math.max(rect.width, 1); // скалируем по ширине

    // Найти ближайшую точку в пределах tolVb
    let nearestIndex = null;
    let nearestDist = Infinity;
    points.forEach((p, i) => {
      const dx = p.x - vbX;
      const dy = p.y - vbY;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIndex = i;
      }
    });

    if (nearestIndex !== null && nearestDist <= tolVb) {
      // Открываем попап для найденной точки
      // Рассчитаем позицию попапа в пикселях относительно wrapper
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      // координата в пикселях от левого верхнего угла wrapper
      const leftPx =
        ((points[nearestIndex].x / VB_WIDTH) * rect.width) +
        (rect.left - wrapperRect.left); // add offset of svg inside wrapper
      const topPx =
        ((points[nearestIndex].y / VB_HEIGHT) * rect.height) +
        (rect.top - wrapperRect.top);

      setPopupPos({ left: leftPx, top: topPx });
      setSelectedPointIndex(nearestIndex);
    } else {
      // Клик не по точке — закрыть
      setSelectedPointIndex(null);
    }
  }

  // Закрываем попап при клике вне SVG и самого попапа
  useEffect(() => {
    function onDocPointerDown(e) {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      if (selectedPointIndex === null) return;

      const popup = wrapper.querySelector(".renewal-popup");
      if (!popup) return;

      if (popup.contains(e.target) || wrapper.querySelector("svg")?.contains(e.target)) {
        // клик внутри попапа или внутри SVG — не закрываем
        return;
      }
      setSelectedPointIndex(null);
    }

    document.addEventListener("pointerdown", onDocPointerDown);
    return () => document.removeEventListener("pointerdown", onDocPointerDown);
  }, [selectedPointIndex]);

  // Если захотите закрыть кнопкой
  function closePopup() {
    setSelectedPointIndex(null);
  }

  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray-200 w-full">
      <div className="px-1 sm:px-4 py-2 sm:py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-[14px] sm:text-lg font-semibold text-gray-900">
          Renewable Energy Map of Moldova
        </h2>
        <p className="text-gray-500 text-sm">Here you can see your facilities.</p>
      </div>

      <div className="p-4">
        <div className="w-full max-w-7xl mx-auto">
          <div className="overflow-hidden relative" ref={wrapperRef}>
            {/* SVG занимает ширину контейнера и адаптируется */}
            <svg
              viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto block"
              role="img"
              aria-label="Energy map"
              ref={svgRef}
              onPointerDown={handleSvgPointer} // pointer covers mouse & touch
            >
              {/* Фон: твоя карта (в /public/md.svg) */}
              <image href="/md.svg" x="0" y="0" width={VB_WIDTH} height={VB_HEIGHT} />

              {/* Рендер точек: рисуем группу в координатах точки */}
              {points.map((point, idx) => {
                return (
                  <g key={idx} transform={`translate(${point.x}, ${point.y})`}>
                    {/* Для видимости добавим интерактивную "горячую" область (круг) */}
                    <circle
                      cx={0}
                      cy={0}
                      r={Math.max(ICON_SIZE, 18)} // видимая область для кликов
                      fill="transparent"
                      className="pointer-events-visible"
                    />
                    {/* сами иконки размещаем сеткой */}
                    {point.items.map((item, i) => {
                      const col = i % 3;
                      const row = Math.floor(i / 3);
                      const offsetX = (col * (ICON_SIZE + GAP)) - ((ICON_SIZE + GAP) * 3 - GAP) / 2;
                      const offsetY = (row * (ICON_SIZE + GAP)) - ((ICON_SIZE + GAP) * 2 - GAP) / 2;

                      const iconHref = item.type === "wind" ? "/wind.svg" : "/solar.svg";
                      // Цвет статуса — для текста рядом в popup, иконки — обычные SVG, окраска внутри SVG зависит от файла
                      return (
                        <g
                          key={item.id}
                          transform={`translate(${offsetX - ICON_SIZE / 2}, ${offsetY - ICON_SIZE / 2})`}
                          // ставим pointer-events none, так как обработчик у всего SVG (чтобы толерантность работала централизованно)
                          style={{ pointerEvents: "none" }}
                        >
                          <image
                            href={iconHref}
                            x={0}
                            y={0}
                            width={ICON_SIZE}
                            height={ICON_SIZE}
                            preserveAspectRatio="xMidYMid meet"
                          />
                          {/* title останется для нативного тултипа при долгом удержании */}
                          <title>
                            {item.name} — {item.status === "ok" ? "Работает" : "Ошибка"}
                          </title>
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </svg>

            {/* HTML-попап центрированный и адаптивный */}
            {selectedPointIndex !== null && (
              <div className="renewal-popup absolute z-50 inset-0 flex items-center justify-center p-4 pointer-events-none">
                <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-xs sm:max-w-sm pointer-events-auto">
                  <div className="p-3 sm:p-4 border-b border-gray-100">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs text-gray-500">Location</div>
                        <div className="font-medium text-gray-800 text-sm">
                          {`x: ${points[selectedPointIndex].x}, y: ${points[selectedPointIndex].y}`}
                        </div>
                      </div>
                      <button
                        onClick={closePopup}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Close"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4">
                    <div className="text-xs text-gray-500 mb-2">Facilities ({points[selectedPointIndex].items.length})</div>
                    <div className="space-y-2 max-h-48 sm:max-h-64 overflow-auto">
                      {points[selectedPointIndex].items.map((it) => (
                        <div key={it.id} className="flex items-center gap-2 p-2 rounded-md bg-gray-50">
                          {/* Статус индикатор */}
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            it.status === "ok" ? "bg-green-500" : "bg-red-500"
                          }`} />
                          
                          <div className="flex-1 min-w-0">
                            <div className="text-gray-800 text-sm font-medium truncate">{it.name}</div>
                            <div className="flex items-center gap-1 text-xs">
                              <span className="text-gray-500 capitalize">{it.type}</span>
                              <span className="text-gray-300">•</span>
                              <span className={it.status === "ok" ? "text-green-600" : "text-red-600"}>
                                {it.status === "ok" ? "Online" : "Error"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}