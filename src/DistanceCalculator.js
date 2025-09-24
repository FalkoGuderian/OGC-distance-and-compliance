/**
 * DistanceCalculator class for calculating distances between coordinate points and various geometry types
 * Uses Turf.js for spatial calculations
 */
class DistanceCalculator {

    /**
     * Calculate distance from a coordinate point to a feature
     * @param {Object} coordinatePoint - Turf.js point object
     * @param {Object} feature - GeoJSON feature object
     * @returns {Object|null} Object with distance (in kilometers) and isContaining properties, or null if calculation fails
     */
    static calculateFeatureDistance(coordinatePoint, feature) {
        if (!feature.geometry) {
            return null;
        }

        const geomType = feature.geometry.type;
        let distance = Infinity;
        let isContaining = false;

        // Check containment for polygons first
        if (geomType === 'Polygon' || geomType === 'MultiPolygon') {
            try {
                isContaining = turf.booleanPointInPolygon(coordinatePoint, feature);
                if (isContaining) {
                    return { distance: 0, isContaining: true };
                }
            } catch (error) {
                console.warn('Error checking point containment:', error);
            }
        }

        // Calculate distance to boundary/geometry
        try {
            distance = this.calculateDistanceToGeometry(coordinatePoint, feature.geometry);
        } catch (error) {
            console.warn('Error calculating distance for feature:', error);
            return null;
        }

        return { distance: distance, isContaining: false };
    }

    /**
     * Calculate distance from a point to a geometry
     * @param {Object} coordinatePoint - Turf.js point object
     * @param {Object} geometry - GeoJSON geometry object
     * @returns {number} Distance in kilometers
     */
    static calculateDistanceToGeometry(coordinatePoint, geometry) {
        const geomType = geometry.type;

        switch (geomType) {
            case 'Polygon':
                return this.calculateDistanceToPolygon(coordinatePoint, geometry);
            case 'MultiPolygon':
                return this.calculateDistanceToMultiPolygon(coordinatePoint, geometry);
            case 'LineString':
                return this.calculateDistanceToLineString(coordinatePoint, geometry);
            case 'MultiLineString':
                return this.calculateDistanceToMultiLineString(coordinatePoint, geometry);
            case 'Point':
                return this.calculateDistanceToPoint(coordinatePoint, geometry);
            case 'MultiPoint':
                return this.calculateDistanceToMultiPoint(coordinatePoint, geometry);
            default:
                throw new Error(`Unsupported geometry type: ${geomType}`);
        }
    }

    /**
     * Calculate distance from a point to a polygon
     * @param {Object} coordinatePoint - Turf.js point object
     * @param {Object} polygon - GeoJSON polygon geometry
     * @returns {number} Distance in kilometers
     */
    static calculateDistanceToPolygon(coordinatePoint, polygon) {
        const boundary = turf.polygonToLine(polygon);

        if (boundary.geometry.type === 'LineString') {
            return turf.pointToLineDistance(coordinatePoint, boundary, { units: 'kilometers' });
        } else if (boundary.geometry.type === 'MultiLineString') {
            let minDist = Infinity;
            boundary.geometry.coordinates.forEach(lineCoords => {
                const lineSegment = turf.lineString(lineCoords);
                const dist = turf.pointToLineDistance(coordinatePoint, lineSegment, { units: 'kilometers' });
                if (dist < minDist) {
                    minDist = dist;
                }
            });
            return minDist;
        }

        throw new Error('Invalid polygon boundary geometry');
    }

    /**
     * Calculate distance from a point to a multi-polygon
     * @param {Object} coordinatePoint - Turf.js point object
     * @param {Object} multiPolygon - GeoJSON multi-polygon geometry
     * @returns {number} Distance in kilometers
     */
    static calculateDistanceToMultiPolygon(coordinatePoint, multiPolygon) {
        let minDist = Infinity;

        multiPolygon.coordinates.forEach(polygonCoords => {
            const singlePolygon = turf.polygon(polygonCoords);
            const boundary = turf.polygonToLine(singlePolygon);

            if (boundary.geometry.type === 'LineString') {
                const dist = turf.pointToLineDistance(coordinatePoint, boundary, { units: 'kilometers' });
                if (dist < minDist) {
                    minDist = dist;
                }
            } else if (boundary.geometry.type === 'MultiLineString') {
                boundary.geometry.coordinates.forEach(lineCoords => {
                    const lineSegment = turf.lineString(lineCoords);
                    const dist = turf.pointToLineDistance(coordinatePoint, lineSegment, { units: 'kilometers' });
                    if (dist < minDist) {
                        minDist = dist;
                    }
                });
            }
        });

        return minDist;
    }

