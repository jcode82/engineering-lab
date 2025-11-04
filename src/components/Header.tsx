export default function Header() {
  return (
    <header className="flex items-center justify-between p-6">
      <h1 className="text-xl font-semibold">Juan Flores</h1>
      <nav className="space-x-4">
        <a href="#projects" className="hover:text-blue-500">Projects</a>
        <a href="#about" className="hover:text-blue-500">About</a>
        <a href="#contact" className="hover:text-blue-500">Contact</a>
      </nav>
    </header>
  );
}
