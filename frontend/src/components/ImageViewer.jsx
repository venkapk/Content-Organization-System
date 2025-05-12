import React, { useState, useRef, useEffect } from 'react';

const ImageViewer = ({ imagePath, textLines }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(true);
  const [hoveredBox, setHoveredBox] = useState(null);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(1);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (imageRef.current && imageRef.current.complete) {
      handleImageLoad();
    }
  }, [imagePath]);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current || !dimensions.width) return;
      const containerWidth = containerRef.current.offsetWidth;
      setScale(containerWidth / dimensions.width);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [dimensions.width]);

  const handleImageLoad = () => {
    try {
      if (!imageRef.current) return;
      setDimensions({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight
      });
    } catch (err) {
      setError('Failed to load image dimensions');
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = () => {
    setError('Failed to load image');
    setLoading(false);
  };

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (!imagePath || !textLines?.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div 
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
      >
        <div className="relative">
          <img
            ref={imageRef}
            src={`http://localhost:5000/images/${imagePath}`}
            alt="Document scan"
            className="w-full h-auto"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          
          {!loading && dimensions.width > 0 && (
            <svg
              className="absolute top-0 left-0 w-full h-full"
              viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
              preserveAspectRatio="none"
            >
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="5"
                  refY="5"
                  markerWidth="4"
                  markerHeight="4"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor"/>
                </marker>
              </defs>
              
              {textLines.map((line, index) => {
                if (!line.bbox || line.bbox.length !== 4) return null;
                
                const [x1, y1, x2, y2] = line.bbox;
                const isHovered = hoveredBox === index;
                const hue = (index * 37) % 360;
                
                return (
                  <g
                    key={index}
                    onMouseEnter={() => setHoveredBox(index)}
                    onMouseLeave={() => setHoveredBox(null)}
                    style={{ 
                      cursor: 'pointer',
                      color: `hsl(${hue}, 70%, ${isHovered ? 45 : 55}%)`
                    }}
                  >
                    {/* Highlight background */}
                    <rect
                      x={x1}
                      y={y1}
                      width={x2 - x1}
                      height={y2 - y1}
                      fill="currentColor"
                      opacity={isHovered ? "0.2" : "0.1"}
                      rx="2"
                    />
                    
                    {/* Bounding box */}
                    <rect
                      x={x1}
                      y={y1}
                      width={x2 - x1}
                      height={y2 - y1}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={isHovered ? "2" : "1"}
                      rx="2"
                    />

                    {/* Line number */}
                    <g transform={`translate(${x1 - 5}, ${y1 + ((y2 - y1) / 2)})`}>
                      <text
                        x="0"
                        y="0"
                        fill="currentColor"
                        fontSize={12 / scale}
                        textAnchor="end"
                        dominantBaseline="middle"
                        className="select-none font-mono"
                      >
                        {index + 1}
                      </text>
                    </g>

                    {/* Text preview on hover */}
                    {isHovered && (
                      <g transform={`translate(${x1}, ${y2 + 20})`}>
                        <rect
                          x="-5"
                          y="-15"
                          width="210"
                          height="20"
                          fill="white"
                          stroke="currentColor"
                          strokeWidth="1"
                          rx="4"
                        />
                        <text
                          x="0"
                          y="-2"
                          fill="currentColor"
                          fontSize={11 / scale}
                          className="select-none"
                        >
                          <tspan>{line.text.slice(0, 30)}</tspan>
                          <tspan x="160" className="font-mono">
                            {Math.round(line.confidence * 100)}%
                          </tspan>
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 text-sm">
        {textLines.slice(0, 10).map((line, index) => (
          <div
            key={index}
            className="flex items-center gap-2 px-2 py-1 rounded bg-gray-50 border border-gray-200"
            style={{ 
              color: `hsl(${(index * 37) % 360}, 70%, 55%)`
            }}
          >
            <span className="font-mono">{index + 1}</span>
            <span className="truncate max-w-[150px]">{line.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageViewer;