// app/_layout.tsx
import { FavoritesProvider } from "@/context/FavoritesContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const tabs = [
  { label: "Home", name: "home", icon: "movie-filter" },
  { label: "Movies", name: "movies", icon: "local-movies" },
  { label: "Favorites", name: "favorites", icon: "favorite" }, // ⭐ new tab
  { label: "Settings", name: "settings", icon: "settings" },
] as const;

export default function Layout() {
  return (
    <FavoritesProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#FF4500",
          tabBarInactiveTintColor: "#999",
          headerShown: false,
          tabBarStyle: { backgroundColor: "#1E1E1E" },
        }}
      >
        {tabs.map(({ name, icon, label }) => (
          <Tabs.Screen
            key={name}
            name={name}
            options={{
              title: label,
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name={icon} color={color} size={size} />
              ),
            }}
          />
        ))}
      </Tabs>
    </FavoritesProvider>
  );
}
