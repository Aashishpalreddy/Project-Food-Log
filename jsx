import { useEffect } from "react";

// Small cheerful sound
const playCheerfulDing = () => {
  const audio = new Audio(
    "https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg"
  );
  audio.play();
};

export default function CheerfulReminder() {
  useEffect(() => {
    const timer = setInterval(() => {
      // Send notification
      if (Notification.permission === "granted") {
        new Notification("🌟 Time to log your meal!", {
          body: "Keep up the great work on your fitness journey!",
        });
        playCheerfulDing();
      }
    }, 60000); // every minute just for demo

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-4 rounded-2xl shadow-md bg-green-100">
      <h2 className="text-xl font-bold">🍎 Food & Fitness Log</h2>
      <p className="mt-2">Notifications will cheer you on with a happy ding!</p>
      <button
        onClick={() => Notification.requestPermission()}
        className="mt-4 px-4 py-2 rounded-2xl bg-green-500 text-white hover:bg-green-600"
      >
        Enable Notifications
      </button>
    </div>
  );
}
