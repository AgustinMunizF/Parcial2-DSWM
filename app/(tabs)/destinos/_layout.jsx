import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="editar" options={{ headerShown: false }} />
    </Stack>
  );
}
