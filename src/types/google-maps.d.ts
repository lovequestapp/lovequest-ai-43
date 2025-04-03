
declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
      setStyle(style: string): void;
      flyTo(options: { center: [number, number]; zoom: number; essential: boolean }): void;
      getCenter(): { lng: number };
      getZoom(): number;
      easeTo(options: { center: any; duration: number; easing: (n: number) => number }): void;
      on(event: string, handler: Function): void;
      remove(): void;
    }
    
    class Marker {
      constructor(opts?: MarkerOptions);
      setLngLat(lngLat: [number, number]): this;
      addTo(map: Map): this;
      remove(): void;
    }
    
    class NavigationControl {
      constructor(options?: { visualizePitch: boolean });
    }
    
    class AttributionControl {
      constructor();
    }
    
    class GeolocateControl {
      constructor(options?: { positionOptions: { enableHighAccuracy: boolean }; trackUserLocation: boolean });
      trigger(): void;
    }
    
    interface MarkerOptions {
      color?: string;
    }
    
    interface MapOptions {
      container: Element | string;
      style: string;
      center?: [number, number];
      zoom?: number;
      pitch?: number;
      projection?: string;
      attributionControl?: boolean;
    }
    
    namespace places {
      class AutocompleteService {
        getPlacePredictions(
          request: AutocompletionRequest,
          callback: (predictions: AutocompletePrediction[] | null, status: PlacesServiceStatus) => void
        ): void;
      }
      
      class PlacesService {
        constructor(attrContainer: HTMLElement);
        getDetails(
          request: PlaceDetailsRequest,
          callback: (result: PlaceResult | null, status: PlacesServiceStatus) => void
        ): void;
      }
      
      class AutocompleteSessionToken {
        constructor();
      }
      
      interface PlaceDetailsRequest {
        placeId: string;
        fields: string[];
        sessionToken?: AutocompleteSessionToken;
      }
      
      interface PlaceResult {
        formatted_address?: string;
        geometry?: {
          location?: { lat: () => number; lng: () => number };
        };
        place_id?: string;
      }
      
      interface AutocompletePrediction {
        description: string;
        place_id: string;
        structured_formatting?: {
          main_text: string;
          secondary_text: string;
        };
      }
      
      interface AutocompletionRequest {
        input: string;
        sessionToken?: AutocompleteSessionToken;
        types?: string[];
      }
      
      const enum PlacesServiceStatus {
        OK = "OK",
        ZERO_RESULTS = "ZERO_RESULTS",
        OVER_QUERY_LIMIT = "OVER_QUERY_LIMIT",
        REQUEST_DENIED = "REQUEST_DENIED",
        INVALID_REQUEST = "INVALID_REQUEST",
        UNKNOWN_ERROR = "UNKNOWN_ERROR",
        NOT_FOUND = "NOT_FOUND"
      }
    }
  }
}