    /**
     * Calculate distance from a point to a line string
     * @param {Object} coordinatePoint - Turf.js point object
     * @param {Object} lineString - GeoJSON line string geometry
     * @returns {number} Distance in kilometers
     */
    static calculateDistanceToLineString(coordinatePoint, lineString) {
        return turf.pointToLineDistance(coordinatePoint, lineString, { units: 'kilometers' });
    }

    /**
     * Calculate distance from a point to a multi-line string
     * @param {Object} coordinatePoint - Turf.js point object
     * @param {Object} multiLineString - GeoJSON multi-line string geometry
     * @returns {number} Distance in kilometers
     */
    static calculateDistanceToMultiLineString(coordinatePoint, multiLineString) {
        let minDist = Infinity;

        multiLineString.coordinates.forEach(lineCoords => {
            if (Array.isArray(lineCoords) && lineCoords.length > 1) {
                const singleLine = turf.lineString(lineCoords);
                const dist = turf.pointToLineDistance(coordinatePoint, singleLine, { units: 'kilometers' });
                if (dist < minDist) {
                    minDist = dist;
                }
            }
        });

        return minDist;
    }

    /**
     * Calculate distance from a point to a point
     * @param {Object} coordinatePoint - Turf.js point object
     * @param {Object} point - GeoJSON point geometry
     * @returns {number} Distance in kilometers
     */
    static calculateDistanceToPoint(coordinatePoint, point) {
        // Ensure consistent coordinate order [lon, lat] for both points
        const featurePoint = turf.point(point.coordinates);
        return turf.distance(coordinatePoint, featurePoint, { units: 'kilometers' });
    }

    /**
     * Calculate distance from a point to a multi-point
     * @param {Object} coordinatePoint - Turf.js point object
     * @param {Object} multiPoint - GeoJSON multi-point geometry
     * @returns {number} Distance in kilometers
     */
    static calculateDistanceToMultiPoint(coordinatePoint, multiPoint) {
        let minDist = Infinity;

        multiPoint.coordinates.forEach(pointCoords => {
            const pointFeature = turf.point(pointCoords);
            const dist = turf.distance(coordinatePoint, pointFeature, { units: 'kilometers' });
            if (dist < minDist) {
                minDist = dist;
            }
        });

        return minDist;
    }

    /**
     * Get the nearest point on a feature to the given coordinate point
     * @param {Object} coordinatePoint - Turf.js point object
     * @param {Object} feature - GeoJSON feature object
     * @returns {Object|null} Nearest point feature or null if not found
     */
    static getNearestPointOnFeature(coordinatePoint, feature) {
        if (!feature.geometry) {
            return null;
        }

        const geomType = feature.geometry.type;

        try {
            if (geomType === 'Point') {
                // Ensure consistent coordinate order [lon, lat]
                return turf.point(feature.geometry.coordinates);
            } else if (geomType === 'MultiPoint') {
                let minDist = Infinity;
                let candidatePoint = null;
                feature.geometry.coordinates.forEach(pointCoords => {
                    // Ensure consistent coordinate order [lon, lat]
                    const pointFeature = turf.point(pointCoords);
                    const dist = turf.distance(coordinatePoint, pointFeature, { units: 'kilometers' });
                    if (dist < minDist) {
                        minDist = dist;
                        candidatePoint = pointFeature;
                    }
                });
                return candidatePoint;
            } else {
                let lineForNearestPoint = null;
                if (geomType === 'Polygon' || geomType === 'MultiPolygon') {
                    lineForNearestPoint = turf.polygonToLine(feature);
                } else if (geomType === 'LineString') {
                    lineForNearestPoint = feature;
                } else if (geomType === 'MultiLineString') {
                    lineForNearestPoint = feature;
                }

                if (lineForNearestPoint && lineForNearestPoint.geometry && lineForNearestPoint.geometry.coordinates) {
                    if (lineForNearestPoint.geometry.type === 'LineString') {
                        return turf.nearestPointOnLine(lineForNearestPoint, coordinatePoint);
                    } else if (lineForNearestPoint.geometry.type === 'MultiLineString') {
                        let overallMinDist = Infinity;
                        let candidatePoint = null;
                        lineForNearestPoint.geometry.coordinates.forEach(lineSegmentCoords => {
                            try {
                                const lineSegment = turf.lineString(lineSegmentCoords);
                                const pointOnSegment = turf.nearestPointOnLine(lineSegment, coordinatePoint);
                                if (pointOnSegment) {
                                    const dist = turf.distance(coordinatePoint, pointOnSegment);
                                    if (dist < overallMinDist) {
                                        overallMinDist = dist;
                                        candidatePoint = pointOnSegment;
                                    }
                                }
                            } catch (error) {
                                console.warn('Error processing line segment:', error);
                            }
                        });
                        return candidatePoint;
                    }
                }
            }
        } catch (error) {
            console.warn('Error getting nearest point on feature:', error);
        }

        return null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DistanceCalculator;
}

// Default export for ES modules
export default DistanceCalculator;
