/**
 * App Router owns the route subtree. Do not retain it inside an exit animation:
 * AnimatePresence(mode="wait") can leave an updated subtree at opacity: 0.
 * A template remounts for each navigation; CSS animates only its entrance and
 * always falls back to visible content without JavaScript or reduced motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="route-enter">{children}</div>;
}
