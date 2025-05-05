import Map from "../utils/map";

export async function storyMapper(story) {
  const { lat = null, lon = null } = story;

  const hasCoordinates = lat !== null && lon !== null;
  const placeName = hasCoordinates
    ? await Map.getPlaceNameByCoordinate(lat, lon)
    : "Lokasi tidak ada";

  return {
    ...story,
    location: {
      latitude: lat,
      longitude: lon,
      placeName,
    },
  };
}